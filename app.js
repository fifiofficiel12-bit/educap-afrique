
"use strict";

// =====================================================
// EDUCAP AFRIQUE — CONFIGURATION SUPABASE
// =====================================================

const SUPABASE_URL = "https://byzsqblgsssymvsztaqb.supabase.co";

// Clé publique fournie dans la conversation.
// Si elle est refusée, remplace-la par la clé Publishable
// complète copiée depuis le projet Supabase EduCap Afrique.
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
    console.error("Formulaire #parcours-form introuvable.");
    return;
  }

  if (
    !window.supabase ||
    typeof window.supabase.createClient !== "function"
  ) {
    afficherMessage(
      "La bibliothèque Supabase ne se charge pas. Vérifie index.html."
    );
    return;
  }

  if (
    !SUPABASE_URL.startsWith("https://") ||
    !SUPABASE_PUBLIC_KEY.startsWith("sb_publishable_")
  ) {
    afficherMessage("La configuration Supabase est incorrecte.");
    return;
  }

  const clientSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY
  );

  const actualiserChamps = () => {
    const valeur = domaine?.value || "";

    const blocScolaire = document.querySelector("#bloc-scolaire");
    const blocSerie = document.querySelector("#bloc-serie");
    const blocCampus = document.querySelector("#bloc-campus");
    const blocCompetences = document.querySelector("#bloc-competences");

    if (blocScolaire) blocScolaire.hidden = valeur !== "scolaire";
    if (blocSerie) blocSerie.hidden = valeur !== "scolaire";
    if (blocCampus) blocCampus.hidden = valeur !== "campus";
    if (blocCompetences) blocCompetences.hidden = valeur !== "competences";
  };

  domaine?.addEventListener("change", actualiserChamps);
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

        // Si une série est proposée dans le formulaire,
        // elle doit être choisie pour les classes concernées.
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

        if (classesAvecSerie.includes(donnees.classe) && !donnees.serie) {
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

        const messageErreur = (error.message || "").toLowerCase();

        if (
          messageErreur.includes("invalid api key") ||
          messageErreur.includes("invalid jwt") ||
          error.status === 401
        ) {
          afficherMessage(
            "Clé API refusée. Copie la clé Publishable complète du projet EduCap Afrique dans app.js, puis republie le site."
          );
        } else if (
          error.code === "42501" ||
          messageErreur.includes("row-level security")
        ) {
          afficherMessage(
            "Supabase refuse l’enregistrement à cause des autorisations de la table. La clé est reconnue, mais les règles d’accès doivent être vérifiées."
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
        "Ton parcours a bien été enregistré ! Tu peux continuer sur EduCap Afrique.",
        true
      );

      formulaire.reset();
      actualiserChamps();

    } catch (erreur) {
      console.error("Erreur inattendue :", erreur);
      afficherMessage(
        "Erreur de connexion. Vérifie Internet et réessaie."
      );
    } finally {
      if (bouton) bouton.disabled = false;
    }
  });
});
