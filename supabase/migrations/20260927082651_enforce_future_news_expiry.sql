create or replace function private.validate_news_expiry()
returns trigger
language plpgsql
set search_path = private, pg_catalog
as $$
begin
	if new.hide_at is not null and new.hide_at <= now() then
		raise exception 'News expiry must be in the future'
			using errcode = 'check_violation';
	end if;

	return new;
end;
$$;

revoke execute on function private.validate_news_expiry() from public;
grant execute on function private.validate_news_expiry() to authenticated;

drop trigger if exists news_validate_expiry on public.news;
create trigger news_validate_expiry
	before insert or update of hide_at on public.news
	for each row execute procedure private.validate_news_expiry();
