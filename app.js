
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Navigation fluide entre les sections.
  document.querySelectorAll('a[href^="#"]').forEach((lien) => {
    lien.addEventListener("click", (evenement) => {
      const cibleId = lien.getAttribute("href");

      if (!cibleId || cibleId === "#") return;

      const cible = document.querySelector(cibleId);

      if (cible) {
        evenement.preventDefault();
        cible.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "start"
        });

        history.replaceState(null, "", cibleId);
      }
    });
  });

  // Afficher le parcours choisi sans prétendre inscrire l'utilisateur.
  const cartes = document.querySelectorAll(".card");

  cartes.forEach((carte) => {
    const titre = carte.querySelector("h3");
    const lien = carte.querySelector('a[href="#inscription"]');

    if (!titre || !lien) return;

    lien.addEventListener("click", () => {
      const parcours = titre.textContent.trim();

      try {
        sessionStorage.setItem("educap_parcours", parcours);
      } catch (erreur) {
        // La navigation reste utilisable si le stockage est bloqué.
      }
    });
  });

  // Préparer le message de sélection du parcours.
  const zoneInscription = document.querySelector("#inscription");

  if (zoneInscription) {
    let parcours = null;

    try {
      parcours = sessionStorage.getItem("educap_parcours");
    } catch (erreur) {
      // Le stockage de session peut être indisponible.
    }

    if (parcours) {
      const titre = zoneInscription.querySelector("h2");

      if (titre) {
        titre.textContent = "Ton parcours : " + parcours;
      }
    }
  }

  console.info(
    "EduCap Afrique est chargé. Les comptes et paiements ne sont pas activés."
  );
});
