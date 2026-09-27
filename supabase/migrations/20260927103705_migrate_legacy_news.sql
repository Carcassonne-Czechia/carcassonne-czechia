alter table public.news
	alter column author_id drop not null;

grant select on public.news to anon, authenticated;
grant insert, update, delete on public.news to authenticated;
grant usage, select on sequence public.news_id_seq to authenticated;

insert into public.news (
	author_id,
	created_at,
	title_cs,
	title_en,
	content_cs,
	content_en,
	image
)
values
(
	null,
	timestamptz '2026-07-02 00:00:00+00',
	$$Online mistrovství České republiky 2026$$,
	$$Online championship of the Czech Republic 2026$$,
	$cs$
Připravujeme pro vás další ročník online mistrovství České republiky v Carcassonne. Začínáme už 31. srpna 2026 a těšíme se na vaši účast! Vítězové se opět kvalifikují do Carcassonne Champions League. Podrobnosti naleznete na [stránce online mistrovství](/online-championship).
$cs$,
	$en$
We are preparing the next edition of the online championship of the Czech Republic in Carcassonne. It starts on August 31, 2026 and the winners will again qualify for the Carcassonne Champions League. Details can be found on the [online championship page](/online-championship).
$en$,
	'/assets/news/2025-online-championship.jpg'
),
(
	null,
	timestamptz '2025-11-30 00:00:00+00',
	$$Podzim plný turnajů pro naši komunitu$$,
	$$Engaging fall for our community$$,
	$cs$
Kromě mistrovství České republiky a online mistrovství se náš tým zúčastnil také Mistrovství Evropy. Skupinová fáze již ukázala vyrovnanost pole, kde naši hráči podali solidní výkony, které vyústily ve tři vítězství 3:2, díky čemuž jsme se umístili na druhém místě naší skupiny. Gratulujeme Polsku k vítězství v naší skupině s výjimečnými výkony a chválíme zbytek týmů, proti kterým jsme hráli.

Rádi bychom nasdíleli nezapomenutelný moment, kdy [J0nny](https://boardgamearena.com/player?id=84017874) posledním tahem svého rozhodujícího zápasu proti Chorvatsku spojil louky, což otočilo hru a umožnilo mu vyhrát o dva body a našemu týmu vyhrát zápas 3:2.

Ve čtvrtfinále jsme čelili silnému belgickému týmu a bohužel se nám podařilo ukořistit pouze dva duely. Celkově jsme na výkony našeho týmu hrdí a těšíme se na budoucí turnaje. I když jsme byli opět o pár rozhodnutí od průlomu, jsme motivováni k dalšímu zlepšování a nadále cílíme na medaili.

Kromě toho [chonps](https://boardgamearena.com/player?id=86015756) dosáhl velmi ceněného 10. místa na osobním Mistrovství světa. Bylo to poprvé, co se pole rozrostlo na více než 50 hráčů, což činí tento úspěch ještě působivějším. Gratulujeme chonpsovi za reprezentaci naší komunity na světové scéně!
$cs$,
	$en$
In addition to the national and online championships, our team took part in the European Championships. The group stage already showed the competitiveness and evenness of the field, with our players delivering solid performances resulting in three 3:2 victories placing us at the second place in our group. We congratulate Poland for winning our group with exceptional performances and give props to the rest of the teams we played against.

We would like to share a memorable moment of [J0nny](https://boardgamearena.com/player?id=84017874) drawing a connection tile at the last turn in his decider game against Croatia that turned the game around making him win by two points and our team win the match 3:2.

In the quarterfinals, we faced a strong Belgian team and sadly only managed to snatch two duels. Overall, we are proud of our team's performance and look forward to future competitions. Even though we were again a couple of decisions away from a breakthrough, we are motivated to keep improving and aiming for a medal in the future.

In addition to that, [chonps](https://boardgamearena.com/player?id=86015756) managed to claim a very respectable 10th place in the in-person World Championships. This was the first time the field has grown to over 50 players, making this achievement even more impressive. Congratulations to chonps for representing our community on the world stage!
$en$,
	'/assets/news/fall.png'
),
(
	null,
	timestamptz '2025-11-01 00:00:00+00',
	$$Mistrovství České republiky 2025$$,
	$$National Championship of Czechia 2025$$,
	$cs$
Dne 12. října 2025 se konalo mistrovství České republiky v Carcassonne. Naše reprezentace na něm obsadila skvělých prvních pět míst. Gratulujeme a přejeme šťastnou cestu do Německa vítězovi [Moya88](https://boardgamearena.com/player?id=84643413) a děkujeme všem účastníkům za skvělou atmosféru!
$cs$,
	$en$
On October 12, 2025, the National Championship of Czechia in Carcassonne took place. Our representatives secured the top five positions. Congratulations to the winner [Moya88](https://boardgamearena.com/player?id=84643413), who will represent us in Germany, and thanks to all participants for the great atmosphere!
$en$,
	'/assets/news/deskohrani.jpg'
);
