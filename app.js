
"use strict";

const SUPABASE_URL = "https://byzsqblgsssymvsztaqb.supabase.co";
const SUPABASE_PUBLIC_KEY =
  "sb_publishable_iGibajCXvXeDMWK5g28Rqw_FjEagmwR";

document.addEventListener("DOMContentLoaded", () => {
  const domaine = document.querySelector("#domaine");
  const classe = document.querySelector("#classe");
  const serie = document.querySelector("#serie");
  const niveauCampus = document.querySelector("#niveau-campus");
  const domaineCampus = document.querySelector("#domaine-campus");
  const formation = document.querySelector("#formation");
  const formulaire = document.querySelector("#parcours-form");
  const resultat = document.querySelector("#resultat-parcours");

  const afficherMessage = (message, succes = false) => {
    if (!resultat) {
      console.log(message);
      return;
    }
    resultat.textContent = message;
    resultat.style.color = succes ? "#16803c" : "#b42318";
  };

  if (!formulaire) {
    console.error("Formulaire introuvable : #parcours-form");
    return;
  }

  if (!window.supabase?.createClient) {
    afficherMessage("La bibliothèque Supabase ne se charge pas.");
    return;
  }

  const clientSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY
  );

  // Séries proposées selon la classe choisie
  const seriesParClasse = {
    "2nde": ["A", "C"],
    "2nde A": ["A"],
    "2nde C": ["C"],
    "1ère": ["A1", "A2", "C", "D"],
    "Première": ["A1", "A2", "C", "D"],
    "Premiere": ["A1", "A2", "C", "D"],
    "Première A1": ["A1"],
    "Première A2": ["A2"],
    "Première C": ["C"],
    "Première D": ["D"],
    "Terminale": ["A1", "A2", "C", "D"],
    "Terminale A1": ["A1"],
    "Terminale A2": ["A2"],
    "Terminale C": ["C"],
    "Terminale D": ["D"]
  };

  const normaliser = (valeur) =>
    (valeur || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const actualiserSeries = () => {
    if (!classe || !serie) return;

    const ancienneSerie = serie.value;
    const classeChoisie = classe.value.trim();
    const classeNormalisee = normaliser(classeChoisie);

    const entree = Object.entries(seriesParClasse).find(
      ([nom]) => normaliser(nom) === classeNormalisee
    );

    const series = entree ? entree[1] : [];

    serie.replaceChildren();

    const optionDepart = document.createElement("option");
    optionDepart.value = "";
    optionDepart.textContent = series.length
      ? "Choisis ta série"
      : "Pas de série à choisir";
    serie.appendChild(optionDepart);

    series.forEach((nomSerie) => {
      const option = document.createElement("option");
      option.value = nomSerie;
      option.textContent = nomSerie;
      serie.appendChild(option);
    });

    if (series.includes(ancienneSerie)) {
      serie.value = ancienneSerie;
    }

    serie.required = series.length > 0;
    serie.disabled = series.length === 0;
  };

  const actualiserChamps = () => {
    const choix = domaine?.value || "";

    const blocScolaire = document.querySelector("#bloc-scolaire");
    const blocSerie = document.querySelector("#bloc-serie");
    const blocCampus = document.querySelector("#bloc-campus");
    const blocCompetences = document.querySelector("#bloc-competences");

    if (blocScolaire) blocScolaire.hidden = choix !== "scolaire";
    if (blocSerie) blocSerie.hidden = choix !== "scolaire";
    if (blocCampus) blocCampus.hidden = choix !== "campus";
    if (blocCompetences) blocCompetences.hidden = choix !== "competences";

    actualiserSeries();
  };

  domaine?.addEventListener("change", actualiserChamps);
  classe?.addEventListener("change", actualiserSeries);

  actualiserChamps();

  formulaire.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bouton = formulaire.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (bouton) bouton.disabled = true;

    try {
      afficherMessage("Enregistrement de ton parcours en cours...", true);

      const domaineChoisi = domaine?.value?.trim() || "";

      if (!["scolaire", "campus", "competences"].includes(domaineChoisi)) {
        afficherMessage("Choisis un domaine avant de continuer.");
        return;
      }

      const donnees = {
        id: crypto.randomUUID(),
        domaine: domaineChoisi,
        classe: null,
        serie: null,
        niveau_campus: null,
        domaine_campus: null,
        formation: null
      };

      if (domaineChoisi === "scolaire") {
        donnees.classe = classe?.value?.trim() || null;
        donnees.serie = serie?.value?.trim() || null;

        if (!donnees.classe) {
          afficherMessage("Choisis ta classe.");
          return;
        }

        const classeNormalisee = normaliser(donnees.classe);
        const entree = Object.entries(seriesParClasse).find(
          ([nom]) => normaliser(nom) === classeNormalisee
        );
        const seriesRequises = entree ? entree[1] : [];

        if (
          seriesRequises.length > 0 &&
          !seriesRequises.includes(donnees.serie)
        ) {
          afficherMessage("Choisis ta série pour continuer.");
          return;
        }
      }

      if (domaineChoisi === "campus") {
        donnees.niveau_campus = niveauCampus?.value?.trim() || null;
        donnees.domaine_campus = domaineCampus?.value?.trim() || null;

        if (!donnees.niveau_campus || !donnees.domaine_campus) {
          afficherMessage(
            "Choisis ton niveau universitaire et ton domaine d’études."
          );
          return;
        }
      }

      if (domaineChoisi === "competences") {
        donnees.formation = formation?.value?.trim() || null;

        if (!donnees.formation) {
          afficherMessage("Choisis la formation qui t’intéresse.");
          return;
        }
      }

      const { error } = await clientSupabase
        .from("parcours_apprenants")
        .insert([donnees]);

      if (error) {
        console.error("Erreur Supabase :", error);

        if (
          error.code === "42501" ||
          (error.message || "").toLowerCase().includes("row-level security")
        ) {
          afficherMessage(
            "Accès refusé par Supabase. Les autorisations de la table doivent être corrigées."
          );
        } else {
          afficherMessage(
            "Enregistrement impossible : " +
              (error.message || "erreur inconnue") +
              (error.code ? " (code " + error.code + ")" : "")
          );
        }
        return;
      }

      afficherMessage(
        "Ton parcours a bien été enregistré ! Bienvenue sur EduCap Afrique.",
        true
      );

      formulaire.reset();
      actualiserChamps();
    } catch (erreur) {
      console.error("Erreur inattendue :", erreur);
      afficherMessage("Erreur de connexion. Vérifie Internet et réessaie.");
    } finally {
      if (bouton) bouton.disabled = false;
    }
  });
});
