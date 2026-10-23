
"use strict";

const SUPABASE_URL = "https://byzsqblgsssymvsztaqb.supabase.co";
const SUPABASE_PUBLIC_KEY =
  "sb_publishable_iGibajCXvXeDMWK5g28Rqw_FjEagmwR";

document.addEventListener("DOMContentLoaded", () => {
  const pays = document.querySelector("#pays");
  const domaine = document.querySelector("#domaine");
  const classe = document.querySelector("#classe");
  const serie = document.querySelector("#serie");
  const niveauCampus = document.querySelector("#niveau-campus");
  const domaineCampus = document.querySelector("#domaine-campus");
  const etablissementCampus = document.querySelector("#etablissement-campus");
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
    resultat.hidden = false;
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

    const entree = pays?.value === "CI" ? Object.entries(seriesParClasse).find(
      ([nom]) => normaliser(nom) === classeNormalisee
    ) : null;

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

    const parcoursScolaireActif = domaine?.value === "scolaire";
    serie.required = parcoursScolaireActif && series.length > 0;
    serie.disabled = !parcoursScolaireActif || series.length === 0;
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

    if (classe) classe.required = choix === "scolaire";
    if (niveauCampus) niveauCampus.required = choix === "campus";
    if (domaineCampus) domaineCampus.required = choix === "campus";
    if (etablissementCampus) etablissementCampus.required = choix === "campus";
    if (formation) formation.required = choix === "competences";

    actualiserSeries();
  };

  domaine?.addEventListener("change", actualiserChamps);
  classe?.addEventListener("change", actualiserSeries);

  // Les raccourcis de parcours sélectionnent le bon formulaire et y amènent l'utilisateur.
  document.querySelectorAll("[data-choix-parcours]").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      const parcours = bouton.getAttribute("data-choix-parcours");
      if (domaine && ["scolaire", "campus", "competences"].includes(parcours)) {
        domaine.value = parcours;
        actualiserChamps();
        formulaire.scrollIntoView({ behavior: "smooth", block: "start" });
        const prochainChamp = parcours === "scolaire" ? pays
          : parcours === "campus" ? niveauCampus
          : formation;
        window.setTimeout(() => prochainChamp?.focus(), 250);
      }
    });
  });

  // Les cartes de la page sélectionnent directement le parcours correspondant.
  document.querySelectorAll("[data-parcours]").forEach((lien) => {
    lien.addEventListener("click", () => {
      const parcours = lien.getAttribute("data-parcours");
      if (domaine && ["scolaire", "campus", "competences"].includes(parcours)) {
        domaine.value = parcours;
        actualiserChamps();
      }
    });
  });

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

      const paysChoisi = pays?.value?.trim() || "";
      if (!paysChoisi) {
        afficherMessage("Choisis ton pays pour personnaliser ton parcours.");
        return;
      }

      const donnees = {
        // La colonne id est générée automatiquement par Supabase.
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
        const entree = paysChoisi === "CI" ? Object.entries(seriesParClasse).find(
          ([nom]) => normaliser(nom) === classeNormalisee
        ) : null;
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
        const etablissementChoisi = etablissementCampus?.value?.trim() || "";
        const filiereChoisie = domaineCampus?.value?.trim() || "";
        donnees.domaine_campus = etablissementChoisi && filiereChoisie
          ? etablissementChoisi + " — " + filiereChoisie
          : null;

        if (!donnees.niveau_campus || !etablissementChoisi || !filiereChoisie) {
          afficherMessage(
            "Choisis ton niveau, ton université ou école, puis ta filière ou ton concours."
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

      // Si l'apprenant est connecté, actualiser aussi le parcours de son compte.
      const { data: sessionInfo } = await clientSupabase.auth.getSession();
      const utilisateurConnecte = sessionInfo.session?.user;

      if (utilisateurConnecte) {
        const { error: erreurProfilParcours } = await clientSupabase
          .from("profiles")
          .update({
            pays: paysChoisi,
            parcours: domaineChoisi,
            classe: donnees.classe,
            serie: donnees.serie,
            niveau_campus: donnees.niveau_campus,
            domaine_campus: donnees.domaine_campus,
            formation: donnees.formation
          })
          .eq("id", utilisateurConnecte.id);

        if (erreurProfilParcours) {
          afficherMessage(
            "Le parcours a été choisi, mais ton profil n'a pas pu être actualisé : " +
              erreurProfilParcours.message
          );
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

  // Espace apprenant : authentification Supabase et accès aux cours publiés.
  const connexionForm = document.querySelector("#connexion-form");
  const inscriptionForm = document.querySelector("#inscription-form");
  const authForms = document.querySelector("#auth-forms");
  const authMessage = document.querySelector("#auth-message");
  const compteConnecte = document.querySelector("#compte-connecte");
  const compteBienvenue = document.querySelector("#compte-bienvenue");
  const listeCours = document.querySelector("#liste-cours");
  const deconnexionBouton = document.querySelector("#deconnexion-bouton");
  const espaceFormateur = document.querySelector("#espace-formateur");
  const coursForm = document.querySelector("#cours-form");
  const mesCoursFormateur = document.querySelector("#mes-cours-formateur");
  const espaceAdmin = document.querySelector("#espace-admin");
  const coursAValider = document.querySelector("#cours-a-valider");

  // Paiement annuel : le serveur Supabase valide la session et initie la transaction.
  const paiementForm = document.querySelector("#paiement-form");
  paiementForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const bouton = paiementForm.querySelector('button[type="submit"]');
    const message = document.querySelector("#paiement-message");
    const afficherPaiement = (texte, succes = false) => {
      if (!message) return;
      message.textContent = texte;
      message.style.color = succes ? "#16803c" : "#b42318";
      message.hidden = false;
    };
    if (bouton) bouton.disabled = true;
    try {
      const { data: sessionInfo, error: sessionError } = await clientSupabase.auth.getSession();
      const session = sessionInfo?.session;
      if (sessionError || !session) {
        afficherPaiement("Connecte-toi à ton compte avant de payer.");
        return;
      }
      const f = new FormData(paiementForm);
      const nomclient = String(f.get("nomclient") || "").trim();
      const numeroSend = String(f.get("numeroSend") || "").replace(/\s+/g, "");
      if (nomclient.length < 2 || !/^\+?[0-9]{8,15}$/.test(numeroSend)) {
        afficherPaiement("Vérifie ton nom complet et ton numéro Mobile Money.");
        return;
      }
      afficherPaiement("Vérification de la demande de paiement…", true);
      const response = await fetch(SUPABASE_URL + "/functions/v1/create-money-fusion-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_PUBLIC_KEY,
          "Authorization": "Bearer " + session.access_token
        },
        body: JSON.stringify({ nomclient, numeroSend })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.url) {
        afficherPaiement(payload.error || "Le paiement n'est pas disponible pour le moment. Aucun paiement n'a été lancé.");
        return;
      }
      const paiementUrl = new URL(payload.url);
      if (paiementUrl.protocol !== "https:" || !["payin.moneyfusion.net", "pay.moneyfusion.net"].includes(paiementUrl.hostname)) {
        afficherPaiement("Adresse de paiement non reconnue. Aucun paiement n'a été lancé.");
        return;
      }
      afficherPaiement("Redirection sécurisée vers le prestataire de paiement…", true);
      window.location.assign(paiementUrl.href);
    } catch (erreur) {
      console.error("Erreur de paiement :", erreur);
      afficherPaiement("Erreur de connexion. Vérifie Internet et réessaie.");
    } finally {
      if (bouton) bouton.disabled = false;
    }
  });



  const messageAuth = (message, succes = false) => {
    if (!authMessage) return;
    authMessage.textContent = message;
    authMessage.style.color = succes ? "#16803c" : "#b42318";
    authMessage.hidden = false;
  };

  // Vérifie le retour du prestataire sur le paiement précis du compte connecté.
  const verifierRetourPaiement = async (session) => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paiement") !== "retour") return;
    if (!session?.user?.id) {
      messageAuth("Retour du paiement reçu. Connecte-toi avec le même compte pour vérifier son état.");
      return;
    }
    const commande = params.get("commande") || "";
    if (!/^[0-9a-f-]{36}$/i.test(commande)) {
      messageAuth("Retour du prestataire reçu, mais la référence de paiement est absente. Consulte ton espace ou contacte le support avant de payer à nouveau.");
      return;
    }
    const { data: paiement, error } = await clientSupabase
      .from("payments")
      .select("status, amount, subscription_ends_at")
      .eq("id", commande)
      .eq("user_id", session.user.id)
      .maybeSingle();
    if (error || !paiement) {
      messageAuth("Impossible de vérifier cette transaction pour le moment. Ne paie pas une deuxième fois : actualise la page dans quelques instants.");
      return;
    }
    if (paiement.status === "paid" && Number(paiement.amount) === 750 &&
        paiement.subscription_ends_at && new Date(paiement.subscription_ends_at) > new Date()) {
      messageAuth("Paiement confirmé : ton abonnement annuel EduCap Afrique est actif.", true);
    } else if (paiement.status === "pending") {
      messageAuth("Paiement encore en attente de confirmation du prestataire. Actualise cette page dans quelques instants et ne relance pas un deuxième paiement.");
    } else {
      messageAuth("Le paiement n’est pas confirmé. Vérifie l’état de la transaction ou contacte le support avant de réessayer.");
    }
  };

  const formaterContenuCours = (contenu) => {
    const lignes = String(contenu || "").replace(/\r/g, "").split("\n");
    let html = "", paragraphe = [], liste = [];
    const fermerParagraphe = () => {
      if (paragraphe.length) { html += "<p>" + echapperHTML(paragraphe.join(" ")) + "</p>"; paragraphe = []; }
    };
    const fermerListe = () => {
      if (liste.length) { html += "<ul>" + liste.map(item => "<li>" + echapperHTML(item) + "</li>").join("") + "</ul>"; liste = []; }
    };
    lignes.forEach((ligne) => {
      const t = ligne.trim();
      if (!t) { fermerParagraphe(); fermerListe(); return; }
      const titre = t.match(/^(#{1,3})\s+(.+)$/) || t.match(/^((?:PARTIE|CHAPITRE|LEÇON|LECON|OBJECTIF|EXERCICE|CORRECTION|MÉTHODE|METHODE|INTRODUCTION|CONCLUSION)\b.*)$/i);
      if (titre) {
        fermerParagraphe(); fermerListe();
        const texte = Array.isArray(titre) && titre.length > 2 ? titre[2] : titre[1];
        html += "<h5>" + echapperHTML(texte.replace(/^#{1,3}\s+/, "")) + "</h5>";
      } else if (/^(?:[-*•]|\d+[.)])\s+/.test(t)) {
        fermerParagraphe(); liste.push(t.replace(/^(?:[-*•]|\d+[.)])\s+/, ""));
      } else {
        fermerListe(); paragraphe.push(t);
      }
    });
    fermerParagraphe(); fermerListe();
    return html || "<p>Le contenu détaillé de ce cours n’a pas encore été renseigné.</p>";
  };

  const boutonGenererPlan = document.querySelector("#generer-plan-cours");
  boutonGenererPlan?.addEventListener("click", () => {
    const sujet = document.querySelector("#prep-sujet")?.value.trim();
    const niveau = document.querySelector("#prep-niveau")?.value.trim();
    const duree = Number(document.querySelector("#prep-duree")?.value || 60);
    const type = document.querySelector("#prep-type")?.value || "decouverte";
    const resultatPlan = document.querySelector("#plan-cours-resultat");
    if (!sujet || !niveau) { messageAuth("Indique le sujet précis et le niveau des apprenants."); return; }
    const objectif = {
      decouverte: "Faire comprendre une notion et savoir l’expliquer.",
      revision: "Rappeler les notions clés, la méthode et les erreurs fréquentes.",
      pratique: "Appliquer les connaissances dans une situation concrète.",
      evaluation: "Mesurer les acquis, expliquer les erreurs et prévoir une remédiation."
    }[type];
    const minutes = (part) => Math.max(3, Math.round(duree * part));
    const plan = [
      "FICHE DE PRÉPARATION PÉDAGOGIQUE",
      "Sujet : " + sujet, "Niveau : " + niveau, "Durée : " + duree + " minutes", "",
      "1. OBJECTIFS", "- " + objectif, "- Définir les notions essentielles et les employer correctement.", "- Résoudre une tâche adaptée au niveau et justifier sa démarche.", "",
      "2. PRÉREQUIS", "- Identifier les connaissances nécessaires.", "- Poser une question diagnostique et reprendre les bases si nécessaire.", "",
      "3. MATÉRIEL ET RESSOURCES", "- Tableau, cahier, support et exercices adaptés.", "- Ajouter les références exactes du programme ou du manuel utilisé.", "",
      "4. DÉROULEMENT DE LA SÉANCE",
      "A. Mise en situation — " + minutes(0.10) + " min", "Présenter une question ou un exemple concret lié à " + sujet + " et faire exprimer les idées initiales.",
      "B. Explication progressive — " + minutes(0.35) + " min", "Définir les mots-clés, expliquer les idées étape par étape et vérifier la compréhension.",
      "C. Exemple corrigé par l’enseignant — " + minutes(0.20) + " min", "Énoncé : [ajouter un exemple]. Méthode : [expliquer le choix]. Étapes : [détailler le raisonnement]. Conclusion : [réponse et vérification].",
      "D. Exercices progressifs — " + minutes(0.25) + " min", "Exercice 1, application directe : [énoncé].", "Exercice 2, transfert ou difficulté supérieure : [énoncé].",
      "E. Vérification des acquis — " + minutes(0.10) + " min", "Poser une question de synthèse ou demander une explication avec les mots de l’apprenant.", "",
      "5. TRACE ÉCRITE À RETENIR", "- Définition et idée principale : [compléter].", "- Étapes ou méthode : [compléter].", "- Exemple de référence : [compléter et vérifier].", "- Erreurs fréquentes et prévention : [compléter].", "",
      "6. CORRIGÉ EXPLIQUÉ", "Pour chaque exercice, indiquer les données, la méthode, le raisonnement, la réponse finale et une vérification.", "",
      "7. DIFFÉRENCIATION", "- Soutien : exercice guidé pour les apprenants en difficulté.", "- Approfondissement : variante plus complexe.", "- Travail personnel : [consigne, durée et critères de réussite].", "",
      "8. BILAN DE L’ENSEIGNANT", "- Objectifs atteints ? Difficultés observées ? Notions à reprendre ?", "",
      "IMPORTANT : cette trame est un point de départ. Compléter les exemples, exercices, corrigés et références exactes avant la séance."
    ].join("\n");
    const titre = document.querySelector("#cours-titre");
    const matiere = document.querySelector("#cours-matiere");
    const description = document.querySelector("#cours-description");
    const contenu = document.querySelector("#cours-contenu");
    if (titre && !titre.value.trim()) titre.value = sujet;
    if (matiere && !matiere.value.trim()) matiere.value = sujet;
    if (description && !description.value.trim()) description.value = "Séance de " + duree + " minutes pour le niveau " + niveau + ", avec objectifs, explications, exercices et bilan.";
    if (contenu) contenu.value = plan;
    resultatPlan.hidden = false;
    resultatPlan.innerHTML = "<h5>Trame prête à compléter</h5><p>La préparation a été insérée dans le formulaire de cours. Complète le contenu disciplinaire et vérifie les réponses avant de l’enregistrer.</p><button type='button' class='btn btn-secondary' id='aller-formulaire-cours'>Compléter le cours</button>";
    resultatPlan.querySelector("#aller-formulaire-cours")?.addEventListener("click", () => {
      document.querySelector("#cours-form")?.scrollIntoView({behavior:"smooth",block:"start"});
      contenu?.focus();
    });
  });

  const echapperHTML = (valeur) => String(valeur ?? "").replace(/[&<>"']/g, (caractere) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[caractere]);

  const afficherCompte = async (session) => {
    if (!authForms || !compteConnecte) return;
    const utilisateur = session?.user;
    authForms.hidden = Boolean(utilisateur);
    compteConnecte.hidden = !utilisateur;
    if (!utilisateur) {
      if (listeCours) listeCours.replaceChildren();
      return;
    }

    const { data: profil, error: erreurProfil } = await clientSupabase
      .from("profiles")
      .select("full_name, role, pays, parcours, classe, serie, niveau_campus, domaine_campus, formation")
      .eq("id", utilisateur.id)
      .maybeSingle();

    if (erreurProfil) {
      messageAuth("Connecté, mais impossible de charger ton profil : " + erreurProfil.message);
      return;
    }

    const nom = profil?.full_name || utilisateur.email || "apprenant";
    const role = profil?.role || "apprenant";
    if (compteBienvenue) {
      const detailsParcours = profil?.parcours === "campus"
        ? [profil?.niveau_campus, profil?.domaine_campus].filter(Boolean).join(" · ")
        : profil?.parcours === "competences"
          ? (profil?.formation || "")
          : profil?.parcours === "scolaire"
            ? [profil?.classe, profil?.serie].filter(Boolean).join(" · ")
            : "";
      compteBienvenue.textContent = role === "admin"
        ? "Bienvenue " + nom + " — espace créateur. Aucun parcours apprenant ni paiement n’est requis pour administrer la plateforme."
        : "Bienvenue " + nom + " — espace " + role + "." +
          (profil?.pays ? " Pays : " + profil.pays + "." : "") +
          (detailsParcours ? " Ton parcours : " + detailsParcours + "." : " Choisis ton parcours pour personnaliser tes cours.");
    }
    if (espaceFormateur) espaceFormateur.hidden = !["formateur", "admin"].includes(role);
    if (espaceAdmin) espaceAdmin.hidden = role !== "admin";
    document.body.classList.toggle("is-admin", role === "admin");
    if (role === "admin") {
      const indicateurs = [
        ["admin-total-apprenants", () => clientSupabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "apprenant")],
        ["admin-total-formateurs", () => clientSupabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "formateur")],
        ["admin-total-publies", () => clientSupabase.from("courses").select("id", { count: "exact", head: true }).eq("published", true)],
        ["admin-total-attente", () => clientSupabase.from("courses").select("id", { count: "exact", head: true }).eq("published", false)],
        ["admin-total-inscriptions", () => clientSupabase.from("enrollments").select("id", { count: "exact", head: true })],
        ["admin-total-paiements", () => clientSupabase.from("payments").select("id", { count: "exact", head: true }).eq("status", "paid")]
      ];
      await Promise.all(indicateurs.map(async ([id, requete]) => {
        const cible = document.getElementById(id);
        if (!cible) return;
        try {
          const { count, error } = await requete();
          cible.textContent = error ? "—" : new Intl.NumberFormat("fr-FR").format(count || 0);
          if (error) console.warn("Indicateur administrateur indisponible :", id, error.message);
        } catch (_) { cible.textContent = "—"; }
      }));
    }
    if (!listeCours) return;
    listeCours.textContent = "Chargement des cours…";

    // Le catalogue ne contient que les métadonnées publiques, jamais le contenu complet.
    const { data: catalogue, error: erreurCours } = await clientSupabase
      .from("course_catalogue")
      .select("id, title, description, category, subject, classe, serie, pays, published, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (erreurCours) {
      listeCours.textContent = "Impossible de charger le catalogue : " + erreurCours.message;
      return;
    }

    // L'accès au contenu complet dépend exclusivement d'un abonnement confirmé côté base.
    const { data: paiementsActifs, error: erreurAbonnement } = await clientSupabase
      .from("payments")
      .select("subscription_ends_at")
      .eq("user_id", utilisateur.id)
      .eq("status", "paid")
      .gt("subscription_ends_at", new Date().toISOString())
      .limit(1);
    const abonnementActif = !erreurAbonnement && Boolean(paiementsActifs?.length);
    let contenusCours = [];
    if (abonnementActif || ["admin", "formateur"].includes(role)) {
      const { data: details, error: erreurDetails } = await clientSupabase
        .from("courses")
        .select("id, content")
        .eq("published", true);
      if (!erreurDetails) contenusCours = details || [];
    }
    const contenuParId = new Map(contenusCours.map(c => [c.id, c.content]));

    const { data: inscriptions, error: erreurInscriptions } = await clientSupabase
      .from("enrollments")
      .select("course_id")
      .eq("student_id", utilisateur.id);

    if (erreurInscriptions) {
      console.error("Erreur de chargement des inscriptions :", erreurInscriptions);
      listeCours.textContent =
        "Les cours sont chargés, mais tes inscriptions ne peuvent pas être vérifiées. Réessaie dans quelques instants.";
      messageAuth("Impossible de vérifier les cours déjà suivis. Aucune nouvelle inscription n’a été effectuée.");
      return;
    }

    const dejaInscrit = new Set((inscriptions || []).map((ligne) => ligne.course_id));

    const parcours = profil?.parcours || "scolaire";
    const classeProfil = profil?.classe || "";
    const serieProfil = profil?.serie || "";
    const cours = (catalogue || []).map(element => ({
      ...element,
      content: contenuParId.get(element.id) || null
    })).filter((element) => {
      if (element.category !== parcours) return false;
      if (element.pays && profil?.pays) {
        const paysCours = normaliser(element.pays).replace(/[’']/g, "");
        const paysProfil = normaliser(profil.pays).replace(/[’']/g, "");
        const memePays = paysCours === paysProfil ||
          (paysProfil === "ci" && paysCours === "cote divoire");
        if (!memePays) return false;
      }
      if (parcours === "scolaire") {
        if (element.classe && classeProfil && element.classe !== classeProfil) return false;
        if (element.serie && serieProfil && element.serie !== serieProfil) return false;
        if (element.classe && !classeProfil) return false;
        if (element.serie && !serieProfil) return false;
      }
      return true;
    });

    if (!cours.length) {
      listeCours.textContent = "Aucun cours publié ne correspond à ton parcours actuel (" +
        parcours + (classeProfil ? " · " + classeProfil : "") +
        (serieProfil ? " · " + serieProfil : "") +
        (profil?.domaine_campus ? " · " + profil.domaine_campus : "") +
        (profil?.formation ? " · " + profil.formation : "") +
        "). Tu peux rechoisir ton parcours avec le bouton « Rechoisir mon parcours ».";
      return;
    }

    listeCours.innerHTML = cours.map((element) => {
      const meta = [element.category, element.subject, element.classe, element.serie]
        .filter(Boolean).join(" · ");
      const inscrit = dejaInscrit.has(element.id);
      return `<article class="course-item">
        <p class="course-meta">${echapperHTML(meta || "Cours EduCap Afrique")}</p>
        <h4>${echapperHTML(element.title)}</h4>
        <p>${echapperHTML(element.description || "")}</p>
        ${(abonnementActif || ["admin", "formateur"].includes(role)) && element.content ? `<section class="lesson-preview"><h5>Leçon complète</h5><div class="lesson-content">${formaterContenuCours(element.content)}</div></section>` : abonnementActif ? `<p class="course-empty-note">Le contenu complet de cette leçon sera ajouté prochainement.</p>` : `<section class="course-empty-note"><strong>Aperçu gratuit.</strong><p>Le titre et la description sont accessibles gratuitement. L’accès à la leçon complète nécessite l’abonnement annuel à 750 FCFA.</p></section>`}
        ${abonnementActif ? `<button class="btn ${inscrit ? "btn-secondary" : "btn-primary"}" type="button" data-inscrire-cours="${echapperHTML(element.id)}" ${inscrit ? "disabled" : ""}>${inscrit ? "Déjà dans mes cours" : "Ajouter à mes cours"}</button>` : `<a class="btn btn-primary" href="#paiement-form">S’abonner — 750 FCFA/an</a>`}
      </article>`;
    }).join("");

    if (["formateur", "admin"].includes(role)) {
      const requeteBrouillons = clientSupabase.from("courses")
        .select("id, title, description, category, subject, classe, serie, content, pays, published, created_at, teacher_id")
        .order("created_at", { ascending: false });
      const { data: coursGeres, error: erreurGeres } = role === "admin"
        ? await requeteBrouillons
        : await requeteBrouillons.eq("teacher_id", utilisateur.id);
      if (erreurGeres) {
        if (mesCoursFormateur) mesCoursFormateur.textContent = "Impossible de charger tes cours.";
        if (coursAValider) coursAValider.textContent = "Impossible de charger les cours à valider.";
      } else {
        if (mesCoursFormateur) {
          const propres = (coursGeres || []).filter(c => role === "admin" || c.teacher_id === utilisateur.id || !c.published);
          mesCoursFormateur.innerHTML = propres.length ? propres.map(c => `<article class="course-item"><p class="course-meta">${echapperHTML(c.category || "Parcours non précisé")} · ${c.published ? "Publié" : "En attente / brouillon"}</p><h4>${echapperHTML(c.title)}</h4><p>${echapperHTML(c.description || "Aucune description renseignée.")}</p><details><summary>Lire le contenu complet</summary><div class="course-content-readable" style="white-space:pre-wrap;overflow-wrap:anywhere;padding:12px 0">${echapperHTML(c.content || "Aucun contenu détaillé n’a été renseigné pour ce cours.")}</div><p><strong>Matière / spécialité :</strong> ${echapperHTML(c.subject || "Non précisée")}</p><p><strong>Pays :</strong> ${echapperHTML(c.country || c.pays || "Non précisé")}</p><p><strong>Classe :</strong> ${echapperHTML(c.classe || "Toutes / non précisée")} · <strong>Série :</strong> ${echapperHTML(c.serie || "Non précisée")}</p><p><strong>Créé le :</strong> ${echapperHTML(c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : "Date non disponible")}</p></details></article>`).join("") : "<p>Aucun cours disponible dans la base pour le moment.</p>";
        }
        if (role === "admin" && coursAValider) {
          const aValider = (coursGeres || []).filter(c => !c.published);
          coursAValider.innerHTML = aValider.length ? aValider.map(c => `<article class="course-item"><p class="course-meta">${echapperHTML(c.category)} · À valider</p><h4>${echapperHTML(c.title)}</h4><p>${echapperHTML(c.description || "")}</p><details><summary>Lire le contenu</summary><p>${echapperHTML(c.content || "")}</p></details><button class="btn btn-primary" type="button" data-publier-cours="${echapperHTML(c.id)}">Valider et publier</button></article>`).join("") : "<p>Aucun cours en attente de validation.</p>";
          coursAValider.querySelectorAll("[data-publier-cours]").forEach(btn => btn.addEventListener("click", async () => {
            btn.disabled = true;
            const { error } = await clientSupabase.from("courses").update({ published: true }).eq("id", btn.dataset.publierCours);
            if (error) {
              messageAuth("Publication refusée : " + error.message);
              btn.disabled = false;
              return;
            }
            messageAuth("Cours publié et visible pour les apprenants.", true);
            await afficherCompte({ user: utilisateur });
          }));
        }
      }
    }

    listeCours.querySelectorAll("[data-inscrire-cours]").forEach((boutonCours) => {
      boutonCours.addEventListener("click", async () => {
        boutonCours.disabled = true;
        boutonCours.textContent = "Inscription en cours…";
        const { error } = await clientSupabase.from("enrollments").insert([{
          student_id: utilisateur.id,
          course_id: boutonCours.getAttribute("data-inscrire-cours")
        }]);
        if (error && error.code !== "23505") {
          console.error("Erreur d'inscription au cours :", error);
          messageAuth("Inscription au cours impossible. Vérifie ta connexion puis réessaie.");
          boutonCours.disabled = false;
          boutonCours.textContent = "Réessayer";
          return;
        }
        if (error?.code === "23505") {
          messageAuth("Tu es déjà inscrit à ce cours.", true);
        } else {
          messageAuth("Inscription enregistrée avec succès.", true);
        }
        await afficherCompte({ user: utilisateur });
      });
    });
  };

  connexionForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const bouton = connexionForm.querySelector('button[type="submit"]');
    if (bouton) bouton.disabled = true;
    try {
      const donneesForm = new FormData(connexionForm);
      const { data, error } = await clientSupabase.auth.signInWithPassword({
        email: String(donneesForm.get("email") || "").trim(),
        password: String(donneesForm.get("password") || "")
      });
      if (error) {
        messageAuth("Connexion impossible : vérifie ton adresse e-mail et ton mot de passe.");
        console.error("Erreur de connexion Supabase :", error.message);
        return;
      }
      const pendingReferralUser = localStorage.getItem("educap_pending_referral_user_id");
      const pendingReferralCode = localStorage.getItem("educap_pending_referral_code");
      if (pendingReferralUser && pendingReferralCode && pendingReferralUser === data.user?.id) {
        const { error: attributionError } = await clientSupabase.rpc("capture_affiliate_referral", { p_code: pendingReferralCode });
        if (!attributionError) {
          localStorage.removeItem("educap_pending_referral_user_id");
          localStorage.removeItem("educap_pending_referral_code");
        } else {
          console.warn("Attribution affiliée à finaliser :", attributionError.message);
        }
      }
      messageAuth("Connexion réussie.", true);
      await afficherCompte(data.session);
    } finally {
      if (bouton) bouton.disabled = false;
    }
  });

  inscriptionForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const bouton = inscriptionForm.querySelector('button[type="submit"]');
    if (bouton) bouton.disabled = true;
    try {
      const donneesForm = new FormData(inscriptionForm);
      const nom = String(donneesForm.get("full_name") || "").trim();
      const email = String(donneesForm.get("email") || "").trim();
      const password = String(donneesForm.get("password") || "");
      if (nom.length < 2) {
        messageAuth("Saisis ton nom complet.");
        return;
      }
      const { data, error } = await clientSupabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: nom } }
      });
      if (error) {
        messageAuth("Création du compte impossible : " + error.message);
        return;
      }
      const codeAffiliation = localStorage.getItem("educap_referral_code");
      if (codeAffiliation && data.user?.id) {
        localStorage.setItem("educap_pending_referral_user_id", data.user.id);
        localStorage.setItem("educap_pending_referral_code", codeAffiliation);
        if (data.session) {
          const { error: attributionError } = await clientSupabase.rpc("capture_affiliate_referral", { p_code: codeAffiliation });
          if (!attributionError) {
            localStorage.removeItem("educap_pending_referral_user_id");
            localStorage.removeItem("educap_pending_referral_code");
          } else {
            console.warn("Attribution affiliée à finaliser après connexion :", attributionError.message);
          }
        }
      }
      inscriptionForm.reset();
      if (data.session) {
        messageAuth("Ton compte est créé. Bienvenue sur EduCap Afrique !", true);
        await afficherCompte(data.session);
      } else {
        messageAuth("Compte créé. Consulte ta boîte e-mail pour confirmer ton adresse avant de te connecter.", true);
      }
    } finally {
      if (bouton) bouton.disabled = false;
    }
  });

  coursForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const bouton = coursForm.querySelector('button[type="submit"]');
    if (bouton) bouton.disabled = true;
    try {
      const f = new FormData(coursForm);
      const titre = String(f.get("title") || "").trim();
      const contenu = String(f.get("content") || "").trim();
      if (titre.length < 3 || contenu.length < 10) {
        messageAuth("Ajoute un titre et un contenu de cours suffisamment détaillé.");
        return;
      }
      const { data: sessionData } = await clientSupabase.auth.getSession();
      const utilisateur = sessionData.session?.user;
      if (!utilisateur) {
        messageAuth("Reconnecte-toi pour envoyer ton cours.");
        return;
      }
      const { error } = await clientSupabase.from("courses").insert([{
        title: titre,
        description: String(f.get("description") || "").trim() || null,
        category: String(f.get("category") || ""),
        pays: String(f.get("pays") || ""),
        subject: String(f.get("subject") || "").trim() || null,
        classe: String(f.get("classe") || "").trim() || null,
        serie: String(f.get("serie") || "").trim() || null,
        content: contenu,
        teacher_id: utilisateur.id,
        published: false
      }]);
      if (error) {
        messageAuth("Envoi impossible. Vérifie que ton compte a été autorisé comme formateur. " + error.message);
        return;
      }
      coursForm.reset();
      messageAuth("Cours envoyé. Il restera invisible aux apprenants jusqu'à sa validation.", true);
      await afficherCompte({ user: utilisateur });
    } catch (erreur) {
      console.error(erreur);
      messageAuth("Une erreur est survenue pendant l'envoi du cours.");
    } finally {
      if (bouton) bouton.disabled = false;
    }
  });

  deconnexionBouton?.addEventListener("click", async () => {
    deconnexionBouton.disabled = true;
    const { error } = await clientSupabase.auth.signOut();
    deconnexionBouton.disabled = false;
    if (error) {
      messageAuth("Déconnexion impossible : " + error.message);
      return;
    }
    messageAuth("Tu es déconnecté.", true);
    await afficherCompte(null);
  });

  if (connexionForm || inscriptionForm) {
    clientSupabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        messageAuth("Impossible de vérifier la session. Recharge la page.");
        return;
      }
      afficherCompte(data.session);
      verifierRetourPaiement(data.session);
    });
    clientSupabase.auth.onAuthStateChange((_evenement, session) => {
      afficherCompte(session);
      verifierRetourPaiement(session);
    });
  }

  // Assistant guidé : accompagne l'utilisateur sans demander ni lire son mot de passe.
  const assistantToggle = document.querySelector("#assistant-toggle");
  const assistantPanneau = document.querySelector("#assistant-panneau");
  const assistantFermer = document.querySelector("#assistant-fermer");
  const assistantMessages = document.querySelector("#assistant-messages");
  const assistantChoix = document.querySelector("#assistant-choix");
  const assistantParcours = document.querySelector("#parcours-form");
  const assistantInscription = document.querySelector("#inscription-form");

  const assistantDire = (texte, auteur = "bot") => {
    if (!assistantMessages) return;
    const bulle = document.createElement("p");
    bulle.className = "assistant-bulle " + (auteur === "user" ? "assistant-user" : "assistant-bot");
    bulle.textContent = texte;
    assistantMessages.appendChild(bulle);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
  };

  const assistantBoutons = (choix) => {
    if (!assistantChoix) return;
    assistantChoix.replaceChildren();
    choix.forEach(({ texte, action }) => {
      const bouton = document.createElement("button");
      bouton.type = "button";
      bouton.textContent = texte;
      bouton.dataset.assistantAction = action;
      assistantChoix.appendChild(bouton);
    });
  };

  const assistantOuvrir = () => {
    if (!assistantPanneau) return;
    assistantPanneau.hidden = false;
    assistantToggle?.setAttribute("aria-expanded", "true");
  };
  const assistantFermerPanneau = () => {
    if (!assistantPanneau) return;
    assistantPanneau.hidden = true;
    assistantToggle?.setAttribute("aria-expanded", "false");
  };

  const assistantChoisirParcours = (parcours) => {
    if (domaine && ["scolaire", "campus", "competences"].includes(parcours)) {
      // Formation est visible dans l'interface; le parcours complet sera finalisé dans le formulaire.
      domaine.value = parcours;
      actualiserChamps();
      assistantParcours?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const assistantAction = (action) => {
    if (action === "start") {
      assistantDire("Oui, m'accompagner", "user");
      assistantDire("Bienvenue sur EduCap Afrique ! 😊 Que tu sois déjà en formation, que tu souhaites poursuivre ton parcours, découvrir un nouveau domaine ou commencer quelque chose de nouveau, je suis là pour t’accompagner. Choisis simplement le parcours qui te correspond le mieux.");
      assistantBoutons([
        { texte: "Je suis élève (Scolaire)", action: "pick-scolaire" },
        { texte: "Je suis étudiant (Campus)", action: "pick-campus" },
        { texte: "Je veux des compétences pratiques", action: "pick-competences" },
        { texte: "Je souhaite suivre un parcours Formation", action: "pick-formation" }
      ]);
    } else if (action.startsWith("pick-")) {
      const parcours = action.slice(5);
      assistantChoisirParcours(parcours);
      assistantDire(({scolaire:"Scolaire",campus:"Campus",competences:"Compétences",formation:"Formation"})[parcours] || parcours, "user");
      assistantDire("Très bien, avançons ensemble ! 😊 Étape 2 sur 3 : complète le formulaire affiché. Choisis ton pays puis les informations demandées. Que tu sois débutant ou déjà engagé dans un parcours, tu es le bienvenu. Je peux te guider, sans te demander de partager ici tes informations personnelles.");
      assistantBoutons([
        { texte: "M'aider à compléter le parcours", action: "help-parcours" },
        { texte: "J'ai terminé le parcours", action: "done-parcours" },
        { texte: "Aller à la création du compte", action: "go-register" }
      ]);
    } else if (action === "help-parcours") {
      assistantDire("Pour Scolaire : pays, classe et série si elle est proposée. Pour Campus : pays, niveau, établissement et filière. Pour Compétences : choisis une compétence. Pour Formation : le formulaire distinct doit encore être finalisé. Ne partage ici aucun mot de passe ni donnée bancaire.");
      assistantBoutons([
        { texte: "Retour au formulaire", action: "back-parcours" },
        { texte: "Aller à la création du compte", action: "go-register" }
      ]);
    } else if (action === "back-parcours") {
      assistantParcours?.scrollIntoView({ behavior: "smooth", block: "start" });
      assistantDire("Complète les champs visibles, puis clique sur « Enregistrer mon parcours ». Si un message d'erreur apparaît, suis son indication.");
      assistantBoutons([
        { texte: "J'ai terminé le parcours", action: "done-parcours" },
        { texte: "Besoin d'aide", action: "help-parcours" }
      ]);
    } else if (action === "done-parcours") {
      assistantDire("Vérifie que le site affiche « Ton parcours a bien été enregistré ». Si c'est le cas, passe à la création du compte.");
      assistantBoutons([
        { texte: "Créer mon compte", action: "go-register" },
        { texte: "Revoir mon parcours", action: "back-parcours" }
      ]);
    } else if (action === "go-register") {
      document.querySelector("#espace-personnel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      assistantInscription?.scrollIntoView({ behavior: "smooth", block: "center" });
      assistantDire("Étape 3 sur 3 : dans « Je crée mon compte », saisis ton nom, ton e-mail et choisis un mot de passe d'au moins 8 caractères. Puis clique sur « Créer mon compte apprenant ». Le mot de passe reste dans le formulaire sécurisé du site : ne me l'envoie jamais.");
      assistantBoutons([
        { texte: "J'ai créé mon compte", action: "account-done" },
        { texte: "J'ai déjà un compte", action: "login" },
        { texte: "Aide pour l'e-mail de confirmation", action: "email-help" }
      ]);
    } else if (action === "account-done") {
      assistantDire("Bravo ! Vérifie le message affiché par le site. Si une confirmation par e-mail est demandée, ouvre le message reçu et confirme ton adresse. Ensuite, connecte-toi pour accéder à ton espace.");
      assistantBoutons([
        { texte: "Aller à la connexion", action: "login" },
        { texte: "Rester sur cette page", action: "start" }
      ]);
    } else if (action === "login") {
      document.querySelector("#connexion-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.querySelector("#connexion-email")?.focus({ preventScroll: true });
      assistantDire("Saisis ton e-mail et ton mot de passe directement dans le formulaire « J'ai déjà un compte », puis clique sur « Me connecter ».");
      assistantBoutons([{ texte: "Compris", action: "account-done" }]);
    } else if (action === "email-help") {
      assistantDire("Vérifie la boîte de réception et les courriers indésirables. Ouvre le message de confirmation et utilise son lien. Si aucun message n'arrive, vérifie que l'adresse e-mail est correcte.");
      assistantBoutons([
        { texte: "Retour à la création du compte", action: "go-register" },
        { texte: "Aller à la connexion", action: "login" }
      ]);
    }
  };

  assistantToggle?.addEventListener("click", () => {
    if (assistantPanneau?.hidden) assistantOuvrir();
    else assistantFermerPanneau();
  });
  assistantFermer?.addEventListener("click", assistantFermerPanneau);
  assistantChoix?.addEventListener("click", (event) => {
    const bouton = event.target.closest("[data-assistant-action]");
    if (bouton) assistantAction(bouton.dataset.assistantAction);
  });

});


// ============================================================
// PROFESSEUR IA EDUCAP — dialogue écrit et vocal
// L'IA réelle passe par une fonction serveur, jamais directement par le navigateur.
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#professeur-ia")) return;
  const section = document.createElement("section");
  section.id = "professeur-ia";
  section.className = "section";
  section.innerHTML = `
    <div class="container">
      <div class="welcome-panel prof-ia-panel">
        <span class="eyebrow">🎓 Mentor EduCap · accompagnement pédagogique</span>
        <h2 id="professeur-ia-titre">Ton professeur particulier</h2>
        <p>Pose ta question directement ici, écris ou dicte ta réponse, puis progresse étape par étape. Le service de dialogue nécessite une connexion à ton compte et la disponibilité du service IA.</p>
        <div class="prof-ia-grid">
          <label>Ton niveau
            <input id="prof-ia-niveau" maxlength="100" placeholder="Ex. Terminale D, Licence 1" />
          </label>
          <label>Matière ou compétence
            <input id="prof-ia-matiere" maxlength="120" placeholder="Ex. mathématiques, philosophie, Excel" />
          </label>
          <label>Ton objectif
            <select id="prof-ia-objectif">
              <option value="comprendre">Comprendre une notion</option>
              <option value="exercice">Faire un exercice avec des indices</option>
              <option value="revision">Réviser pour un examen</option>
              <option value="oral">M'entraîner à l'oral</option>
            </select>
          </label>
        </div>
        <div id="prof-ia-conversation" class="prof-ia-conversation" role="log" aria-live="polite">
          <div class="prof-ia-bulle prof-ia-bot">Bonjour ! Je suis ton professeur EduCap. Dis-moi ce que tu veux apprendre. Nous avancerons ensemble : une explication, une question, puis un exercice adapté à tes réponses.</div>
        </div>
        <form id="prof-ia-form" class="prof-ia-form">
          <label for="prof-ia-message">Ta question ou ta réponse</label>
          <textarea id="prof-ia-message" rows="3" maxlength="2500" required placeholder="Écris ici, ou appuie sur le micro pour parler…"></textarea>
          <div class="prof-ia-actions">
            <button class="btn btn-primary" type="submit" id="prof-ia-envoyer">Envoyer au professeur</button>
            <button class="btn btn-secondary" type="button" id="prof-ia-micro">🎙️ Parler</button>
            <button class="btn btn-secondary" type="button" id="prof-ia-lire">🔊 Lire la réponse</button>
            <button class="btn btn-secondary" type="button" id="prof-ia-effacer">Nouvelle séance</button>
          </div>
          <p id="prof-ia-statut" class="muted" aria-live="polite">La conversation sera adaptée à ton niveau. La voix dépend des fonctions disponibles sur ton appareil.</p>
        </form>
      </div>
    </div>`;
  const coach = document.querySelector("#coach-intelligent");
  if (coach?.parentNode) coach.parentNode.insertBefore(section, coach);
  else document.querySelector("main")?.appendChild(section);

  const style = document.createElement("style");
  style.textContent = `
    .prof-ia-panel{max-width:960px;margin:auto}.prof-ia-panel h2{font-size:clamp(28px,4vw,38px);margin:12px 0}
    .prof-ia-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:20px 0}
    .prof-ia-grid label,.prof-ia-form label{display:grid;gap:7px;font-weight:700;font-size:14px}
    .prof-ia-grid input,.prof-ia-grid select,.prof-ia-form textarea{box-sizing:border-box;width:100%;min-height:46px;padding:11px;border:1px solid #ccd8e8;border-radius:10px;background:#fff;font:inherit}
    .prof-ia-conversation{height:320px;overflow:auto;background:#f5f8fd;border:1px solid #dce5f2;border-radius:14px;padding:14px;margin:18px 0;display:flex;flex-direction:column;gap:10px}
    .prof-ia-bulle{max-width:88%;padding:12px 14px;border-radius:14px;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.5}
    .prof-ia-bot{align-self:flex-start;background:#fff;border:1px solid #dce5f2}.prof-ia-user{align-self:flex-end;background:#dceaff;color:#16345f}
    .prof-ia-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:12px}.prof-ia-actions button{min-height:44px}
    @media(max-width:700px){.prof-ia-grid{grid-template-columns:1fr}.prof-ia-bulle{max-width:96%}.prof-ia-actions{display:grid;grid-template-columns:1fr 1fr}.prof-ia-actions button{width:100%}}
  `;
  document.head.appendChild(style);

  const conversation = document.querySelector("#prof-ia-conversation");
  const input = document.querySelector("#prof-ia-message");
  const status = document.querySelector("#prof-ia-statut");
  const sendButton = document.querySelector("#prof-ia-envoyer");
  const history = [];
  let lastAnswer = "";
  const sayStatus = (s) => { status.textContent = s; };
  const addBubble = (text, who) => {
    const bubble = document.createElement("div");
    bubble.className = "prof-ia-bulle " + (who === "user" ? "prof-ia-user" : "prof-ia-bot");
    bubble.textContent = text;
    conversation.appendChild(bubble);
    conversation.scrollTop = conversation.scrollHeight;
  };
  const readAloud = (text) => {
    if (!("speechSynthesis" in window)) { sayStatus("La lecture vocale n'est pas disponible sur cet appareil."); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  document.querySelector("#prof-ia-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    const niveau = document.querySelector("#prof-ia-niveau").value.trim();
    const matiere = document.querySelector("#prof-ia-matiere").value.trim();
    const objectif = document.querySelector("#prof-ia-objectif").value;
    addBubble(message, "user");
    history.push({ role: "user", content: message });
    input.value = "";
    sendButton.disabled = true;
    sayStatus("Ton professeur prépare une explication adaptée…");
    try {
      const { data: sessionData, error: sessionError } = await window.supabase.createClient(
        "https://byzsqblgsssymvsztaqb.supabase.co",
        "sb_publishable_iGibajCXvXeDMWK5g28Rqw_FjEagmwR"
      ).auth.getSession();
      if (sessionError || !sessionData?.session) {
        history.pop();
        addBubble("Pour démarrer une séance personnalisée, connecte-toi d'abord dans « Mon espace », puis reviens ici.", "assistant");
        sayStatus("Connexion nécessaire pour utiliser le professeur IA.");
        return;
      }
      const response = await fetch("https://byzsqblgsssymvsztaqb.supabase.co/functions/v1/professeur-ia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "sb_publishable_iGibajCXvXeDMWK5g28Rqw_FjEagmwR",
          "Authorization": "Bearer " + sessionData.session.access_token
        },
        body: JSON.stringify({ niveau, matiere, objectif, messages: history.slice(-12) })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.reply) throw new Error(data.error || "Le professeur IA n'est pas encore configuré.");
      lastAnswer = String(data.reply);
      history.push({ role: "assistant", content: lastAnswer });
      addBubble(lastAnswer, "assistant");
      sayStatus("Tu peux poser une question, répondre à l'exercice ou écouter l'explication.");
      readAloud(lastAnswer);
    } catch (error) {
      history.pop();
      addBubble("Je ne peux pas répondre pour le moment. " + (error.message || "Vérifie la connexion et réessaie."), "assistant");
      sayStatus("Le service IA doit être configuré côté serveur pour répondre.");
    } finally {
      sendButton.disabled = false;
      input.focus();
    }
  });

  document.querySelector("#prof-ia-micro")?.addEventListener("click", () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { sayStatus("La dictée vocale n'est pas prise en charge par ce navigateur. Tu peux écrire ta réponse."); return; }
    const recognition = new Recognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    sayStatus("Je t'écoute… parle clairement.");
    recognition.onresult = (event) => { input.value = event.results[0][0].transcript; input.focus(); sayStatus("Ta réponse est prête. Relis-la puis envoie-la."); };
    recognition.onerror = () => sayStatus("Je n'ai pas pu capter ta voix. Autorise le micro ou écris ta réponse.");
    recognition.onend = () => { if (!input.value.trim()) sayStatus("Tu peux réessayer ou écrire ta réponse."); };
    recognition.start();
  });
  document.querySelector("#prof-ia-lire")?.addEventListener("click", () => {
    if (lastAnswer) readAloud(lastAnswer);
    else sayStatus("La réponse du professeur apparaîtra ici et pourra être lue à voix haute.");
  });
  document.querySelector("#prof-ia-effacer")?.addEventListener("click", () => {
    history.length = 0; lastAnswer = "";
    conversation.replaceChildren();
    addBubble("Nouvelle séance ! Quel sujet veux-tu travailler aujourd'hui ?", "assistant");
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    sayStatus("Nouvelle séance commencée.");
  });
});

