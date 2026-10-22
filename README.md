# EduCap Afrique

Plateforme éducative orientée vers les besoins des apprenants en Côte d'Ivoire.

## Site et dépôt

- Site : https://educap-afrique.fifiofficiel12.workers.dev/
- Dépôt : https://github.com/fifiofficiel12-bit/educap-afrique

## Fonctionnalités actuellement présentes dans le code

- Page publique en français présentant EduCap Scolaire, Campus et Compétences.
- Formulaire de sélection du parcours connecté à Supabase.
- Création de compte apprenant par e-mail et mot de passe, connexion et déconnexion.
- Affichage des cours publiés dans l'espace apprenant.
- Inscription à un cours publié, si la session est authentifiée.
- Les nouveaux comptes sont créés avec le rôle `apprenant`; l'inscription publique ne permet pas de se donner un rôle `formateur` ou `admin`.
- La table `public.parcours_apprenants` conserve les parcours déjà enregistrés; ses anciennes règles d'insertion trop permissives ont été remplacées.

## Configuration Supabase

Le site utilise le projet Supabase associé au dépôt. Le navigateur utilise uniquement la clé publique. Ne jamais placer une clé secrète Supabase dans `app.js`.

Les comptes peuvent nécessiter une confirmation d'adresse e-mail selon les paramètres d'authentification du projet. Vérifier les paramètres de redirection et l'envoi d'e-mails dans Supabase avant le lancement public.

## À construire et tester avant le lancement

- Espaces formateur et administrateur complets avec contrôle des rôles et validation des cours.
- Parcours de récupération du mot de passe et vérification complète des e-mails.
- Tests de bout en bout sur le site déployé, notamment création de compte, connexion, affichage des cours et inscriptions.
- Paiements Mobile Money (Orange Money, MTN MoMo, Moov Money, Wave) : aucune intégration de paiement n'est présentée comme opérationnelle.
- Vérification des avertissements de sécurité Supabase restants.

Le code poussé sur GitHub n'implique pas à lui seul que le dernier déploiement Cloudflare soit terminé. Vérifier le déploiement de production avant de communiquer le lancement.
