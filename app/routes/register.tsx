import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { getSupabaseClient } from "~/lib/supabase-client";

export default function Register({ params }: { params: { token: string } }) {
    const navigate = useNavigate();
    const token = params.token.startsWith("token=")
        ? params.token.slice("token=".length)
        : params.token;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        if (password !== confirmation) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        const { error: functionError } =
            await getSupabaseClient().functions.invoke(
                "complete-registration",
                {
                    body: {
                        token,
                        email,
                        password,
                    },
                }
            );
        setIsSubmitting(false);

        if (functionError) {
            setError(functionError.message);
            return;
        }

        navigate("/login", { replace: true });
    };

    return (
        <main style={{ maxWidth: "28rem", margin: "4rem auto" }}>
            <h1>Register</h1>
            <p>
                Use your email to sign in. It is required for account access and
                is not shown publicly.
            </p>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <label htmlFor="register-email">Email</label>
                <InputText
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                />
                <label htmlFor="register-password">Password</label>
                <Password
                    inputId="register-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    feedback
                    toggleMask
                    autoComplete="new-password"
                    required
                    minLength={6}
                />
                <label htmlFor="register-password-confirmation">
                    Confirm password
                </label>
                <Password
                    inputId="register-password-confirmation"
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    feedback={false}
                    toggleMask
                    autoComplete="new-password"
                    required
                    minLength={6}
                />
                {error && (
                    <p role="alert" style={{ color: "var(--red-600)" }}>
                        {error}
                    </p>
                )}
                <Button
                    type="submit"
                    label="Register"
                    icon="pi pi-user-plus"
                    loading={isSubmitting}
                />
            </form>
        </main>
    );
}
