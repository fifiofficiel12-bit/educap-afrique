
"use strict";

// =====================================================
// EDUCAP AFRIQUE — CONFIGURATION SUPABASE
// =====================================================

const SUPABASE_URL = "https://byzsqblgsssymvsztaqb.supabase.co";

// Dans Supabase : Paramètres du projet > API Keys
// Copie la clé publique Publishable de CE projet.
const SUPABASE_PUBLIC_KEY = "REMPLACE_PAR_TA_CLE_SB_PUBLISHABLE";

document.addEventListener("DOMContentLoaded", () => {
  const afficherErreur = (message) => {
    const resultat = document.querySelector("#resultat-parcours");
    if (resultat) {
      resultat.textContent = message;
      resultat.style.color = "#b42318";
    }
  };

  const afficherMessage = (message, succes = false) => {
    const resultat = document.querySelector("#resultat-parcours");
    if (resultat) {
      resultat.textContent = message;
      resultat.style.color = succes ? "#16803c" : "#b42318";
    }
  };

  // Vérification des éléments nécessaires
  const domaine = document.querySelector("#domaine");
  const classe = document.querySelector("#classe");
  const serie = document.querySelector("#serie");
  const niveauCampus = document.querySelector("#niveau-campus");
  const domaineCampus = document.querySelector("#domaine-campus");
  const formation = document.querySelector("#formation");
  const formulaire = document.querySelector("#parcours-form");

  if (!formulaire) {
    console.error("EduCap Afrique : formulaire #parcours-form introuvable.");
    return;
  }

  // Vérification de la bibliothèque Supabase
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    afficherErreur(
      "La bibliothèque Supabase ne se charge pas. Vérifie son importation dans index.html."
    );
    return;
  }

  // Vérification de la configuration
  if (
    !SUPABASE_URL.startsWith("https://") ||
    !SUPABASE_PUBLIC_KEY.startsWith("sb_publishable_") ||
    SUPABASE_PUBLIC_KEY.includes("REMPLACE_PAR")
  ) {
    afficherErreur(
      "Configuration Supabase incomplète : ajoute la clé publique Publishable de ton projet."
    );
    return;
  }

  // Connexion à Supabase
  const clientSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY
  );

  // Afficher les champs selon le domaine sélectionné
  const actualiserChamps = () => {
    const valeur = domaine?.value || "";

    const blocScolaire = document.querySelector("#bloc-scolaire");
    const blocSerie = document.querySelector("#bloc-serie");
    const blocCampus = document.querySelector("#bloc-campus");
    const blocCompetences = document.querySelector("#bloc-competences");

    if (blocScolaire) {
      blocScolaire.hidden = valeur !== "scolaire";
    }

    if (blocSerie) {
      blocSerie.hidden = valeur !== "scolaire";
    }

    if (blocCampus) {
      blocCampus.hidden = valeur !== "campus";
    }

    if (blocCompetences) {
      blocCompetences.hidden = valeur !== "competences";
    }
  };

  domaine?.addEventListener("change", actualiserChamps);
  actualiserChamps();

  // Préparer et enregistrer le parcours
  formulaire.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bouton = formulaire.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (bouton) {
      bouton.disabled = true;
    }

    afficherMessage("Enregistrement de ton parcours en cours...", true);

    try {
      const domaineChoisi = domaine?.value?.trim() || "";

      if (!["scolaire", "campus", "competences"].includes(domaineChoisi)) {
        afficherErreur("Choisis un domaine avant de continuer.");
        return;
      }

      const donnees = {
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
          afficherErreur("Choisis ta classe.");
          return;
        }

        // Pour les classes concernées, la série doit être renseignée.
        const classesAvecSerie = [
          "2nde A",
          "2nde C",
          "Première A1",
          "Première A2",
          "Première C",
          "Première D",
          "Terminale A1",
          "Terminale A2",
          "Terminale C",
          "Terminale D"
        ];

        if (
          classesAvecSerie.includes(donnees.classe) &&
          !donnees.serie
        ) {
          afficherErreur("Choisis ta série pour continuer.");
          return;
        }
      }

      if (domaineChoisi === "campus") {
        donnees.niveau_campus =
          niveauCampus?.value?.trim() || null;

        donnees.domaine_campus =
          domaineCampus?.value?.trim() || null;

        if (!donnees.niveau_campus || !donnees.domaine_campus) {
          afficherErreur(
            "Choisis ton niveau universitaire et ton domaine d’études."
          );
          return;
        }
      }

      if (domaineChoisi === "competences") {
        donnees.formation = formation?.value?.trim() || null;

        if (!donnees.formation) {
          afficherErreur("Choisis la formation qui t’intéresse.");
          return;
        }
      }

      // INSERT sans SELECT : aucun besoin de lire la ligne après insertion.
      const { error } = await clientSupabase
        .from("parcours_apprenants")
        .insert([donnees]);

      if (error) {
        console.error("Erreur Supabase :", error);

        if (
          error.message?.toLowerCase().includes("invalid api key") ||
          error.message?.toLowerCase().includes("invalid jwt")
        ) {
          afficherErreur(
            "Clé API Supabase invalide. Vérifie que la clé Publishable provient du projet EduCap Afrique et remplace celle de app.js."
          );
        } else if (
          error.code === "42501" ||
          error.message?.toLowerCase().includes("row-level security")
        ) {
          afficherErreur(
            "Supabase refuse cet enregistrement à cause des autorisations de la table. La clé est reconnue, mais les règles d’accès doivent être vérifiées."
          );
        } else {
          afficherErreur(
            "Enregistrement impossible : " +
            (error.message || "erreur inconnue") +
            (error.code ? " (code " + error.code + ")" : "")
          );
        }

        return;
      }

      afficherMessage(
        "Ton parcours a bien été enregistré ! Tu peux continuer sur EduCap Afrique.",
        true
      );

      // Réinitialiser le formulaire et actualiser les champs
      formulaire.reset();
      actualiserChamps();

    } catch (erreur) {
      console.error("Erreur inattendue :", erreur);
      afficherErreur(
        "Une erreur de connexion est survenue. Vérifie ta connexion Internet et réessaie."
      );
    } finally {
      if (bouton) {
        bouton.disabled = false;
      }
    }
  });
});
