create table public.registration_tokens (
	id uuid primary key default gen_random_uuid(),
	token_hash text not null unique,
	token_prefix text not null,
	player_id bigint not null references public.players (id) on delete restrict,
	created_by uuid not null references auth.users (id) on delete restrict,
	created_at timestamptz not null default now(),
	expires_at timestamptz not null,
	constraint registration_tokens_hash_check check (token_hash ~ '^[0-9a-f]{64}$'),
	constraint registration_tokens_prefix_check check (length(token_prefix) between 4 and 32),
	constraint registration_tokens_expiry_check check (expires_at > created_at)
);

create unique index registration_tokens_one_unconsumed
	on public.registration_tokens ((true));

create table public.registration_token_permissions (
	token_id uuid not null references public.registration_tokens (id) on delete cascade,
	permission_code text not null references public.permission_catalog (code) on delete restrict,
	primary key (token_id, permission_code)
);

alter table public.registration_tokens enable row level security;
alter table public.registration_token_permissions enable row level security;

revoke all on public.registration_tokens from anon, authenticated;
revoke all on public.registration_token_permissions from anon, authenticated;
grant all on public.registration_tokens to service_role;
grant all on public.registration_token_permissions to service_role;

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

	if p_permission_codes is null or cardinality(p_permission_codes) = 0 then
		raise exception 'At least one permission is required' using errcode = 'check_violation';
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
		where id = p_player_id
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
