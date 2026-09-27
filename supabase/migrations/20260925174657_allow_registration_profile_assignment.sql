create or replace function private.protect_profile_fields()
returns trigger
language plpgsql
set search_path = private, pg_catalog
as $$
begin
	if not (select private.has_permission('admin'))
	and current_setting('app.registration_completion', true) is distinct from 'on'
	and (
		new.user_id is distinct from old.user_id
		or new.player_id is distinct from old.player_id
		or new.created_at is distinct from old.created_at
	) then
		raise exception 'Only admins can change protected profile fields';
	end if;

	new.updated_at := now();
	return new;
end;
$$;

create or replace function public.complete_registration(
	p_token_hash text,
	p_user_id uuid
)
returns table (player_id bigint, permission_codes text[])
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
	registration_token public.registration_tokens%rowtype;
	assigned_permissions text[];
begin
	select token.*
	into registration_token
	from public.registration_tokens token
	where token.token_hash = p_token_hash
		and token.expires_at > now()
	for update;

	if not found then
		raise exception 'Invalid or expired registration token'
			using errcode = 'no_data_found';
	end if;

	if not exists (
		select 1
		from public.players
		where id = registration_token.player_id
		and bga_username is not null
	) then
		raise exception 'The selected BGA username no longer exists'
			using errcode = 'foreign_key_violation';
	end if;

	select array_agg(permission_code order by permission_code)
	into assigned_permissions
	from public.registration_token_permissions
	where token_id = registration_token.id;

	insert into public.user_permissions (user_id, permission_code, granted_by)
	select p_user_id, permission_code, p_user_id
	from public.registration_token_permissions
	where token_id = registration_token.id
	on conflict (user_id, permission_code) do nothing;

	perform set_config('request.jwt.claim.sub', p_user_id::text, true);
	perform set_config('app.registration_completion', 'on', true);

	update public.profiles
	set player_id = registration_token.player_id,
		updated_at = now()
	where user_id = p_user_id;

	if not found then
		insert into public.profiles (user_id, player_id)
		values (p_user_id, registration_token.player_id);
	end if;

	delete from public.registration_tokens
	where id = registration_token.id;

	return query select registration_token.player_id, assigned_permissions;
end;
$$;

revoke execute on function public.complete_registration(text, uuid)
	from public, anon, authenticated;
grant execute on function public.complete_registration(text, uuid)
	to service_role;
