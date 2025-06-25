import {
    formerTeamCaptainBGAUsernames,
    teamCaptainBGAUsername,
    teamCompetitionMembers,
    teamContests,
    type CurrentTeamMemberBGAUsername,
    type FormerTeamMemberBGAUsername,
    type TeamContestParticipations,
} from "~/players/team-members";
import { getNameFromBGAUsername } from "~/utils";

type BasicTeamMemberData = {
    name: string | undefined;
    BGA_Username: CurrentTeamMemberBGAUsername | FormerTeamMemberBGAUsername;
    team_captain: boolean;
    former_captain: boolean;
};

export type TeamMemberData = BasicTeamMemberData &
    Record<TeamContestParticipations, number[]>;

export const computeTeamMemberDataFromBGAUsername = (
    BGA_Username: CurrentTeamMemberBGAUsername | FormerTeamMemberBGAUsername
) => {
    const memberData: BasicTeamMemberData &
        Partial<Record<TeamContestParticipations, number[]>> = {
        name: getNameFromBGAUsername(BGA_Username),
        BGA_Username,
        team_captain: teamCaptainBGAUsername === BGA_Username,
        former_captain: formerTeamCaptainBGAUsernames.includes(BGA_Username),
    };

    teamContests.forEach((teamContest) => {
        memberData[`${teamContest}Participations`] = [];

        teamCompetitionMembers[teamContest].forEach((contest) => {
            contest.members.forEach((member) => {
                if (member === BGA_Username)
                    memberData[`${teamContest}Participations`]?.push(
                        contest.year
                    );
            });
        });
    });

    return memberData as TeamMemberData;
};
