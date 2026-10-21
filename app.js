"use strict";

// ==================================================
// 1. CONFIGURATION SUPABASE
// ==================================================

const SUPABASE_URL = "https://byzsqblgsssymvsztaqb.supabase.co/rest/v1/";
const SUPABASE_PUBLIC_KEY = "sb_publishable_iGibajCXvXeDMWK5g28Rqw_FjEagmwR";

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

  if (!domaine || !formulaire || !resultat) {
    console.error("EduCap Afrique : formulaire introuvable.");
    return;
  }

  const niveauCampus = document.querySelector("#niveau-campus");
  const domaineCampus = document.querySelector("#domaine-campus");
  const formation = document.querySelector("#formation");
  const bouton = formulaire.querySelector('button[type="submit"]');

  // Connexion à Supabase
  let supabaseClient = null;

  try {
    if (
      window.supabase &&
      typeof window.supabase.createClient === "function" &&
      SUPABASE_URL.startsWith("https://") &&
      SUPABASE_PUBLIC_KEY
    ) {
      supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLIC_KEY
      );
    }
  } catch (erreur) {
    console.error("Erreur d'initialisation Supabase :", erreur);
  }

  // Séries disponibles selon la classe
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

  function afficherMessage(titreTexte, messageTexte, erreur = false) {
    resultat.replaceChildren();

    const titre = document.createElement("h3");
    titre.textContent = titreTexte;

    const message = document.createElement("p");
    message.textContent = messageTexte;

    resultat.append(titre, message);
    resultat.style.background = erreur ? "#fff0f0" : "#eaf6ef";
    resultat.style.color = erreur ? "#9b1c1c" : "#075b46";
    resultat.hidden = false;

    resultat.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "nearest"
    });
  }

  // Actualiser les séries lorsque la classe change
  function mettreAJourSeries() {
    if (!classe || !serie || !blocSerie) return;

    const ancienneValeur = serie.value;
    const series = seriesParClasse[classe.value] || [];

    serie.replaceChildren(new Option("Sélectionne ta série", ""));

    series.forEach((nom) => {
      serie.add(new Option("Série " + nom, nom));
    });

    if (series.includes(ancienneValeur)) {
      serie.value = ancienneValeur;
    }

    const afficher =
      domaine.value === "scolaire" && series.length > 0;

    blocSerie.hidden = !afficher;
    rendreObligatoire(serie, afficher);

    if (!afficher) serie.value = "";
  }

  // Afficher les champs du domaine choisi
  function mettreAJourDomaine() {
    const choix = domaine.value;

    if (blocScolaire) {
      blocScolaire.hidden = choix !== "scolaire";
    }

    if (blocCampus) {
      blocCampus.hidden = choix !== "campus";
    }

    if (blocCompetences) {
      blocCompetences.hidden = choix !== "competences";
    }

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

  // Préparer les données du parcours
  function obtenirParcours() {
    const choix = domaine.value;

    const donnees = {
      domaine: choix,
      classe: null,
      serie: null,
      niveau_campus: null,
      domaine_campus: null,
      formation: null
    };

    const details = [];

    if (choix === "scolaire") {
      donnees.classe = classe.value;
      details.push("Classe : " + classe.value);

      if (blocSerie && !blocSerie.hidden) {
        donnees.serie = serie.value;
        details.push("Série : " + serie.value);
      }
    } else if (choix === "campus") {
      donnees.niveau_campus = niveauCampus.value;
      donnees.domaine_campus = domaineCampus.value;

      details.push("Niveau : " + niveauCampus.value);
      details.push("Domaine : " + domaineCampus.value);
    } else if (choix === "competences") {
      donnees.formation = formation.value;
      details.push("Formation : " + formation.value);
    }

    return { donnees, details, choix };
  }

  // Enregistrer le parcours dans Supabase
  formulaire.addEventListener("submit", async (evenement) => {
    evenement.preventDefault();

    if (!formulaire.reportValidity()) return;

    const { donnees, details, choix } = obtenirParcours();

    if (!nomsDomaines[choix]) {
      afficherMessage(
        "Choix invalide",
        "Sélectionne un domaine pour continuer.",
        true
      );
      return;
    }

    if (!supabaseClient) {
      afficherMessage(
        "Connexion indisponible",
        "Le client Supabase ne se charge pas. Vérifie que la bibliothèque Supabase est présente dans index.html et que les paramètres sont corrects.",
        true
      );
      return;
    }

    const texteBouton = bouton ? bouton.textContent : "";

    if (bouton) {
      bouton.disabled = true;
      bouton.textContent = "Enregistrement en cours...";
    }

    try {
      const { error } = await supabaseClient
        .from("parcours_apprenants")
        .insert([donnees]);

      if (error) {
        console.error("Erreur Supabase :", error);
        throw error;
      }

      resultat.replaceChildren();

      const titre = document.createElement("h3");
      titre.textContent = "Ton parcours est enregistré !";
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
        "Ton choix a été enregistré dans EduCap Afrique. " +
        "Cette étape ne crée pas encore de compte utilisateur.";

      resultat.appendChild(information);
      resultat.style.background = "#eaf6ef";
      resultat.style.color = "#075b46";
      resultat.hidden = false;

      resultat.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "nearest"
      });
    } catch (erreur) {
      console.error("Erreur d'enregistrement Supabase :", erreur);

      const detailErreur =
        erreur && erreur.message
          ? erreur.message
          : "Erreur inconnue. Consulte la console du navigateur.";

      afficherMessage(
        "Enregistrement impossible",
        "Détail : " + detailErreur,
        true
      );
    } finally {
      if (bouton) {
        bouton.disabled = false;
        bouton.textContent = texteBouton;
      }
    }
  });

  // Navigation fluide vers les sections
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

      history.replaceState(null, "", id);
    });
  });

  mettreAJourDomaine();

  console.info(
    supabaseClient
      ? "EduCap Afrique : client Supabase initialisé."
      : "EduCap Afrique : client Supabase indisponible."
  );
});
