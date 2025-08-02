import type { Lang } from "./lang-context";

const _DICTIONARY = {
    BGA_Username: {
        cs: "Jméno na BGA",
        en: "BGA username",
    },
    nationalChampionship: {
        cs: "Mistrovství ČR",
        en: "National championship",
    },
    onlineChampionship: {
        cs: "Online mistrovství ČR",
        en: "Online championship",
    },
    worldChampionship: {
        cs: "Mistrovství světa",
        en: "World championship",
    },
    CCL: {
        cs: "Carcassonne Champions League",
        en: "Carcassonne Champions League",
    },
    teamCaptainBGAUsername: {
        cs: "Kapitán týmu",
        en: "Team captain",
    },
    formerTeamCaptainBGAUsername: {
        cs: "Dřívější kapitán týmu",
        en: "Former team captain",
    },
    tournaments: {
        cs: "Turnaje",
        en: "Tournaments",
    },
    home: {
        cs: "Domů",
        en: "Home",
    },
    players: {
        cs: "Hráči",
        en: "Players",
    },
    hook: {
        cs: "Carcassonne Česko",
        en: "Carcassonne Czechia",
    },
    members: {
        cs: "Členové týmu",
        en: "Team members",
    },
    history: {
        cs: "Historie",
        en: "History",
    },
    hallOfFame: {
        cs: "Síň slávy",
        en: "Hall of Fame",
    },
    position: {
        cs: "Pozice",
        en: "Position",
    },
    name: {
        cs: "Jméno",
        en: "Name",
    },
    points: {
        cs: "Body",
        en: "Points",
    },
    scoreDifference: {
        cs: "Rozdíl ve skóre",
        en: "Score difference",
    },
    selectYear: {
        cs: "Vyberte rok",
        en: "Select year",
    },
    minYear: {
        cs: "Od",
        en: "From",
    },
    maxYear: {
        cs: "Do",
        en: "To",
    },
    includedTournaments: {
        cs: "Zahrnuté turnaje",
        en: "Included tournaments",
    },
    achievements: {
        cs: "Úspěchy",
        en: "Achievements",
    },
    bio: {
        cs: "Bio",
        en: "Bio",
    },
    links: {
        cs: "Odkazy",
        en: "Links",
    },
    historicalResults: {
        cs: "Historické výsledky",
        en: "Historical results",
    },
    news: {
        cs: "Novinky",
        en: "News",
    },
} as const;

export type DictionaryStub = keyof typeof _DICTIONARY;
export const DICTIONARY: Record<DictionaryStub, Record<Lang, string>> = {
    ..._DICTIONARY,
} as const;
