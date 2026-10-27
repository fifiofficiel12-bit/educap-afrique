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
        course:["Un événement est un résultat ou un ensemble de résultats d’une expérience aléatoire. Son contraire rassemble tous les résultats où l’événement initial ne se produit pas.","La probabilité de l’événement et celle de son contraire totalisent toujours 1, soit 100 %.","On peut calculer P(non A) par 1 − P(A), mais il faut d’abord s’assurer que P(A) est connue et comprise entre 0 et 1."],
        example:"Dans un sac, la probabilité de tirer une boule rouge est 0,3. L’événement contraire est « ne pas tirer une boule rouge ». Sa probabilité vaut 1 − 0,3 = 0,7, soit 70 %. Contrôle : 0,3 + 0,7 = 1.",
        summary:"Identifier précisément l’événement, calculer 1 − sa probabilité et vérifier que les deux probabilités totalisent 1.",
        question:"Si la probabilité d’un événement est de 0,18, quelle est celle de son contraire ?",
        choices:["0,18","0,82","1,18"],
        answer:1, explanation:"1 − 0,18 = 0,82. Les deux probabilités totalisent 1."
      },
      {
        id:"tc-complexes", level:"Terminale C", subject:"Mathématiques",
        title:"Premiers calculs avec les nombres complexes",
        objective:"Calculer avec i et écrire un nombre complexe sous forme algébrique.",
        course:["Un nombre complexe s’écrit z = a + bi, où a est sa partie réelle, b sa partie imaginaire et i² = −1.","Pour additionner deux nombres complexes, on additionne séparément les parties réelles et les coefficients de i.","Pour multiplier, on développe puis on remplace i² par −1. Attention : i² n’est pas égal à 1."],
        example:"Calculons (3 + 2i) + (1 − 5i) = (3 + 1) + (2 − 5)i = 4 − 3i. Puis (2 + i)(3 − i) = 6 − 2i + 3i − i² = 7 + i, car i² = −1.",
        summary:"Regrouper séparément les parties réelles et imaginaires; lors d’un produit, développer et remplacer i² par −1.",
        question:"Combien vaut (1 + i)(1 − i) ?",
        choices:["2","0","1 + i"],
        answer:0, explanation:"(1+i)(1−i)=1−i²=1−(−1)=2."
      }
      ,{
        id:"a1-log", level:"Terminale A1", subject:"Mathématiques",
        title:"Équations avec le logarithme népérien",
        objective:"Utiliser les propriétés du logarithme pour résoudre une équation simple.",
        course:["Le logarithme népérien ln(x) existe uniquement si x > 0. Cette condition doit être écrite avant de résoudre une équation.","Pour x et y strictement positifs, ln(x) = ln(y) implique x = y, car la fonction logarithme est injective.","La propriété ln(ab) = ln(a) + ln(b) s’applique si a > 0 et b > 0. On ne peut pas prendre le logarithme d’un nombre négatif ou nul."]0;+∞[ : ln(a) = ln(b) équivaut à a = b, avec a et b positifs."
        ],
        example:"Résoudre ln(2x − 1) = ln(5). Condition : 2x − 1 > 0, donc x > 1/2. Égalité des logarithmes : 2x − 1 = 5, donc 2x = 6 et x = 3. La valeur 3 respecte la condition : la solution est {3}.",
        summary:"Déterminer le domaine de définition, utiliser les propriétés du logarithme, résoudre puis vérifier les conditions de positivité.",
        question:"Quelle condition doit vérifier x pour que ln(3x + 6) soit défini ?",
        choices:["x > −2","x ≥ −2","x < −2"],
        answer:0, explanation:"Il faut 3x+6>0, donc 3x>−6 puis x>−2."
      },
      {
        id:"a1-suites", level:"Terminale A1", subject:"Mathématiques",
        title:"Reconnaître une suite arithmétique",
        objective:"Identifier une suite arithmétique et calculer un terme à partir de sa raison.",
        course:["Une suite est arithmétique si l’on ajoute toujours le même nombre pour passer d’un terme au suivant. Ce nombre constant est la raison r.","La relation de récurrence est u(n+1) = u(n) + r. Si le premier terme est u0, alors un = u0 + n r.","Attention à l’indice de départ : si la suite commence à u1, la formule s’écrit un = u1 + (n−1)r."],
        example:"Une suite vérifie u0 = 7 et r = −2. Alors u1 = 5, u2 = 3 et u4 = 7 + 4×(−2) = −1. Le résultat est cohérent car on retire 2 à chaque étape.",
        summary:"Identifier le premier terme et la raison, vérifier la différence constante puis appliquer la formule correspondant à l’indice de départ.",
        question:"Une suite arithmétique a u0 = 5 et r = 3. Quelle est la valeur de u4 ?",
        choices:["8","12","17"],
        answer:2, explanation:"u4 = u0 + 4r = 5 + 4×3 = 17."
      },
      {
        id:"tc-derivee", level:"Terminale C", subject:"Mathématiques",
        title:"Dérivée et sens de variation",
        objective:"Calculer une dérivée simple et relier son signe aux variations d’une fonction.",
        course:["La dérivée f′ décrit la variation locale d’une fonction. Pour f(x)=x², f′(x)=2x; pour f(x)=ax+b, f′(x)=a.","Si f′ est positive sur un intervalle, f y est croissante; si f′ est négative, f y est décroissante. Si le signe change, il faut repérer où il change.","Une étude de variations demande de calculer la dérivée, résoudre f′(x)=0, étudier le signe puis conclure intervalle par intervalle."],
        example:"Pour f(x)=x²−6x+5, f′(x)=2x−6. La dérivée s’annule en x=3. Elle est négative pour x<3 et positive pour x>3 : f décroît jusqu’à 3 puis croît après 3. f(3)=9−18+5=−4.",
        summary:"Calculer la dérivée, repérer ses zéros, dresser son signe et en déduire les variations sur chaque intervalle.",
        question:"Pour f(x)=x²−6x, quel est le signe de f′(x) lorsque x=2 ?",
        choices:["Positif","Négatif","Nul"],
        answer:1, explanation:"f′(x)=2x−6, donc f′(2)=4−6=−2, qui est négatif."
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
        id:"term-philo-conscience", level:"Terminale A1 / A2", subject:"Philosophie",
        title:"La conscience suffit-elle à nous connaître ?",
        objective:"Distinguer conscience de soi et connaissance complète de soi, puis construire une problématique.",
        course:[
          "La conscience permet à une personne de se rendre compte de ses pensées, de ses actes et de son existence.",
          "Pourtant, nos motivations peuvent nous échapper : habitudes, émotions et influences peuvent orienter nos décisions sans être clairement identifiées.",
          "Se connaître demande donc aussi un examen critique de ses actes, de ses choix et de leurs conséquences."
        ],
        example:"Problématique : si la conscience nous donne accès à nous-mêmes, pourquoi nous arrive-t-il de mal comprendre les raisons de nos actes ? Plan possible : I. La conscience rend possible la réflexion sur soi ; II. elle ne révèle pas toujours toutes nos motivations ; III. l’observation de soi et l’expérience peuvent approfondir la connaissance de soi.",
        summary:"Définir la conscience et la connaissance de soi, montrer leur lien puis examiner leurs limites à l’aide d’arguments et d’exemples.",
        question:"Quelle difficulté nourrit cette problématique ?",
        choices:["La conscience rend toute erreur impossible","Nous pouvons être conscients sans comprendre toutes nos motivations","La connaissance de soi ne concerne jamais les actes"],
        answer:1, explanation:"La conscience permet de réfléchir sur soi, mais certaines motivations peuvent rester difficiles à reconnaître."
      },
      {
        id:"term-philo-travail", level:"Terminale A1 / A2", subject:"Philosophie",
        title:"Le travail est-il seulement une contrainte ?",
        objective:"Analyser les dimensions pénible, sociale et créatrice du travail.",
        course:[
          "Le travail exige un effort et peut être vécu comme une obligation nécessaire pour satisfaire des besoins.",
          "Il permet aussi de produire des biens ou des services, d’acquérir des compétences et de contribuer à la vie collective.",
          "Il faut distinguer la pénibilité d’une activité et la valeur que cette activité peut prendre pour la personne et la société."
        ],
        example:"Problématique : le travail nous impose-t-il seulement une nécessité, ou peut-il aussi contribuer à notre autonomie ? Plan possible : I. Le travail comporte des efforts et des contraintes ; II. il développe des capacités et rend possible une autonomie matérielle ; III. ses effets dépendent notamment des conditions de travail et de la reconnaissance.",
        summary:"Éviter de présenter le travail comme entièrement négatif ou entièrement positif : examiner les contraintes, les apports et les conditions concrètes.",
        question:"Quel élément permet de nuancer le jugement sur le travail ?",
        choices:["Toutes les activités ont toujours les mêmes effets","Les conditions de travail et la reconnaissance","Le travail ne produit aucun résultat"],
        answer:1, explanation:"Les conditions concrètes influencent la pénibilité, l’autonomie et la reconnaissance liées au travail."
      },
      {
        id:"term-philo-verite", level:"Terminale A1 / A2", subject:"Philosophie",
        title:"Peut-on être certain de posséder la vérité ?",
        objective:"Distinguer opinion, croyance, preuve et recherche de la vérité.",
        course:[
          "Une opinion est un jugement que l’on peut tenir pour vrai sans disposer d’une justification suffisante.",
          "La recherche de la vérité exige d’examiner les raisons, les faits et les objections plutôt que de s’appuyer uniquement sur l’assurance personnelle.",
          "Douter ne signifie pas renoncer à la vérité : un doute méthodique peut aider à corriger les erreurs."
        ],
        example:"Problématique : comment distinguer une conviction sincère d’une connaissance justifiée ? Plan possible : I. Nous avons besoin de convictions pour agir ; II. une conviction peut être fausse malgré notre assurance ; III. la vérification, l’argumentation et la confrontation des points de vue renforcent nos jugements.",
        summary:"Une dissertation sur la vérité doit préciser ce que signifie savoir, identifier les risques de l’opinion et expliquer comment justifier un jugement.",
        question:"Qu’est-ce qui distingue principalement une connaissance justifiée d’une simple opinion ?",
        choices:["Le fait d’être répétée souvent","La présence de raisons et de vérifications","Le fait de ne jamais être discutée"],
        answer:1, explanation:"Une connaissance justifiée s’appuie sur des raisons, des preuves ou des méthodes de vérification."
      },
      {
        id:"term-philo-justice", level:"Terminale A1 / A2", subject:"Philosophie",
        title:"La justice consiste-t-elle à traiter tout le monde de la même manière ?",
        objective:"Étudier l’égalité, l’équité et l’application des règles communes.",
        course:[
          "L’égalité exige que les personnes placées dans des situations comparables soient traitées selon des règles cohérentes.",
          "L’équité invite à considérer certaines différences de situation lorsque l’application identique d’une règle produit une injustice.",
          "Une différence de traitement doit toutefois pouvoir être justifiée par des raisons pertinentes et non par le favoritisme."
        ],
        example:"Problématique : une règle identique pour tous garantit-elle toujours un résultat juste ? Plan possible : I. Des règles communes protègent contre l’arbitraire ; II. des situations différentes peuvent demander des réponses adaptées ; III. l’équité doit rester justifiable et compatible avec les droits de chacun.",
        summary:"Distinguer égalité de traitement et équité, puis rechercher les critères qui rendent une différence de traitement légitime.",
        question:"Quand une différence de traitement peut-elle être équitable ?",
        choices:["Lorsqu’elle favorise un ami sans raison","Lorsqu’elle répond à une différence pertinente et peut être justifiée","Lorsqu’elle supprime les droits de certains"],
        answer:1, explanation:"L’équité peut tenir compte de situations différentes, à condition que les raisons soient pertinentes et justifiables."
      },
      {
        id:"term-philo-bonheur", level:"Terminale A1 / A2", subject:"Philosophie",
        title:"Le bonheur dépend-il de nous ?",
        objective:"Examiner le rôle des choix personnels et des circonstances dans la recherche du bonheur.",
        course:[
          "Le bonheur désigne généralement un état durable de satisfaction, à distinguer d’un plaisir ponctuel.",
          "Nos habitudes, nos choix et notre manière d’interpréter les événements peuvent influencer notre bien-être.",
          "Cependant, la santé, les ressources, les relations et les conditions sociales limitent parfois ce qu’une personne peut décider seule."
        ],
        example:"Problématique : pouvons-nous construire notre bonheur par nos choix alors que nous ne maîtrisons pas toutes les circonstances ? Plan possible : I. Nos décisions et nos habitudes comptent ; II. les circonstances extérieures peuvent nous limiter ; III. une recherche réaliste du bonheur associe action personnelle, relations et prise en compte du réel.",
        summary:"Éviter les réponses absolues : distinguer ce qui dépend de nos choix et ce qui échappe à notre contrôle.",
        question:"Quelle réponse est la plus nuancée ?",
        choices:["Tout dépend uniquement de la volonté","Rien ne dépend jamais de nous","Nos choix comptent, mais les circonstances jouent aussi un rôle"],
        answer:2, explanation:"Le bonheur est influencé à la fois par les choix personnels et par des circonstances que l’on ne contrôle pas entièrement."
      },
      {
        id:"term-philo-etat", level:"Terminale A1 / A2", subject:"Philosophie",
        title:"L’État limite-t-il ou protège-t-il la liberté ?",
        objective:"Comprendre la tension entre règles collectives, sécurité et libertés individuelles.",
        course:[
          "L’État établit des règles communes et organise des institutions destinées à assurer la vie collective.",
          "Les lois peuvent limiter certaines actions individuelles, notamment lorsqu’elles portent atteinte aux droits d’autrui.",
          "Le pouvoir de l’État doit aussi être encadré : des règles arbitraires ou abusives peuvent menacer les libertés qu’il devrait protéger."
        ],
        example:"Problématique : comment des institutions qui imposent des limites peuvent-elles en même temps protéger la liberté ? Plan possible : I. L’absence de règles peut exposer les personnes à la violence ; II. des règles communes protègent les droits ; III. le contrôle du pouvoir est nécessaire pour éviter l’arbitraire.",
        summary:"Analyser les deux fonctions possibles des règles publiques : organiser la liberté commune et risquer de la restreindre abusivement.",
        question:"Pourquoi le pouvoir de l’État doit-il être encadré ?",
        choices:["Pour empêcher toute règle commune","Pour réduire le risque d’arbitraire et protéger les droits","Pour rendre toutes les libertés inutiles"],
        answer:1, explanation:"Le contrôle du pouvoir contribue à prévenir les abus et à protéger les libertés."
      },
      {
        id:"term-francais-argumentation", level:"Terminale A / C / D", subject:"Français",
        title:"Construire un paragraphe argumentatif",
        objective:"Défendre une idée à l’aide d’un argument, d’une explication et d’un exemple.",
        course:["Une thèse est l’idée que l’on cherche à défendre ou à réfuter.","Un argument donne une raison en faveur de la thèse; l’explication montre pourquoi cette raison est valable.","Un exemple concret illustre l’argument. Les connecteurs logiques rendent le raisonnement lisible."],
        example:"Sujet : la lecture est-elle utile aux jeunes ? Thèse : la lecture enrichit la réflexion. Argument : elle expose le lecteur à des idées différentes. Explication : comparer des points de vue aide à mieux examiner ses propres opinions. Exemple : un roman peut amener à réfléchir aux conséquences d’une décision.",
        summary:"Un paragraphe solide présente une idée précise, la justifie, l’explique et l’illustre avant de passer à l’idée suivante.",
        question:"Quel élément explique pourquoi une raison soutient la thèse ?",
        choices:["Le titre seul","L’explication de l’argument","Une répétition de la thèse"], answer:1, explanation:"L’explication relie clairement l’argument à l’idée défendue."
      },
      {
        id:"term-anglais-present", level:"Collège / Lycée", subject:"Anglais",
        title:"Parler des habitudes au présent simple",
        objective:"Former des phrases affirmatives et négatives au présent simple.",
        course:["Le présent simple décrit notamment les habitudes, les faits généraux et les routines.","Avec he, she et it, le verbe prend généralement -s ou -es à la forme affirmative.","À la forme négative, on utilise do not/don’t ou does not/doesn’t, puis la base verbale."],
        example:"I study every evening. She studies every evening. They do not play on Monday. He doesn’t play on Monday.",
        summary:"Repérer le sujet, choisir la forme verbale adaptée et utiliser do/does pour les questions et les négations.",
        question:"Choisis la phrase correcte.",
        choices:["She study every day.","She studies every day.","She does studies every day."], answer:1, explanation:"À la troisième personne du singulier, on ajoute généralement -s au verbe à l’affirmatif."
      },
      {
        id:"term-histoire-colonisation", level:"3e / Terminale", subject:"Histoire-Géographie",
        title:"Comprendre les causes et les conséquences de la colonisation",
        objective:"Organiser une réponse historique en distinguant causes, acteurs et conséquences.",
        course:["L’étude historique distingue les causes économiques, politiques, stratégiques et idéologiques sans les confondre.","Une réponse structurée situe les faits dans le temps et identifie les acteurs et leurs intérêts.","Les conséquences peuvent être politiques, économiques, sociales et culturelles; elles doivent être expliquées à partir de faits précis."],
        example:"Pour analyser une situation coloniale, présenter d’abord le contexte et les intérêts des puissances, puis les formes de domination et enfin les conséquences pour les sociétés concernées. Éviter les affirmations générales sans exemple historique.",
        summary:"Une réponse historique doit être chronologique, contextualisée et appuyée sur des faits, en distinguant causes et conséquences.",
        question:"Que faut-il faire dans une analyse historique rigoureuse ?",
        choices:["Énumérer des dates sans expliquer","Distinguer le contexte, les acteurs, les causes et les conséquences","Remplacer les faits par des opinions"], answer:1, explanation:"Une analyse historique explique les événements en les replaçant dans leur contexte."
      },
      {
        id:"term-svt-ecosysteme", level:"Collège / Lycée", subject:"SVT",
        title:"Écosystème et équilibre du milieu",
        objective:"Identifier les êtres vivants, leur milieu et les relations alimentaires.",
        course:["Un écosystème associe un milieu physique et les êtres vivants qui y interagissent.","Une chaîne alimentaire représente un transfert de matière et d’énergie entre organismes.","Une modification d’une population ou du milieu peut avoir des effets sur plusieurs maillons du réseau alimentaire."],
        example:"Dans une prairie, l’herbe peut être consommée par un insecte herbivore, lui-même mangé par un oiseau. Si la végétation diminue fortement, les herbivores peuvent manquer de nourriture et les prédateurs être affectés à leur tour.",
        summary:"Décrire le milieu, identifier les organismes et expliquer les relations entre eux avant de conclure sur les conséquences d’un changement.",
        question:"Que représente une chaîne alimentaire ?",
        choices:["Une suite de relations alimentaires entre organismes","Une liste sans relation entre espèces","Uniquement les éléments minéraux du sol"], answer:0, explanation:"Une chaîne alimentaire montre qui est consommé par qui dans un milieu."
      },
      {
        id:"term-chimie-quantite", level:"Terminale C / D", subject:"Physique-Chimie",
        title:"Calculer une quantité de matière",
        objective:"Utiliser la relation entre masse, masse molaire et quantité de matière.",
        course:["La quantité de matière n s’exprime en mole (mol).","Pour un échantillon pur de masse m et de masse molaire M, n = m/M, avec des unités compatibles.","Vérifier les unités et convertir les grammes en kilogrammes seulement si la masse molaire est exprimée dans l’unité correspondante."],
        example:"Un échantillon contient 18 g d’eau. Avec M(H₂O) = 18 g·mol⁻¹, n = 18/18 = 1 mol.",
        summary:"Identifier m et M, vérifier que les unités concordent, puis appliquer n = m/M.",
        question:"Quelle quantité de matière correspond à 36 g d’une substance de masse molaire 18 g·mol⁻¹ ?",
        choices:["0,5 mol","2 mol","18 mol"], answer:1, explanation:"n = m/M = 36/18 = 2 mol."
      },
      {
        id:"term-economie-marche", level:"Terminale / Campus", subject:"Économie",
        title:"Comprendre l’offre et la demande",
        objective:"Expliquer comment l’offre, la demande et le prix interagissent sur un marché.",
        course:["La demande représente les quantités que les acheteurs souhaitent et peuvent acheter à différents prix.","L’offre représente les quantités que les vendeurs souhaitent et peuvent proposer à différents prix.","Le prix d’équilibre correspond, dans le modèle simple, au niveau où quantité offerte et quantité demandée sont égales."],
        example:"Si le prix d’un produit baisse, davantage d’acheteurs peuvent souhaiter l’acquérir, toutes choses égales par ailleurs. Si les vendeurs proposent peu de produits alors que la demande est élevée, une pression à la hausse sur le prix peut apparaître.",
        summary:"Préciser le marché étudié, distinguer offre et demande, puis expliquer comment un changement peut influencer le prix et la quantité échangée.",
        question:"Dans le modèle simple, que désigne le prix d’équilibre ?",
        choices:["Le prix choisi au hasard","Le prix où offre et demande se rencontrent","Le prix toujours le plus élevé"], answer:1, explanation:"L’équilibre correspond à l’égalité entre la quantité offerte et la quantité demandée."
      },
      {
        id:"term-informatique-algorithme", level:"Collège / Lycée / Campus", subject:"Informatique",
        title:"Concevoir un algorithme simple",
        objective:"Décomposer un problème en entrées, traitements et sorties.",
        course:["Les entrées sont les informations nécessaires au traitement.","Le traitement décrit les opérations à effectuer dans un ordre précis.","Les sorties sont les résultats attendus. Un test avec plusieurs exemples aide à repérer les erreurs."],
        example:"Objectif : calculer la moyenne de deux notes. Entrées : note1 et note2. Traitement : moyenne = (note1 + note2)/2. Sortie : afficher moyenne. Il faut vérifier que les notes reçues sont valides.",
        summary:"Décrire le problème, lister les entrées, ordonner les opérations, définir les sorties puis tester le résultat.",
        question:"Dans un algorithme, à quoi servent les entrées ?",
        choices:["À fournir les données utilisées","À afficher obligatoirement une image","À remplacer les calculs"], answer:0, explanation:"Les entrées fournissent les données sur lesquelles le traitement va travailler."
      },
      {
        id:"term-comptabilite-bilan", level:"Campus / Compétences", subject:"Comptabilité",
        title:"Comprendre le bilan comptable",
        objective:"Distinguer les ressources de l’entreprise et leur utilisation à une date donnée.",
        course:["Le bilan présente la situation patrimoniale d’une entité à une date déterminée.","L’actif décrit les biens et droits; le passif présente notamment les ressources et les obligations selon la présentation comptable utilisée.","Le bilan respecte l’égalité fondamentale entre total de l’actif et total du passif."],
        example:"Une entreprise possède du matériel pour 500 000 FCFA et de la trésorerie pour 200 000 FCFA. Son actif total est de 700 000 FCFA. Le bilan complet doit présenter au passif les ressources correspondantes pour le même total.",
        summary:"Le bilan est une photographie à une date précise. Identifier les éléments, les classer correctement et vérifier l’égalité des totaux.",
        question:"Que représente principalement le bilan ?",
        choices:["Uniquement les ventes du mois","La situation patrimoniale à une date donnée","Seulement les bénéfices futurs"], answer:1, explanation:"Le bilan présente les éléments patrimoniaux et les ressources à une date donnée."
      },
      {
        id:"six-maths-fractions", level:"6e / 5e", subject:"Mathématiques",
        title:"Additionner des fractions simples",
        objective:"Additionner des fractions de même dénominateur et simplifier le résultat.",
        course:["Une fraction a un numérateur (en haut) et un dénominateur (en bas, non nul). Pour additionner des fractions, il faut les exprimer avec un dénominateur commun.","Si les dénominateurs sont identiques, on additionne les numérateurs et on conserve le dénominateur : 2/7 + 3/7 = 5/7.","Si les dénominateurs diffèrent, on recherche un dénominateur commun. Par exemple, 1/2 = 3/6 et 1/3 = 2/6, donc 1/2 + 1/3 = 5/6."],
        example:"Calculons 3/4 + 1/8. Le dénominateur commun peut être 8 : 3/4 = 6/8. Donc 6/8 + 1/8 = 7/8. On ne calcule pas 3+1 sur 4+8.",
        summary:"Trouver un dénominateur commun, transformer les fractions, additionner les numérateurs puis simplifier si possible.",
        question:"Combien vaut 1/3 + 1/6 ?",
        choices:["2/9","1/2","2/6"], answer:1, explanation:"1/3 = 2/6, donc 2/6 + 1/6 = 3/6 = 1/2."
      },
      {
        id:"quatrieme-maths-pythagore", level:"4e / 3e", subject:"Mathématiques",
        title:"Utiliser le théorème de Pythagore",
        objective:"Calculer un côté d’un triangle rectangle à partir des deux autres.",
        course:["Dans un triangle rectangle, l’hypoténuse est le côté opposé à l’angle droit et c’est le plus long côté.","Le théorème de Pythagore affirme que le carré de l’hypoténuse est égal à la somme des carrés des deux autres côtés.","Avant d’appliquer la formule, identifier l’angle droit et l’hypoténuse."],
        example:"Un triangle ABC est rectangle en A, avec AB = 3 cm et AC = 4 cm. BC² = 3² + 4² = 9 + 16 = 25, donc BC = 5 cm.",
        summary:"Identifier l’hypoténuse, écrire l’égalité de Pythagore, remplacer les longueurs et prendre la racine carrée positive.",
        question:"Un triangle rectangle a des côtés de l’angle droit de 6 cm et 8 cm. Quelle est l’hypoténuse ?",
        choices:["10 cm","14 cm","100 cm"], answer:0, explanation:"c² = 6² + 8² = 36 + 64 = 100, donc c = 10 cm."
      },
      {
        id:"troisieme-francais-grammaire", level:"3e", subject:"Français",
        title:"Reconnaître les propositions dans une phrase complexe",
        objective:"Distinguer phrase simple, propositions indépendantes et proposition subordonnée.",
        course:["Une phrase simple contient généralement un seul verbe conjugué principal.","Une phrase complexe comporte plusieurs propositions, souvent repérables grâce aux verbes conjugués.","Une proposition subordonnée dépend d’une autre proposition et peut être introduite par un mot subordonnant comme que, quand, parce que ou lorsque."],
        example:"« Je rentre parce qu’il pleut » contient deux verbes conjugués : « rentre » et « pleut ». « Je rentre » est la principale; « parce qu’il pleut » exprime la cause.",
        summary:"Repérer les verbes conjugués, délimiter les propositions puis identifier le lien logique ou grammatical entre elles.",
        question:"Dans « Elle sourit quand elle arrive », quel mot introduit la subordonnée ?",
        choices:["Elle","quand","sourit"], answer:1, explanation:"« Quand » introduit la proposition subordonnée circonstancielle de temps."
      },
      {
        id:"troisieme-anglais-past", level:"3e / Lycée", subject:"Anglais",
        title:"Raconter un événement au prétérit",
        objective:"Utiliser le prétérit pour parler d’une action passée et terminée.",
        course:["Le prétérit simple décrit une action située dans le passé et considérée comme terminée.","Les verbes réguliers prennent généralement -ed; plusieurs verbes fréquents sont irréguliers et doivent être appris.","À la forme négative, on utilise did not/didn’t suivi de la base verbale."],
        example:"Yesterday, I visited my aunt. She went to the market. I did not stay long.",
        summary:"Repérer un marqueur de temps passé, choisir la forme du verbe et utiliser did pour la négation sans conjuguer une deuxième fois le verbe.",
        question:"Choisis la forme correcte : « Yesterday, he ___ to school. »",
        choices:["go","went","did went"], answer:1, explanation:"Le prétérit de « go » est « went »."
      },
      {
        id:"term-svt-digestion", level:"3e / Terminale D", subject:"SVT",
        title:"La digestion et l’absorption des nutriments",
        objective:"Expliquer la transformation des aliments et le passage des nutriments dans le sang.",
        course:["La digestion transforme les aliments en molécules plus simples grâce aux actions mécaniques et chimiques du tube digestif.","Les nutriments obtenus peuvent traverser la paroi de l’intestin grêle : c’est l’absorption intestinale.","Le sang transporte ensuite de nombreux nutriments vers les organes qui les utilisent."],
        example:"L’amidon est progressivement dégradé en sucres simples. Après leur absorption dans l’intestin grêle, ces nutriments passent dans la circulation et peuvent être utilisés par les cellules.",
        summary:"Distinguer aliments, nutriments, digestion et absorption, puis expliquer le trajet des nutriments vers les organes.",
        question:"Où se déroule l’essentiel de l’absorption des nutriments ?",
        choices:["Dans l’intestin grêle","Dans la bouche uniquement","Dans la trachée"], answer:0, explanation:"L’intestin grêle est le principal lieu d’absorption des nutriments."
      },
      {
        id:"term-geographie-population", level:"3e / Terminale", subject:"Histoire-Géographie",
        title:"Étudier la répartition de la population",
        objective:"Lire une répartition spatiale et expliquer les facteurs de concentration humaine.",
        course:["La densité de population correspond au nombre d’habitants rapporté à une superficie, généralement en habitants par km².","La population est souvent plus concentrée là où se trouvent des emplois, des services, des voies de transport ou des conditions favorables à l’habitat.","Une carte doit être lue avec son titre, sa légende, son échelle et sa date avant toute interprétation."],
        example:"Pour comparer deux régions, relever leur population et leur superficie, calculer ou lire la densité, puis expliquer les écarts en s’appuyant sur des éléments vérifiables comme les activités économiques et les infrastructures.",
        summary:"Décrire les données avant de les expliquer; distinguer ce que montre la carte et les hypothèses qui nécessitent d’autres informations.",
        question:"Comment calcule-t-on une densité de population ?",
        choices:["Superficie divisée par la population","Population divisée par la superficie","Population multipliée par la superficie"], answer:1, explanation:"Densité = population / superficie."
      },
      {
        id:"term-physique-electricite", level:"3e / Terminale C-D", subject:"Physique-Chimie",
        title:"Loi d’Ohm dans un circuit simple",
        objective:"Relier tension, résistance et intensité dans un conducteur ohmique.",
        course:["Pour un conducteur ohmique à température constante, la loi d’Ohm s’écrit U = R × I.","U se mesure en volts, R en ohms et I en ampères.","À partir de deux grandeurs connues, on peut calculer la troisième en transformant la relation."],
        example:"Une résistance de 6 Ω est traversée par un courant de 2 A. La tension vaut U = R × I = 6 × 2 = 12 V.",
        summary:"Identifier les grandeurs et leurs unités, choisir U = RI ou sa forme transformée, puis vérifier le résultat.",
        question:"Une résistance de 4 Ω est soumise à une tension de 12 V. Quelle intensité la traverse ?",
        choices:["3 A","8 A","48 A"], answer:0, explanation:"I = U/R = 12/4 = 3 A."
      },
      {
        id:"term-maths-pourcentage", level:"3e / Lycée", subject:"Mathématiques",
        title:"Calculer un pourcentage et une variation",
        objective:"Calculer une proportion et interpréter une augmentation ou une réduction.",
        course:["Pour calculer p % d’une quantité N, multiplier N par p/100.","Une augmentation de p % correspond à multiplier la valeur initiale par 1 + p/100.","Une réduction de p % correspond à multiplier la valeur initiale par 1 − p/100."],
        example:"Un article coûte 10 000 FCFA et bénéficie d’une réduction de 15 %. Réduction = 10 000 × 0,15 = 1 500 FCFA. Nouveau prix = 10 000 − 1 500 = 8 500 FCFA.",
        summary:"Transformer le pourcentage en nombre décimal, calculer la variation puis l’ajouter ou la retrancher selon la situation.",
        question:"Après une hausse de 10 %, un montant de 5 000 FCFA devient :",
        choices:["4 500 FCFA","5 100 FCFA","5 500 FCFA"], answer:2, explanation:"5 000 × 1,10 = 5 500 FCFA."
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

      {
        id:"primaire-maths-addition", level:"Primaire · CE2", subject:"Mathématiques",
        title:"Additionner des nombres entiers",
        objective:"Poser une addition et vérifier le résultat.",
        course:["Aligne les chiffres selon leur rang : unités sous unités, dizaines sous dizaines, centaines sous centaines.","Additionne en commençant par les unités. Si le résultat dépasse 9, reporte la dizaine à la colonne suivante.","Relis l’opération et vérifie le résultat avec une estimation."],
        example:"Une classe compte 128 cahiers puis reçoit 47 cahiers. 128 + 47 = 175 cahiers. On additionne 8 + 7 = 15, on écrit 5 et on retient 1 dizaine ; puis 2 + 4 + 1 = 7 dizaines et on garde 1 centaine.",
        summary:"Bien aligner les rangs, additionner colonne par colonne et penser aux retenues.",
        question:"Une école possède 236 livres et en reçoit 52. Combien de livres possède-t-elle maintenant ?",
        choices:["278 livres","288 livres","298 livres"],answer:1,explanation:"236 + 52 = 288 livres."
      },
      {
        id:"college-maths-equation", level:"Collège · 4e", subject:"Mathématiques",
        title:"Résoudre une équation du premier degré",
        objective:"Isoler l’inconnue en conservant l’égalité.",
        course:["Une équation est une égalité contenant une inconnue.","Pour isoler l’inconnue, effectue la même opération sur les deux membres de l’égalité.","Remplace la valeur trouvée dans l’équation de départ pour vérifier."],
        example:"Résoudre 3x + 5 = 20. On soustrait 5 : 3x = 15. On divise par 3 : x = 5. Vérification : 3 × 5 + 5 = 20.",
        summary:"Effectuer la même opération des deux côtés, isoler x puis vérifier.",
        question:"Résous 2x + 7 = 19.",
        choices:["x = 5","x = 6","x = 13"],answer:1,explanation:"Soustraire 7 donne 2x = 12, puis diviser par 2 donne x = 6."
      },
      {
        id:"lycee-francais-argumentation", level:"Terminale · Toutes séries", subject:"Français",
        title:"Construire un paragraphe argumentatif",
        objective:"Défendre une idée avec une justification et un exemple.",
        course:["Une thèse est l’idée que l’on défend.","Un argument explique pourquoi cette idée peut être acceptée.","Un exemple concret illustre l’argument ; une phrase de liaison aide à organiser le raisonnement."],
        example:"Thèse : la lecture aide à apprendre. Argument : elle enrichit le vocabulaire et développe la compréhension. Exemple : lire régulièrement des textes variés permet de rencontrer des mots nouveaux dans leur contexte.",
        summary:"Pour chaque idée, présente la thèse, explique l’argument et illustre-le par un exemple précis.",
        question:"Quel élément sert principalement à illustrer un argument ?",
        choices:["Un exemple concret","Le titre du devoir uniquement","Une répétition de la thèse"],answer:0,explanation:"Un exemple concret montre comment l’argument s’applique à une situation."
      },
      {
        id:"campus-droit-introduction", level:"Université · Licence 1", subject:"Droit",
        title:"Distinguer droit objectif et droits subjectifs",
        objective:"Comprendre deux notions fondamentales pour commencer l’étude du droit.",
        course:["Le droit objectif désigne l’ensemble des règles juridiques qui organisent la vie en société.","Les droits subjectifs sont les prérogatives reconnues à une personne par le droit, par exemple un droit de propriété.","Pour analyser une situation, il faut identifier la règle applicable et les droits dont les personnes peuvent se prévaloir."],
        example:"Une règle générale encadre la conclusion d’un contrat : elle relève du droit objectif. Le droit d’une personne de demander l’exécution d’un contrat valide peut constituer un droit subjectif.",
        summary:"Droit objectif : les règles. Droits subjectifs : les prérogatives reconnues aux personnes.",
        question:"Que désigne le droit objectif ?",
        choices:["Les préférences personnelles","L’ensemble des règles juridiques applicables dans la société","Uniquement le droit de propriété"],answer:1,explanation:"Le droit objectif regroupe les règles juridiques qui organisent la société."
      },
      {
        id:"campus-methodologie", level:"Université · Tous niveaux", subject:"Méthodologie universitaire",
        title:"Prendre des notes et préparer une fiche",
        objective:"Transformer un cours en notes utiles pour réviser.",
        course:["Repère les notions, définitions, raisonnements et exemples importants plutôt que recopier chaque phrase.","Après le cours, complète les notes et vérifie les notions que tu n’as pas comprises.","Fais une fiche structurée avec un titre, les idées principales, des exemples et quelques questions de révision."],
        example:"Pour une leçon de dix pages, prépare une fiche d’une page : cinq notions clés, trois questions et un résumé rédigé avec tes propres mots.",
        summary:"Écouter, sélectionner, clarifier puis synthétiser permet de réviser plus efficacement.",
        question:"Quel est l’objectif principal d’une fiche de révision ?",
        choices:["Recopier tout le cours sans tri","Organiser les idées essentielles pour les retrouver facilement","Remplacer tous les exercices"],answer:1,explanation:"Une fiche synthétise les notions essentielles pour faciliter la révision."
      },
      {
        id:"competences-bureautique-tableur", level:"Compétences pratiques", subject:"Bureautique",
        title:"Faire une somme dans un tableur",
        objective:"Comprendre comment totaliser une série de valeurs dans un tableur.",
        course:["Place les nombres dans une colonne ou une ligne et vérifie que chaque cellule contient une valeur numérique.","La fonction SOMME additionne les valeurs d’une plage de cellules.","Contrôle que la plage sélectionnée inclut toutes les cellules voulues et aucune donnée inutile."],
        example:"Si les montants se trouvent de B2 à B5, la formule =SOMME(B2:B5) calcule leur total dans un tableur configuré en français.",
        summary:"Sélectionne la plage exacte et utilise la fonction SOMME pour calculer un total.",
        question:"Dans un tableur en français, quelle formule additionne les cellules B2 à B5 ?",
        choices:["=MOYENNE(B2:B5)","=SOMME(B2:B5)","=NB(B2:B5)"],answer:1,explanation:"SOMME additionne les valeurs de la plage B2:B5 ; MOYENNE calcule une moyenne et NB compte les valeurs numériques."
      },
      {
        id:"competences-gestion-budget", level:"Compétences pratiques", subject:"Gestion et budget",
        title:"Calculer un solde simple",
        objective:"Distinguer recettes, dépenses et solde disponible.",
        course:["Les recettes sont les sommes reçues pendant une période.","Les dépenses sont les sommes utilisées pendant cette période.","Le solde simple se calcule en soustrayant les dépenses des recettes."],
        example:"Tu reçois 25 000 FCFA et dépenses 18 500 FCFA. Le solde restant est 25 000 − 18 500 = 6 500 FCFA.",
        summary:"Solde = recettes − dépenses, en comparant des montants de la même période.",
        question:"Une activité reçoit 40 000 FCFA et dépense 27 500 FCFA. Quel est son solde ?",
        choices:["12 500 FCFA","13 500 FCFA","67 500 FCFA"],answer:0,explanation:"40 000 − 27 500 = 12 500 FCFA."
      },
      {
        id:"competences-numerique-securite", level:"Compétences pratiques", subject:"Culture numérique",
        title:"Protéger ses comptes en ligne",
        objective:"Adopter des habitudes simples pour sécuriser ses accès numériques.",
        course:["Utilise un mot de passe long et différent pour chaque service important.","Active la vérification en deux étapes lorsqu’elle est proposée.","Ne partage jamais un code de validation et vérifie l’adresse du site avant de saisir tes identifiants."],
        example:"Un message te demande ton code reçu par SMS pour « débloquer ton compte ». Ne transmets pas ce code : ouvre toi-même l’application ou le site officiel pour vérifier la situation.",
        summary:"Mot de passe unique, double vérification et prudence face aux messages urgents.",
        question:"Que faire si une personne inconnue te demande le code de validation de ton compte ?",
        choices:["Lui envoyer le code rapidement","Ne pas partager le code et vérifier depuis le service officiel","Publier le code dans un groupe"],answer:1,explanation:"Un code de validation est confidentiel ; le partager peut permettre à quelqu’un de prendre le contrôle du compte."
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
          <label for="efl-search">Rechercher une leçon</label>
          <input id="efl-search" type="search" placeholder="Ex. : équation, dérivée, droit, bureautique…" autocomplete="off" aria-describedby="efl-search-help">
          <p id="efl-search-help" class="efl-search-help">Recherche par titre, matière, niveau ou mot-clé. Clique sur un résultat pour ouvrir la leçon.</p>
          <div id="efl-search-results" class="efl-search-results" aria-live="polite"></div>
          <label for="efl-unit">Ou choisir une fiche</label>
          <select id="efl-unit">${units.map(u=>`<option value="${u.id}">${u.level} — ${u.title}</option>`).join("")}</select>
          <div id="efl-content" aria-live="polite"></div>
        </div>
      </div>`;
    const style=document.createElement("style");
    style.textContent=`
      #educap-fiches-lecons .efl-panel{max-width:900px;margin:auto;padding:clamp(18px,3vw,28px);border:1px solid #dce7f8;border-radius:18px;background:#fff}
      #educap-fiches-lecons label{display:block;font-weight:700;margin:14px 0 7px}
      #educap-fiches-lecons select,#educap-fiches-lecons #efl-search{width:100%;min-height:46px;padding:10px 12px;border:1px solid #cbd9ed;border-radius:10px;font:inherit;background:#fff;color:#172642}
      #educap-fiches-lecons #efl-search:focus{outline:3px solid #d9e8ff;border-color:#1457d9}
      #educap-fiches-lecons .efl-search-help{margin:7px 0 12px;color:#617089;font-size:13px}
      #educap-fiches-lecons .efl-search-results{display:grid;gap:8px;margin:12px 0 18px}
      #educap-fiches-lecons .efl-search-result{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;padding:12px 14px;border:1px solid #dce6f5;border-radius:11px;background:#f8fbff;text-align:left;color:#172642;cursor:pointer}
      #educap-fiches-lecons .efl-search-result:hover,#educap-fiches-lecons .efl-search-result:focus{border-color:#1457d9;background:#eef5ff}
      #educap-fiches-lecons .efl-search-result strong{display:block}
      #educap-fiches-lecons .efl-search-result small{display:block;margin-top:3px;color:#617089}
      #educap-fiches-lecons .efl-search-empty{padding:13px;border-radius:10px;background:#fff7e6;color:#76521b;font-size:14px}
      #educap-fiches-lecons .efl-block{margin-top:16px;padding:16px;border-radius:12px;background:#f7faff;border:1px solid #e1eaf6}
      #educap-fiches-lecons .efl-block h3{margin:0 0 10px;font-size:18px}
      #educap-fiches-lecons li{margin:7px 0;line-height:1.55}
      #educap-fiches-lecons .efl-example{white-space:normal;line-height:1.7}
      #educap-fiches-lecons .efl-choices{display:grid;gap:8px;margin-top:12px}
      #educap-fiches-lecons .efl-choice{display:flex;gap:9px;align-items:flex-start;padding:11px;background:#fff;border:1px solid #dce5f1;border-radius:9px;cursor:pointer}
      #educap-fiches-lecons .efl-feedback{margin-top:12px;padding:12px;border-radius:9px;display:none}
      #educap-fiches-lecons .efl-feedback.visible{display:block}
      #educap-fiches-lecons .efl-action{margin-top:12px;border:0;border-radius:9px;padding:11px 16px;background:#1456a0;color:#fff;font-weight:700;cursor:pointer}
      #educap-fiches-lecons .efl-learning-path{padding:18px;border-radius:14px;background:#173a32;color:#fff;margin:18px 0}
      #educap-fiches-lecons .efl-path-top{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:12px;font-weight:800}
      #educap-fiches-lecons .efl-progress-track{height:7px;margin:12px 0;background:#47645c;border-radius:9px;overflow:hidden}
      #educap-fiches-lecons .efl-progress-track span{display:block;height:100%;background:#9ce4b9;border-radius:9px;transition:width .2s}
      #educap-fiches-lecons .efl-path-steps{display:flex;gap:12px;flex-wrap:wrap;font-size:12px;color:#c9d9d2}
      #educap-fiches-lecons .efl-path-steps .active{color:#a7efc1;font-weight:800}
      #educap-fiches-lecons .efl-lesson-header{border-color:#c5e5d0;background:#f2faf5}
      #educap-fiches-lecons .efl-lesson-tag{display:inline-block;margin-bottom:8px;color:#176b50;font-size:12px;font-weight:800}
      #educap-fiches-lecons .efl-lesson-navigation{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:16px}
      #educap-fiches-lecons .efl-lesson-navigation button{border:1px solid #d5e1dc;border-radius:9px;padding:10px 12px;background:#fff;color:#173a32;font:inherit;font-size:13px;font-weight:700;cursor:pointer}
      #educap-fiches-lecons .efl-lesson-navigation button:disabled{opacity:.4;cursor:not-allowed}
      #educap-fiches-lecons .efl-next{background:#16734f}
      #educap-fiches-lecons .efl-footnote{font-size:12px;color:#617089;margin-top:14px}
      @media(max-width:520px){#educap-fiches-lecons .efl-path-top{font-size:11px}#educap-fiches-lecons .efl-lesson-navigation button{flex:1}}

    `;
    document.head.appendChild(style);
    const hero=document.querySelector("#accueil");
    if(hero) hero.insertAdjacentElement("afterend",section);
    else {
      const registration=document.querySelector("#inscription");
      if(registration) registration.insertAdjacentElement("beforebegin",section);
      else document.querySelector("main")?.appendChild(section);
    }
    const selector=section.querySelector("#efl-unit");
    const panel=section.querySelector("#efl-content");
    const searchInput=section.querySelector("#efl-search");
    const searchResults=section.querySelector("#efl-search-results");
    const normalizeSearch=value=>String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("fr").trim();
    function updateSearch(){
      const query=normalizeSearch(searchInput.value);
      if(!query){searchResults.innerHTML="";return;}
      const words=query.split(/\s+/).filter(Boolean);
      const matches=units.filter(u=>{
        const haystack=normalizeSearch([u.title,u.subject,u.level,u.objective,...u.course,u.example,u.summary].join(" "));
        return words.every(word=>haystack.includes(word));
      }).slice(0,12);
      if(!matches.length){
        searchResults.innerHTML='<div class="efl-search-empty">Aucune leçon disponible ne correspond à cette recherche. Essaie un autre mot, une matière ou une classe.</div>';
        return;
      }
      searchResults.innerHTML=matches.map(u=>'<button type="button" class="efl-search-result" data-lesson-id="'+esc(u.id)+'"><span><strong>'+esc(u.title)+'</strong><small>'+esc(u.level)+' · '+esc(u.subject)+'</small></span><span aria-hidden="true">Ouvrir →</span></button>').join("");
    }
    searchInput.addEventListener("input",updateSearch);
    searchResults.addEventListener("click",event=>{
      const button=event.target.closest("[data-lesson-id]");
      if(!button)return;
      selector.value=button.dataset.lessonId;
      render();
      panel.scrollIntoView({behavior:"smooth",block:"start"});
    });
    const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    const globalSearch=document.querySelector("#edc-global-lesson-search");
    const globalResults=document.querySelector("#edc-global-search-results");
    if(globalSearch&&globalResults){
      const closeGlobalResults=()=>{globalResults.hidden=true;globalSearch.setAttribute("aria-expanded","false");};
      const renderGlobalResults=()=>{
        const query=normalizeSearch(globalSearch.value);
        if(!query){globalResults.innerHTML="";closeGlobalResults();return;}
        const words=query.split(/\s+/).filter(Boolean);
        const matches=units.filter(u=>{
          const haystack=normalizeSearch([u.title,u.subject,u.level,u.objective,...u.course,u.example,u.summary].join(" "));
          return words.every(word=>haystack.includes(word));
        }).slice(0,8);
        globalResults.innerHTML=matches.length?matches.map(u=>'<button type="button" role="option" data-global-lesson-id="'+esc(u.id)+'"><strong>'+esc(u.title)+'</strong><small>'+esc(u.level)+' · '+esc(u.subject)+'</small></button>').join(""):'<div class="edc-search-empty">Aucune leçon disponible pour cette recherche. Essaie un autre mot ou une autre matière.</div>';
        globalResults.hidden=false;
        globalSearch.setAttribute("aria-expanded","true");
      };
      globalSearch.addEventListener("input",renderGlobalResults);
      globalSearch.addEventListener("keydown",event=>{
        if(event.key==="Escape")closeGlobalResults();
        if(event.key==="Enter"){
          const first=globalResults.querySelector("[data-global-lesson-id]");
          if(first){event.preventDefault();first.click();}
        }
      });
      globalResults.addEventListener("click",event=>{
        const button=event.target.closest("[data-global-lesson-id]");
        if(!button)return;
        const lesson=units.find(u=>u.id===button.dataset.globalLessonId);
        if(!lesson)return;
        selector.value=lesson.id;
        render();
        closeGlobalResults();
        const sectionTop=section.getBoundingClientRect().top+window.scrollY-110;
        window.scrollTo({top:Math.max(0,sectionTop),behavior:"smooth"});
      });
      document.addEventListener("click",event=>{
        if(!event.target.closest(".edc-global-search"))closeGlobalResults();
      });
    }
    const completedLessons = new Set();
    function render(){
      const u=units.find(x=>x.id===selector.value);
      const currentIndex=units.findIndex(x=>x.id===u.id);
      const progress=Math.round((completedLessons.size/units.length)*100);
      panel.innerHTML=`
        <div class="efl-learning-path">
          <div class="efl-path-top"><span>TON PARCOURS D’APPRENTISSAGE</span><strong>${progress}% terminé</strong></div>
          <div class="efl-progress-track"><span style="width:${progress}%"></span></div>
          <div class="efl-path-steps"><span class="active">1. J’apprends</span><span>2. Je m’exerce</span><span>3. Je vérifie</span></div>
        </div>
        <div class="efl-block efl-lesson-header"><span class="efl-lesson-tag">${esc(u.level)} · ${esc(u.subject)}</span><h3>${esc(u.title)}</h3><p><strong>À la fin de cette leçon, tu dois pouvoir :</strong> ${esc(u.objective)}</p><p><strong>Avant de commencer :</strong> lis toute la situation et repère les mots ou notions que tu connais déjà.</p></div>
        <div class="efl-block"><h3>📘 1. Je découvre et je comprends</h3><p>Lis chaque idée lentement. Essaie de la reformuler avec tes propres mots avant de continuer.</p><ol>${u.course.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>
        <div class="efl-block"><h3>🧭 2. Je suis la démarche</h3><ol>${u.course.map(x=>`<li>${esc(x)}</li>`).join("")}<li>Vérifie que ta réponse répond bien à la question posée et que le résultat est cohérent.</li></ol><p class="efl-footnote">La démarche exacte dépend de la matière : justifie tes calculs en mathématiques, tes idées en français et philosophie, et tes observations dans les matières scientifiques.</p></div>
        <div class="efl-block"><h3>✍️ 3. Exemple expliqué et corrigé</h3><p class="efl-example">${esc(u.example)}</p><p><strong>À faire :</strong> cache la correction, essaie de refaire les étapes sur ton cahier, puis compare avec l’exemple.</p></div>
        <div class="efl-block"><h3>🧠 4. Ce que je dois retenir</h3><p>${esc(u.summary)}</p><p><strong>Auto-vérification :</strong> peux-tu expliquer la notion sans relire la leçon ? Peux-tu refaire l’exemple et expliquer pourquoi la méthode convient ?</p></div>
        <div class="efl-block efl-quiz"><h3>🎯 5. Je vérifie ce que j’ai compris</h3><p>${esc(u.question)}</p><div class="efl-choices">${u.choices.map((ch,i)=>`<label class="efl-choice"><input type="radio" name="efl-answer" value="${i}"><span>${esc(ch)}</span></label>`).join("")}</div><button class="efl-action" type="button" id="efl-check">Vérifier ma réponse</button><div id="efl-feedback" class="efl-feedback" role="status"></div><button class="efl-action efl-next" type="button" id="efl-next" hidden>Passer à la leçon suivante →</button><p class="efl-footnote">Cette fiche contient un exercice de vérification. Elle ne remplace pas une série complète d’exercices ni la progression officielle de la classe.</p></div>
        <div class="efl-lesson-navigation"><button type="button" id="efl-prev" ${currentIndex===0?"disabled":""}>← Leçon précédente</button><span>Leçon ${currentIndex+1} sur ${units.length}</span><button type="button" id="efl-next-nav" ${currentIndex===units.length-1?"disabled":""}>Leçon suivante →</button></div>
        <p class="efl-footnote">EduCap Afrique — apprendre, pratiquer et vérifier ses acquis.</p>`;
      panel.querySelector("#efl-check").addEventListener("click",()=>{
        const selected=panel.querySelector('input[name="efl-answer"]:checked');
        const feedback=panel.querySelector("#efl-feedback");
        feedback.classList.add("visible");
        if(!selected){feedback.textContent="Choisis une réponse avant de vérifier.";return;}
        const correct=Number(selected.value)===u.answer;
        feedback.textContent=(correct?"Bonne réponse ! Tu as validé cette étape. ":"Pas encore. Relis la leçon puis réessaie. ")+u.explanation;
        if(correct){completedLessons.add(u.id);const newProgress=Math.round((completedLessons.size/units.length)*100);panel.querySelector(".efl-path-top strong").textContent=newProgress+"% terminé";panel.querySelector(".efl-progress-track span").style.width=newProgress+"%";panel.querySelector("#efl-next").hidden=false;panel.querySelector(".efl-path-steps span:nth-child(2)").classList.add("active");panel.querySelector(".efl-path-steps span:nth-child(3)").classList.add("active");}
      });
      const goTo=index=>{if(index>=0&&index<units.length){selector.value=units[index].id;render();selector.scrollIntoView({behavior:"smooth",block:"start"});}};
      panel.querySelector("#efl-prev").addEventListener("click",()=>goTo(currentIndex-1));
      panel.querySelector("#efl-next-nav").addEventListener("click",()=>goTo(currentIndex+1));
      panel.querySelector("#efl-next").addEventListener("click",()=>goTo(currentIndex+1));
    }
    selector.addEventListener("change",render);
    render();
  });
})();