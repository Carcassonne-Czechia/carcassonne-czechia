drop view if exists public.news_public;

create view public.news_public
with (security_invoker = false)
as
select
	news.id,
	news.author_id,
	news.created_at,
	news.hide_at,
	news.title_cs,
	news.title_en,
	news.content_cs,
	news.content_en,
	news.image,
	coalesce(
		nullif(btrim(players.name), ''),
		nullif(btrim(players.bga_username), ''),
		'Carcassonne Czechia'
	) as author
from public.news news
left join public.profiles profiles on profiles.user_id = news.author_id
left join public.players players on players.id = profiles.player_id
where news.hide_at is null or news.hide_at > now();

revoke all on public.news_public from public;
grant select on public.news_public to anon, authenticated;
