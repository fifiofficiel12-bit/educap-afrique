/* EduCap Afrique — progression pédagogique structurée
   Les exemples ci-dessous illustrent la méthode. Ils ne sont pas présentés comme un inventaire officiel complet.
*/
(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const classroom = document.querySelector("#ma-classe");
    if (!classroom || classroom.querySelector("#educap-progression-guide")) return;

    const style = document.createElement("style");
    style.textContent = `
      #educap-progression-guide{margin-top:22px;padding:clamp(18px,3vw,28px);background:#fff;border:1px solid #dce7f8;border-radius:18px;box-shadow:0 8px 28px #173c740a}
      #educap-progression-guide .ep-breadcrumb{display:flex;flex-wrap:wrap;gap:7px;align-items:center;font-size:13px;color:#52627a;margin:10px 0 18px}
      #educap-progression-guide .ep-crumb{padding:6px 9px;border-radius:8px;background:#edf4ff;color:#174b91}
      #educap-progression-guide .ep-progress{height:9px;border-radius:99px;background:#e8eef8;overflow:hidden;margin:8px 0 16px}
      #educap-progression-guide .ep-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,#1859bc,#44b3a4);transition:width .2s}
      #educap-progression-guide .ep-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      #educap-progression-guide .ep-card{padding:15px;border:1px solid #e1e8f2;border-radius:13px;background:#fbfdff}
      #educap-progression-guide .ep-card h4{margin:0 0 8px}
      #educap-progression-guide .ep-muted{font-size:13px;color:#617089}
      #educap-progression-guide .ep-check{display:flex;gap:9px;align-items:flex-start;margin:10px 0}
      #educap-progression-guide .ep-check input{margin-top:5px}
      #educap-progression-guide .ep-summary{padding:15px;border-radius:12px;background:#f0f7ff;margin-top:14px}
      #educap-progression-guide .ep-warning{padding:12px;border-radius:10px;background:#fff7e6;color:#76521b;font-size:13px;margin-top:14px}
      @media(max-width:600px){#educap-progression-guide .ep-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);

    const guide = document.createElement("section");
    guide.id = "educap-progression-guide";
    guide.setAttribute("aria-labelledby", "educap-progression-title");
    guide.innerHTML = `
      <div class="section-heading" style="text-align:left;margin-bottom:12px">
        <span class="eyebrow">MÉTHODE DE TRAVAIL</span>
        <h3 id="educap-progression-title">Comment suivre une leçon jusqu’à sa validation</h3>
        <p>Un chemin clair : objectif, cours, pratique, quiz, correction et synthèse.</p>
      </div>
      <nav class="ep-breadcrumb" aria-label="Fil d’Ariane pédagogique">
        <span class="ep-crumb">Mon parcours</span><span aria-hidden="true">›</span>
        <span class="ep-crumb">Séquence</span><span aria-hidden="true">›</span>
        <span class="ep-crumb">Leçon</span><span aria-hidden="true">›</span>
        <span class="ep-crumb">Quiz</span>
      </nav>
      <div class="ep-muted">Progression de démonstration : coche les étapes après les avoir réalisées.</div>
      <div class="ep-progress" role="progressbar" aria-label="Progression des étapes de la leçon" aria-valuemin="0" aria-valuemax="5" aria-valuenow="0"><span></span></div>
      <div class="ep-grid">
        <article class="ep-card">
          <h4>1. Objectifs d’apprentissage</h4>
          <p>À la fin de la leçon, tu dois pouvoir expliquer la notion avec tes propres mots, appliquer la méthode et vérifier ton résultat.</p>
          <p class="ep-muted">Conseil : transforme chaque objectif en une question à laquelle tu peux répondre sans regarder le cours.</p>
        </article>
        <article class="ep-card">
          <h4>2. Cours et exemples</h4>
          <p>Lis l’explication, observe un exemple corrigé puis réalise un exercice similaire seul.</p>
          <p class="ep-muted">Conseil : note les définitions, les étapes importantes et les erreurs à éviter.</p>
        </article>
        <article class="ep-card">
          <h4>3. Quiz immédiat</h4>
          <p>Le quiz doit se trouver juste après la leçon, avant de passer à la suivante.</p>
          <p class="ep-muted">Après validation, lis l’explication de la bonne réponse. Si tu te trompes, reprends la partie concernée et réessaie.</p>
        </article>
        <article class="ep-card">
          <h4>4. Validation des acquis</h4>
          <p>Fais un exercice d’application sans aide. La progression ne doit être validée que lorsque le résultat est enregistré dans ton compte.</p>
          <p class="ep-muted">La progression affichée ici est un exemple local, pas encore un relevé officiel synchronisé à ton compte.</p>
        </article>
      </div>
      <div class="ep-summary">
        <h4 style="margin:0 0 7px">Fiche « Ce qu’il faut retenir »</h4>
        <p style="margin:0">À la fin de chaque chapitre, une synthèse devra rassembler les notions clés, les définitions, les méthodes, un exemple corrigé et les erreurs fréquentes.</p>
      </div>
      <div class="ep-card" style="margin-top:14px">
        <h4>Checklist de la leçon</h4>
        <label class="ep-check"><input type="checkbox" data-ep-step> <span>J’ai lu les objectifs et compris ce que je dois apprendre.</span></label>
        <label class="ep-check"><input type="checkbox" data-ep-step> <span>J’ai étudié le cours et l’exemple corrigé.</span></label>
        <label class="ep-check"><input type="checkbox" data-ep-step> <span>J’ai réalisé l’exercice d’application.</span></label>
        <label class="ep-check"><input type="checkbox" data-ep-step> <span>J’ai répondu au quiz et lu la correction.</span></label>
        <label class="ep-check"><input type="checkbox" data-ep-step> <span>Je peux expliquer l’essentiel sans regarder le cours.</span></label>
      </div>
      <p class="ep-warning"><strong>Important :</strong> cette interface définit la méthode pédagogique cible. Le catalogue complet des chapitres officiels et l’enregistrement sécurisé des validations doivent être alimentés et vérifiés matière par matière à partir des documents officiels.</p>
    `;

    const hero = classroom.querySelector(".classroom-hero");
    if (hero) hero.insertAdjacentElement("afterend", guide);
    else classroom.prepend(guide);

    const boxes = [...guide.querySelectorAll("[data-ep-step]")];
    const bar = guide.querySelector(".ep-progress span");
    const progress = guide.querySelector(".ep-progress");
    const key = "educap-progression-checklist-v1";
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      boxes.forEach((box, i) => box.checked = saved.includes(i));
    } catch (_) {}
    const update = () => {
      const done = boxes.filter(box => box.checked).length;
      bar.style.width = (done / boxes.length * 100) + "%";
      progress.setAttribute("aria-valuenow", String(done));
      try {
        localStorage.setItem(key, JSON.stringify(boxes.map((box, i) => box.checked ? i : -1).filter(i => i >= 0)));
      } catch (_) {}
    };
    boxes.forEach(box => box.addEventListener("change", update));
    update();
  });
})();
