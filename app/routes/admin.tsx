import { Button } from "primereact/button";
import { useContext, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext } from "~/i18n/lang-context";
import { useAuth } from "~/lib/auth-context";
import PlayersTable from "~/components/admin/players-table";
import UsersTable from "~/components/admin/users-table";
import NewsManager from "~/components/news/news-manager";
import ProfilePanel from "~/components/profile/profile-panel";

type AdminSection = "overview" | "profile" | "users" | "players" | "news";

export default function Admin() {
    const { lang } = useContext(LangContext);
    const { user, isAdmin, isLoading, signOut } = useAuth();
    const [searchParams] = useSearchParams();
    const initialSection = searchParams.get("section");
    const [section, setSection] = useState<AdminSection>(
        initialSection === "profile" ||
            initialSection === "users" ||
            initialSection === "players" ||
            initialSection === "news"
            ? initialSection
            : "overview"
    );

    if (isLoading) {
        return <main style={{ padding: "2rem" }}>Loading...</main>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return (
            <main style={{ maxWidth: "42rem", margin: "4rem auto" }}>
                <h1>{DICTIONARY.adminPanel[lang]}</h1>
                <p>{DICTIONARY.accessDenied[lang]}</p>
                <Link to="/">{DICTIONARY.home[lang]}</Link>
            </main>
        );
    }

    return (
        <main className="admin-layout">
            <aside className="admin-sidebar">
                <h1>{DICTIONARY.adminPanel[lang]}</h1>
                <nav aria-label={DICTIONARY.adminPanel[lang]}>
                    <button
                        className={section === "overview" ? "active" : ""}
                        type="button"
                        onClick={() => setSection("overview")}
                    >
                        <span className="pi pi-home" />
                        {DICTIONARY.overview[lang]}
                    </button>
                    <button
                        className={section === "profile" ? "active" : ""}
                        type="button"
                        onClick={() => setSection("profile")}
                    >
                        <span className="pi pi-user" />
                        {DICTIONARY.profile[lang]}
                    </button>
                    <button
                        className={section === "users" ? "active" : ""}
                        type="button"
                        onClick={() => setSection("users")}
                    >
                        <span className="pi pi-users" />
                        {DICTIONARY.users[lang]}
                    </button>
                    <button
                        className={section === "players" ? "active" : ""}
                        type="button"
                        onClick={() => setSection("players")}
                    >
                        <span className="pi pi-id-card" />
                        {DICTIONARY.players[lang]}
                    </button>
                    <button
                        className={section === "news" ? "active" : ""}
                        type="button"
                        onClick={() => setSection("news")}
                    >
                        <span className="pi pi-megaphone" />
                        {DICTIONARY.news[lang]}
                    </button>
                </nav>
            </aside>
            <nav
                className="admin-mobile-nav"
                aria-label={DICTIONARY.adminPanel[lang]}
            >
                <button
                    className={section === "overview" ? "active" : ""}
                    type="button"
                    onClick={() => setSection("overview")}
                >
                    <span className="pi pi-home" />
                    {DICTIONARY.overview[lang]}
                </button>
                <button
                    className={section === "profile" ? "active" : ""}
                    type="button"
                    onClick={() => setSection("profile")}
                >
                    <span className="pi pi-user" />
                    {DICTIONARY.profile[lang]}
                </button>
                <button
                    className={section === "users" ? "active" : ""}
                    type="button"
                    onClick={() => setSection("users")}
                >
                    <span className="pi pi-users" />
                    {DICTIONARY.users[lang]}
                </button>
                <button
                    className={section === "players" ? "active" : ""}
                    type="button"
                    onClick={() => setSection("players")}
                >
                    <span className="pi pi-id-card" />
                    {DICTIONARY.players[lang]}
                </button>
                <button
                    className={section === "news" ? "active" : ""}
                    type="button"
                    onClick={() => setSection("news")}
                >
                    <span className="pi pi-megaphone" />
                    {DICTIONARY.news[lang]}
                </button>
            </nav>
            <section className="admin-content">
                {section === "overview" ? (
                    <>
                        <h2>{DICTIONARY.adminPanel[lang]}</h2>
                        <p>
                            {lang === "cs"
                                ? "Jste přihlášeni s oprávněním administrátora."
                                : "You are signed in with administrator access."}
                        </p>
                        <Button
                            type="button"
                            label={DICTIONARY.logOut[lang]}
                            icon="pi pi-sign-out"
                            onClick={() => void signOut()}
                        />
                    </>
                ) : section === "users" ? (
                    <>
                        <h2>{DICTIONARY.users[lang]}</h2>
                        <UsersTable currentUserId={user.id} />
                    </>
                ) : section === "players" ? (
                    <>
                        <h2>{DICTIONARY.players[lang]}</h2>
                        <PlayersTable />
                    </>
                ) : section === "profile" ? (
                    <>
                        <h2>{DICTIONARY.profile[lang]}</h2>
                        <ProfilePanel userId={user.id} />
                    </>
                ) : (
                    <NewsManager userId={user.id} isAdmin canEdit />
                )}
            </section>
        </main>
    );
}
