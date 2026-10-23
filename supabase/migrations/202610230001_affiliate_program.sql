-- EduCap Afrique : programme d’affiliation sécurisé.
create table if not exists public.affiliate_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text not null unique,
  category text not null default 'starter' check (category in ('starter','pro','elite')),
  status text not null default 'pending' check (status in ('pending','approved','suspended')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  updated_at timestamptz not null default now()
);
create table if not exists public.affiliate_clicks (
  id bigint generated always as identity primary key,
  affiliate_id uuid not null references public.affiliate_profiles(user_id) on delete cascade,
  visitor_key uuid not null,
  clicked_on date not null default (timezone('utc', now()))::date,
  referrer text,
  created_at timestamptz not null default now(),
  unique (affiliate_id, visitor_key, clicked_on)
);
create table if not exists public.affiliate_referrals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliate_profiles(user_id) on delete restrict,
  referred_user_id uuid not null unique references auth.users(id) on delete cascade,
  referral_code text not null,
  attributed_at timestamptz not null default now(),
  constraint affiliate_referrals_not_self check (affiliate_id <> referred_user_id)
);
create table if not exists public.affiliate_commissions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliate_profiles(user_id) on delete restrict,
  referred_user_id uuid not null references auth.users(id) on delete restrict,
  payment_id uuid not null unique references public.payments(id) on delete restrict,
  amount integer not null check (amount in (75,110,150)),
  category_at_payment text not null check (category_at_payment in ('starter','pro','elite')),
  status text not null default 'pending' check (status in ('pending','approved','paid','cancelled')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  paid_at timestamptz,
  paid_by uuid references auth.users(id) on delete set null,
  admin_note text
);
create index if not exists affiliate_clicks_affiliate_created_idx on public.affiliate_clicks (affiliate_id, created_at desc);
create index if not exists affiliate_referrals_affiliate_idx on public.affiliate_referrals (affiliate_id, attributed_at desc);
create index if not exists affiliate_commissions_affiliate_status_idx on public.affiliate_commissions (affiliate_id, status, created_at desc);

alter table public.affiliate_profiles enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.affiliate_referrals enable row level security;
alter table public.affiliate_commissions enable row level security;

