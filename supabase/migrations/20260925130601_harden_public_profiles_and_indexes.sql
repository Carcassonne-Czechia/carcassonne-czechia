drop view if exists public.profile_directory;

create policy "Public can read profile directory fields"
on public.profiles for select
to anon
using (true);

revoke all on public.profiles from anon;
grant select (player_id, bio, profile_picture_path)
	on public.profiles to anon;

create index news_author_id_idx
	on public.news (author_id);

create index user_permissions_granted_by_idx
	on public.user_permissions (granted_by);

create index user_permissions_permission_code_idx
	on public.user_permissions (permission_code);
