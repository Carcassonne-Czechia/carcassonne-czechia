create policy "Users can read their own permissions"
	on public.user_permissions for select
	to authenticated
	using ((select auth.uid()) = user_id);