// ============================================================
// COACH INTELLIGENT EDUCAP — outil d'étude immédiatement utilisable
// Fonctionne côté navigateur, sans inventer de cours officiels.
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#coach-intelligent")) return;
  const section = document.createElement("section");
  section.id = "coach-intelligent";
  section.className = "section";
  section.innerHTML = `
    <div class="container">
      <div class="welcome-panel coach-panel">
        <span class="eyebrow">✨ EduCap Intelligence</span>
        <h2>Ton coach d’apprentissage personnel</h2>
        <p>Construis un plan de travail, entraîne-toi avec des questions et identifie la prochaine étape. L’outil adapte ses conseils à ton objectif.</p>
        <form id="coach-form" class="coach-form">
          <label>Ton parcours
            <select id="coach-domaine" required>
              <option value="scolaire">Élève — collège / lycée</option>
              <option value="campus">Étudiant — université</option>
              <option value="competences">Développer une compétence professionnelle</option>
              <option value="recherche">Chercheur / recherche documentaire</option>
            </select>
          </label>
          <label>Ton niveau
            <select id="coach-niveau" required>
              <option>Débutant</option><option>Intermédiaire</option><option>Avancé</option>
              <option>4e</option><option>3e — BEPC</option><option>Seconde</option><option>Première</option><option>Terminale A1</option><option>Terminale A2</option><option>Terminale C</option><option>Terminale D</option><option>Licence</option><option>Master</option><option>Doctorat</option>
            </select>
          </label>
          <label>Ton objectif
            <select id="coach-objectif" required>
              <option value="comprendre">Comprendre une notion difficile</option>
              <option value="revision">Réviser pour un examen</option>
              <option value="exercice">M’entraîner avec des exercices</option>
              <option value="projet">Préparer un projet ou un mémoire</option>
              <option value="competence">Apprendre une compétence pratique</option>
              <option value="recherche">Organiser une recherche fiable</option>
            </select>
          </label>
          <label>La matière ou le sujet à travailler
            <input id="coach-sujet" required maxlength="120" placeholder="Ex. : dissertation, équations, comptabilité, Excel…" />
          </label>
          <label>Temps disponible aujourd’hui
            <select id="coach-temps"><option value="15">15 minutes</option><option value="30" selected>30 minutes</option><option value="45">45 minutes</option><option value="60">1 heure</option><option value="90">1 h 30</option></select>
          </label>
          <button class="btn btn-primary" type="submit">Créer mon plan intelligent →</button>
        </form>
        <div id="coach-resultat" class="coach-result" hidden aria-live="polite"></div>
      </div>
    </div>`;
  const videos = document.querySelector("#videos");
  if (videos?.parentNode) videos.parentNode.insertBefore(section, videos.nextSibling);
  else document.querySelector("main")?.appendChild(section);

  const style = document.createElement("style");
  style.textContent = `
    .coach-panel{max-width:920px;margin:auto}
    .coach-panel h2{font-size:clamp(28px,4vw,38px);margin:14px 0}
    .coach-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:24px}
    .coach-form label{display:grid;gap:7px;font-weight:700;font-size:14px}
    .coach-form input,.coach-form select{width:100%;min-height:48px;padding:11px 13px;border:1px solid #d3def0;border-radius:10px;background:#fff;color:#172642}
    .coach-form button{align-self:end;min-height:48px}
    .coach-result{margin-top:24px;padding:22px;border-radius:16px;background:#f1f6ff;border:1px solid #cfe0ff}
    .coach-result h3{margin-top:0}.coach-result li{margin:9px 0}
    .coach-quiz{margin-top:18px;padding-top:16px;border-top:1px solid #cfe0ff}
    .coach-quiz input{margin-right:8px}
    @media(max-width:650px){.coach-form{grid-template-columns:1fr}.coach-form button{width:100%}}
  `;
  document.head.appendChild(style);

  const form = document.querySelector("#coach-form");
  const output = document.querySelector("#coach-resultat");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const domaine = document.querySelector("#coach-domaine").value;
    const niveau = document.querySelector("#coach-niveau").value;
    const objectif = document.querySelector("#coach-objectif").value;
    const sujet = document.querySelector("#coach-sujet").value.trim();
    const minutes = Number(document.querySelector("#coach-temps").value);
    if (!sujet) return;
    const blocs = domaine === "recherche" || objectif === "recherche"
      ? [
          ["Clarifier la question", "Transforme le sujet en une question précise et délimite le thème."],
          ["Chercher des sources", "Privilégie les ouvrages, articles scientifiques, institutions et documents originaux. Note auteur, date et référence."],
          ["Évaluer les preuves", "Compare plusieurs sources, distingue faits, interprétations et limites."],
          ["Synthétiser", "Résume les résultats avec tes propres mots et conserve les références pour éviter le plagiat."]
        ]
      : objectif === "competence" || domaine === "competences"
      ? [
          ["Comprendre l’usage", "Écris ce que tu veux être capable de réaliser concrètement à la fin."],
          ["Observer un exemple", "Étudie une démonstration ou un modèle simple lié à « " + sujet + " »."],
          ["Pratiquer", "Réalise une petite tâche toi-même et note chaque étape."],
          ["Vérifier", "Teste le résultat, repère l’erreur la plus importante et recommence."]
        ]
      : objectif === "projet"
      ? [
          ["Définir le livrable", "Écris le résultat attendu, le public concerné et les critères de réussite."],
          ["Faire le plan", "Découpe « " + sujet + " » en petites tâches ordonnées."],
          ["Réaliser une première version", "Produis une version courte plutôt que d’attendre un résultat parfait."],
          ["Relire et améliorer", "Vérifie les sources, la cohérence, les calculs et les consignes."]
        ]
      : [
          ["Rappeler ce que tu sais", "Sans regarder le cours, note trois idées que tu connais déjà sur « " + sujet + " »."],
          ["Comprendre la notion", "Relis la définition, explique-la avec tes propres mots et invente un exemple."],
          ["T’entraîner activement", "Résous une question ou un exercice sans regarder la correction, puis compare ta méthode."],
          ["Corriger et mémoriser", "Explique pourquoi chaque erreur est arrivée et écris une règle courte à retenir."]
        ];
    const total = minutes;
    const weights = [0.15,0.3,0.4,0.15];
    const esc = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    const steps = blocs.map((b,i)=>'<li><strong>'+Math.max(2,Math.round(total*weights[i]))+' min — '+esc(b[0])+':</strong> '+esc(b[1])+'</li>').join("");
    const quizPrompt = domaine === "recherche" || objectif === "recherche"
      ? "Quelle différence fais-tu entre une source primaire et une source secondaire ?"
      : "Explique « " + sujet + " » en deux phrases, puis donne un exemple concret.";
    output.innerHTML = '<h3>Ton plan de travail personnalisé</h3><p><strong>Parcours :</strong> '+esc(domaine)+' · <strong>Niveau :</strong> '+esc(niveau)+' · <strong>Objectif :</strong> '+esc(objectif)+'</p><ol>'+steps+'</ol><div class="coach-quiz"><h3>Défi de rappel actif</h3><p>'+esc(quizPrompt)+'</p><label for="coach-reponse"><strong>Ta réponse</strong></label><textarea id="coach-reponse" rows="4" maxlength="1500" placeholder="Écris ta réponse ici, puis vérifie si elle est claire, exacte et illustrée…"></textarea><p class="muted">Conseil : essaie d’abord sans consulter le cours. Cet outil t’aide à t’organiser ; il ne prétend pas corriger automatiquement une réponse ni remplacer les sources de ton cours.</p><button type="button" class="btn btn-secondary" id="coach-imprimer">Imprimer / enregistrer mon plan</button></div>';
    output.hidden = false;
    document.querySelector("#coach-imprimer")?.addEventListener("click",()=>window.print());
    output.scrollIntoView({behavior:"smooth",block:"start"});
  });
});


