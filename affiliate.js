"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const URL = "https://byzsqblgsssymvsztaqb.supabase.co";
  const KEY = "sb_publishable_iGibajCXvXeDMWK5g28Rqw_FjEagmwR";
  const db = window.supabase?.createClient?.(URL, KEY);
  const $ = (id) => document.getElementById(id);
  const msg = $("affiliate-message");
  const apply = $("affiliate-application");
  const dash = $("affiliate-dashboard");
  const adminPanel = $("affiliate-admin-panel");
  let session = null, profile = null, affiliateChannel = null;
  const say = (s, ok=false) => { if(msg){msg.textContent=s;msg.style.color=ok?"#16803c":"#b42318";msg.hidden=false;} };
  const number = (id,n) => {if($(id)) $(id).textContent=new Intl.NumberFormat("fr-FR").format(n||0);};
  const money = (n) => new Intl.NumberFormat("fr-FR").format(Number(n||0))+" FCFA";

  const params = new URLSearchParams(location.search);
  const code = (params.get("ref")||"").trim().toUpperCase();
  if (/^EDU-[A-Z0-9]{8}$/.test(code)) {
    localStorage.setItem("educap_referral_code",code);
    let visitor = localStorage.getItem("educap_affiliate_visitor_id");
    if(!visitor){visitor=crypto.randomUUID();localStorage.setItem("educap_affiliate_visitor_id",visitor);}
    if(db) db.rpc("track_affiliate_click",{p_code:code,p_visitor_key:visitor,p_referrer:document.referrer||""})
      .then(({error})=>{if(error)console.warn("Suivi affiliation indisponible",error.message);});
  }

  async function adminCall(action,id=""){
    if(!session) throw new Error("Connecte-toi à ton compte.");
    const res=await fetch(URL+"/functions/v1/affiliate-admin",{method:"POST",headers:{
      "Content-Type":"application/json","apikey":KEY,"Authorization":"Bearer "+session.access_token
    },body:JSON.stringify({action,id})});
    const data=await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(data.error||"Action administrative impossible.");
    return data;
  }
  async function loadAdmin(){
    if(!adminPanel||profile?.role!=="admin")return;
    adminPanel.hidden=false;
    const list=$("affiliate-admin-affiliates"), comm=$("affiliate-admin-commissions"), withdrawals=$("affiliate-admin-withdrawals");
    list.textContent="Chargement…";comm.textContent="Chargement…";if(withdrawals)withdrawals.textContent="Chargement…";
    try{
      const data=await adminCall("list_admin");
      list.replaceChildren();comm.replaceChildren();if(withdrawals)withdrawals.replaceChildren();
      if(!data.affiliates.length)list.textContent="Aucune demande d’affiliation.";
      data.affiliates.forEach(a=>{
        const card=document.createElement("article");card.className="card affiliate-admin-card";
        const h=document.createElement("h4");h.textContent=a.code+" · "+a.category.toUpperCase();
        const p=document.createElement("p");p.textContent="Compte "+a.user_id+" · "+a.status+" · clics "+a.clicks+" · filleuls "+a.referrals+" · abonnements payés "+a.paidSubscriptions;
        card.append(h,p);
        if(a.status==="pending"||a.status!=="suspended"){
          const b=document.createElement("button");b.type="button";b.className="btn btn-primary";
          b.textContent=a.status==="pending"?"Valider l’affilié":"Suspendre";
          b.onclick=async()=>{try{await adminCall(a.status==="pending"?"approve_affiliate":"suspend_affiliate",a.user_id);await loadAdmin();say("Modification enregistrée.",true);}catch(e){say(e.message);}};
          card.append(b);
        }
        list.append(card);
      });
      if(!data.commissions.length)comm.textContent="Aucune commission.";
      data.commissions.forEach(c=>{
        const card=document.createElement("article");card.className="card affiliate-admin-card";
        const h=document.createElement("h4");h.textContent=money(c.amount)+" · "+c.status;
        const p=document.createElement("p");p.textContent="Affilié "+c.affiliate_id+" · abonnement "+c.payment_id+" · "+c.category_at_payment;
        card.append(h,p);
        if(c.status==="pending"||c.status==="approved"){
          const b=document.createElement("button");b.type="button";b.className="btn btn-primary";
          b.textContent=c.status==="pending"?"Approuver la commission":"Marquer comme payée";
          b.onclick=async()=>{try{await adminCall(c.status==="pending"?"approve_commission":"mark_commission_paid",c.id);await loadAdmin();say("Commission mise à jour.",true);}catch(e){say(e.message);}};
          card.append(b);
        }
        comm.append(card);
      });
      if(withdrawals){
        if(!data.withdrawals?.length)withdrawals.textContent="Aucune demande de retrait.";
        (data.withdrawals||[]).forEach(w=>{
          const card=document.createElement("article");card.className="card affiliate-admin-card";
          const h=document.createElement("h4");h.textContent=money(w.amount)+" · "+({pending:"En attente",approved:"À verser",paid:"Versé",rejected:"Refusé"})[w.status];
          const p=document.createElement("p");p.textContent="Affilié "+w.affiliate_id+" · "+({orange_money:"Orange Money",mtn_momo:"MTN MoMo",moov_money:"Moov Money",wave:"Wave"})[w.mobile_money_operator]+" · "+w.mobile_money_number;
          card.append(h,p);
          if(w.status==="pending"||w.status==="approved"){
            const b=document.createElement("button");b.type="button";b.className="btn btn-primary";
            b.textContent=w.status==="pending"?"Valider la demande":"Confirmer le versement";
            b.onclick=async()=>{try{await adminCall(w.status==="pending"?"approve_withdrawal":"mark_withdrawal_paid",w.id);await loadAdmin();say("Demande de retrait mise à jour.",true);}catch(e){say(e.message);}};
            card.append(b);
          }
          withdrawals.append(card);
        });
      }
    }catch(e){list.textContent=e.message;comm.textContent="Chargement impossible.";if(withdrawals)withdrawals.textContent="Chargement impossible."}
  }

  async function load(sessionInfo){
    session=sessionInfo||null;profile=null;
    if(!db)return;
    if(!session){if(dash)dash.hidden=true;if(apply)apply.hidden=false;if(adminPanel)adminPanel.hidden=true;return;}
    const p=await db.from("profiles").select("role").eq("id",session.user.id).maybeSingle();
    if(p.error){say("Impossible de vérifier ton profil.");return;}profile=p.data;
    const a=await db.from("affiliate_profiles").select("user_id,code,category,status").eq("user_id",session.user.id).maybeSingle();
    if(a.error){say("Impossible de charger l’affiliation : "+a.error.message);return;}
    if(!a.data){
      if(dash)dash.hidden=true;
      if(apply){apply.hidden=false;apply.textContent="Demander à devenir affilié";apply.onclick=async()=>{
        apply.disabled=true;try{const r=await db.rpc("request_affiliate");if(r.error)throw r.error;say("Demande envoyée. Ton lien sera activé après validation par EduCap Afrique.",true);await load(session);}
        catch(e){say("Demande impossible : "+e.message);}finally{apply.disabled=false;}
      };}
    }else{
      if(apply)apply.hidden=true;if(dash)dash.hidden=false;
      $("affiliate-code").textContent=a.data.code;
      $("affiliate-category").textContent=({starter:"Starter",pro:"Pro",elite:"Elite"})[a.data.category]||a.data.category;
      $("affiliate-status").textContent=({pending:"En attente de validation",approved:"Actif",suspended:"Suspendu"})[a.data.status]||a.data.status;
      const link=location.origin+"/?ref="+encodeURIComponent(a.data.code);$("affiliate-link").value=link;
      $("affiliate-link-copy").onclick=async()=>{try{await navigator.clipboard.writeText(link);say("Lien copié. Partage-le avec tes futurs apprenants.",true);}catch(_){$("affiliate-link").select();say("Sélectionne puis copie le lien.",true);}};
      const [clicks,refs,comm]=await Promise.all([
        db.from("affiliate_clicks").select("id",{count:"exact",head:true}).eq("affiliate_id",session.user.id),
        db.from("affiliate_referrals").select("id",{count:"exact",head:true}).eq("affiliate_id",session.user.id),
        db.from("affiliate_commissions").select("id,amount,status,category_at_payment,created_at,withdrawal_id").eq("affiliate_id",session.user.id).order("created_at",{ascending:false}).limit(1000)
      ]);
      const withdrawalsResult=await db.from("affiliate_withdrawals").select("id,amount,mobile_money_operator,mobile_money_number,mobile_money_service,status,created_at,paid_at").eq("affiliate_id",session.user.id).order("created_at",{ascending:false}).limit(100);
      if(clicks.error||refs.error||comm.error||withdrawalsResult.error){say("Certaines statistiques ne sont pas disponibles.");return;}
      const rows=comm.data||[];
      const available=rows.filter(x=>x.status==="approved"&&!x.withdrawal_id).reduce((s,x)=>s+x.amount,0);
      if($("affiliate-withdrawable"))$("affiliate-withdrawable").textContent=money(available);
      const withdrawalForm=$("affiliate-withdrawal-form");
      if(withdrawalForm&&!withdrawalForm.dataset.bound){
        withdrawalForm.dataset.bound="1";
        withdrawalForm.addEventListener("submit",async event=>{
          event.preventDefault();
          const button=$("affiliate-withdrawal-submit"), feedback=$("affiliate-withdrawal-message");
          button.disabled=true;
          try{
            const operator=$("affiliate-withdrawal-operator").value;
            const phone=$("affiliate-withdrawal-number").value.trim();
            const service=$("affiliate-withdrawal-other-service")?.value.trim()||"";
            if(operator==="other"&&!service)throw new Error("Précise le nom du service de paiement.");
            const {data,error}=await db.rpc("request_affiliate_withdrawal",{p_operator:operator,p_number:phone,p_service:service||null});
            if(error)throw error;
            if(data?.success!==true)throw new Error(data?.message||"La demande n’a pas pu être envoyée.");
            feedback.textContent="Demande envoyée : "+money(data.amount)+". Elle sera vérifiée par EduCap Afrique avant le versement.";
            feedback.hidden=false;feedback.style.color="#075b46";withdrawalForm.reset();
            await load(session);
          }catch(error){feedback.textContent=error.message||"Demande impossible. Réessaie.";feedback.hidden=false;feedback.style.color="#b42318";}
          finally{button.disabled=false;}
        });
      }
      const withdrawalList=$("affiliate-withdrawal-list");
      if(withdrawalList){
        withdrawalList.replaceChildren();
        const statuses={pending:"En attente de vérification",approved:"Validée, en attente de versement",paid:"Versée",rejected:"Refusée"};
        const operators={orange_money:"Orange Money",mtn_momo:"MTN MoMo",moov_money:"Moov Money",wave:"Wave",other:"Autre service"};
        if(!withdrawalsResult.data?.length)withdrawalList.textContent="Aucune demande pour le moment.";
        (withdrawalsResult.data||[]).forEach(w=>{
          const li=document.createElement("li");
          li.textContent=new Date(w.created_at).toLocaleDateString("fr-FR")+" — "+money(w.amount)+" — "+(w.mobile_money_operator==="other"?(w.mobile_money_service||"Autre service"):operators[w.mobile_money_operator])+" — "+w.mobile_money_number+" — "+statuses[w.status];
          withdrawalList.append(li);
        });
      }
      const notice=$("affiliate-notice");
      const paidRows=rows.filter(x=>["pending","approved","paid"].includes(x.status));
      if(notice){
        if(paidRows.length){
          const latest=paidRows[0];
          const statusText=({pending:"ta commission est en cours de vérification",approved:"ta commission est validée et en attente de versement",paid:"ta commission a été versée"})[latest.status];
          notice.textContent="Dernier abonnement confirmé : un apprenant venu grâce à ton lien a payé. Commission : "+money(latest.amount)+". "+statusText+".";
          notice.hidden=false;
        }else{
          notice.textContent="Dès qu’un apprenant paiera une formule EduCap Afrique grâce à ton lien, cette page affichera la confirmation et ta commission.";
          notice.hidden=false;
        }
      }
      number("affiliate-clicks",clicks.count);number("affiliate-referrals",refs.count);
      number("affiliate-paid-subscriptions",rows.filter(x=>["pending","approved","paid"].includes(x.status)).length);
      number("affiliate-earned",rows.filter(x=>x.status!=="cancelled").reduce((s,x)=>s+x.amount,0));
      number("affiliate-pending",rows.filter(x=>["pending","approved"].includes(x.status)).reduce((s,x)=>s+x.amount,0));
      number("affiliate-paid",rows.filter(x=>x.status==="paid").reduce((s,x)=>s+x.amount,0));
      const ul=$("affiliate-commission-list");ul.replaceChildren();
      if(!rows.length)ul.textContent="Les commissions apparaîtront après les premiers abonnements payés.";
      rows.forEach(x=>{const li=document.createElement("li");li.textContent=new Date(x.created_at).toLocaleDateString("fr-FR")+" — Abonnement confirmé — Commission : "+money(x.amount)+" — "+({pending:"en cours de vérification",approved:"validée, en attente de versement",paid:"versée",cancelled:"annulée"})[x.status];ul.append(li);});
    }
    if(profile?.role==="admin")await loadAdmin();else if(adminPanel)adminPanel.hidden=true;
  }
  const withdrawalOperator=$("affiliate-withdrawal-operator");
  const otherService=$("affiliate-withdrawal-other-service");
  const otherServiceLabel=$("affiliate-withdrawal-other-label");
  withdrawalOperator?.addEventListener("change",()=>{const show=withdrawalOperator.value==="other";if(otherService)otherService.hidden=!show;if(otherServiceLabel)otherServiceLabel.hidden=!show;if(otherService)otherService.required=show;});
  apply?.addEventListener("click",()=>{if(!session){say("Crée un compte ou connecte-toi avant de demander à devenir affilié.");document.querySelector("#espace-personnel")?.scrollIntoView({behavior:"smooth"});}});
  async function refreshAffiliateAfterPayment(){
    if(session) await load(session);
  }
  if(db){
    db.auth.getSession().then(({data})=>load(data.session));
    db.auth.onAuthStateChange((_e,s)=>{
      if(affiliateChannel){db.removeChannel(affiliateChannel);affiliateChannel=null;}
      void load(s);
      if(s){
        affiliateChannel=db.channel("affiliate-commissions-"+s.user.id)
          .on("postgres_changes",{event:"INSERT",schema:"public",table:"affiliate_commissions",filter:"affiliate_id=eq."+s.user.id},()=>{
            void refreshAffiliateAfterPayment();
            say("Bonne nouvelle ! Un abonnement vient d’être confirmé grâce à ton lien. Consulte le message dans ton espace affiliation.",true);
          })
          .subscribe();
      }
    });
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)void refreshAffiliateAfterPayment();});
    window.addEventListener("focus",()=>void refreshAffiliateAfterPayment());
  }
});
