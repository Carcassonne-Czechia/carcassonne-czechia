import { Checkbox } from "primereact/checkbox";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import Markdown from "react-markdown";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext, type Lang } from "~/i18n/lang-context";
import { ROUTE_HEADERS } from "~/routes";
import { getSupabaseClient } from "~/lib/supabase-client";
import type { NewsRecord } from "./news-types";

type NewsManagerProps = {
    userId: string;
    isAdmin?: boolean;
    canEdit?: boolean;
};

type PlayerRelation = {
    name: string | null;
    bga_username: string | null;
};

type ProfileRow = {
    user_id: string;
    players: PlayerRelation | PlayerRelation[] | null;
};

function isExpired(item: NewsRecord) {
    return (
        item.hide_at !== null && new Date(item.hide_at).getTime() <= Date.now()
    );
}

function toDisplayDate(value: string | null, lang: Lang) {
    if (!value) {
        return lang === "cs" ? "Bez omezení" : "No expiry";
    }

    return new Intl.DateTimeFormat(lang === "cs" ? "cs-CZ" : "en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function languageValue(item: NewsRecord, lang: Lang) {
    const value = lang === "cs" ? item.title_cs : item.title_en;
    return (
        value || (lang === "cs" ? item.title_en : item.title_cs) || "Untitled"
    );
}

export default function NewsManager({
    userId,
    isAdmin = false,
    canEdit = false,
}: NewsManagerProps) {
    const { lang } = useContext(LangContext);
    const [news, setNews] = useState<NewsRecord[]>([]);
    const [authors, setAuthors] = useState<Record<string, string>>({});
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
    const [languageById, setLanguageById] = useState<Record<number, Lang>>({});
    const [ownOnly, setOwnOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        const loadNews = async () => {
            setLoading(true);
            setError(null);
            const supabase = getSupabaseClient();
            const newsQuery = supabase
                .from("news")
                .select(
                    "id, author_id, created_at, hide_at, title_cs, title_en, content_cs, content_en, image"
                )
                .order("created_at", { ascending: false });
            const [newsResult, profilesResult] = await Promise.all([
                isAdmin ? newsQuery : newsQuery.eq("author_id", userId),
                supabase
                    .from("profiles")
                    .select("user_id, players(name, bga_username)"),
            ]);

            if (!active) {
                return;
            }

            const firstError = newsResult.error || profilesResult.error;
            if (firstError) {
                setError(firstError.message);
                setLoading(false);
                return;
            }

            const loadedAuthors: Record<string, string> = {};
            for (const profile of (profilesResult.data ?? []) as ProfileRow[]) {
                const player = Array.isArray(profile.players)
                    ? profile.players[0]
                    : profile.players;
                loadedAuthors[profile.user_id] =
                    player?.bga_username ||
                    player?.name ||
                    profile.user_id.slice(0, 8);
            }

            setAuthors(loadedAuthors);
            setNews((newsResult.data ?? []) as NewsRecord[]);
            setLoading(false);
        };

        void loadNews();
        return () => {
            active = false;
        };
    }, [isAdmin, userId]);

    const visibleNews = news
        .filter((item) => !isAdmin || !ownOnly || item.author_id === userId)
        .sort((first, second) => {
            const firstExpired = isExpired(first);
            const secondExpired = isExpired(second);
            if (firstExpired !== secondExpired) {
                return firstExpired ? 1 : -1;
            }
            return (
                new Date(second.created_at).getTime() -
                new Date(first.created_at).getTime()
            );
        });
    const currentNews = visibleNews.filter((item) => !isExpired(item));
    const expiredNews = visibleNews.filter(isExpired);

    const toggleExpanded = (id: number) => {
        setExpandedIds((current) => {
            const next = new Set(current);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const setItemLanguage = (id: number, nextLang: Lang) => {
        setLanguageById((current) => ({ ...current, [id]: nextLang }));
    };

    const deleteNews = async (item: NewsRecord) => {
        const title = languageValue(item, lang);
        const message =
            lang === "cs"
                ? `Opravdu chcete smazat novinku „${title}“?`
                : `Delete the news item “${title}”?`;
        if (!window.confirm(message)) {
            return;
        }

        setError(null);
        const { error: deleteError } = await getSupabaseClient()
            .from("news")
            .delete()
            .eq("id", item.id);
        if (deleteError) {
            setError(deleteError.message);
            return;
        }

        setNews((current) =>
            current.filter((newsItem) => newsItem.id !== item.id)
        );
    };

    const renderItem = (item: NewsRecord) => {
        const itemLang = languageById[item.id] ?? lang;
        const expanded = expandedIds.has(item.id);
        const hasCs = Boolean(item.title_cs && item.content_cs);
        const hasEn = Boolean(item.title_en && item.content_en);
        const title = languageValue(item, itemLang);
        const author = item.author_id
            ? authors[item.author_id] || item.author_id.slice(0, 8)
            : "Carcassonne Czechia";

        return (
            <article className="news-admin-item" key={item.id}>
                <div className="news-admin-summary">
                    <button
                        className="news-summary-toggle"
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => toggleExpanded(item.id)}
                    >
                        <img
                            src={item.image || "/assets/news/default.jpg"}
                            alt=""
                            className="news-admin-image"
                        />
                        <span className="news-admin-meta">
                            <strong>{title}</strong>
                            <span>
                                {DICTIONARY.author[lang]}: {author}
                            </span>
                            <span>
                                {DICTIONARY.expiresAt[lang]}:{" "}
                                {toDisplayDate(item.hide_at, lang)}
                            </span>
                        </span>
                        <span
                            className={`news-summary-chevron pi ${
                                expanded ? "pi-chevron-up" : "pi-chevron-down"
                            }`}
                            aria-hidden="true"
                        />
                    </button>
                    <div className="news-admin-actions">
                        <div
                            className="news-language-actions"
                            aria-label={DICTIONARY.news[lang]}
                        >
                            <button
                                className={itemLang === "cs" ? "selected" : ""}
                                type="button"
                                disabled={!hasCs}
                                aria-label="Cesky"
                                onClick={() => setItemLanguage(item.id, "cs")}
                            >
                                <span className="fi fi-cz fis" />
                            </button>
                            <button
                                className={itemLang === "en" ? "selected" : ""}
                                type="button"
                                disabled={!hasEn}
                                aria-label="English"
                                onClick={() => setItemLanguage(item.id, "en")}
                            >
                                <span className="fi fi-gb fis" />
                            </button>
                        </div>
                        {canEdit && (
                            <Link
                                className="p-button p-component p-button-text p-button-icon-only news-edit-link"
                                to={`/${ROUTE_HEADERS.NEWS}/${item.id}/edit`}
                                aria-label={`${DICTIONARY.editNews[lang]}: ${title}`}
                                title={DICTIONARY.editNews[lang]}
                            >
                                <span className="pi pi-pencil" />
                            </Link>
                        )}
                        {canEdit && (
                            <button
                                className="p-button p-component p-button-text p-button-icon-only news-delete-button"
                                type="button"
                                aria-label={`${lang === "cs" ? "Smazat" : "Delete"}: ${title}`}
                                title={lang === "cs" ? "Smazat" : "Delete"}
                                onClick={() => void deleteNews(item)}
                            >
                                <span className="pi pi-trash" />
                            </button>
                        )}
                    </div>
                </div>
                {expanded && (
                    <div className="news-admin-content">
                        <Markdown>
                            {(itemLang === "cs"
                                ? item.content_cs
                                : item.content_en) || ""}
                        </Markdown>
                    </div>
                )}
            </article>
        );
    };

    const renderSection = (items: NewsRecord[], heading: string) => (
        <section className="news-admin-section">
            <h3>{heading}</h3>
            {items.length ? (
                <div className="news-admin-list">{items.map(renderItem)}</div>
            ) : (
                <p>{lang === "cs" ? "Žádné novinky." : "No news."}</p>
            )}
        </section>
    );

    return (
        <div className="news-manager">
            <div className="news-manager-toolbar">
                <h2>{DICTIONARY.news[lang]}</h2>
                {canEdit && (
                    <Link
                        className="p-button p-component p-button-icon-only p-button-rounded"
                        to={`/${ROUTE_HEADERS.NEWS}/new`}
                        aria-label={DICTIONARY.createNews[lang]}
                        title={DICTIONARY.createNews[lang]}
                    >
                        <span className="pi pi-plus" />
                    </Link>
                )}
            </div>
            {isAdmin && (
                <label className="news-own-filter">
                    <Checkbox
                        checked={ownOnly}
                        onChange={(event) => setOwnOnly(Boolean(event.checked))}
                    />
                    <span>{DICTIONARY.ownNews[lang]}</span>
                </label>
            )}
            {loading && <p>Loading...</p>}
            {error && (
                <p className="admin-error" role="alert">
                    {error}
                </p>
            )}
            {!loading && !error && (
                <>
                    {renderSection(currentNews, DICTIONARY.news[lang])}
                    {expiredNews.length > 0 &&
                        renderSection(
                            expiredNews,
                            DICTIONARY.expiredNews[lang]
                        )}
                </>
            )}
        </div>
    );
}
