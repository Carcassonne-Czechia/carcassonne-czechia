import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useContext, useState, type FormEvent } from "react";
import { Navigate } from "react-router";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext } from "~/i18n/lang-context";
import { useAuth } from "~/lib/auth-context";

export default function Login() {
    const { lang } = useContext(LangContext);
    const {
        user,
        isAdmin,
        isEditor,
        isLoading,
        signIn,
        error: authError,
    } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isLoading && user) {
        return (
            <Navigate
                to={isAdmin ? "/admin" : isEditor ? "/editor" : "/profile"}
                replace
            />
        );
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);
        const signInError = await signIn(email, password);
        if (signInError) {
            setError(signInError);
        }
        setIsSubmitting(false);
    };

    return (
        <main style={{ maxWidth: "28rem", margin: "4rem auto" }}>
            <h1>{DICTIONARY.logIn[lang]}</h1>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <label htmlFor="login-email">Email</label>
                <InputText
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                />
                <label htmlFor="login-password">Password</label>
                <Password
                    inputId="login-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    feedback={false}
                    toggleMask
                    autoComplete="current-password"
                    required
                />
                {(error || authError) && (
                    <p role="alert" style={{ color: "var(--red-600)" }}>
                        {error || authError}
                    </p>
                )}
                <Button
                    type="submit"
                    label={DICTIONARY.logIn[lang]}
                    icon="pi pi-sign-in"
                    loading={isSubmitting}
                />
            </form>
        </main>
    );
}
