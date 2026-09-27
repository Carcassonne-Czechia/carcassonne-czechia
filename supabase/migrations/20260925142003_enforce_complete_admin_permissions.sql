create or replace function private.assert_admin_permission_completeness(
	target_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = private, pg_catalog
as $$
begin
	if exists (
		select 1
		from public.user_permissions
		where user_id = target_user_id
		and permission_code = 'admin'
	)
	and exists (
		select 1
		from public.permission_catalog catalog
		where catalog.code <> 'admin'
		and not exists (
			select 1
			from public.user_permissions permission
			where permission.user_id = target_user_id
			and permission.permission_code = catalog.code
		)
	) then
		raise exception 'An admin must have every non-admin permission'
			using errcode = 'check_violation';
	end if;
end;
$$;

revoke execute on function private.assert_admin_permission_completeness(uuid)
	from public, anon, authenticated;

create or replace function private.check_user_permission_admin_invariant()
returns trigger
language plpgsql
security definer
set search_path = private, pg_catalog
as $$
begin
	if tg_op = 'DELETE' then
		perform private.assert_admin_permission_completeness(old.user_id);
	elsif tg_op = 'UPDATE' then
		perform private.assert_admin_permission_completeness(old.user_id);
		perform private.assert_admin_permission_completeness(new.user_id);
	else
		perform private.assert_admin_permission_completeness(new.user_id);
	end if;
	return null;
end;
$$;

revoke execute on function private.check_user_permission_admin_invariant()
	from public, anon, authenticated;

create constraint trigger user_permissions_admin_invariant
	after insert or update or delete on public.user_permissions
	deferrable initially deferred
	for each row execute procedure private.check_user_permission_admin_invariant();

create or replace function private.check_permission_catalog_admin_invariant()
returns trigger
language plpgsql
security definer
set search_path = private, pg_catalog
as $$
declare
	admin_user record;
begin
	for admin_user in
		select distinct user_id
		from public.user_permissions
		where permission_code = 'admin'
	loop
		perform private.assert_admin_permission_completeness(admin_user.user_id);
	end loop;
	return null;
end;
$$;

revoke execute on function private.check_permission_catalog_admin_invariant()
	from public, anon, authenticated;

create constraint trigger permission_catalog_admin_invariant
	after insert or update or delete on public.permission_catalog
	deferrable initially deferred
	for each row execute procedure private.check_permission_catalog_admin_invariant();

insert into public.user_permissions (user_id, permission_code, granted_by)
select admin_permissions.user_id, catalog.code, admin_permissions.user_id
from public.user_permissions admin_permissions
cross join public.permission_catalog catalog
where admin_permissions.permission_code = 'admin'
	and catalog.code <> 'admin'
on conflict (user_id, permission_code) do nothing;
