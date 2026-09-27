import { HAS_AVATAR } from "~/existing-content";

export function getPlayerAvatarUrl(
    bgaUsername: string | null,
    profilePicturePath: string | null = null
) {
    if (profilePicturePath || !bgaUsername) {
        return profilePicturePath || "/assets/logo.jpg";
    }

    const avatarFileName = bgaUsername === "_Lyanna_" ? "Lyanna" : bgaUsername;
    const hasLegacyAvatar = (HAS_AVATAR as readonly string[]).includes(
        bgaUsername
    );

    return hasLegacyAvatar
        ? `/assets/player-avatars/${avatarFileName}.jpg`
        : "/assets/logo.jpg";
}
