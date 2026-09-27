import { Button } from "primereact/button";
import { useContext, useState } from "react";
import { Navigate, useSearchParams } from "react-router";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext } from "~/i18n/lang-context";
import { useAuth } from "~/lib/auth-context";
import NewsManager from "~/components/news/news-manager";
import ProfilePanel from "~/components/profile/profile-panel";

type AccountSection = "overview" | "news";

export default function Account() {
    const { lang } = useContext(LangContext);
    const { user, isAdmin, isEditor, isLoading, signOut } = useAuth();
    const canEdit = isEditor || isAdmin;
    const [searchParams] = useSearchParams();
    const [section, setSection] = useState<AccountSection>(
        searchParams.get("section") === "news" ? "news" : "overview"
    );

    if (isLoading) {
        return <main style={{ padding: "2rem" }}>Loading...</main>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const panelTitle = isAdmin
        ? DICTIONARY.profilePanel[lang]
        : isEditor
          ? DICTIONARY.editorPanel[lang]
          : DICTIONARY.profilePanel[lang];
    const showNews = isEditor && !isAdmin;

    return (
        <main className="admin-layout">
            <aside className="admin-sidebar">
                <h1>{panelTitle}</h1>
                <nav aria-label={panelTitle}>
                    <button
                        className={section === "overview" ? "active" : ""}
                        type="button"
                        onClick={() => setSection("overview")}
                    >
                        <span className="pi pi-home" />
                        {DICTIONARY.overview[lang]}
                    </button>
                    {showNews && (
                        <button
                            className={section === "news" ? "active" : ""}
                            type="button"
                            onClick={() => setSection("news")}
                        >
                            <span className="pi pi-megaphone" />
                            {DICTIONARY.news[lang]}
                        </button>
                    )}
                </nav>
            </aside>
            <nav className="admin-mobile-nav" aria-label={panelTitle}>
                <button
                    className={section === "overview" ? "active" : ""}
                    type="button"
                    onClick={() => setSection("overview")}
                >
                    <span className="pi pi-home" />
                    {DICTIONARY.overview[lang]}
                </button>
                {showNews && (
                    <button
                        className={section === "news" ? "active" : ""}
                        type="button"
                        onClick={() => setSection("news")}
                    >
                        <span className="pi pi-megaphone" />
                        {DICTIONARY.news[lang]}
                    </button>
                )}
            </nav>
            <section className="admin-content">
                {section === "overview" ? (
                    <>
                        <h2>{panelTitle}</h2>
                        <ProfilePanel userId={user.id} />
                        <Button
                            type="button"
                            label={DICTIONARY.logOut[lang]}
                            icon="pi pi-sign-out"
                            onClick={() => void signOut()}
                        />
                    </>
                ) : (
                    <NewsManager userId={user.id} canEdit={canEdit} />
                )}
            </section>
        </main>
    );
}
