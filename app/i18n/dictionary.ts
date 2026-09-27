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
    KoCCup: {
        cs: "King of Carcassonne Cup",
        en: "King of Carcassonne Cup",
    },
    KoCChampionship: {
        cs: "King of Carcassonne Championship",
        en: "King of Carcassonne Championship",
    },
    KoCToC: {
        cs: "King of Carcassonne Tournament of Champions",
        en: "King of Carcassonne Tournament of Champions",
    },
    MSO: {
        cs: "Mind Sports Olympiad",
        en: "Mind Sports Olympiad",
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
    phoneNumber: {
        cs: "Telefonní číslo",
        en: "Phone number",
    },
    playerAvatar: {
        cs: "Avatar hráče",
        en: "Player avatar",
    },
    chooseImage: {
        cs: "Vyberte obrázek",
        en: "Choose an image",
    },
    profileSaved: {
        cs: "Profil byl uložen.",
        en: "Profile saved.",
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
    logIn: {
        cs: "Přihlásit se",
        en: "Log in",
    },
    logOut: {
        cs: "Odhlásit se",
        en: "Log out",
    },
    admin: {
        cs: "Administrace",
        en: "Admin",
    },
    adminPanel: {
        cs: "Administrace",
        en: "Admin panel",
    },
    editor: {
        cs: "Editor",
        en: "Editor",
    },
    editorPanel: {
        cs: "Editor",
        en: "Editor panel",
    },
    profile: {
        cs: "Profil",
        en: "Profile",
    },
    profilePanel: {
        cs: "Profil",
        en: "Profile",
    },
    accessDenied: {
        cs: "K této stránce nemáte přístup.",
        en: "You do not have access to this page.",
    },
    overview: {
        cs: "Přehled",
        en: "Overview",
    },
    users: {
        cs: "Uživatelé",
        en: "Users",
    },
    allNews: {
        cs: "Všechny novinky",
        en: "All news",
    },
    ownNews: {
        cs: "Jen moje novinky",
        en: "Only my news",
    },
    createNews: {
        cs: "Vytvořit novinku",
        en: "Create news",
    },
    editNews: {
        cs: "Upravit novinku",
        en: "Edit news",
    },
    title: {
        cs: "Název",
        en: "Title",
    },
    content: {
        cs: "Obsah",
        en: "Content",
    },
    picture: {
        cs: "Obrázek",
        en: "Picture",
    },
    expiresAt: {
        cs: "Platí do",
        en: "Expires at",
    },
    author: {
        cs: "Autor",
        en: "Author",
    },
    expiredNews: {
        cs: "Archivované novinky",
        en: "Expired news",
    },
    save: {
        cs: "Uložit",
        en: "Save",
    },
    cancel: {
        cs: "Zrušit",
        en: "Cancel",
    },
    markdownHint: {
        cs: "Obsah podporuje Markdown.",
        en: "Content supports Markdown.",
    },
} as const;

export type DictionaryStub = keyof typeof _DICTIONARY;
export const DICTIONARY: Record<DictionaryStub, Record<Lang, string>> = {
    ..._DICTIONARY,
} as const;
