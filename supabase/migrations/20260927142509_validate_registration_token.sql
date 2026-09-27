create or replace function public.validate_registration_token(
	p_token_hash text
)
returns boolean
language sql
security invoker
set search_path = public, pg_catalog
as $$
	select exists (
		select 1
		from public.registration_tokens token
		where token.token_hash = p_token_hash
			and token.expires_at > now()
			and exists (
				select 1
				from public.players player
				where player.id = token.player_id
					and player.bga_username is not null
			)
	);
$$;

revoke execute on function public.validate_registration_token(text)
	from public, anon, authenticated;
grant execute on function public.validate_registration_token(text)
	to service_role;
