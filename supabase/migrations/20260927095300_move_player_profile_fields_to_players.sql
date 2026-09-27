alter table public.players
	add column if not exists bio text,
	add column if not exists profile_picture_path text;

update public.players
set
	bio = profiles.bio,
	profile_picture_path = profiles.profile_picture_path
from public.profiles profiles
where profiles.player_id = players.id;

alter table public.profiles
	drop column if exists bio,
	drop column if exists profile_picture_path;

drop policy if exists "Public can read profile directory fields" on public.profiles;
drop view if exists public.profile_directory;

create view public.profile_directory
with (security_invoker = false)
as
	select
		players.id as player_id,
		players.bio,
		players.profile_picture_path
	from public.players players;

revoke all on public.profile_directory from public;
grant select on public.profile_directory to anon, authenticated;

grant update (phone_number) on public.profiles to authenticated;
grant update (name, bga_username, bio, profile_picture_path)
	on public.players to authenticated;
