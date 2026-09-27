export type NewsRecord = {
    id: number;
    author_id: string | null;
    created_at: string;
    hide_at: string | null;
    title_cs: string | null;
    title_en: string | null;
    content_cs: string | null;
    content_en: string | null;
    image: string | null;
};

export type NewsFormValues = {
    titleCs: string;
    titleEn: string;
    contentCs: string;
    contentEn: string;
    image: string;
    hideAt: string;
};
