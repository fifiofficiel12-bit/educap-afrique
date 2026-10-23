-- Demandes de retrait affiliés, avec minimum de 1 000 FCFA.
create table if not exists public.affiliate_withdrawals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliate_profiles(user_id) on delete restrict,
  amount integer not null check (amount >= 1000),
  mobile_money_operator text not null check (mobile_money_operator in ('orange_money','mtn_momo','moov_money','wave')),
  mobile_money_number text not null check (length(mobile_money_number) between 8 and 20),
  status text not null default 'pending' check (status in ('pending','approved','paid','rejected')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  paid_at timestamptz,
  paid_by uuid references auth.users(id) on delete set null,
  admin_note text
);
alter table public.affiliate_commissions add column if not exists withdrawal_id uuid references public.affiliate_withdrawals(id) on delete set null;
create index if not exists affiliate_withdrawals_affiliate_status_idx on public.affiliate_withdrawals(affiliate_id,status,created_at desc);
alter table public.affiliate_withdrawals enable row level security;
drop policy if exists "Affiliés lisent leurs retraits" on public.affiliate_withdrawals;
create policy "Affiliés lisent leurs retraits" on public.affiliate_withdrawals for select to authenticated using (
 affiliate_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')
);
revoke all on public.affiliate_withdrawals from anon, authenticated, public;
grant select on public.affiliate_withdrawals to authenticated;
create or replace function public.request_affiliate_withdrawal(p_operator text,p_number text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_user uuid:=auth.uid(); v_amount integer; v_withdrawal uuid; v_open boolean;
begin
 if v_user is null then raise exception 'Connecte-toi pour demander un retrait.'; end if;
 if p_operator not in ('orange_money','mtn_momo','moov_money','wave') then raise exception 'Choisis un opérateur Mobile Money valide.'; end if;
 if p_number is null or length(regexp_replace(p_number,'[^0-9+]','','g'))<8 or length(regexp_replace(p_number,'[^0-9+]','','g'))>20 then raise exception 'Saisis un numéro Mobile Money valide.'; end if;
 if not exists(select 1 from public.affiliate_profiles where user_id=v_user and status='approved') then raise exception 'Ton compte affilié doit être validé avant un retrait.'; end if;
 select exists(select 1 from public.affiliate_withdrawals where affiliate_id=v_user and status in ('pending','approved')) into v_open;
 if v_open then raise exception 'Tu as déjà une demande de retrait en cours.'; end if;
 select coalesce(sum(amount),0)::integer into v_amount from public.affiliate_commissions where affiliate_id=v_user and status='approved' and withdrawal_id is null;
 if v_amount<1000 then raise exception 'Le minimum de retrait est de 1 000 FCFA. Ton solde disponible est de % FCFA.',v_amount; end if;
 insert into public.affiliate_withdrawals(affiliate_id,amount,mobile_money_operator,mobile_money_number) values(v_user,v_amount,p_operator,regexp_replace(p_number,'[^0-9+]','','g')) returning id into v_withdrawal;
 update public.affiliate_commissions set withdrawal_id=v_withdrawal where affiliate_id=v_user and status='approved' and withdrawal_id is null;
 return jsonb_build_object('success',true,'withdrawal_id',v_withdrawal,'amount',v_amount);
end; $$;
revoke all on function public.request_affiliate_withdrawal(text,text) from public,anon;
grant execute on function public.request_affiliate_withdrawal(text,text) to authenticated;
