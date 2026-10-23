import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ORIGIN = "https://educap-afrique.fifiofficiel12.workers.dev";
const cors = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: cors });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json({ error: "Configuration serveur incomplète." }, 500);

  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Connexion requise." }, 401);

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user) return json({ error: "Session invalide." }, 401);

  const { data: profile, error: profileError } = await admin
    .from("profiles").select("role").eq("id", authData.user.id).maybeSingle();
  if (profileError || profile?.role !== "admin") return json({ error: "Accès réservé à l'administration." }, 403);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Données invalides." }, 400); }
  const action = String(body.action || "");
  const id = String(body.id || "");
  if (id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return json({ error: "Identifiant invalide." }, 400);
  }

  if (action === "list_admin") {
    const [affiliatesResult, commissionsResult] = await Promise.all([
      admin.from("affiliate_profiles").select("user_id,code,category,status,created_at,approved_at").order("created_at", { ascending: false }).limit(200),
      admin.from("affiliate_commissions").select("id,affiliate_id,referred_user_id,payment_id,amount,category_at_payment,status,created_at,approved_at,paid_at").order("created_at", { ascending: false }).limit(300),
    ]);
    if (affiliatesResult.error || commissionsResult.error) return json({ error: "Impossible de charger les données d’affiliation." }, 500);
    const affiliates = affiliatesResult.data || [];
    const commissions = commissionsResult.data || [];
    const [clicksResult, referralsResult] = await Promise.all([
      admin.from("affiliate_clicks").select("affiliate_id"),
      admin.from("affiliate_referrals").select("affiliate_id"),
    ]);
    if (clicksResult.error || referralsResult.error) return json({ error: "Impossible de calculer les indicateurs." }, 500);
    return json({
      affiliates: affiliates.map((a: any) => ({
        ...a,
        clicks: (clicksResult.data || []).filter((x: any) => x.affiliate_id === a.user_id).length,
        referrals: (referralsResult.data || []).filter((x: any) => x.affiliate_id === a.user_id).length,
        paidSubscriptions: commissions.filter((c: any) => c.affiliate_id === a.user_id && ["pending", "approved", "paid"].includes(c.status)).length,
      })),
      commissions,
    });
  }

  if (!id) return json({ error: "Identifiant requis." }, 400);

  if (action === "approve_affiliate") {
    const { error } = await admin.from("affiliate_profiles")
      .update({ status: "approved", approved_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("user_id", id).eq("status", "pending");
    if (error) return json({ error: "Validation impossible." }, 500);
    return json({ success: true });
  }
  if (action === "suspend_affiliate") {
    const { error } = await admin.from("affiliate_profiles")
      .update({ status: "suspended", updated_at: new Date().toISOString() })
      .eq("user_id", id);
    if (error) return json({ error: "Suspension impossible." }, 500);
    return json({ success: true });
  }
  if (action === "approve_commission") {
    const { data, error } = await admin.from("affiliate_commissions")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("id", id).eq("status", "pending")
      .select("id").maybeSingle();
    if (error || !data) return json({ error: "Commission introuvable ou déjà traitée." }, 409);
    return json({ success: true });
  }
  if (action === "mark_commission_paid") {
    const { data, error } = await admin.from("affiliate_commissions")
      .update({ status: "paid", paid_at: new Date().toISOString(), paid_by: authData.user.id })
      .eq("id", id).eq("status", "approved")
      .select("id").maybeSingle();
    if (error || !data) return json({ error: "La commission doit d’abord être approuvée." }, 409);
    return json({ success: true });
  }

  return json({ error: "Action non reconnue." }, 400);
});
