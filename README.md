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

## État du projet et contrôles avant ouverture publique

- L’espace apprenant comprend la création de compte, la connexion, la déconnexion, le catalogue public des cours et la séparation entre aperçu et contenu complet.
- Le formulaire de récupération du mot de passe utilise l’e-mail Supabase ; le lien de retour et le changement de mot de passe doivent encore être vérifiés en navigateur.
- Les utilisateurs connectés peuvent envoyer une candidature formateur. L’administration peut l’accepter ou la refuser ; l’acceptation active le rôle formateur via un déclencheur de base de données.
- L’espace administrateur permet de consulter les candidatures et de contrôler les cours. Les tests de bout en bout de ces écrans restent à réaliser.
- Le paiement annuel Money Fusion est fixé à 750 FCFA. La fonction de création de transaction est active (version 11) et le webhook est actif (version 8), mais aucun paiement n’est confirmé dans la base. Le test réel n’a pas été effectué.
- La base contient 69 cours, dont 43 publiés ; les 43 cours publiés sont présents dans le catalogue public. La conformité de chaque leçon avec les progressions officielles doit être contrôlée avant de la présenter comme validée.
- Les derniers commits GitHub ne prouvent pas à eux seuls que Cloudflare sert déjà la dernière version. Le déploiement public et les tests navigateur restent à confirmer.
- Supabase signale encore des avertissements de sécurité et de configuration d’authentification à examiner avant l’ouverture publique.

Ne finalise pas les deux transactions de test déjà en attente et ne considère aucun abonnement comme payé tant que Money Fusion et Supabase ne l’ont pas confirmé.
