/* EduCap Afrique — salle de classe numérique */
(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("#ma-classe")) return;

    const style = document.createElement("style");
    style.textContent = `
      #ma-classe{padding:64px 0;background:linear-gradient(180deg,#f4f7ff 0%,#fff 100%)}
      #ma-classe .classroom-shell{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(250px,.8fr);gap:22px;align-items:start}
      #ma-classe .classroom-hero{padding:clamp(22px,4vw,38px);border-radius:24px;background:linear-gradient(130deg,#102d66,#1859bc 68%,#3687e8);color:#fff;box-shadow:0 18px 48px #164b9c26;overflow:hidden;position:relative}
      #ma-classe .classroom-hero:after{content:"✦";position:absolute;right:24px;top:0;font-size:110px;opacity:.12}
      #ma-classe .classroom-hero .eyebrow{color:#dbeafe}
      #ma-classe .classroom-hero h2{font-size:clamp(28px,4vw,42px);line-height:1.15;margin:12px 0}
      #ma-classe .classroom-hero p{max-width:650px;color:#e8f1ff}
      #ma-classe .classroom-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:24px}
      #ma-classe .classroom-stat{padding:14px;border:1px solid #ffffff40;background:#ffffff12;border-radius:14px}
      #ma-classe .classroom-stat strong{display:block;font-size:23px;color:#fff}
      #ma-classe .classroom-stat span{font-size:12px;color:#e5efff}
      #ma-classe .classroom-panel{padding:22px;background:#fff;border:1px solid #dfe7f5;border-radius:20px;box-shadow:0 8px 28px #173c7410}
      #ma-classe .classroom-panel h3{margin:0 0 14px}
      #ma-classe .classroom-panel label{display:block;font-size:13px;font-weight:700;margin:12px 0 6px}
      #ma-classe .classroom-panel select,#ma-classe .classroom-search{width:100%;min-height:45px;padding:10px 12px;border:1px solid #d7e1f1;border-radius:10px;background:#fff;font:inherit;color:#172642}
      #ma-classe .classroom-section-head{display:flex;justify-content:space-between;align-items:end;gap:14px;margin:32px 0 16px}
      #ma-classe .classroom-section-head h3{margin:0;font-size:23px}
      #ma-classe .classroom-section-head p{margin:4px 0 0;color:#64748b;font-size:14px}
      #ma-classe .classroom-toolbar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}
      #ma-classe .classroom-toolbar>*{flex:1 1 180px}
      #ma-classe .lesson-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
      #ma-classe .lesson-card{display:flex;flex-direction:column;gap:12px;padding:18px;background:#fff;border:1px solid #dfe7f5;border-radius:18px;min-width:0;transition:transform .18s,box-shadow .18s}
      #ma-classe .lesson-card:hover{transform:translateY(-3px);box-shadow:0 12px 28px #183f7814}
      #ma-classe .lesson-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
      #ma-classe .lesson-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:13px;background:#edf4ff;font-size:22px}
      #ma-classe .lesson-tag{font-size:11px;font-weight:800;color:#1754a5;background:#edf4ff;padding:5px 8px;border-radius:999px}
      #ma-classe .lesson-card h4{font-size:17px;line-height:1.35;margin:0}
      #ma-classe .lesson-card p{font-size:13px;color:#64748b;margin:0}
      #ma-classe .lesson-meta{display:flex;flex-wrap:wrap;gap:8px;color:#64748b;font-size:12px}
      #ma-classe .lesson-card .btn{width:100%;margin-top:auto}
      #ma-classe .classroom-notice{margin-top:16px;padding:14px 16px;border-radius:12px;background:#fff8e8;border:1px solid #f4dfaa;color:#735015;font-size:13px}
      #ma-classe .week-list{display:grid;gap:10px}
      #ma-classe .week-item{display:grid;grid-template-columns:48px 1fr;gap:12px;align-items:center;padding:11px;border-radius:12px;background:#f7f9fd}
      #ma-classe .week-day{font-size:11px;font-weight:800;text-align:center;color:#1754a5;background:#e6efff;border-radius:9px;padding:8px 3px}
      #ma-classe .week-item strong{display:block;font-size:13px}
      #ma-classe .week-item small{color:#64748b}
      #ma-classe .classroom-progress{height:8px;border-radius:99px;background:#e8eef8;overflow:hidden;margin:12px 0}
      #ma-classe .classroom-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,#1d63c5,#44b3a4);transition:width .2s}
      #ma-classe .lesson-detail{margin-top:20px;padding:22px;background:#f7faff;border:1px solid #dce7f8;border-radius:18px}
      #ma-classe .lesson-detail h4{margin-top:0}
      #ma-classe .lesson-detail li{margin:8px 0}
      #ma-classe .quiz-options{display:grid;gap:8px;margin:12px 0}
      #ma-classe .quiz-options label{display:flex;gap:8px;align-items:start;padding:10px;border:1px solid #dce7f8;border-radius:10px;background:#fff}
      #ma-classe .quiz-feedback{padding:12px;border-radius:10px;background:#e9f8ef;color:#17633b;margin-top:10px}
      @media(max-width:900px){#ma-classe .classroom-shell{grid-template-columns:1fr}#ma-classe .lesson-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:580px){#ma-classe{padding:42px 0}#ma-classe .lesson-grid{grid-template-columns:1fr}#ma-classe .classroom-stats{gap:7px}#ma-classe .classroom-stat{padding:10px}#ma-classe .classroom-stat strong{font-size:19px}#ma-classe .classroom-stat span{font-size:11px}#ma-classe .classroom-section-head{align-items:start;flex-direction:column}}
    `;
    document.head.appendChild(style);

    const lessons = [
      {id:"math-equation",path:"scolaire",subject:"Mathématiques",level:"Collège · 4e–3e",icon:"📐",title:"Résoudre une équation du premier degré",desc:"Comprendre l’inconnue, isoler x et vérifier le résultat.",time:"20 min",kind:"Exemple guidé",content:["Une équation conserve son égalité si l’on effectue la même opération des deux côtés.","Exemple : 3x + 5 = 20.","Soustrais 5 : 3x = 15. Divise par 3 : x = 5.","Vérification : 3 × 5 + 5 = 20. La solution est correcte."],question:"Quelle est la solution de 2x + 4 = 14 ?",options:["x = 5","x = 9","x = 7"],answer:0,explain:"2x = 14 − 4 = 10, donc x = 5."},
      {id:"philo-dissertation",path:"scolaire",subject:"Philosophie",level:"Lycée · Terminale",icon:"💭",title:"Construire une dissertation philosophique",desc:"Analyser les mots clés, formuler un problème et organiser un plan.",time:"25 min",kind:"Méthode",content:["Définis précisément les termes du sujet.","Repère une tension ou une difficulté qui pose problème.","Formule une problématique sous forme de question claire.","Construis un plan progressif et justifie chaque idée par un argument et un exemple."],question:"Que doit-on faire avant de construire le plan ?",options:["Rédiger directement la conclusion","Analyser les termes du sujet","Apprendre une citation au hasard"],answer:1,explain:"L’analyse des termes permet de comprendre le sujet et de formuler la problématique."},
      {id:"francais-lecture",path:"scolaire",subject:"Français",level:"Collège · 6e–3e",icon:"📖",title:"Lire et comprendre une consigne",desc:"Repérer le verbe d’action, les informations utiles et le résultat attendu.",time:"15 min",kind:"Technique",content:["Lis la consigne une première fois sans répondre.","Souligne le verbe d’action : expliquer, comparer, calculer, justifier…","Repère les données et les contraintes.","Reformule ce que tu dois produire avant de commencer."],question:"Quel élément aide à identifier le travail demandé ?",options:["Le verbe d’action de la consigne","La longueur de la feuille","La couleur du cahier"],answer:0,explain:"Le verbe d’action indique l’opération attendue."},
      {id:"campus-recherche",path:"campus",subject:"Méthodologie universitaire",level:"Licence · Méthode",icon:"🎓",title:"Réussir une recherche documentaire",desc:"Définir une question, évaluer les sources et organiser ses références.",time:"30 min",kind:"Méthode",content:["Transforme ton thème en question de recherche précise.","Privilégie les ouvrages, articles scientifiques et sources institutionnelles.","Compare les sources et note leurs limites.","Conserve les références et rédige la synthèse avec tes propres mots."],question:"Pourquoi conserver les références des sources ?",options:["Pour pouvoir vérifier et citer l’information","Pour allonger artificiellement le travail","Ce n’est pas utile"],answer:0,explain:"Les références rendent le travail vérifiable et permettent de citer correctement les auteurs."},
      {id:"competence-excel",path:"competences",subject:"Bureautique",level:"Débutant · Pratique",icon:"💻",title:"Créer un tableau simple dans un tableur",desc:"Organiser les données, nommer les colonnes et calculer un total.",time:"20 min",kind:"Atelier pratique",content:["Crée des colonnes claires : Article, Quantité, Prix unitaire, Total.","Dans la cellule Total, multiplie la quantité par le prix unitaire.","Recopie la formule sur les lignes suivantes.","Vérifie le résultat avec un calcul manuel sur une ligne."],question:"Que permet une formule dans un tableur ?",options:["Automatiser un calcul","Changer la couleur de l’écran uniquement","Envoyer automatiquement un e-mail"],answer:0,explain:"Une formule calcule un résultat à partir des données des cellules."},
      {id:"competence-projet",path:"competences",subject:"Organisation professionnelle",level:"Tous niveaux",icon:"🎯",title:"Découper un objectif en actions",desc:"Définir un résultat concret, des étapes et un critère de réussite.",time:"15 min",kind:"Mise en pratique",content:["Écris le résultat précis que tu veux obtenir.","Découpe-le en trois à cinq actions réalisables.","Attribue une durée réaliste à chaque action.","Définis comment tu vérifieras que le travail est terminé."],question:"À quoi sert un critère de réussite ?",options:["À vérifier si le résultat attendu est atteint","À rendre la tâche plus compliquée","À remplacer toutes les étapes"],answer:0,explain:"Un critère de réussite permet de vérifier concrètement le résultat."}
    ];

    const section = document.createElement("section");
    section.id = "ma-classe";
    section.className = "section";
    section.innerHTML = `
      <div class="container">
        <div class="section-heading"><span class="eyebrow">EDUCAP CLASSE · APPRENDRE AVEC MÉTHODE</span><h2>Ma salle de classe numérique</h2><p>Un espace pour suivre un parcours, étudier par matière, pratiquer et mesurer ses progrès.</p></div>
        <div class="classroom-shell">
          <div>
            <div class="classroom-hero">
              <span class="eyebrow">TON ESPACE D’APPRENTISSAGE</span>
              <h2>Chaque jour, un pas de plus.</h2>
              <p>Choisis une séance, lis la leçon, réponds au mini-quiz et marque-la comme terminée. Tes progrès sont conservés sur cet appareil.</p>
              <div class="classroom-stats">
                <div class="classroom-stat"><strong id="classe-total">${lessons.length}</strong><span>Séances de démonstration</span></div>
                <div class="classroom-stat"><strong id="classe-terminees">0</strong><span>Séances terminées</span></div>
                <div class="classroom-stat"><strong id="classe-pourcentage">0%</strong><span>Progression locale</span></div>
              </div>
            </div>
            <div class="classroom-section-head"><div><h3>Mon programme de cours</h3><p>Filtre les séances par parcours ou par matière.</p></div></div>
            <div class="classroom-toolbar">
              <select id="classe-parcours" aria-label="Filtrer par parcours"><option value="tous">Tous les parcours</option><option value="scolaire">EduCap Scolaire</option><option value="campus">EduCap Campus</option><option value="competences">EduCap Compétences</option></select>
              <select id="classe-matiere" aria-label="Filtrer par matière"><option value="toutes">Toutes les matières</option></select>
              <input class="classroom-search" id="classe-recherche" type="search" placeholder="Rechercher une leçon…" aria-label="Rechercher une leçon">
            </div>
            <div class="lesson-grid" id="classe-lecons"></div>
            <div id="classe-detail" class="lesson-detail" hidden aria-live="polite"></div>
            <div class="classroom-notice">📌 <strong>Transparence pédagogique :</strong> les séances affichées ici sont des démonstrations pour présenter la méthode de travail. Elles ne remplacent pas encore une bibliothèque complète de cours officiels. Les contenus devront être enrichis et vérifiés par niveau et programme.</div>
          </div>
          <aside class="classroom-panel">
            <h3>🗓️ Mon rythme de classe</h3>
            <p style="font-size:13px;color:#64748b;margin-top:-6px">Exemple d’organisation à adapter à ton emploi du temps réel.</p>
            <div class="week-list">
              <div class="week-item"><span class="week-day">LUN</span><div><strong>Comprendre une leçon</strong><small>25 min · nouvelle notion</small></div></div>
              <div class="week-item"><span class="week-day">MAR</span><div><strong>Faire des exercices</strong><small>30 min · pratique guidée</small></div></div>
              <div class="week-item"><span class="week-day">MER</span><div><strong>Réviser les notions</strong><small>15 min · rappel actif</small></div></div>
              <div class="week-item"><span class="week-day">JEU</span><div><strong>Résoudre un défi</strong><small>25 min · autonomie</small></div></div>
              <div class="week-item"><span class="week-day">VEN</span><div><strong>Faire le mini-quiz</strong><small>10 min · vérifier ses acquis</small></div></div>
            </div>
            <div style="margin-top:22px"><strong>Progression des séances</strong><div class="classroom-progress"><span id="classe-barre"></span></div><p id="classe-message" style="font-size:13px;color:#64748b;margin:0">Commence par une séance de démonstration.</p></div>
            <a class="btn btn-secondary" style="display:block;text-align:center;margin-top:18px" href="#inscription">Mettre à jour mon parcours</a>
          </aside>
        </div>
      </div>`;
    const videos = document.querySelector("#videos");
    if (videos?.parentNode) videos.parentNode.insertBefore(section, videos);
    else document.querySelector("main")?.appendChild(section);

    const list = section.querySelector("#classe-lecons");
    const filterPath = section.querySelector("#classe-parcours");
    const filterSubject = section.querySelector("#classe-matiere");
    const search = section.querySelector("#classe-recherche");
    const detail = section.querySelector("#classe-detail");
    const progressKey = "educap-classe-complete-v2";
    const supabaseClient = window.supabase?.createClient
      ? window.supabase.createClient("https://byzsqblgsssymvsztaqb.supabase.co", "sb_publishable_iGibajCXvXeDMWK5g28Rqw_FjEagmwR")
      : null;
    let signedUser = null;
    if (supabaseClient) {
      supabaseClient.auth.getUser().then(({data}) => { signedUser = data?.user || null; }).catch(() => {});
    }
    const syncPassedLesson = async (lesson) => {
      if (!supabaseClient || !signedUser) return;
      const {error} = await supabaseClient.from("learning_progress").upsert({
        user_id: signedUser.id, lesson_id: lesson.id, parcours: lesson.path,
        matiere: lesson.subject, quiz_score: 100, quiz_passed: true,
        completed_at: new Date().toISOString(), updated_at: new Date().toISOString()
      }, {onConflict:"user_id,lesson_id"});
      if (error) console.warn("Progression conservée sur cet appareil, synchronisation indisponible :", error.message);
    };
    let completed = [];
    try { completed = JSON.parse(localStorage.getItem(progressKey) || "[]"); if (!Array.isArray(completed)) completed = []; } catch (_) { completed = []; }

    [...new Set(lessons.map(x => x.subject))].sort().forEach(subject => {
      const option = document.createElement("option"); option.value = subject; option.textContent = subject; filterSubject.appendChild(option);
    });

    const updateProgress = () => {
      const count = lessons.filter(x => completed.includes(x.id)).length;
      const pct = Math.round(count / lessons.length * 100);
      section.querySelector("#classe-total").textContent = lessons.length;
      section.querySelector("#classe-terminees").textContent = count;
      section.querySelector("#classe-pourcentage").textContent = pct + "%";
      section.querySelector("#classe-barre").style.width = pct + "%";
      section.querySelector("#classe-message").textContent = count ? count + " séance(s) terminée(s). Continue à ton rythme !" : "Commence par une séance de démonstration.";
    };
    const showFinalAssessment = (path, pathLessons) => {
      const old = detail.querySelector("#classe-evaluation-finale");
      if (old) return;
      const panel = document.createElement("div");
      panel.id = "classe-evaluation-finale";
      panel.style.cssText = "margin-top:22px;padding:20px;border:2px solid #b7dfc5;border-radius:16px;background:#f0f9f2";
      panel.innerHTML = '<h3>🎓 Évaluation de fin de parcours</h3><p>Toutes les séances de ce parcours sont réussies. Réponds maintenant aux questions de validation. Il faut obtenir au moins 70 %.</p><form id="classe-final-form"></form><div id="classe-final-result" role="status"></div>';
      const form = panel.querySelector("form");
      pathLessons.forEach((lesson, i) => {
        const field = document.createElement("fieldset");
        field.style.cssText = "border:1px solid #dce7f8;border-radius:10px;padding:12px;margin:12px 0";
        const legend = document.createElement("legend"); legend.textContent = (i+1)+". "+lesson.question; field.appendChild(legend);
        lesson.options.forEach((option, j) => {
          const label = document.createElement("label"); label.style.cssText = "display:block;padding:7px";
          const input = document.createElement("input"); input.type="radio"; input.name="q"+i; input.value=String(j); input.required=true;
          label.append(input, document.createTextNode(" "+option)); field.appendChild(label);
        });
        form.appendChild(field);
      });
      const submit = document.createElement("button"); submit.type="submit"; submit.className="btn btn-primary"; submit.textContent="Valider l’évaluation"; form.appendChild(submit);
      form.addEventListener("submit", async event => {
        event.preventDefault(); let correct=0; const data=new FormData(form);
        pathLessons.forEach((lesson,i)=>{if(Number(data.get("q"+i))===lesson.answer)correct++;});
        const score=Math.round(correct/pathLessons.length*100); const passed=score>=70;
        panel.querySelector("#classe-final-result").textContent=passed
          ? "Parcours validé ! Résultat : "+score+" %. Tu as démontré la compréhension des notions."
          : "Résultat : "+score+" %. Revois les séances et leurs corrections avant de repasser l’évaluation.";
        panel.querySelector("#classe-final-result").style.cssText="margin-top:12px;font-weight:700;color:"+(passed?"#17633b":"#9a3412");
        if(passed) { submit.disabled=true; submit.textContent="Parcours validé ✓"; }
      });
      detail.appendChild(panel);
      panel.scrollIntoView({behavior:"smooth",block:"center"});
    };
    const renderLessons = () => {
      const q = search.value.trim().toLocaleLowerCase("fr");
      const filtered = lessons.filter(x => (filterPath.value === "tous" || x.path === filterPath.value) && (filterSubject.value === "toutes" || x.subject === filterSubject.value) && (x.title + " " + x.subject + " " + x.desc + " " + x.level).toLocaleLowerCase("fr").includes(q));
      list.replaceChildren();
      if (!filtered.length) { list.innerHTML = '<p>Aucune séance ne correspond à ces filtres. Essaie une autre recherche.</p>'; return; }
      filtered.forEach(item => {
        const card = document.createElement("article"); card.className = "lesson-card";
        const done = completed.includes(item.id);
        card.innerHTML = `<div class="lesson-top"><span class="lesson-icon">${item.icon}</span><span class="lesson-tag">${done ? "✓ Terminée" : item.kind}</span></div><p><strong>${item.subject}</strong> · ${item.level}</p><h4>${item.title}</h4><p>${item.desc}</p><div class="lesson-meta"><span>◷ ${item.time}</span><span>• Démonstration</span></div><button type="button" class="btn ${done ? "btn-secondary" : "btn-primary"}" data-open-lecon="${item.id}">${done ? "Revoir la séance" : "Ouvrir la séance →"}</button>`;
        list.appendChild(card);
      });
    };
    const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    const openLesson = id => {
      const item = lessons.find(x => x.id === id); if (!item) return;
      detail.hidden = false;
      detail.innerHTML = `<div class="lesson-top"><span class="lesson-tag">${item.subject}</span><span class="lesson-meta">${item.time}</span></div><h4>${item.icon} ${item.title}</h4><p><strong>Objectif :</strong> ${item.desc}</p><h4>1. Leçon expliquée</h4><ol>${item.content.map(x => "<li>"+escapeHTML(x)+"</li>").join("")}</ol><div style="border-top:1px solid #dce7f8;padding-top:16px;margin-top:18px"><h4>2. Quiz de compréhension</h4><p>Le quiz s’ouvre sur une page séparée. Une fois commencé, revenir en arrière ou recharger la page réinitialise le quiz.</p><button type="button" class="btn btn-primary" id="classe-ouvrir-quiz">Ouvrir le quiz →</button><p id="classe-quiz-status" role="status">La séance sera validée uniquement après une bonne réponse au quiz.</p></div>`;
      detail.querySelector("#classe-ouvrir-quiz").addEventListener("click", () => {
        const quizWindow = window.open("", "_blank");
        if (!quizWindow) {
          alert("Le navigateur a bloqué la nouvelle page. Autorise les fenêtres contextuelles pour EduCap Afrique, puis réessaie.");
          return;
        }
        const safe = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
        const quizPayload = {title:item.title,subject:item.subject,question:item.question,options:item.options,answer:item.answer,explain:item.explain};
        quizWindow.document.open();
        quizWindow.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Quiz — EduCap Afrique</title><style>
          *{box-sizing:border-box}body{margin:0;background:#f3f6fc;color:#172642;font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.55}.wrap{max-width:760px;margin:0 auto;padding:28px 16px}.brand{font-weight:800;color:#1754a5;letter-spacing:.04em}.panel{margin-top:22px;background:#fff;border:1px solid #dfe7f5;border-radius:22px;padding:clamp(20px,5vw,36px);box-shadow:0 12px 35px #173c7410}h1{font-size:clamp(25px,5vw,36px);line-height:1.2}p{color:#52627a}.option{display:flex;gap:12px;align-items:flex-start;padding:14px;margin:10px 0;border:1px solid #dbe4f2;border-radius:12px;cursor:pointer}.option:has(input:checked){background:#eef5ff;border-color:#4784d7}.option input{margin-top:6px}button{border:0;border-radius:11px;padding:13px 18px;background:#1859bc;color:#fff;font-weight:700;font-size:15px;cursor:pointer}button:disabled{opacity:.6;cursor:default}.notice{font-size:13px;background:#fff7e6;color:#77531b;border:1px solid #f0dda9;border-radius:12px;padding:12px}.feedback{padding:14px;border-radius:12px;margin-top:16px;background:#e8f7ee;color:#17633b}.hidden{display:none}.foot{font-size:12px;color:#7b8799;margin-top:22px}
        </style></head><body><main class="wrap"><div class="brand">EDUCAP AFRIQUE · ESPACE QUIZ</div><section class="panel"><p>${safe(item.subject)}</p><h1>${safe(item.title)}</h1><p>Lis la question, choisis une seule réponse puis valide.</p><div class="notice">Attention : quitter cette page, y revenir avec le bouton précédent ou actualiser recommence le quiz. Tes réponses ne sont pas conservées.</div><form id="quiz-form"><h2>${safe(item.question)}</h2>${item.options.map((option,index)=>'<label class="option"><input required type="radio" name="answer" value="'+index+'"><span>'+safe(option)+'</span></label>').join("")}<button type="submit" id="submit">Valider ma réponse</button></form><div id="feedback" class="feedback hidden" role="status"></div><p class="foot">Quiz de démonstration · EduCap Afrique</p></section></main><script>
          const form=document.getElementById("quiz-form"), feedback=document.getElementById("feedback"), submit=document.getElementById("submit");
          form.addEventListener("submit",function(event){event.preventDefault();const selected=form.querySelector('input[name="answer"]:checked');if(!selected)return;const correct=Number(selected.value)===${Number(item.answer)};feedback.textContent=(correct?"Bonne réponse ! ":"Réponse incorrecte. ")+${JSON.stringify(item.explain)}; if(correct && window.opener){window.opener.postMessage({type:"educap-quiz-passed",lessonId:${JSON.stringify(item.id)}},"*");}feedback.classList.remove("hidden");feedback.style.background=correct?"#e8f7ee":"#fff0ed";feedback.style.color=correct?"#17633b":"#9a3412";form.querySelectorAll("input").forEach(input=>input.disabled=true);submit.disabled=true;submit.textContent="Réponse validée";});
          window.addEventListener("pageshow",function(event){if(event.persisted){window.location.reload();}});
          window.addEventListener("pagehide",function(){try{form.reset();}catch(e){}});
        </script></body></html>`);
        quizWindow.document.close();
        quizWindow.focus();
        window.addEventListener("message", function onQuizPassed(event) {
          if (event.origin !== window.location.origin || event.data?.type !== "educap-quiz-passed" || event.data.lessonId !== item.id) return;
          window.removeEventListener("message", onQuizPassed);
          if (!completed.includes(item.id)) completed.push(item.id);
          try { localStorage.setItem(progressKey, JSON.stringify(completed)); } catch (_) {}
          syncPassedLesson(item);
          updateProgress(); renderLessons();
          detail.querySelector("#classe-quiz-status")?.replaceChildren(document.createTextNode("Séance réussie : progression enregistrée."));
          const samePath = lessons.filter(x => x.path === item.path);
          if (samePath.every(x => completed.includes(x.id))) showFinalAssessment(item.path, samePath);
        });
      });
      
      detail.scrollIntoView({behavior:"smooth",block:"start"});
    };
    list.addEventListener("click", event => {
      const button = event.target.closest("[data-open-lecon]");
      if (button) openLesson(button.dataset.openLecon);
    });
    [filterPath,filterSubject].forEach(el => el.addEventListener("change", renderLessons));
    search.addEventListener("input", renderLessons);
    renderLessons(); updateProgress();
    (async () => {
      if (!supabaseClient) return;
      try {
        const auth = await supabaseClient.auth.getUser();
        signedUser = auth.data?.user || null;
        if (!signedUser) return;
        const {data:rows, error} = await supabaseClient.from("learning_progress")
          .select("lesson_id,quiz_passed").eq("user_id", signedUser.id);
        if (error) throw error;
        (rows || []).forEach(row => {
          if (row.quiz_passed && lessons.some(lesson => lesson.id === row.lesson_id) && !completed.includes(row.lesson_id)) completed.push(row.lesson_id);
        });
        try { localStorage.setItem(progressKey, JSON.stringify(completed)); } catch (_) {}
        renderLessons(); updateProgress();
      } catch (error) {
        console.warn("Chargement de la progression en ligne indisponible :", error.message || error);
      }
    })();

    const nav = document.querySelector("#navigation-edcap");
    if (nav && !nav.querySelector('a[href="#ma-classe"]')) {
      const link = document.createElement("a");
      link.className = "nav-link"; link.href = "#ma-classe"; link.innerHTML = '<span aria-hidden="true">▣</span> Ma salle de classe';
      const anchor = nav.querySelector('a[href="#parcours-decouverte"]');
      if (anchor) anchor.insertAdjacentElement("afterend", link); else nav.appendChild(link);
    }
  });
})();
