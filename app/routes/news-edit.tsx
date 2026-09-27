import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import {
    useContext,
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import {
    Link,
    Navigate,
    useLocation,
    useNavigate,
    useParams,
} from "react-router";
import { DICTIONARY } from "~/i18n/dictionary";
import { LangContext } from "~/i18n/lang-context";
import { useAuth } from "~/lib/auth-context";
import { getSupabaseClient } from "~/lib/supabase-client";
import type { NewsFormValues } from "~/components/news/news-types";

const emptyForm: NewsFormValues = {
    titleCs: "",
    titleEn: "",
    contentCs: "",
    contentEn: "",
    image: "",
    hideAt: "",
};

function toLocalDateTime(value: string | null) {
    if (!value) {
        return "";
    }

    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60_000)
        .toISOString()
        .slice(0, 16);
}

function currentLocalDateTime() {
    return toLocalDateTime(new Date().toISOString());
}

function validateForm(form: NewsFormValues, lang: "cs" | "en") {
    const languages = [
        {
            label: lang === "cs" ? "čeština" : "Czech",
            title: form.titleCs.trim(),
            content: form.contentCs.trim(),
        },
        {
            label: lang === "cs" ? "angličtina" : "English",
            title: form.titleEn.trim(),
            content: form.contentEn.trim(),
        },
    ];

    if (!languages.some((language) => language.title && language.content)) {
        return lang === "cs"
            ? "Vyplňte alespoň název a obsah v jednom jazyce."
            : "Enter a title and content in at least one language.";
    }

    for (const language of languages) {
        if (Boolean(language.title) !== Boolean(language.content)) {
            return lang === "cs"
                ? `Název a obsah musí být vyplněny společně (${language.label}).`
                : `Title and content must be provided together (${language.label}).`;
        }
    }

    if (form.hideAt && new Date(form.hideAt).getTime() <= Date.now()) {
        return lang === "cs"
            ? "Datum vypršení musí být v budoucnosti."
            : "The expiry date must be in the future.";
    }

    return null;
}

