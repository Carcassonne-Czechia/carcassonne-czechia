create or replace function public.create_registration_token(
	p_token_hash text,
	p_token_prefix text,
	p_player_id bigint,
	p_permission_codes text[],
	p_created_by uuid
)
returns table (id uuid, expires_at timestamptz)
language plpgsql
set search_path = public, pg_catalog
as $$
declare
	new_token_id uuid;
	new_expires_at timestamptz;
	requested_code_count integer;
	known_code_count integer;
begin
	if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then
		raise exception 'Invalid registration token hash' using errcode = 'check_violation';
	end if;

	if p_token_prefix is null or length(p_token_prefix) not between 4 and 32 then
		raise exception 'Invalid registration token prefix' using errcode = 'check_violation';
	end if;

	if p_permission_codes is null then
		raise exception 'Registration permissions are required as an array'
			using errcode = 'check_violation';
	end if;

	select count(distinct requested_code)
	into requested_code_count
	from unnest(p_permission_codes) as requested_code;

	select count(*)
	into known_code_count
	from public.permission_catalog
	where code = any(p_permission_codes);

	if requested_code_count <> known_code_count then
		raise exception 'Unknown registration permission' using errcode = 'foreign_key_violation';
	end if;

	if not exists (
		select 1
		from public.players
		where public.players.id = p_player_id
		and bga_username is not null
	) then
		raise exception 'The selected BGA username does not exist'
			using errcode = 'foreign_key_violation';
	end if;

	delete from public.registration_tokens
	where registration_tokens.expires_at <= now();

	if exists (select 1 from public.registration_tokens) then
		raise exception 'An active registration token already exists'
			using errcode = 'unique_violation';
	end if;

	new_expires_at := now() + interval '1 week';
	insert into public.registration_tokens (
		token_hash,
		token_prefix,
		player_id,
		created_by,
		expires_at
	)
	values (
		p_token_hash,
		p_token_prefix,
		p_player_id,
		p_created_by,
		new_expires_at
	)
	returning registration_tokens.id into new_token_id;

	insert into public.registration_token_permissions (token_id, permission_code)
	select new_token_id, catalog.code
	from public.permission_catalog catalog
	where catalog.code = any(p_permission_codes)
		or ('admin' = any(p_permission_codes) and catalog.code <> 'admin');

	return query select new_token_id, new_expires_at;
end;
$$;

revoke execute on function public.create_registration_token(text, text, bigint, text[], uuid)
	from public, anon, authenticated;
grant execute on function public.create_registration_token(text, text, bigint, text[], uuid)
	to service_role;
