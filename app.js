
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const domaine = document.querySelector("#domaine");
  const classe = document.querySelector("#classe");
  const serie = document.querySelector("#serie");

  const blocScolaire = document.querySelector("#bloc-scolaire");
  const blocSerie = document.querySelector("#bloc-serie");
  const blocCampus = document.querySelector("#bloc-campus");
  const blocCompetences = document.querySelector("#bloc-competences");

  const formulaire = document.querySelector("#parcours-form");
  const resultat = document.querySelector("#resultat-parcours");

  if (!domaine || !formulaire || !resultat) return;

  const niveauCampus = document.querySelector("#niveau-campus");
  const domaineCampus = document.querySelector("#domaine-campus");
  const formation = document.querySelector("#formation");

  const seriesParClasse = {
    "2nde": ["A", "C"],
    "1ère": ["A1", "A2", "C", "D"],
    "Terminale": ["A1", "A2", "C", "D"]
  };

  const nomsDomaines = {
    scolaire: "EduCap Scolaire",
    campus: "EduCap Campus",
    competences: "EduCap Compétences"
  };

  function rendreObligatoire(champ, obligatoire) {
    if (champ) champ.required = obligatoire;
  }

  function masquerResultat() {
    resultat.hidden = true;
    resultat.replaceChildren();
  }

  function mettreAJourSeries() {
    if (!classe || !serie || !blocSerie) return;

    const anciennesValeurs = serie.value;
    const series = seriesParClasse[classe.value] || [];

    serie.replaceChildren(
      new Option("Sélectionne ta série", "")
    );

    series.forEach((nom) => {
      serie.add(new Option("Série " + nom, nom));
    });

    if (series.includes(anciennesValeurs)) {
      serie.value = anciennesValeurs;
    }

    const afficher =
      domaine.value === "scolaire" && series.length > 0;

    blocSerie.hidden = !afficher;
    rendreObligatoire(serie, afficher);

    if (!afficher) serie.value = "";
  }

  function mettreAJourDomaine() {
    const choix = domaine.value;

    blocScolaire.hidden = choix !== "scolaire";
    blocCampus.hidden = choix !== "campus";
    blocCompetences.hidden = choix !== "competences";

    rendreObligatoire(classe, choix === "scolaire");
    rendreObligatoire(niveauCampus, choix === "campus");
    rendreObligatoire(domaineCampus, choix === "campus");
    rendreObligatoire(formation, choix === "competences");

    mettreAJourSeries();
    masquerResultat();
  }

  function choisirDomaine(valeur) {
    domaine.value = valeur;
    mettreAJourDomaine();
  }

  domaine.addEventListener("change", mettreAJourDomaine);

  if (classe) {
    classe.addEventListener("change", () => {
      mettreAJourSeries();
      masquerResultat();
    });
  }

  if (serie) {
    serie.addEventListener("change", masquerResultat);
  }

  [niveauCampus, domaineCampus, formation].forEach((champ) => {
    if (champ) {
      champ.addEventListener("change", masquerResultat);
    }
  });

  document.querySelectorAll("[data-parcours]").forEach((lien) => {
    lien.addEventListener("click", () => {
      choisirDomaine(lien.dataset.parcours);
    });
  });

  formulaire.addEventListener("submit", (evenement) => {
    evenement.preventDefault();

    if (!formulaire.reportValidity()) return;

    const choix = domaine.value;
    const details = [];

    if (choix === "scolaire") {
      details.push("Classe : " + classe.value);

      if (!blocSerie.hidden) {
        details.push("Série : " + serie.value);
      }
    } else if (choix === "campus") {
      details.push("Niveau : " + niveauCampus.value);
      details.push("Domaine : " + domaineCampus.value);
    } else if (choix === "competences") {
      details.push("Formation : " + formation.value);
    }

    resultat.replaceChildren();

    const titre = document.createElement("h3");
    titre.textContent = "Ton parcours est préparé !";
    resultat.appendChild(titre);

    const nom = document.createElement("p");
    nom.textContent = nomsDomaines[choix];
    resultat.appendChild(nom);

    const liste = document.createElement("ul");

    details.forEach((detail) => {
      const element = document.createElement("li");
      element.textContent = detail;
      liste.appendChild(element);
    });

    resultat.appendChild(liste);

    const information = document.createElement("p");
    information.textContent =
      "Ta sélection est affichée sur cette page. " +
      "Elle n'est pas encore enregistrée dans un compte.";

    resultat.appendChild(information);
    resultat.hidden = false;

    resultat.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth",
      block: "nearest"
    });
  });

  // Navigation fluide vers les sections.
  document.querySelectorAll('a[href^="#"]').forEach((lien) => {
    lien.addEventListener("click", (evenement) => {
      const id = lien.getAttribute("href");
      if (!id || id === "#") return;

      const cible = document.querySelector(id);
      if (!cible) return;

      evenement.preventDefault();

      cible.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });

      history.replaceState(null, "", id);
    });
  });

  mettreAJourDomaine();

  console.info("EduCap Afrique : parcours initialisé.");
});
