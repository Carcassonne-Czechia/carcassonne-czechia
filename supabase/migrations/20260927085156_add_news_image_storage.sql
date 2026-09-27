insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do update set public = excluded.public;

create policy "News editors can upload news images"
on storage.objects for insert
to authenticated
with check (
	bucket_id = 'news-images'
	and (storage.foldername(name))[1] = (select auth.uid())::text
	and (
		(select private.has_permission('news.edit'))
		or (select private.has_permission('admin'))
	)
);

create policy "News editors can update their images"
on storage.objects for update
to authenticated
using (
	bucket_id = 'news-images'
	and (storage.foldername(name))[1] = (select auth.uid())::text
	and (
		(select private.has_permission('news.edit'))
		or (select private.has_permission('admin'))
	)
)
with check (
	bucket_id = 'news-images'
	and (storage.foldername(name))[1] = (select auth.uid())::text
	and (
		(select private.has_permission('news.edit'))
		or (select private.has_permission('admin'))
	)
);

create policy "News editors can delete their images"
on storage.objects for delete
to authenticated
using (
	bucket_id = 'news-images'
	and (storage.foldername(name))[1] = (select auth.uid())::text
	and (
		(select private.has_permission('news.edit'))
		or (select private.has_permission('admin'))
	)
);
