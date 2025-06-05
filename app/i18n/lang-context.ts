import { createContext, type Dispatch, type SetStateAction } from "react";

export type Lang = "cs" | "en";
export const LangContext = createContext<{
    lang: Lang;
    setLang: Dispatch<SetStateAction<Lang>> | null;
}>({ lang: "en", setLang: null });
