# EduCap Afrique

Plateforme éducative orientée vers les besoins des apprenants en Côte d'Ivoire.

## Site et dépôt

- Site : https://educap-afrique.fifiofficiel12.workers.dev/
- Dépôt : https://github.com/fifiofficiel12-bit/educap-afrique

## Configuration de l'enregistrement des parcours

Le formulaire utilise Supabase pour enregistrer les choix des apprenants dans la table `public.parcours_apprenants`.

1. Ouvrir le projet Supabase associé au site.
2. Aller dans **Éditeur SQL** puis **Nouvelle requête**.
3. Ouvrir le fichier [supabase/setup-parcours.sql](supabase/setup-parcours.sql) dans ce dépôt GitHub.
4. Copier tout son contenu dans l'éditeur SQL de Supabase et exécuter la requête.
5. Tester le formulaire public en choisissant chacun des trois domaines.

Le script autorise l'insertion validée des parcours, mais ne donne pas à un visiteur anonyme le droit de lire les parcours enregistrés. Il ne supprime pas la table ni les données existantes. Il recrée uniquement la politique portant le nom `eduCap_public_insert_parcours`.

## État des fonctionnalités

Le site public et le formulaire de sélection de parcours sont présents. Les espaces apprenants, enseignants et administrateurs, la publication sécurisée de cours et le paiement Mobile Money ne doivent pas être considérés comme opérationnels tant qu'ils ne sont pas construits, configurés et testés. Ne jamais placer une clé secrète Supabase dans le JavaScript public : utiliser uniquement la clé publique côté navigateur et réserver les clés secrètes au serveur.