drop policy if exists "Affiliés lisent leur profil" on public.affiliate_profiles;
create policy "Affiliés lisent leur profil" on public.affiliate_profiles for select to authenticated
using (user_id = (select auth.uid()) or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
drop policy if exists "Affiliés lisent leurs clics" on public.affiliate_clicks;
create policy "Affiliés lisent leurs clics" on public.affiliate_clicks for select to authenticated
using (affiliate_id = (select auth.uid()) or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
drop policy if exists "Affiliés lisent leurs filleuls" on public.affiliate_referrals;
create policy "Affiliés lisent leurs filleuls" on public.affiliate_referrals for select to authenticated
using (affiliate_id = (select auth.uid()) or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
drop policy if exists "Affiliés lisent leurs commissions" on public.affiliate_commissions;
create policy "Affiliés lisent leurs commissions" on public.affiliate_commissions for select to authenticated
using (affiliate_id = (select auth.uid()) or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

revoke all on public.affiliate_profiles, public.affiliate_clicks, public.affiliate_referrals, public.affiliate_commissions from anon, authenticated, public;
grant select on public.affiliate_profiles, public.affiliate_clicks, public.affiliate_referrals, public.affiliate_commissions to authenticated;
grant usage, select on sequence public.affiliate_clicks_id_seq to service_role;

-- Empêche l'auto-attribution du rôle administrateur via la mise à jour du profil.
revoke update on public.profiles from anon, authenticated, public;
grant update (full_name, parcours, classe, serie, niveau_campus, domaine_campus, formation, pays) on public.profiles to authenticated;

create or replace function public.request_affiliate() returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_user uuid := auth.uid(); v_row public.affiliate_profiles;
begin
  if v_user is null then raise exception 'Connexion requise'; end if;
  insert into public.affiliate_profiles (user_id, code)
  values (v_user, 'EDU-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)))
  on conflict (user_id) do nothing;
  select * into v_row from public.affiliate_profiles where user_id = v_user;
  return jsonb_build_object('user_id', v_row.user_id, 'code', v_row.code, 'category', v_row.category, 'status', v_row.status);
end; $$;
revoke all on function public.request_affiliate() from public, anon;
grant execute on function public.request_affiliate() to authenticated;

create or replace function public.track_affiliate_click(p_code text, p_visitor_key uuid, p_referrer text default null)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_affiliate uuid;
begin
  if p_code is null or length(p_code) > 32 or p_visitor_key is null then return false; end if;
  select user_id into v_affiliate from public.affiliate_profiles
  where upper(code) = upper(trim(p_code)) and status = 'approved';
  if v_affiliate is null then return false; end if;
  insert into public.affiliate_clicks (affiliate_id, visitor_key, referrer)
  values (v_affiliate, p_visitor_key, left(coalesce(p_referrer, ''), 300))
  on conflict (affiliate_id, visitor_key, clicked_on) do nothing;
  return true;
end; $$;
revoke all on function public.track_affiliate_click(text, uuid, text) from public;
grant execute on function public.track_affiliate_click(text, uuid, text) to anon, authenticated;

create or replace function public.capture_affiliate_referral(p_code text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_user uuid := auth.uid(); v_affiliate public.affiliate_profiles; v_existing public.affiliate_referrals;
begin
  if v_user is null then raise exception 'Connexion requise'; end if;
  select * into v_existing from public.affiliate_referrals where referred_user_id = v_user;
  if found then return jsonb_build_object('captured', false, 'reason', 'already_attributed'); end if;
  if exists (select 1 from public.payments where user_id = v_user and status = 'paid') then
    return jsonb_build_object('captured', false, 'reason', 'already_paid');
  end if;
  select * into v_affiliate from public.affiliate_profiles
  where upper(code) = upper(trim(coalesce(p_code,''))) and status = 'approved';
  if not found or v_affiliate.user_id = v_user then return jsonb_build_object('captured', false, 'reason', 'invalid_code'); end if;
  insert into public.affiliate_referrals (affiliate_id, referred_user_id, referral_code)
  values (v_affiliate.user_id, v_user, v_affiliate.code)
  on conflict (referred_user_id) do nothing;
  return jsonb_build_object('captured', true);
end; $$;
revoke all on function public.capture_affiliate_referral(text) from public, anon;
grant execute on function public.capture_affiliate_referral(text) to authenticated;

create or replace function public.process_affiliate_paid_payment() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_affiliate public.affiliate_profiles; v_amount integer; v_count bigint;
begin
  if new.status <> 'paid' or old.status = 'paid' or new.amount <> 750 then return new; end if;
  select ap.* into v_affiliate from public.affiliate_referrals ar
  join public.affiliate_profiles ap on ap.user_id = ar.affiliate_id
  where ar.referred_user_id = new.user_id and ap.status = 'approved';
  if not found then return new; end if;
  v_amount := case v_affiliate.category when 'elite' then 150 when 'pro' then 110 else 75 end;
  insert into public.affiliate_commissions (affiliate_id,referred_user_id,payment_id,amount,category_at_payment,status)
  values (v_affiliate.user_id,new.user_id,new.id,v_amount,v_affiliate.category,'pending')
  on conflict (payment_id) do nothing;
  select count(*) into v_count from public.affiliate_commissions
  where affiliate_id = v_affiliate.user_id and status in ('pending','approved','paid');
  update public.affiliate_profiles set category = case
    when v_count >= 100 then 'elite'
    when v_count >= 20 and category = 'starter' then 'pro'
    else category end,
    updated_at = now()
  where user_id = v_affiliate.user_id;
  return new;
end; $$;
drop trigger if exists trg_process_affiliate_paid_payment on public.payments;
create trigger trg_process_affiliate_paid_payment after update of status on public.payments
for each row when (new.status = 'paid' and old.status is distinct from 'paid')
execute function public.process_affiliate_paid_payment();
revoke all on function public.process_affiliate_paid_payment() from public, anon, authenticated;

create index if not exists affiliate_commissions_referred_user_idx on public.affiliate_commissions (referred_user_id);
create index if not exists affiliate_commissions_paid_by_idx on public.affiliate_commissions (paid_by);
