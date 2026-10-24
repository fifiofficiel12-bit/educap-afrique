/* EduCap Afrique — premières fiches de cours interactives
   Ressources pédagogiques originales, à distinguer des programmes officiels DPFC.
   Les thèmes sont rapprochés des documents de référence; cette fiche ne remplace pas le cours du professeur.
*/
(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("#educap-fiches-lecons")) return;
    const units = [
      {
        id:"a1-fonctions", level:"Terminale A1", subject:"Mathématiques",
        title:"Étudier une fonction rationnelle simple",
        objective:"Déterminer le domaine, calculer une limite simple et dériver une fonction rationnelle.",
        course:[
          "Le domaine de définition exclut les valeurs qui annulent le dénominateur.",
          "Pour dériver un quotient u(x)/v(x), on utilise (u'v − uv')/v², lorsque v(x) ≠ 0.",
          "Pour étudier les variations, on cherche le signe de la dérivée sur chaque intervalle du domaine."
        ],
        example:"Soit f(x) = (2x + 1)/(x − 1). Le dénominateur impose x ≠ 1. Pour x ≠ 1, f'(x) = [2(x − 1) − (2x + 1)]/(x − 1)² = −3/(x − 1)². Comme le dénominateur est positif, f'(x) < 0 sur ]−∞;1[ et sur ]1;+∞[ : f est strictement décroissante sur chacun de ces intervalles.",
        summary:"Toujours commencer par le domaine. Pour un quotient, dériver avec la formule du quotient, simplifier puis étudier le signe.",
        question:"Quel est le domaine de définition de f(x) = (2x + 1)/(x − 1) ?",
        choices:["Tous les réels","Tous les réels sauf 1","Tous les réels sauf −1"],
        answer:1, explanation:"Le dénominateur x − 1 ne doit pas être nul, donc x ≠ 1."
      },
      {
        id:"a1-proba", level:"Terminale A1", subject:"Mathématiques",
        title:"Probabilité d’un événement contraire",
        objective:"Utiliser la probabilité de l’événement contraire pour simplifier un calcul.",
        course:[
          "La probabilité d’un événement A est comprise entre 0 et 1.",
          "L’événement contraire de A, noté A̅, signifie que A ne se réalise pas.",
          "La relation essentielle est P(A̅) = 1 − P(A)."
        ],
        example:"Si la probabilité qu’un élève réussisse un test est de 0,72, alors la probabilité qu’il échoue est 1 − 0,72 = 0,28, soit 28 %.",
        summary:"Quand il est plus simple de calculer « au moins un » ou « aucun », penser à l’événement contraire et à la formule 1 − P(A).",
        question:"Si P(A) = 0,35, combien vaut P(A̅) ?",
        choices:["0,35","0,65","1,35"],
        answer:1, explanation:"P(A̅) = 1 − 0,35 = 0,65."
      },
      {
        id:"tc-complexes", level:"Terminale C", subject:"Mathématiques",
        title:"Premiers calculs avec les nombres complexes",
        objective:"Calculer avec i et écrire un nombre complexe sous forme algébrique.",
        course:[
          "Un nombre complexe s’écrit z = a + bi, où a et b sont réels et i² = −1.",
          "Pour additionner, on regroupe les parties réelles et les parties imaginaires.",
          "Pour multiplier, on développe puis on remplace i² par −1."
        ],
        example:"Calculons (2 + 3i)(1 − i). En développant : 2 − 2i + 3i − 3i². Comme i² = −1, cela donne 2 + i + 3 = 5 + i.",
        summary:"Développer comme avec des expressions algébriques, puis remplacer systématiquement i² par −1.",
        question:"Combien vaut i² ?",
        choices:["1","−1","i"],
        answer:1, explanation:"Par définition de l’unité imaginaire, i² = −1."
      }
      ,{
        id:"a1-log", level:"Terminale A1", subject:"Mathématiques",
        title:"Équations avec le logarithme népérien",
        objective:"Utiliser les propriétés du logarithme pour résoudre une équation simple.",
        course:[
          "Le logarithme népérien ln(x) est défini seulement pour x strictement positif.",
          "Pour a > 0 et b > 0, ln(a) + ln(b) = ln(ab).",
          "La fonction ln est strictement croissante sur ]0;+∞[ : ln(a) = ln(b) équivaut à a = b, avec a et b positifs."
        ],
        example:"Résoudre ln(x) = ln(5). Condition : x > 0. Comme ln est injective sur les réels positifs, x = 5. La solution est donc {5}.",
        summary:"Écrire d’abord la condition x > 0. Simplifier les logarithmes, puis résoudre en vérifiant que les solutions respectent le domaine.",
        question:"Quelle est la condition de définition de ln(x) ?",
        choices:["x ≥ 0","x > 0","x ≠ 0"],
        answer:1, explanation:"Le logarithme népérien est défini uniquement pour un argument strictement positif."
      },
      {
        id:"a1-suites", level:"Terminale A1", subject:"Mathématiques",
        title:"Reconnaître une suite arithmétique",
        objective:"Identifier une suite arithmétique et calculer un terme à partir de sa raison.",
        course:[
          "Une suite (uₙ) est arithmétique si la différence entre deux termes consécutifs est constante.",
          "Cette constante r s’appelle la raison : uₙ₊₁ = uₙ + r.",
          "Si le premier terme est u₀, alors uₙ = u₀ + nr."
        ],
        example:"Une suite arithmétique vérifie u₀ = 4 et r = 3. Alors u₅ = 4 + 5 × 3 = 19.",
        summary:"Repérer la différence constante, identifier le premier terme et la raison, puis appliquer la formule adaptée à l’indice de départ.",
        question:"Si u₀ = 2 et r = 4, quelle est la valeur de u₃ ?",
        choices:["6","10","14"],
        answer:2, explanation:"u₃ = u₀ + 3r = 2 + 3 × 4 = 14."
      },
      {
        id:"tc-derivee", level:"Terminale C", subject:"Mathématiques",
        title:"Dérivée et sens de variation",
        objective:"Calculer une dérivée simple et relier son signe aux variations d’une fonction.",
        course:[
          "La dérivée de xⁿ est nxⁿ⁻¹ pour les puissances usuelles où la formule s’applique.",
          "Si f'(x) est positive sur un intervalle, f y est croissante; si f'(x) est négative, f y est décroissante.",
          "Pour conclure sur un intervalle, vérifier le signe de la dérivée sur tout cet intervalle."
        ],
        example:"Pour f(x) = x² − 4x, f'(x) = 2x − 4. La dérivée est négative si x < 2, nulle en 2 et positive si x > 2. La fonction décroît jusqu’à 2 puis croît après 2.",
        summary:"Calculer f'(x), résoudre f'(x) = 0, étudier le signe de f' puis en déduire les variations.",
        question:"Pour f(x) = x² − 4x, combien vaut f'(3) ?",
        choices:["−2","2","6"],
        answer:1, explanation:"f'(x) = 2x − 4, donc f'(3) = 6 − 4 = 2."
      },
      {
        id:"term-philo-liberte", level:"Terminale A1 / A2", subject:"Philosophie",
        title:"La liberté consiste-t-elle à faire tout ce que l’on veut ?",
        objective:"Définir les notions, construire une problématique et organiser une argumentation philosophique.",
        course:[
          "La liberté peut désigner l’absence de contrainte, la capacité de choisir ou l’autonomie, c’est-à-dire la possibilité d’agir selon des raisons que l’on reconnaît comme siennes.",
          "Faire tout ce que l’on désire semble exprimer la liberté, mais les désirs peuvent entrer en conflit entre eux ou avec les droits d’autrui.",
          "Une dissertation ne doit pas simplement répondre oui ou non : elle examine la difficulté, confronte des arguments et construit une réponse nuancée."
        ],
        example:"Problématique possible : si être libre signifie satisfaire tous ses désirs, comment expliquer que certaines règles puissent protéger la liberté de chacun ? Plan d’entraînement : I. La liberté semble supposer le choix ; II. l’absence de toute limite peut nuire à soi-même et aux autres ; III. des règles justifiées et discutées peuvent rendre possible une liberté responsable.",
        summary:"Définir liberté et désir, faire apparaître une tension, formuler une question directrice, puis soutenir chaque partie par un argument expliqué et un exemple pertinent.",
        question:"Quel est le rôle principal d’une problématique dans une dissertation ?",
        choices:["Répéter le sujet sans le questionner","Faire apparaître le problème à examiner et guider le raisonnement","Donner la conclusion dès la première phrase"],
        answer:1, explanation:"La problématique transforme le sujet en problème philosophique et organise la réflexion."
      },
      {
        id:"term-physique-mouvement", level:"Terminale C / D", subject:"Physique-Chimie",
        title:"Mouvement rectiligne uniformément varié",
        objective:"Relier accélération constante, vitesse et déplacement dans un mouvement rectiligne.",
        course:[
          "Dans un mouvement rectiligne uniformément varié, l’accélération a est constante sur l’intervalle étudié.",
          "La vitesse à l’instant t s’écrit v(t) = v₀ + at, avec v₀ la vitesse initiale.",
          "La position s’écrit x(t) = x₀ + v₀t + ½at², si l’axe, l’origine des temps et les unités sont cohérents."
        ],
        example:"Un mobile part avec v₀ = 2 m/s et une accélération a = 3 m/s². Après 4 s, v = 2 + 3 × 4 = 14 m/s. Le déplacement est Δx = 2 × 4 + ½ × 3 × 4² = 8 + 24 = 32 m.",
        summary:"Identifier les données, convertir les unités si nécessaire, choisir la formule adaptée puis vérifier l’unité et la cohérence du résultat.",
        question:"Un mobile a v₀ = 5 m/s et a = 2 m/s². Quelle est sa vitesse après 3 s ?",
        choices:["6 m/s","11 m/s","15 m/s"],
        answer:1, explanation:"v = v₀ + at = 5 + 2 × 3 = 11 m/s."
      },
      {
        id:"troisieme-equation", level:"3e", subject:"Mathématiques",
        title:"Résoudre une équation du premier degré",
        objective:"Isoler l’inconnue en effectuant la même opération sur les deux membres.",
        course:[
          "Une équation est une égalité contenant une ou plusieurs inconnues.",
          "Pour conserver l’égalité, on ajoute, soustrait, multiplie ou divise les deux membres par la même valeur autorisée.",
          "Après résolution, remplacer l’inconnue par la valeur trouvée permet de vérifier la solution."
        ],
        example:"Résoudre 3x + 5 = 20. Soustraire 5 des deux côtés : 3x = 15. Diviser par 3 : x = 5. Vérification : 3 × 5 + 5 = 20.",
        summary:"Regrouper les termes, isoler l’inconnue et vérifier la solution dans l’équation initiale.",
        question:"Quelle est la solution de 4x − 6 = 10 ?",
        choices:["x = 1","x = 4","x = 16"],
        answer:1, explanation:"Ajouter 6 donne 4x = 16, puis diviser par 4 donne x = 4."
      }
    ];
    const section=document.createElement("section");
    section.id="educap-fiches-lecons";
    section.className="section";
    section.innerHTML=`
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">EDUCAP SCOLAIRE · APPRENDRE EN PRATIQUANT</span>
          <h2>Premières fiches de cours et exercices corrigés</h2>
          <p>Lis la leçon, étudie l’exemple, puis vérifie ta compréhension avec le mini-quiz.</p>
        </div>
        <div class="efl-panel">
          <label for="efl-unit">Choisir une fiche</label>
          <select id="efl-unit">${units.map(u=>`<option value="${u.id}">${u.level} — ${u.title}</option>`).join("")}</select>
          <div id="efl-content" aria-live="polite"></div>
        </div>
      </div>`;
    const style=document.createElement("style");
    style.textContent=`
      #educap-fiches-lecons .efl-panel{max-width:900px;margin:auto;padding:clamp(18px,3vw,28px);border:1px solid #dce7f8;border-radius:18px;background:#fff}
      #educap-fiches-lecons label{display:block;font-weight:700;margin-bottom:7px}
      #educap-fiches-lecons select{width:100%;min-height:46px;padding:10px;border:1px solid #d7e1f1;border-radius:10px;font:inherit}
      #educap-fiches-lecons .efl-block{margin-top:16px;padding:16px;border-radius:12px;background:#f7faff;border:1px solid #e1eaf6}
      #educap-fiches-lecons .efl-block h3{margin:0 0 10px;font-size:18px}
      #educap-fiches-lecons li{margin:7px 0;line-height:1.55}
      #educap-fiches-lecons .efl-example{white-space:normal;line-height:1.7}
      #educap-fiches-lecons .efl-choices{display:grid;gap:8px;margin-top:12px}
      #educap-fiches-lecons .efl-choice{display:flex;gap:9px;align-items:flex-start;padding:11px;background:#fff;border:1px solid #dce5f1;border-radius:9px;cursor:pointer}
      #educap-fiches-lecons .efl-feedback{margin-top:12px;padding:12px;border-radius:9px;display:none}
      #educap-fiches-lecons .efl-feedback.visible{display:block}
      #educap-fiches-lecons .efl-action{margin-top:12px;border:0;border-radius:9px;padding:11px 16px;background:#1456a0;color:#fff;font-weight:700;cursor:pointer}
    `;
    document.head.appendChild(style);
    const catalog=document.querySelector("#catalogue-programmes-officiels");
    if(catalog) catalog.insertAdjacentElement("afterend",section);
    else {
      const registration=document.querySelector("#inscription");
      if(registration) registration.insertAdjacentElement("beforebegin",section);
      else document.querySelector("main")?.appendChild(section);
    }
    const selector=section.querySelector("#efl-unit");
    const panel=section.querySelector("#efl-content");
    const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    function render(){
      const u=units.find(x=>x.id===selector.value);
      panel.innerHTML=`
        <div class="efl-block"><h3>${esc(u.title)}</h3><p><strong>Niveau :</strong> ${esc(u.level)} · ${esc(u.subject)}</p><p><strong>Objectif :</strong> ${esc(u.objective)}</p></div>
        <div class="efl-block"><h3>1. À retenir</h3><ul>${u.course.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
        <div class="efl-block"><h3>2. Exemple corrigé</h3><p class="efl-example">${esc(u.example)}</p></div>
        <div class="efl-block"><h3>3. Résumé</h3><p>${esc(u.summary)}</p></div>
        <div class="efl-block"><h3>4. Mini-quiz</h3><p>${esc(u.question)}</p><div class="efl-choices">${u.choices.map((c,i)=>`<label class="efl-choice"><input type="radio" name="efl-answer" value="${i}"><span>${esc(c)}</span></label>`).join("")}</div><button class="efl-action" type="button" id="efl-check">Vérifier ma réponse</button><div id="efl-feedback" class="efl-feedback" role="status"></div></div>
        <p style="font-size:12px;color:#617089;margin-top:14px">EduCap Afrique — apprendre, pratiquer et vérifier ses acquis.</p>`;
      panel.querySelector("#efl-check").addEventListener("click",()=>{
        const selected=panel.querySelector('input[name="efl-answer"]:checked');
        const feedback=panel.querySelector("#efl-feedback");
        feedback.classList.add("visible");
        if(!selected){feedback.textContent="Choisis une réponse avant de vérifier.";return;}
        feedback.textContent=(Number(selected.value)===u.answer?"Bonne réponse ! ":"Pas encore. ") + u.explanation;
      });
    }
    selector.addEventListener("change",render);
    render();
  });
})();