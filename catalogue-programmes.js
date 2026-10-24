/* EduCap Afrique — catalogue de référence scolaire ivoirien
   Références institutionnelles : DPFC / MENAET. Ce catalogue n'affirme pas que chaque leçon est déjà publiée.
*/
(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("#catalogue-programmes")) return;

    const levels = [
      {id:"CP1",name:"CP1",cycle:"Primaire",series:[]},
      {id:"CP2",name:"CP2",cycle:"Primaire",series:[]},
      {id:"CE1",name:"CE1",cycle:"Primaire",series:[]},
      {id:"CE2",name:"CE2",cycle:"Primaire",series:[]},
      {id:"CM1",name:"CM1",cycle:"Primaire",series:[]},
      {id:"CM2",name:"CM2 · Préparation CEPE",cycle:"Primaire",series:[]},
      {id:"6e",name:"6e",cycle:"Collège",series:[]},
      {id:"5e",name:"5e",cycle:"Collège",series:[]},
      {id:"4e",name:"4e",cycle:"Collège",series:[]},
      {id:"3e",name:"3e · Préparation BEPC",cycle:"Collège",series:[]},
      {id:"2ndeA",name:"2nde A",cycle:"Lycée",series:["A"]},
      {id:"2ndeC",name:"2nde C",cycle:"Lycée",series:["C"]},
      {id:"1ereA1",name:"1ère A1",cycle:"Lycée",series:["A1"]},
      {id:"1ereA2",name:"1ère A2",cycle:"Lycée",series:["A2"]},
      {id:"1ereC",name:"1ère C",cycle:"Lycée",series:["C"]},
      {id:"1ereD",name:"1ère D",cycle:"Lycée",series:["D"]},
      {id:"tleA1",name:"Terminale A1",cycle:"Lycée",series:["A1"]},
      {id:"tleA2",name:"Terminale A2",cycle:"Lycée",series:["A2"]},
      {id:"tleC",name:"Terminale C",cycle:"Lycée",series:["C"]},
      {id:"tleD",name:"Terminale D",cycle:"Lycée",series:["D"]}
    ];
    const subjects = [
      {name:"Français",url:"https://dpfc-ci.net/?page_id=63",note:"Choisir le document correspondant au niveau et à la série si indiqué."},
      {name:"Mathématiques",url:"https://dpfc-ci.net/?page_id=63",note:"Vérifier le programme de la classe et la série."},
      {name:"Anglais",url:"https://dpfc-ci.net/?page_id=63",note:"Le programme peut varier selon le cycle et la série."},
      {name:"Histoire-Géographie",url:"https://dpfc-ci.net/?page_id=63",note:"Associer les leçons aux progressions officielles de l'année."},
      {name:"Physique-Chimie",url:"https://dpfc-ci.net/?page_id=63",note:"Disponibilité et programme selon la classe et la série."},
      {name:"Sciences de la Vie et de la Terre (SVT)",url:"https://dpfc-ci.net/?page_id=63",note:"Vérifier la progression correspondant au niveau."},
      {name:"Philosophie",url:"https://dpfc-ci.net/?page_id=63",note:"Pour le lycée, vérifier la série et la progression annuelle."},
      {name:"Espagnol",url:"https://dpfc-ci.net/?page_id=63",note:"Selon la classe et la langue effectivement suivie."},
      {name:"Allemand",url:"https://dpfc-ci.net/?page_id=63",note:"Selon la classe et la langue effectivement suivie."},
      {name:"EDHC",url:"https://dpfc-ci.net/?page_id=63",note:"Disponibilité selon le niveau."},
      {name:"Éducation musicale",url:"https://dpfc-ci.net/?page_id=63",note:"Disponibilité selon le niveau."},
      {name:"Arts plastiques",url:"https://dpfc-ci.net/?page_id=63",note:"Disponibilité selon le niveau."},
      {name:"EPS",url:"https://dpfc-ci.net/?page_id=63",note:"Selon le niveau et le cycle."},
      {name:"Lecture et langage",url:"https://dpfc-ci.net/?page_id=289",note:"Primaire : consulter le programme du niveau concerné."},
      {name:"Sciences et technologie",url:"https://dpfc-ci.net/?page_id=289",note:"Primaire : vérifier le programme et les activités du niveau."},
      {name:"Éducation aux Droits de l’Homme et à la Citoyenneté (EDHC)",url:"https://dpfc-ci.net/?page_id=289",note:"Programme primaire selon le niveau."},
      {name:"Activités d’Éveil et de Création (AEC)",url:"https://dpfc-ci.net/?page_id=289",note:"Programme primaire selon le niveau."}
    ];

    // Premier contenu détaillé vérifié dans un document DPFC indexé : Mathématiques Terminale A1.
    // À enrichir progressivement avec les autres PDF officiels, classe par classe.
    const verifiedLessons = {
      "tleA1|Mathématiques": {
        source: "https://dpfc-ci.net/dpfc/programmes/maths/11.%20Prog%20%C3%89duct%20MATHS%20TA1%20CND%200923.pdf",
        sourceLabel: "Mathématiques — Terminale A1",
        themes: [
          {theme:"Calculs algébriques", lessons:["Systèmes linéaires dans ℝ × ℝ"]},
          {theme:"Fonctions numériques", lessons:["Étude de fonctions polynômes et de fonctions rationnelles","Fonction logarithme népérien","Fonction exponentielle népérienne","Primitives et calcul intégral","Suites numériques"]},
          {theme:"Organisation et traitement de données", lessons:["Statistique à deux variables"]},
          {theme:"Modélisation d’un phénomène aléatoire", lessons:["Probabilités"]}
        ]
      }
    };

    verifiedLessons["tleC|Mathématiques"] = {
      source: "https://dpfc-ci.net/dpfc/programmes/maths/13.%20Prog%20Educt%20maths%20TC%20CND%200923.pdf",
      sourceLabel: "Mathématiques — Terminale C",
      themes: [
        {theme:"Calculs algébriques",lessons:["Nombres complexes"]},
        {theme:"Analyse",lessons:["Limites et continuité","Dérivabilité et étude de fonctions","Suites numériques","Calcul intégral","Équations différentielles"]},
        {theme:"Arithmétique",lessons:["Divisibilité dans ℤ","PPCM et PGCD de deux entiers relatifs"]},
        {theme:"Géométrie",lessons:["Barycentre et lignes de niveaux","Géométrie analytique de l’espace","Isométries du plan","Similitudes directes du plan","Nombres complexes et géométrie du plan"]},
        {theme:"Probabilités et statistiques",lessons:["Probabilité conditionnelle et variable aléatoire","Statistique à deux variables"]}
      ]
    };

    const section = document.createElement("section");
    section.id = "catalogue-programmes";
    section.className = "section";
    section.innerHTML = `
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">EDUCAP SCOLAIRE</span>
          <h2>Apprendre par classe et par matière</h2>
          <p>Choisis ton niveau pour retrouver les matières de ton parcours scolaire.</p>
        </div>
        <div class="catalogue-panel">
          <label for="ep-catalogue-niveau">Classe / niveau</label>
          <select id="ep-catalogue-niveau"><option value="">Choisir un niveau</option>${levels.map(l=>`<option value="${l.id}">${l.name}</option>`).join("")}</select>
          <div id="ep-catalogue-serie-wrap" hidden><label for="ep-catalogue-serie">Série</label><select id="ep-catalogue-serie"></select></div>
          
          <div id="ep-catalogue-result" aria-live="polite"><p>Sélectionne une classe pour afficher les matières à organiser.</p></div>

        </div>
      </div>`;
    const style = document.createElement("style");
    style.textContent = `
      #catalogue-programmes .catalogue-panel{max-width:900px;margin:0 auto;padding:clamp(18px,3vw,28px);background:#fff;border:1px solid #dce7f8;border-radius:18px;box-shadow:0 8px 28px #173c740a}
      #catalogue-programmes label{display:block;font-weight:700;margin:12px 0 6px}
      #catalogue-programmes select{width:100%;min-height:46px;padding:10px 12px;border:1px solid #d7e1f1;border-radius:10px;background:#fff;font:inherit;color:#172642}
      #catalogue-programmes .ep-catalogue-notice{margin:16px 0;padding:13px;border-radius:10px;background:#fff7e6;color:#76521b;font-size:13px}
      #catalogue-programmes .ep-subject-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}
      #catalogue-programmes .ep-subject{padding:15px;border:1px solid #e1e8f2;border-radius:12px;background:#fbfdff}
      #catalogue-programmes .ep-subject h4{margin:0 0 7px}
      #catalogue-programmes .ep-subject p{font-size:13px;color:#617089;margin:0 0 10px}
      #catalogue-programmes .ep-subject a,#catalogue-programmes .ep-official-links a{color:#1754a5;font-weight:700;text-decoration:underline}
      #catalogue-programmes .ep-official-links{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px;font-size:13px}\n      #catalogue-programmes .ep-verified-programme{margin:18px 0;padding:16px;border:1px solid #b9d8c5;background:#f5fbf7;border-radius:12px}\n      #catalogue-programmes .ep-theme{margin:12px 0;padding:10px 12px;background:#fff;border-radius:8px}\n      #catalogue-programmes .ep-theme ol{margin:8px 0 0;padding-left:22px}\n      #catalogue-programmes .ep-theme li{margin:5px 0}
      @media(max-width:600px){#catalogue-programmes .ep-subject-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
    const main = document.querySelector("main");
    const registration = document.querySelector("#inscription");
    if (registration) registration.insertAdjacentElement("beforebegin", section);
    else if (main) main.appendChild(section);
    else return;

    const levelSelect=section.querySelector("#ep-catalogue-niveau");
    const seriesWrap=section.querySelector("#ep-catalogue-serie-wrap");
    const seriesSelect=section.querySelector("#ep-catalogue-serie");
    const result=section.querySelector("#ep-catalogue-result");
    const escape=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    const render=()=>{
      const level=levels.find(l=>l.id===levelSelect.value);
      if(!level){seriesWrap.hidden=true;result.innerHTML="<p>Sélectionne une classe pour afficher les matières à organiser.</p>";return;}
      const previousSeries=seriesSelect.value;
      seriesWrap.hidden=!level.series.length;
      seriesSelect.replaceChildren();
      if(level.series.length){
        seriesSelect.innerHTML=level.series.map(s=>\`<option value="\${escape(s)}">\${escape(s)}</option>\`).join("");
        if(level.series.includes(previousSeries)) seriesSelect.value=previousSeries;
      }
      const serieChoisie=seriesSelect.value;
      const list=subjects.filter(s=>{
        if(level.cycle==="Primaire") return ["Français","Mathématiques","Histoire-Géographie","Sciences de la Vie et de la Terre (SVT)","Éducation aux Droits de l’Homme et à la Citoyenneté (EDHC)","Activités d’Éveil et de Création (AEC)","EPS","Lecture et langage","Sciences et technologie"].includes(s.name);
        if(level.cycle==="Collège") return !["Philosophie","Lecture et langage","Sciences et technologie","Éducation aux Droits de l’Homme et à la Citoyenneté (EDHC)","Activités d’Éveil et de Création (AEC)"].includes(s.name);
        if(level.cycle==="Lycée") return !["EDHC","Éducation musicale","Arts plastiques","Lecture et langage","Sciences et technologie","Éducation aux Droits de l’Homme et à la Citoyenneté (EDHC)","Activités d’Éveil et de Création (AEC)"].includes(s.name);
        return true;
      });
      const detail=verifiedLessons[level.id+"|Mathématiques"];
      const serieLabel=serieChoisie ? " · Série "+escape(serieChoisie) : "";
      const lessonHtml=detail ? \`<section class="ep-verified-programme"><h4>Programme de mathématiques — \${escape(level.name)}</h4><p>Repères de leçons pour organiser les révisions.</p>\${detail.themes.map(t=>\`<div class="ep-theme"><strong>\${escape(t.theme)}</strong><ol>\${t.lessons.map(l=>\`<li>\${escape(l)}</li>\`).join("")}</ol></div>\`).join("")}</section>\` : "";
      result.innerHTML=\`<h3 style="margin:20px 0 4px">\${escape(level.name)}\${serieLabel} — matières à organiser</h3>
        <p>Choisis une matière ci-dessous, puis ouvre les fiches de cours et les exercices disponibles.</p>
        \${lessonHtml}
        <div class="ep-subject-grid">\${list.map(s=>\`<article class="ep-subject"><h4>\${escape(s.name)}</h4><p>\${escape(s.note)}</p><a href="#educap-fiches-lecons" class="ep-open-lessons" data-subject="\${escape(s.name)}">Voir les fiches disponibles →</a></article>\`).join("")}</div>
        <p class="ep-catalogue-notice">Les ressources s’enrichissent progressivement. La liste des matières ne signifie pas que toutes les leçons sont déjà publiées.</p>\`;
      result.querySelectorAll(".ep-open-lessons").forEach(link=>link.addEventListener("click",()=>{
        const subject=link.getAttribute("data-subject");
        const lessonSelect=document.querySelector("#efl-unit");
        if(lessonSelect){
          const options=Array.from(lessonSelect.options);
          const match=options.find(o=>o.textContent.toLowerCase().includes(subject.toLowerCase()) && (o.textContent.toLowerCase().includes(level.name.toLowerCase()) || o.textContent.toLowerCase().includes(level.id.toLowerCase())));
          const fallback=options.find(o=>o.textContent.toLowerCase().includes(subject.toLowerCase()));
          if(match||fallback){lessonSelect.value=(match||fallback).value;lessonSelect.dispatchEvent(new Event("change",{bubbles:true}));}
        }
      }));
    };
    levelSelect.addEventListener("change",render);
    seriesSelect.addEventListener("change",render);
  });
})();