// ============================================================
// ASSISTANT FLOTTANT GRATUIT EDUCAP AFRIQUE
// Assistant local d'accompagnement : conseils guidés sans service externe.
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#educap-aide-flottante")) return;

  const style = document.createElement("style");
  style.textContent = `
    #educap-aide-flottante{position:fixed;right:18px;bottom:18px;z-index:9999;font-family:inherit}
    #educap-aide-bouton{border:0;border-radius:999px;padding:14px 18px;background:#123d75;color:#fff;font-weight:800;box-shadow:0 8px 28px #0b214744;cursor:pointer}
    #educap-aide-panneau{display:none;position:absolute;right:0;bottom:64px;width:min(350px,calc(100vw - 32px));max-height:72vh;overflow:auto;background:#fff;color:#172642;border:1px solid #d9e3f2;border-radius:18px;box-shadow:0 14px 44px #10233b33;padding:18px}
    #educap-aide-panneau.ouvert{display:block}
    #educap-aide-panneau h3{margin:0 0 8px;font-size:19px}
    #educap-aide-panneau p{font-size:14px;line-height:1.5}
    #educap-aide-panneau label{display:block;font-weight:700;font-size:13px;margin:12px 0 6px}
    #educap-aide-panneau select,#educap-aide-panneau textarea{box-sizing:border-box;width:100%;padding:10px;border:1px solid #ccd8e8;border-radius:9px;background:#fff;color:#172642}
    #educap-aide-panneau textarea{min-height:72px;resize:vertical}
    #educap-aide-panneau button.action{width:100%;border:0;border-radius:9px;padding:11px;margin-top:9px;font-weight:700;cursor:pointer;background:#eaf1fb;color:#123d75}
    #educap-aide-panneau button.principal{background:#123d75;color:#fff}
    #educap-aide-reponse{white-space:pre-line;background:#f3f7fd;padding:12px;border-radius:10px;margin-top:12px;font-size:14px;line-height:1.5}
    @media(max-width:480px){#educap-aide-flottante{right:12px;bottom:12px}#educap-aide-panneau{max-height:70vh}}
  `;
  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "educap-aide-flottante";
  root.innerHTML = `
    <section id="educap-aide-panneau" role="dialog" aria-label="Mentor EduCap — assistant d’apprentissage">
      <h3>Bonjour, je suis Mentor EduCap !</h3>
      <p>Je reste avec toi dans EduCap Afrique. Choisis ton besoin et décris ta question : je te proposerai une méthode pour avancer, gratuitement.</p>
      <label for="educap-aide-parcours">Ton parcours</label>
      <select id="educap-aide-parcours">
        <option value="scolaire">Collège / lycée</option>
        <option value="campus">Université</option>
        <option value="competences">Formation professionnelle</option>
      </select>
      <label for="educap-aide-besoin">De quoi as-tu besoin ?</label>
      <select id="educap-aide-besoin">
        <option value="comprendre">Comprendre une leçon</option>
        <option value="exercice">Résoudre un exercice étape par étape</option>
        <option value="revision">Préparer un examen</option>
        <option value="organisation">Organiser mon travail</option>
        <option value="orientation">Choisir un parcours ou une compétence</option>
      </select>
      <label for="educap-aide-sujet">Précise le sujet (facultatif)</label>
      <textarea id="educap-aide-sujet" maxlength="500" placeholder="Ex. : équations du second degré, dissertation, comptabilité…"></textarea>
      <button type="button" class="action principal" id="educap-aide-conseil">Obtenir une méthode gratuite</button>
      <button type="button" class="action" id="educap-aide-dialogue">Discuter avec mon professeur EduCap</button>
      <button type="button" class="action" id="educap-aide-inscription">M’aider à choisir mon parcours / m’inscrire</button>
      <div id="educap-aide-reponse" hidden aria-live="polite"></div>
      
      <button type="button" class="action" id="educap-aide-fermer">Fermer</button>
    </section>
    <button id="educap-aide-bouton" type="button" aria-expanded="false">💬 Mentor EduCap</button>
  `;
  document.body.appendChild(root);

  const panel = root.querySelector("#educap-aide-panneau");
  const toggle = root.querySelector("#educap-aide-bouton");
  const answer = root.querySelector("#educap-aide-reponse");
  toggle.addEventListener("click", () => {
    const open = !panel.classList.contains("ouvert");
    panel.classList.toggle("ouvert", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  root.querySelector("#educap-aide-fermer").addEventListener("click", () => {
    panel.classList.remove("ouvert");
    toggle.setAttribute("aria-expanded", "false");
  });

  root.querySelector("#educap-aide-dialogue").addEventListener("click", () => {
    const professeur = document.querySelector("#professeur-ia");
    panel.classList.remove("ouvert");
    toggle.setAttribute("aria-expanded", "false");
    if (professeur) {
      professeur.scrollIntoView({ behavior: "smooth", block: "start" });
      const champ = document.querySelector("#prof-ia-message");
      window.setTimeout(() => champ?.focus({ preventScroll: true }), 450);
    }
  });

  root.querySelector("#educap-aide-inscription").addEventListener("click", () => {
    const formulaire = document.querySelector("#parcours-form");
    panel.classList.remove("ouvert");
    toggle.setAttribute("aria-expanded", "false");
    formulaire?.scrollIntoView({ behavior: "smooth", block: "start" });
    const message = document.querySelector("#resultat-parcours");
    if (message) {
      message.textContent = "Mentor EduCap t’accompagne : choisis ton pays et ton parcours, puis complète les champs affichés.";
      message.style.color = "#123d75";
      message.hidden = false;
    }
  });

  root.querySelector("#educap-aide-conseil").addEventListener("click", () => {
    const parcours = root.querySelector("#educap-aide-parcours").value;
    const besoin = root.querySelector("#educap-aide-besoin").value;
    const sujet = root.querySelector("#educap-aide-sujet").value.trim();
    const sujetTexte = sujet ? " Sujet choisi : " + sujet + "." : "";
    const conseils = {
      comprendre: "1. Lis une petite partie de la leçon.\n2. Reformule l’idée avec tes propres mots.\n3. Trouve un exemple.\n4. Note précisément ce que tu ne comprends pas, puis demande une explication.",
      exercice: "1. Recopie la consigne et repère ce qu’on cherche.\n2. Liste les données utiles.\n3. Essaie une première étape sans regarder le corrigé.\n4. Vérifie chaque calcul et explique pourquoi ta méthode fonctionne.",
      revision: "1. Choisis un seul chapitre.\n2. Rappelle les notions sans regarder le cours.\n3. Fais un exercice ou une question type examen.\n4. Corrige tes erreurs et révise-les de nouveau demain.",
      organisation: "1. Choisis un objectif réalisable aujourd’hui.\n2. Travaille 25 minutes sans distraction.\n3. Fais une pause de 5 minutes.\n4. Termine en écrivant ce que tu as compris et ce qu’il reste à revoir.",
      orientation: "1. Décris ce que tu aimes faire.\n2. Note les matières ou compétences où tu progresses.\n3. Choisis une compétence à tester avec un petit projet.\n4. Compare les prérequis et les débouchés à l’aide de sources fiables."
    };
    const niveaux = {scolaire:"Pour ton parcours scolaire",campus:"Pour ton parcours universitaire",competences:"Pour ta formation professionnelle"};
    answer.textContent = niveaux[parcours] + " :\n\n" + conseils[besoin] + sujetTexte + "\n\nCette aide propose une méthode générale pour t’aider à avancer. Pour un résultat fiable, compare toujours avec ton cours et les consignes de ton professeur.";
    answer.hidden = false;
  });
});
