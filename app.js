
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
    if (formation) formation.required = choix === "competences";

    actualiserSeries();
  };

  domaine?.addEventListener("change", actualiserChamps);
  classe?.addEventListener("change", actualiserSeries);

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

  const messageAuth = (message, succes = false) => {
    if (!authMessage) return;
    authMessage.textContent = message;
    authMessage.style.color = succes ? "#16803c" : "#b42318";
    authMessage.hidden = false;
  };

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
      .select("full_name, role, parcours, classe, serie")
      .eq("id", utilisateur.id)
      .maybeSingle();

    if (erreurProfil) {
      messageAuth("Connecté, mais impossible de charger ton profil : " + erreurProfil.message);
      return;
    }

    const nom = profil?.full_name || utilisateur.email || "apprenant";
    const role = profil?.role || "apprenant";
    if (compteBienvenue) {
      compteBienvenue.textContent = "Bienvenue " + nom + " — espace " + role + ".";
    }
    if (espaceFormateur) espaceFormateur.hidden = !["formateur", "admin"].includes(role);
    if (espaceAdmin) espaceAdmin.hidden = role !== "admin";
    if (!listeCours) return;
    listeCours.textContent = "Chargement des cours…";

    const { data: cours, error: erreurCours } = await clientSupabase
      .from("courses")
      .select("id, title, description, category, subject, classe, serie, content")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (erreurCours) {
      listeCours.textContent = "Impossible de charger les cours : " + erreurCours.message;
      return;
    }

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

    if (!cours?.length) {
      listeCours.textContent = "Aucun cours n’est publié pour le moment. Reviens bientôt !";
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
        ${element.content ? `<details><summary>Consulter le contenu</summary><p>${echapperHTML(element.content)}</p></details>` : ""}
        <button class="btn ${inscrit ? "btn-secondary" : "btn-primary"}" type="button" data-inscrire-cours="${echapperHTML(element.id)}" ${inscrit ? "disabled" : ""}>
          ${inscrit ? "Déjà dans mes cours" : "M’inscrire gratuitement"}
        </button>
      </article>`;
    }).join("");

    if (["formateur", "admin"].includes(role)) {
      const requeteBrouillons = clientSupabase.from("courses")
        .select("id, title, description, category, subject, classe, serie, content, published, created_at, teacher_id")
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
          mesCoursFormateur.innerHTML = propres.length ? propres.map(c => `<article class="course-item"><p class="course-meta">${echapperHTML(c.category)} · ${c.published ? "Publié" : "En attente / brouillon"}</p><h4>${echapperHTML(c.title)}</h4><p>${echapperHTML(c.description || "")}</p></article>`).join("") : "<p>Aucun cours créé pour le moment.</p>";
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
    });
    clientSupabase.auth.onAuthStateChange((_evenement, session) => {
      afficherCompte(session);
    });
  }
});
