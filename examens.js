(() => {
  "use strict";
  const URL_SUPABASE = "https://byzsqblgsssymvsztaqb.supabase.co";
  const CLE_PUBLIQUE = "sb_publishable_iGibajCXvXeDMWK5g28Rqw_FjEagmwR";
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.supabase?.createClient) return;
    const sb = window.supabase.createClient(URL_SUPABASE, CLE_PUBLIQUE);
    const nav = document.querySelector("#navigation-edcap");
    if (nav && !document.querySelector("[data-nav-examens]")) {
      const lien = document.createElement("a");
      lien.className = "nav-link";
      lien.href = "#examens-edcap";
      lien.dataset.navExamens = "true";
      lien.textContent = "▣ Examens et résultats";
      const compte = [...nav.querySelectorAll(".nav-group-label")].find(el => /MON COMPTE/i.test(el.textContent));
      (compte || nav).before(lien);
    }
    const footer = document.querySelector(".site-footer");
    if (!footer) return;
    let section = document.querySelector("#examens-edcap");
    if (!section) {
      section = document.createElement("section");
      section.id = "examens-edcap";
      section.className = "section";
      section.style.cssText = "padding:52px 0;background:#f5f8ff;scroll-margin-top:24px";
      section.innerHTML = `
      <div class="container">
        <div style="max-width:820px;margin:0 auto 26px;text-align:center">
          <span style="font-weight:800;letter-spacing:.08em;color:#245cc8;font-size:.75rem">SE PRÉPARER ET MESURER SES PROGRÈS</span>
          <h2 style="font-size:clamp(1.8rem,4vw,2.5rem);margin:8px 0;color:#173a32">Examens et résultats</h2>
          <p style="color:#60716c">Passe tes épreuves, obtiens ta note et retrouve tes résultats dans ton espace personnel.</p>
        </div>
        <div id="examens-edcap-zone" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:18px">
          <article style="padding:22px;border:1px solid #dce5f2;border-radius:18px;background:#fff"><h3 style="margin-top:0">📚 Épreuves disponibles</h3><div id="examens-edcap-liste">Chargement…</div></article>
          <article style="padding:22px;border:1px solid #dce5f2;border-radius:18px;background:#fff"><h3 style="margin-top:0">🏆 Mes résultats</h3><div id="examens-edcap-resultats">Vérification de la connexion…</div></article>
        </div>
        <div id="examens-edcap-session" style="margin-top:20px"></div>
        <p style="max-width:820px;margin:18px auto 0;color:#718078;font-size:.82rem">Les sujets d’entraînement sont non officiels. Les réponses rédigées peuvent nécessiter une correction par un enseignant. Les épreuves sont affichées après publication par l’équipe EduCap Afrique.</p>
      </div>`;
      footer.before(section);
    }
    const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    const labelType = t => ({ancien_sujet:"Ancien sujet",sujet_entrainement:"Sujet d’entraînement",examen_blanc:"Examen blanc",evaluation_finale:"Examen final",concours:"Concours"}[t] || "Épreuve");
    const liste = section.querySelector("#examens-edcap-liste");
    const resultats = section.querySelector("#examens-edcap-resultats");
    const session = section.querySelector("#examens-edcap-session");
    let timer = null;
    let examenActif = null;
    let tentativeActive = null;
    let finA = null;
    const msg = (txt, error = false) => `<p style="color:${error ? "#b42318" : "#52665f"}">${esc(txt)}</p>`;
    function nettoyerTimer() { if (timer) clearInterval(timer); timer = null; }
    async function chargerResultats(user) {
      if (!user) {
        resultats.innerHTML = '<p>Connecte-toi pour passer un examen et retrouver tes notes.</p><a href="#espace-personnel">Accéder à mon espace</a>';
        return;
      }
      const {data: attempts, error} = await sb.from("exam_attempts")
        .select("id,exam_id,started_at,submitted_at,statut,score_obtenu,score_max,pourcentage,correction_disponible,exam_sets(title,matiere,examen_type)")
        .eq("apprenant_id",user.id).order("created_at",{ascending:false}).limit(30);
      if (error) { resultats.innerHTML = msg("Impossible de charger tes résultats. Réessaie plus tard.",true); return; }
      if (!attempts?.length) { resultats.innerHTML = msg("Tu n’as pas encore passé d’examen. Tes résultats apparaîtront ici."); return; }
      resultats.innerHTML = attempts.map(a => {
        const note = a.score_obtenu != null && a.score_max != null ? esc(a.score_obtenu)+" / "+esc(a.score_max) : a.statut === "correction_en_cours" ? "Correction de l’enseignant en cours" : a.statut === "en_cours" ? "Tentative non terminée" : "Résultat en attente";
        const pct = a.pourcentage != null ? `<p style="margin:5px 0"><strong>${esc(a.pourcentage)} %</strong></p><div style="height:7px;background:#edf0f5;border-radius:10px;overflow:hidden"><div style="height:7px;width:${Math.max(0,Math.min(100,Number(a.pourcentage)))}%;background:#16865d"></div></div>` : "";
        return `<div style="padding:13px 0;border-top:1px solid #edf0f5"><strong>${esc(a.exam_sets?.title || "Épreuve")}</strong><p style="margin:5px 0">Note : <strong>${note}</strong></p><small style="color:#718078">${a.submitted_at ? "Soumis le "+esc(new Date(a.submitted_at).toLocaleDateString("fr-FR")) : "Non soumis"} · ${esc(a.statut)}</small>${pct}${a.correction_disponible ? `<p><button type="button" data-correction="${esc(a.id)}" style="padding:8px 12px;border:0;border-radius:8px;background:#e6efff;cursor:pointer">Consulter la correction</button></p>` : ""}</div>`;
      }).join("");
    }
    async function charger() {
      const {data: authData} = await sb.auth.getUser();
      const user = authData?.user;
      const {data: exams,error} = await sb.from("exam_sets")
        .select("id,title,description,parcours,examen_type,classe,serie,niveau,filiere,matiere,annee,duree_minutes,bareme,statut_source")
        .eq("published",true).order("created_at",{ascending:false}).limit(50);
      if (error) liste.innerHTML = msg("Impossible de charger les épreuves. Vérifie la connexion et réessaie.",true);
      else if (!exams?.length) liste.innerHTML = msg("Aucune épreuve n’est encore publiée. Les examens apparaîtront ici après validation.");
      else liste.innerHTML = exams.map(e => `<div style="padding:14px 0;border-top:1px solid #edf0f5"><strong>${esc(e.title)}</strong>
        <p style="margin:6px 0;color:#60716c;font-size:.88rem">${esc([labelType(e.examen_type),e.matiere,e.classe,e.serie ? "Série "+e.serie : "",e.niveau,e.filiere,e.annee].filter(Boolean).join(" · "))}</p>
        <p style="margin:5px 0;font-size:.86rem">${esc(e.duree_minutes)} minutes · Barème : ${esc(e.bareme)} points</p>
        ${e.description ? `<p style="font-size:.9rem">${esc(e.description)}</p>` : ""}
        <p style="font-size:.78rem;color:#718078">${e.statut_source === "officiel_verifie" ? "Sujet officiel vérifié" : e.statut_source === "archive_a_verifier" ? "Archive à vérifier" : "Entraînement non officiel"}</p>
        <button type="button" data-start-exam="${esc(e.id)}" style="padding:10px 14px;border:0;border-radius:9px;background:#176b50;color:white;font-weight:700;cursor:pointer">Commencer l’épreuve</button></div>`).join("");
      await chargerResultats(user);
    }
    function renderQuestion(q,i) {
      const title = `<div style="padding:16px 0;border-top:1px solid #e6ebf2"><p><strong>Question ${i+1} — ${esc(q.points)} point(s)</strong></p><p style="white-space:pre-wrap">${esc(q.enonce)}</p>`;
      if (q.type_question === "redaction" || q.type_question === "reponse_courte") return title+`<label style="display:block;font-weight:600;margin:8px 0" for="rep-${q.id}">${q.type_question === "redaction" ? "Ta réponse rédigée" : "Ta réponse"}</label><textarea id="rep-${q.id}" data-answer="${q.id}" data-kind="${q.type_question}" rows="${q.type_question === "redaction" ? 5 : 2}" style="box-sizing:border-box;width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:8px"></textarea></div>`;
      let choices = Array.isArray(q.choix) ? q.choix : [];
      if (q.type_question === "vrai_faux" && !choices.length) choices = ["Vrai","Faux"];
      if (!choices.length) return title+`<input data-answer="${q.id}" data-kind="reponse_courte" style="width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:8px" aria-label="Réponse à la question ${i+1}"></div>`;
      return title+choices.map((c,j) => { const val = c && typeof c === "object" ? (c.value ?? c.id ?? c.label ?? String(j)) : c; const text = c && typeof c === "object" ? (c.label ?? c.text ?? val) : c; return `<label style="display:flex;gap:9px;align-items:flex-start;margin:10px 0"><input type="radio" name="rep-${q.id}" data-answer="${q.id}" data-kind="${esc(q.type_question)}" value="${esc(val)}"><span>${esc(text)}</span></label>`; }).join("")+"</div>";
    }
    function lireReponses() {
      return [...session.querySelectorAll("[data-answer]")].reduce((acc,el) => {
        const id = el.dataset.answer;
        if (el.type === "radio") { if (el.checked) acc[id] = el.value; }
        else if (el.value.trim()) acc[id] = el.value.trim();
        return acc;
      },{});
    }
    async function enregistrerReponses() {
      const answers = lireReponses();
      const rows = Object.entries(answers).map(([question_id,value]) => ({attempt_id:tentativeActive.id,question_id,reponse_donnee:value}));
      if (!rows.length) return;
      const {error} = await sb.from("exam_answers").upsert(rows,{onConflict:"attempt_id,question_id"});
      if (error) throw error;
    }
    async function soumettre(automatique = false) {
      if (!tentativeActive || !examenActif) return;
      const btn = session.querySelector("[data-submit-exam]");
      if (btn) { btn.disabled = true; btn.textContent = "Enregistrement…"; }
      try {
        await enregistrerReponses();
        const {data,error} = await sb.rpc("soumettre_examen",{p_attempt_id:tentativeActive.id});
        if (error) throw error;
        nettoyerTimer();
        const r = data || {};
        session.innerHTML = `<article style="padding:24px;border:1px solid #dce5f2;border-radius:18px;background:#fff"><h3>Examen terminé ${automatique ? "— temps écoulé" : ""}</h3>
          <p>Ta tentative a été enregistrée.</p><div style="font-size:1.8rem;font-weight:800;color:#176b50">${esc(r.score_obtenu)} / ${esc(r.score_max)}</div>
          ${r.pourcentage != null ? `<p>${esc(r.pourcentage)} % de réussite</p>` : "<p>Une correction manuelle est nécessaire avant de publier la note définitive.</p>"}
          <p>${r.correction_disponible ? "La correction est disponible ci-dessous et dans tes résultats." : "Les réponses rédigées seront corrigées par un enseignant avant la publication de la note finale."}</p>
          <div id="examens-correction-immediate"></div><button type="button" data-back-results style="padding:10px 14px;border:0;border-radius:9px;background:#176b50;color:white;cursor:pointer">Voir mes résultats</button></article>`;
        if (r.correction_disponible) await afficherCorrection(tentativeActive.id,session.querySelector("#examens-correction-immediate"));
        const {data:authData} = await sb.auth.getUser(); await chargerResultats(authData?.user);
        session.scrollIntoView({behavior:"smooth",block:"start"});
      } catch (e) {
        if (btn) { btn.disabled = false; btn.textContent = "Soumettre mon examen"; }
        session.insertAdjacentHTML("afterbegin",msg(e?.message || "Impossible de soumettre l’examen. Vérifie ta connexion et réessaie.",true));
      }
    }
    async function commencer(id) {
      const {data:authData} = await sb.auth.getUser();
      const user = authData?.user;
      if (!user) { session.innerHTML = msg("Connecte-toi à ton compte avant de commencer une épreuve.",true)+'<a href="#espace-personnel">Accéder à mon espace</a>'; return; }
      const {data:exam,error:examError} = await sb.from("exam_sets").select("id,title,description,duree_minutes,bareme").eq("id",id).eq("published",true).single();
      if (examError || !exam) { session.innerHTML = msg("Cette épreuve n’est plus disponible.",true); return; }
      const {data:questions,error:qError} = await sb.from("exam_questions_published").select("id,exam_id,ordre,enonce,type_question,choix,points,correction_manuelle").eq("exam_id",id).order("ordre");
      if (qError || !questions?.length) { session.innerHTML = msg("Cette épreuve ne contient pas encore de questions accessibles.",true); return; }
      const {data:attempt,error:aError} = await sb.from("exam_attempts").insert({exam_id:id,apprenant_id:user.id,score_max:exam.bareme}).select("id,started_at").single();
      if (aError || !attempt) { session.innerHTML = msg(aError?.message || "Impossible de démarrer l’épreuve.",true); return; }
      examenActif = {...exam,questions}; tentativeActive = attempt; finA = Date.now()+Number(exam.duree_minutes||60)*60000;
      session.innerHTML = `<article style="padding:22px;border:1px solid #dce5f2;border-radius:18px;background:white"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center"><h3>${esc(exam.title)}</h3><strong id="examens-chrono" style="color:#b42318">Temps restant : --:--</strong></div><p>${esc(exam.description || "Lis attentivement chaque question. Tes réponses seront enregistrées lors de la soumission.")}</p><form id="examens-formulaire">${questions.map(renderQuestion).join("")}<button data-submit-exam type="submit" style="padding:12px 18px;border:0;border-radius:9px;background:#176b50;color:white;font-weight:700;cursor:pointer">Soumettre mon examen</button> <button data-cancel-exam type="button" style="padding:12px 18px;border:1px solid #cbd5e1;border-radius:9px;background:white;cursor:pointer">Quitter sans soumettre</button></form></article>`;
      const form = session.querySelector("#examens-formulaire");
      form.addEventListener("submit",ev=>{ev.preventDefault();if(confirm("Confirmer la soumission ? Tu ne pourras plus modifier tes réponses.")) soumettre(false);});
      session.querySelector("[data-cancel-exam]").addEventListener("click",()=>{if(confirm("Quitter cette tentative ? Elle restera enregistrée comme non terminée.")){nettoyerTimer();session.innerHTML=msg("Tentative laissée en cours. Tu peux consulter tes résultats.");}});
      const tick = () => { const remain=Math.max(0,finA-Date.now()); const el=session.querySelector("#examens-chrono"); if(el) el.textContent="Temps restant : "+String(Math.floor(remain/60000)).padStart(2,"0")+":"+String(Math.floor((remain%60000)/1000)).padStart(2,"0"); if(remain<=0){nettoyerTimer();soumettre(true);} };
      tick(); timer=setInterval(tick,1000); session.scrollIntoView({behavior:"smooth",block:"start"});
    }
    async function afficherCorrection(id,target) {
      if (!target) return;
      const {data,error}=await sb.rpc("consulter_correction",{p_attempt_id:id});
      if(error){target.innerHTML=msg("La correction ne peut pas encore être affichée.");return;}
      target.innerHTML="<h4>Correction détaillée</h4>"+(data||[]).map(q=>`<div style="padding:12px 0;border-top:1px solid #e6ebf2"><strong>Question ${esc(q.ordre)} — ${esc(q.points_obtenus ?? 0)} / ${esc(q.points)}</strong><p style="white-space:pre-wrap">${esc(q.enonce)}</p><p><strong>Ta réponse :</strong> ${esc(typeof q.reponse_donnee === "string" ? q.reponse_donnee : JSON.stringify(q.reponse_donnee ?? "Aucune réponse"))}</p><p><strong>Réponse attendue :</strong> ${esc(typeof q.reponse_attendue === "string" ? q.reponse_attendue : JSON.stringify(q.reponse_attendue ?? "À revoir avec le corrigé"))}</p>${q.explication ? `<p>${esc(q.explication)}</p>` : ""}</div>`).join("");
    }
    section.addEventListener("click", async ev => {
      const start = ev.target.closest("[data-start-exam]");
      const correction = ev.target.closest("[data-correction]");
      const back = ev.target.closest("[data-back-results]");
      if(start) { await commencer(start.dataset.startExam); return; }
      if(correction) { const id=correction.dataset.correction; const wrap=document.createElement("div"); wrap.style.cssText="padding:12px 0"; correction.parentElement.after(wrap); correction.disabled=true; await afficherCorrection(id,wrap); }
      if(back) { session.scrollIntoView({behavior:"smooth",block:"start"}); resultats.scrollIntoView({behavior:"smooth",block:"center"}); }
    });
    sb.auth.onAuthStateChange(() => { charger().catch(()=>{}); });
    charger().catch(()=>{liste.textContent="Erreur de chargement.";resultats.textContent="Erreur de chargement.";});
  });
})();