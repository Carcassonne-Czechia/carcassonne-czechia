insert into storage.buckets (id, name, public)
values ('player-avatars', 'player-avatars', true)
on conflict (id) do update set public = excluded.public;

create policy "Users can upload player avatars"
on storage.objects for insert
to authenticated
with check (
	bucket_id = 'player-avatars'
	and (
		(storage.foldername(name))[1] = (select auth.uid())::text
		or (select private.has_permission('admin'))
	)
);

create policy "Users can update player avatars"
on storage.objects for update
to authenticated
using (
	bucket_id = 'player-avatars'
	and (
		(storage.foldername(name))[1] = (select auth.uid())::text
		or (select private.has_permission('admin'))
	)
)
with check (
	bucket_id = 'player-avatars'
	and (
		(storage.foldername(name))[1] = (select auth.uid())::text
		or (select private.has_permission('admin'))
	)
);

create policy "Users can delete player avatars"
on storage.objects for delete
to authenticated
using (
	bucket_id = 'player-avatars'
	and (
		(storage.foldername(name))[1] = (select auth.uid())::text
		or (select private.has_permission('admin'))
	)
);

grant update (name, bga_username) on public.players to authenticated;

create policy "Users can update their linked player identity"
on public.players for update
to authenticated
using (
	exists (
		select 1
		from public.profiles
		where profiles.player_id = players.id
		and profiles.user_id = (select auth.uid())
	)
)
with check (
	exists (
		select 1
		from public.profiles
		where profiles.player_id = players.id
		and profiles.user_id = (select auth.uid())
	)
);
