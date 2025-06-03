export const TEXT_STUBS = {
    BGA_USERNAME: "BGA_Username",
    NATIONAL_CHAMPIONSHIP: "nationalChampionship",
    ONLINE_CHAMPIONSHIP: "onlineChampionship",
    WORLD_CHAMPIONSHIP: "worldChampionship",
    CCL: "championsLeague",
    NAME: "name",
    POSITION: "position",
    SCORE_DIFFERENCE: "scoreDifference",
    GOLD: "Gold",
    SILVER: "Silver",
    BRONZE: "Bronze",
    PARTICIPATION: "Participation",
    YEAR: "year",
} as const;

export type TextStub = keyof typeof TEXT_STUBS;
