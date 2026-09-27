import { useContext, useEffect, useState } from "react";
import { LangContext } from "../../i18n/lang-context";
import Markdown from "react-markdown";
import { DICTIONARY } from "~/i18n/dictionary";
import { getSupabaseClient } from "~/lib/supabase-client";
import type { NewsRecord } from "./news-types";

function languageValue(item: NewsRecord, lang: "cs" | "en") {
    const title = lang === "cs" ? item.title_cs : item.title_en;
    const content = lang === "cs" ? item.content_cs : item.content_en;
    if (title && content) {
        return { title, content };
    }

    const fallbackTitle = lang === "cs" ? item.title_en : item.title_cs;
    const fallbackContent = lang === "cs" ? item.content_en : item.content_cs;
    return {
        title: title || fallbackTitle || "Untitled",
        content: content || fallbackContent || "",
    };
}

export default function News() {
    const { lang } = useContext(LangContext);
    const [news, setNews] = useState<NewsRecord[]>([]);
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        const loadNews = async () => {
            const { data, error: loadError } = await getSupabaseClient()
                .from("news_public")
                .select(
                    "id, author_id, created_at, hide_at, title_cs, title_en, content_cs, content_en, image, author"
                )
                .order("created_at", { ascending: false });

            if (!active) {
                return;
            }

            if (loadError) {
                setError(loadError.message);
            } else {
                setNews((data ?? []) as NewsRecord[]);
            }
            setLoading(false);
        };

        void loadNews();
        return () => {
            active = false;
        };
    }, []);

    const itemTemplate = (item: NewsRecord) => {
        const localized = languageValue(item, lang);
        const expanded = expandedIds.has(item.id);

        return (
            <article className="news-admin-item" key={item.id}>
                <div className="news-admin-summary">
                    <button
                        className="news-summary-toggle"
                        type="button"
                        aria-expanded={expanded}
                        onClick={() =>
                            setExpandedIds((current) => {
                                const next = new Set(current);
                                if (next.has(item.id)) {
                                    next.delete(item.id);
                                } else {
                                    next.add(item.id);
                                }
                                return next;
                            })
                        }
                    >
                        <img
                            src={item.image || "/assets/news/default.jpg"}
                            alt=""
                            className="news-admin-image"
                        />
                        <span className="news-admin-meta">
                            <strong>{localized.title}</strong>
                            <span>
                                {DICTIONARY.author[lang]}: {item.author}
                            </span>
                        </span>
                        <span
                            className={`news-summary-chevron pi ${
                                expanded ? "pi-chevron-up" : "pi-chevron-down"
                            }`}
                            aria-hidden="true"
                        />
                    </button>
                </div>
                {expanded && (
                    <div className="news-admin-content">
                        <Markdown>{localized.content}</Markdown>
                    </div>
                )}
            </article>
        );
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return (
            <p className="admin-error" role="alert">
                {error}
            </p>
        );
    }

    return <div className="news-admin-list">{news.map(itemTemplate)}</div>;
}
