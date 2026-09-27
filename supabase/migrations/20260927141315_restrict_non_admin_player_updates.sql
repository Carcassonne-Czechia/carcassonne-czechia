create or replace function private.protect_player_fields()
returns trigger
language plpgsql
set search_path = private, pg_catalog
as $$
begin
	if not (select private.has_permission('admin'))
	and (
		(to_jsonb(new) - array['name', 'updated_at']) is distinct from
		(to_jsonb(old) - array['name', 'updated_at'])
	) then
		raise exception 'Only the player name can be changed by non-admins';
	end if;

	if not (select private.has_permission('admin')) then
		new.updated_at := now();
	end if;

	return new;
end;
$$;

revoke execute on function private.protect_player_fields() from public;
grant execute on function private.protect_player_fields() to authenticated;

drop trigger if exists players_protect_fields on public.players;
create trigger players_protect_fields
	before update on public.players
	for each row execute procedure private.protect_player_fields();
