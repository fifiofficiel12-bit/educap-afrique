(() => {
  "use strict";
  const URL_SUPABASE = "https://byzsqblgsssymvsztaqb.supabase.co";
  const CLE_PUBLIQUE = "sb_publishable_iGibajCXvXeDMWK5g28Rqw_FjEagmwR";
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.supabase?.createClient) return;
    const sb = window.supabase.createClient(URL_SUPABASE, CLE_PUBLIQUE);
    const nav = document.querySelector("#navigation-edcap");
    if (nav && !document.querySelector('[data-nav-examens]')) {
      const lien = document.createElement("a");
      lien.className = "nav-link";
      lien.href = "#examens-edcap";
      lien.dataset.navExamens = "true";
      lien.innerHTML = '<span aria-hidden="true">▣</span> Examens et résultats';
      const compte = [...nav.querySelectorAll(".nav-group-label")].find(el => /MON COMPTE/i.test(el.textContent));
      (compte || nav).before(lien);
    }
    const footer = document.querySelector(".site-footer");
    if (!footer || document.querySelector("#examens-edcap")) return;
    const section = document.createElement("section");
    section.id = "examens-edcap";
    section.className = "section";
    section.style.cssText = "padding:52px 0;background:#f5f8ff;scroll-margin-top:24px";
    section.innerHTML = `
      <div class="container">
        <div style="max-width:820px;margin:0 auto 26px;text-align:center">
          <span style="font-weight:800;letter-spacing:.08em;color:#245cc8;font-size:.75rem">SE PRÉPARER ET MESURER SES PROGRÈS</span>
          <h2 style="font-size:clamp(1.8rem,4vw,2.5rem);margin:8px 0;color:#173a32">Examens et résultats</h2>
          <p style="color:#60716c">Retrouve les épreuves disponibles, entraîne-toi et consulte l’historique de tes résultats dans ton espace personnel.</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:18px">
          <article style="padding:22px;border:1px solid #dce5f2;border-radius:18px;background:#fff">
            <h3 style="margin-top:0">📚 Épreuves disponibles</h3>
            <p style="color:#60716c;font-size:.92rem">Anciens sujets vérifiés, sujets d’entraînement et examens blancs.</p>
            <div id="examens-edcap-liste" aria-live="polite">Chargement des épreuves…</div>
          </article>
          <article style="padding:22px;border:1px solid #dce5f2;border-radius:18px;background:#fff">
            <h3 style="margin-top:0">🏆 Mes résultats</h3>
            <p style="color:#60716c;font-size:.92rem">Tes notes et tes tentatives précédentes, accessibles après connexion.</p>
            <div id="examens-edcap-resultats" aria-live="polite">Vérification de ta connexion…</div>
          </article>
        </div>
        <p style="max-width:820px;margin:18px auto 0;color:#718078;font-size:.82rem">Les sujets d’entraînement sont non officiels. Les notes des réponses rédigées peuvent nécessiter une correction par un enseignant. Les épreuves apparaîtront ici après validation et publication par l’équipe EduCap Afrique.</p>
      </div>`;
    footer.before(section);
    const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    const typeLabel = t => ({ancien_sujet:"Ancien sujet",sujet_entrainement:"Sujet d’entraînement",examen_blanc:"Examen blanc",evaluation_finale:"Examen final",concours:"Concours"}[t] || "Épreuve");
    async function charger() {
      const liste = document.querySelector("#examens-edcap-liste");
      const resultats = document.querySelector("#examens-edcap-resultats");
      const { data: auth } = await sb.auth.getUser();
      const user = auth?.user;
      const { data: examens, error } = await sb.from("exam_sets")
        .select("id,title,description,parcours,examen_type,classe,serie,niveau,filiere,matiere,annee,duree_minutes,bareme,statut_source")
        .eq("published", true).order("created_at", { ascending: false }).limit(50);
      if (error) {
        liste.innerHTML = '<p style="color:#b42318">Impossible de charger les épreuves pour le moment. Réessaie plus tard.</p>';
      } else if (!examens?.length) {
        liste.innerHTML = '<p>Aucune épreuve n’est encore publiée. Les sujets apparaîtront ici après leur vérification et leur mise en ligne.</p>';
      } else {
        liste.innerHTML = examens.map(e => `<div style="padding:14px 0;border-top:1px solid #edf0f5">
          <strong>${esc(e.title)}</strong><div style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0">
          <span style="font-size:.75rem;background:#edf3ff;padding:4px 8px;border-radius:20px">${esc(typeLabel(e.examen_type))}</span>
          ${e.matiere ? `<span style="font-size:.75rem;background:#f0f4f2;padding:4px 8px;border-radius:20px">${esc(e.matiere)}</span>` : ""}
          ${e.annee ? `<span style="font-size:.75rem;background:#f0f4f2;padding:4px 8px;border-radius:20px">${esc(e.annee)}</span>` : ""}
          </div><p style="margin:5px 0;color:#60716c;font-size:.88rem">${esc([e.classe,e.serie ? "Série "+e.serie : "",e.niveau,e.filiere].filter(Boolean).join(" · "))}</p>
          <p style="margin:5px 0;font-size:.86rem">${esc(e.duree_minutes)} min · Barème : ${esc(e.bareme)} points</p>
          ${e.description ? `<p style="font-size:.9rem">${esc(e.description)}</p>` : ""}
          <p style="font-size:.78rem;color:#718078">${e.statut_source === "officiel_verifie" ? "Sujet officiel vérifié" : e.statut_source === "archive_a_verifier" ? "Archive en cours de vérification" : "Sujet d’entraînement non officiel"}</p>
        </div>`).join("");
      }
      if (!user) {
        resultats.innerHTML = '<p>Connecte-toi à ton compte pour retrouver tes notes et l’historique de tes examens.</p><a class="btn btn-primary" href="#espace-personnel">Accéder à mon espace</a>';
        return;
      }
      const { data: tentatives, error: errTentatives } = await sb.from("exam_attempts")
        .select("id,exam_id,started_at,submitted_at,statut,score_obtenu,score_max,pourcentage,correction_disponible,exam_sets(title,matiere,examen_type)")
        .eq("apprenant_id", user.id).order("created_at", { ascending: false }).limit(30);
      if (errTentatives) {
        resultats.innerHTML = '<p>Ton historique n’a pas pu être chargé. Réessaie plus tard.</p>';
      } else if (!tentatives?.length) {
        resultats.innerHTML = '<p>Tu n’as pas encore de résultat enregistré. Tes examens terminés apparaîtront ici.</p>';
      } else {
        resultats.innerHTML = tentatives.map(t => {
          const note = t.score_obtenu != null && t.score_max != null ? `${esc(t.score_obtenu)} / ${esc(t.score_max)}` : (t.statut === "correction_en_cours" ? "Correction en cours" : "Résultat en attente");
          const pct = t.pourcentage != null ? `<div style="height:7px;background:#edf0f5;border-radius:10px;margin-top:8px;overflow:hidden"><div style="height:7px;width:${Math.max(0,Math.min(100,Number(t.pourcentage)))}%;background:#16865d"></div></div><small>${esc(t.pourcentage)} %</small>` : "";
          return `<div style="padding:13px 0;border-top:1px solid #edf0f5"><strong>${esc(t.exam_sets?.title || "Épreuve")}</strong><p style="margin:5px 0">Résultat : <strong>${note}</strong></p><small style="color:#718078">${t.submitted_at ? "Remis le " + esc(new Date(t.submitted_at).toLocaleDateString("fr-FR")) : "Tentative en cours"} · ${esc(t.statut)}</small>${pct}${t.correction_disponible ? '<p style="font-size:.82rem;color:#16865d">Correction disponible</p>' : ""}</div>`;
        }).join("");
      }
    }
    sb.auth.onAuthStateChange(() => { charger().catch(() => {}); });
    charger().catch(() => {
      document.querySelector("#examens-edcap-liste").textContent = "Une erreur est survenue lors du chargement.";
      document.querySelector("#examens-edcap-resultats").textContent = "Une erreur est survenue lors du chargement.";
    });
  });
})();