-- Active les notifications en temps réel des commissions pour les affiliés.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'affiliate_commissions'
     ) then
    execute 'alter publication supabase_realtime add table public.affiliate_commissions';
  end if;
end $$;