export default function NewsEdit() {
    const { lang } = useContext(LangContext);
    const { user, isAdmin, isEditor, isLoading } = useAuth();
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const isNew = id === "new" || location.pathname.endsWith("/new");
    const returnPath = isAdmin ? "/admin?section=news" : "/editor?section=news";
    const [form, setForm] = useState<NewsFormValues>(emptyForm);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (!user || isNew) {
            setLoading(false);
            return;
        }

        let active = true;
        const loadNews = async () => {
            const { data, error: loadError } = await getSupabaseClient()
                .from("news")
                .select(
                    "id, author_id, created_at, hide_at, title_cs, title_en, content_cs, content_en, image"
                )
                .eq("id", id)
                .maybeSingle();

            if (!active) {
                return;
            }

            if (loadError || !data) {
                setError(loadError?.message || "News item not found.");
                setLoading(false);
                return;
            }

            setForm({
                titleCs: data.title_cs || "",
                titleEn: data.title_en || "",
                contentCs: data.content_cs || "",
                contentEn: data.content_en || "",
                image: data.image || "",
                hideAt: toLocalDateTime(data.hide_at),
            });
            setLoading(false);
        };

        void loadNews();
        return () => {
            active = false;
        };
    }, [id, isNew, user]);

    if (isLoading || loading) {
        return <main style={{ padding: "2rem" }}>Loading...</main>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin && !isEditor) {
        return (
            <main style={{ maxWidth: "42rem", margin: "4rem auto" }}>
                <h1>{DICTIONARY.news[lang]}</h1>
                <p>{DICTIONARY.accessDenied[lang]}</p>
                <Link to="/profile">{DICTIONARY.profile[lang]}</Link>
            </main>
        );
    }

    const updateField = (field: keyof NewsFormValues, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        if (file && !file.type.startsWith("image/")) {
            setError(
                lang === "cs"
                    ? "Vyberte prosím obrázek."
                    : "Please choose an image file."
            );
            return;
        }

        setError(null);
        setImageFile(file);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationError = validateForm(form, lang);
        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(true);
        setError(null);
        const supabase = getSupabaseClient();
        let imageUrl = form.image.trim() || null;
        if (imageFile) {
            const extension = imageFile.name.includes(".")
                ? imageFile.name.split(".").pop()?.toLowerCase() || "jpg"
                : "jpg";
            const imagePath = `${user.id}/${crypto.randomUUID()}.${extension}`;
            const { error: uploadError } = await supabase.storage
                .from("news-images")
                .upload(imagePath, imageFile, {
                    cacheControl: "3600",
                    contentType: imageFile.type,
                    upsert: false,
                });
            if (uploadError) {
                setError(uploadError.message);
                setSaving(false);
                return;
            }

            imageUrl = supabase.storage
                .from("news-images")
                .getPublicUrl(imagePath).data.publicUrl;
        }

        const values = {
            title_cs: form.titleCs.trim() || null,
            title_en: form.titleEn.trim() || null,
            content_cs: form.contentCs.trim() || null,
            content_en: form.contentEn.trim() || null,
            image: imageUrl,
            hide_at: form.hideAt ? new Date(form.hideAt).toISOString() : null,
        };
        const result = isNew
            ? await supabase.from("news").insert(values)
            : await supabase.from("news").update(values).eq("id", id);

        if (result.error) {
            setError(result.error.message);
            setSaving(false);
            return;
        }

        navigate(returnPath);
    };

    return (
        <main className="news-edit-page">
            <div className="news-edit-header">
                <div>
                    <h1>
                        {isNew
                            ? DICTIONARY.createNews[lang]
                            : DICTIONARY.editNews[lang]}
                    </h1>
                </div>
            </div>
            {error && (
                <p className="admin-error" role="alert">
                    {error}
                </p>
            )}
            <form className="news-edit-form" onSubmit={handleSubmit}>
                <fieldset>
                    <legend>
                        <span className="fi fi-gb fis" />{" "}
                        {DICTIONARY.title[lang]}
                    </legend>
                    <label htmlFor="news-title-en">English</label>
                    <InputText
                        id="news-title-en"
                        value={form.titleEn}
                        onChange={(event) =>
                            updateField("titleEn", event.target.value)
                        }
                    />
                </fieldset>
                <fieldset>
                    <legend>
                        <span className="fi fi-cz fis" />{" "}
                        {DICTIONARY.title[lang]}
                    </legend>
                    <label htmlFor="news-title-cs">Česky</label>
                    <InputText
                        id="news-title-cs"
                        value={form.titleCs}
                        onChange={(event) =>
                            updateField("titleCs", event.target.value)
                        }
                    />
                </fieldset>
                <fieldset className="news-edit-content-fieldset">
                    <legend>
                        <span className="fi fi-gb fis" />{" "}
                        {DICTIONARY.content[lang]}
                    </legend>
                    <label htmlFor="news-content-en">English Markdown</label>
                    <InputTextarea
                        id="news-content-en"
                        value={form.contentEn}
                        onChange={(event) =>
                            updateField("contentEn", event.target.value)
                        }
                        rows={8}
                        autoResize
                    />
                </fieldset>
                <fieldset className="news-edit-content-fieldset">
                    <legend>
                        <span className="fi fi-cz fis" />{" "}
                        {DICTIONARY.content[lang]}
                    </legend>
                    <label htmlFor="news-content-cs">Český Markdown</label>
                    <InputTextarea
                        id="news-content-cs"
                        value={form.contentCs}
                        onChange={(event) =>
                            updateField("contentCs", event.target.value)
                        }
                        rows={8}
                        autoResize
                    />
                </fieldset>
                <div className="news-edit-meta-fields">
                    <fieldset className="news-image-fieldset">
                        <legend>{DICTIONARY.picture[lang]}</legend>
                        <label htmlFor="news-image">
                            {lang === "cs"
                                ? "Vyberte obrázek"
                                : "Choose an image"}
                        </label>
                        <input
                            id="news-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {(imagePreview || form.image) && (
                            <img
                                className="news-image-preview"
                                src={imagePreview || form.image}
                                alt=""
                            />
                        )}
                    </fieldset>
                    <fieldset>
                        <legend>{DICTIONARY.expiresAt[lang]}</legend>
                        <label htmlFor="news-expires-at">
                            {lang === "cs" ? "Volitelné" : "Optional"}
                        </label>
                        <input
                            className="p-inputtext p-component"
                            id="news-expires-at"
                            type="datetime-local"
                            min={currentLocalDateTime()}
                            value={form.hideAt}
                            onChange={(event) =>
                                updateField("hideAt", event.target.value)
                            }
                        />
                    </fieldset>
                </div>
                <p className="news-markdown-hint">
                    {DICTIONARY.markdownHint[lang]}
                </p>
                <div className="news-edit-actions">
                    <Button
                        type="submit"
                        label={DICTIONARY.save[lang]}
                        icon="pi pi-check"
                        loading={saving}
                    />
                    <Button
                        type="button"
                        label={DICTIONARY.cancel[lang]}
                        icon="pi pi-times"
                        severity="secondary"
                        outlined
                        onClick={() => navigate(returnPath)}
                    />
                </div>
            </form>
        </main>
    );
}
