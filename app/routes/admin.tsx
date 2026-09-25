import { Button } from "primereact/button";
import { useContext } from "react";
import { Link, Navigate } from "react-router";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext } from "~/i18n/lang-context";
import { useAuth } from "~/lib/auth-context";

export default function Admin() {
    const { lang } = useContext(LangContext);
    const { user, isAdmin, isLoading, signOut } = useAuth();

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
        <main style={{ maxWidth: "50rem", margin: "4rem auto" }}>
            <h1>{DICTIONARY.adminPanel[lang]}</h1>
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
        </main>
    );
}
