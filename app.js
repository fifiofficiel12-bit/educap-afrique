
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Navigation fluide accessible.
  document.querySelectorAll('a[href^="#"]').forEach((lien) => {
    lien.addEventListener("click", (evenement) => {
      const id = lien.getAttribute("href");
      if (!id || id === "#") return;

      const cible = document.querySelector(id);
      if (!cible) return;

      evenement.preventDefault();
      cible.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      if (lien.dataset.parcours) {
        choisirDomaine(lien.dataset.parcours);
      }

      history.replaceState(null, "", id);
    });
  });

  const domaine = document.querySelector("#domaine");
  const classe = document.querySelector("#classe");
  const serie = document.querySelector("#serie");
  const blocScolaire = document.querySelector("#bloc-scolaire");
  const blocSerie = document.querySelector("#bloc-serie");
  const blocCampus = document.querySelector("#bloc-campus");
  const blocCompetences = document.querySelector("#bloc-competences");
  const formulaire = document.querySelector("#parcours-form");
  const resultat = document.querySelector("#resultat-parcours");

  if (!domaine || !formulaire) return;

  const champsOptionnels = [
    classe,
    serie,
    document.querySelector("#niveau-campus"),
    document.querySelector("#domaine-campus"),
    document.querySelector("#formation")
  ];

  function rendreObligatoire(champ, obligatoire) {
    if (!champ) return;
    champ.required = obligatoire;
  }

  function choisirDomaine(valeur) {
    domaine.value = valeur;
    mettreAJourDomaine();
    domaine.focus({ preventScroll: true });
  }

  function mettreAJourDomaine() {
    const choix = domaine.value;

    blocScolaire.hidden = choix !== "scolaire";
    blocCampus.hidden = choix !== "campus";
    blocCompetences.hidden = choix !== "competences";

    rendreObligatoire(classe, choix === "scolaire");
    rendreObligatoire(
      document.querySelector("#niveau-campus"),
      choix === "campus"
    );
    rendreObligatoire(
      document.querySelector("#domaine-campus"),
      choix === "campus"
    );
    rendreObligatoire(
      document.querySelector("#formation"),
      choix === "competences"
    );

    mettreAJourSeries();
    resultat.hidden = true;
  }

  function mettreAJourSeries() {
    const niveau = classe ? classe.value : "";
    const anciennesSeries = {
      "2nde": ["A", "C"],
      "1ère": ["A1", "A2", "C", "D"],
      "Terminale": ["A1", "A2", "C", "D"]
    };

    const series = anciennesSeries[niveau] || [];
    const optionActuelle = serie ? serie.value : "";

    if (serie) {
      serie.replaceChildren(new Option("Sélectionne ta série", ""));
      series.forEach((nom) => {
        serie.add(new Option("Série " + nom, nom));
      });

      if (series.includes(optionActuelle)) {
        serie.value = optionActuelle;
      }
    }

    const afficherSerie =
      domaine.value === "scolaire" && series.length > 0;

    blocSerie.hidden = !afficherSerie;
    rendreObligatoire(serie, afficherSerie);
  }

  domaine.addEventListener("change", mettreAJourDomaine);

  if (classe) {
    classe.addEventListener("change", mettreAJourSeries);
  }

  document.querySelectorAll("[data-parcours]").forEach((lien) => {
    lien.addEventListener("click", () => {
      choisirDomaine(lien.dataset.parcours);
    });
  });

  formulaire.addEventListener("submit", (evenement) => {
    evenement.preventDefault();

    if (!formulaire.reportValidity()) return;

    const choix = domaine.value;
    let details = [];

    if (choix === "scolaire") {
      details.push("Classe : " + classe.value);
      if (!blocSerie.hidden) {
        details.push("Série : " + serie.value);
      }
    } else if (choix === "campus") {
      details.push(
        "Niveau : " + document.querySelector("#niveau-campus").value
      );
      details.push(
        "Domaine : " + document.querySelector("#domaine-campus").value
      );
    } else if (choix === "competences") {
      details.push(
        "Formation : " + document.querySelector("#formation").value
      );
    }

    const noms = {
      scolaire: "EduCap Scolaire",
      campus: "EduCap Campus",
      competences: "EduCap Compétences"
    };

    resultat.replaceChildren();

    const titre = document.createElement("h3");
    titre.textContent = "Ton parcours est préparé !";
    resultat.appendChild(titre);

    const domaineTexte = document.createElement("p");
    domaineTexte.textContent = noms[choix];
    resultat.appendChild(domaineTexte);

    const liste = document.createElement("ul");
    details.forEach((detail) => {
      const element = document.createElement("li");
      element.textContent = detail;
      liste.appendChild(element);
    });
    resultat.appendChild(liste);

    const information = document.createElement("p");
    information.textContent =
      "Cette sélection est enregistrée uniquement dans cette page. " +
      "Aucun compte n'est créé et aucune donnée n'est envoyée à un serveur.";
    resultat.appendChild(information);

    resultat.hidden = false;
    resultat.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  mettreAJourDomaine();

  console.info(
    "EduCap Afrique : sélecteur de parcours chargé. " +
    "Les comptes et paiements ne sont pas activés."
  );
});
