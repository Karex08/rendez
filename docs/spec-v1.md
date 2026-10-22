# Spécification v1 — App de réservation The Barbershop Geneva

Décisions validées avec Alex le 22 oct. 2026 (session de cadrage Q1 à Q37).
Cette spec fait foi pour la construction de la v1.

## 1. Cadre

- **Client** : The Barbershop Geneva, salon unique. Alex est autorisé à utiliser la marque, le nom, les photos et le contenu du site https://the-barbershop.ch/.
- **Utilisateurs** : clients uniquement. Pas d'espace barbier ni gérant en v1.
- **Technologie** : Expo / React Native + TypeScript, une seule base de code iOS + Android. Tests dans le simulateur iOS (Xcode requis).
- **Langue** : français uniquement, tutoiement, prix en CHF.
- **Pas de serveur en v1** : salons, barbiers, prestations et créneaux sont des données dans l'app ; profil et réservations sont stockés sur le téléphone. Le code isole l'accès aux données derrière une couche (« repository ») pour brancher un vrai serveur en v2 sans réécrire les écrans.
- **Structure de l'app** : reprise des captures de l'app Barber Concept (structure et parcours uniquement). Ne jamais reprendre ses noms, logos, photos ni barbiers.

## 2. Look and feel (repris de the-barbershop.ch)

- **Couleurs** : fond `#131314` (presque noir), texte `#FFFFFF`, texte secondaire `rgba(255,255,255,0.6)`, accent unique or `#CEA46F`. Rouge discret pour les actions destructrices (annuler). Pas de bleu ni de vert fluo.
- **Typos (Google Fonts)** : titres **Bebas Neue** (capitales étroites) ; boutons et libellés **Inter 700** en majuscules, espacement ~0.16em ; texte courant **Open Sans**.
- **Formes** : angles carrés, sauf un arrondi léger de **4 px** sur les champs de saisie et les cartes. Pas d'ombres. Filets dorés fins (souvent en pointillés) comme séparateurs.
- **Boutons** : principal = fond blanc, texte `#131314` ; secondaire = contour blanc, texte blanc. Majuscules.
- **Fonds** : noir uni partout. Seule exception : la carte du salon sur l'accueil, avec la photo `comptoir-logo.jpg` assombrie par un voile sombre, comme sur le site (`rgba(42,42,42,0.85)`).
- **Illustrations dorées** (`assets/images/illustrations/`) : sur les écrans vides (aucun rendez-vous, historique vide) et en ornements sur l'écran Fidélité.
- **Logo provisoire** (pas de fichier logo fourni) : ciseaux dorés + « THE BARBERSHOP » en Bebas Neue or + « Geneva » en italique dessous. Placé en bas des écrans de connexion. À remplacer par le SVG officiel s'il est fourni.

## 3. Navigation

Barre d'onglets en bas, 3 onglets : **Accueil**, **Fidélité**, **Profil**.
(League et Express reviendront en v2 comme onglets supplémentaires.)

## 4. Écrans

### 4.1 Connexion (fond noir uni)
1. « Connexion » — « Saisis ton numéro pour recevoir un code unique par SMS. » Sélecteur d'indicatif (🇨🇭 +41 par défaut) + champ numéro. Bouton « Recevoir mon code ».
2. « Connexion » — « Saisis le code à 6 chiffres envoyé à » + numéro formaté (+41 78 248 06 35). 6 cases. Bouton « Vérifier le code ».
   - v1 : pas de vrai SMS. Code de test **`123456`**, affiché discrètement sous les cases en mode test.
3. Première connexion → « Saisis tes informations » : Prénom, Nom, E-mail, Code de parrainage (optionnel). Bouton « Créer mon compte ».
   - Le code de parrainage est enregistré avec le profil, sans effet en v1.

### 4.2 Accueil
- En-tête « Salut, **[prénom]** » (« Salut, » en gris). Pas de sélecteur de ville (un seul salon).
- « Ton prochain rendez-vous » (seulement s'il y en a un) : carte avec jour + mois en grand, avatar du barbier (initiale), nom du salon, « avec [barbier] », date et heure. Ouvre la fiche du rendez-vous (4.4).
- Carte du salon : photo `comptoir-logo.jpg` assombrie, nom du salon, adresse, bouton « Réserver ».
- « Tes derniers rendez-vous » : **affiché uniquement s'il existe au moins un rendez-vous passé**. Les 3 plus récents + lien « Tout voir » vers la liste complète. Les rendez-vous annulés n'y figurent pas.

### 4.3 Parcours de réservation (modal plein écran, liens « Retour » / « Fermer »)
1. **Choisis une prestation** (sur-titre : nom du salon) : prestations groupées par catégorie (titre par groupe). Chaque ligne : nom, durée, prix en pastille « CHF 40.00 ». Les prestations étudiantes affichent « Carte étudiant à présenter au salon ».
2. **Choisis ton créneau** (sous-titre : prestation choisie), d'après les captures `design/captures/02` et `03` :
   - Rangée horizontale de cartes barbiers : **« Peu importe » en premier, sélectionné par défaut**, puis Raul, Youssef, Sophie. Avatar = initiale sur fond noir avec filet doré (en attendant les portraits). **Aucune note ni étoile, ni maintenant ni plus tard.**
   - Bandeau « Octobre 2026 · Jeu. 22 ⌄ » qui ouvre un calendrier du mois (jusqu'à **90 jours** à l'avance).
   - Liste des **14 jours** à partir de la date choisie ; pour chaque jour, grille de créneaux (3 colonnes). Jour sans dispo : « [Barbier] n'est pas disponible à cette date ».
   - Créneau sélectionné = fond blanc. Bouton collant en bas « Continuer · mar. 27 oct. à 09:30 ».
   - « Peu importe » montre l'union des créneaux de tous les barbiers ; le barbier libre est attribué à la confirmation.
3. **Finalise ta réservation** : carte « Ton rendez-vous » (Barbier, Prestation, Date « mar. 27 oct., 09:30 – 10:00 », Salon, Prix). Code promo (champ + « Appliquer ») ; code de démo **`BIENVENUE10`** = -10 %. Mention « Pour bénéficier du tarif étudiant, présente ta carte à la réception du salon. » Texte d'annulation (24 h). Sous-total, Total.
   - « Payer par carte » : **visible mais grisé, « Bientôt disponible »** (paiement en ligne en v2).
   - « Payer sur place » : confirme la réservation.
4. **Rendez-vous confirmé** (fond noir uni) : coche, récap (Barbier, Prestation, Date, Prix « Sur place »), aperçu de carte non interactif + adresse + « Obtenir l'itinéraire » (ouvre Plans / Google Maps) + « Ajouter au calendrier » (calendrier du téléphone, après autorisation). Bouton « Terminer ».

### 4.4 Fiche du rendez-vous (panneau qui monte du bas)
- « Détails du rendez-vous » : Barbier, Prestation, Date + « Fin prévue à 10:00 », Paiement « Sur place ». Carte, adresse, itinéraire, ajout au calendrier, mention tarif étudiant.
- « Annuler le rendez-vous ? » (contour rouge) → feuille de confirmation « Supprimer le rendez-vous » / « Annuler ».
- **Règle : annulation possible jusqu'à 24 h avant.** Au-delà, le bouton est remplacé par « Contacte le salon pour annuler » avec le numéro (+41 22 321 86 61).

### 4.5 Fidélité
Même structure que l'app d'origine : carte « Programme fidélité » (niveau actuel, points, barre de progression vers le niveau suivant), puis « Les niveaux » en cartes à faire défiler (5 niveaux, indicateur de pagination). Noms, seuils et avantages **provisoires**, à faire valider par le salon. v1 : toujours 0 point (calcul des points en v2). Accent or au lieu du vert.

### 4.6 Profil
Initiales en cercle, « Profil », « Gère tes informations de compte. » Champs : prénom, nom, e-mail, téléphone. Boutons « Enregistrer » et « Se déconnecter » (contour rouge).

## 5. Données du salon

- **Nom** : The Barbershop Geneva
- **Adresse** : Chem. du Vieux-Vésenaz 31, 1222 Vésenaz, Suisse — GPS approx. 46.23869, 6.19763
- **Téléphone** : +41 22 321 86 61 — **E-mail** : info@the-barbershop.ch
- **Horaires** : lundi–vendredi 09:00–19:00, samedi 09:00–18:00, dimanche fermé
- **Paiement au salon** : espèces, Visa, Mastercard, TWINT

### Barbiers et plannings
| Barbier | Planning |
|---|---|
| Raul | mar 13:30–19:00, mer–jeu 09:00–19:00, ven 10:00–19:00, sam 09:00–18:00 |
| Youssef (« Youss ») | mar–mer 09:00–19:00, ven 10:00–19:00, sam 09:00–18:00 |
| Sophie | horaires du salon (planning réel à fournir) |

### Prestations (CHF / minutes)
Durées du site, sauf les deux corrections validées (Cheveux & Barbe normal aligné sur la version étudiante ; Papa & Fils doublé).

| Catégorie | Prestation | Prix | Durée |
|---|---|---|---|
| Cheveux | Coupe de cheveux | 40 | 30 |
| Cheveux | Cheveux Rapide | 40 | 20 |
| Cheveux | Coupe de cheveux longs | 45 | 30 |
| Barbe | Taille de barbe (Tondeuse) | 25 | 30 |
| Barbe | Rasage complet (Tondeuse) | 29 | 30 |
| Barbe | Taille de barbe courte | 37 | 30 |
| Barbe | Taille de barbe longue | 37 | 30 |
| Barbe | Rasage complet de la barbe | 40 | 30 |
| Cheveux & Barbe | Cheveux & Barbe sans linge chaud | 55 | 30 |
| Cheveux & Barbe | Cheveux & Barbe Rapide | 70 | 40 |
| Cheveux & Barbe | Cheveux & Barbe avec linge chaud et soin | 70 | 30 |
| Étudiants, Enfant & Bébé | Coupe de bébé (-1 an) | 20 | 30 |
| Étudiants, Enfant & Bébé | Coupe enfant (-10 ans) | 30 | 30 |
| Étudiants, Enfant & Bébé | Coupe étudiant (-25 ans) | 33 | 30 |
| Étudiants, Enfant & Bébé | Étudiant : Cheveux & Barbe sans linge chaud | 50 | 30 |
| Étudiants, Enfant & Bébé | Étudiant : Cheveux & Barbe avec linge chaud | 60 | 30 |
| Soin | Soin classique | 25 | 30 |
| Soin | Soin complet avec massage | 30 | 30 |
| Formule | Formule Papa & Fils | 65 | 60 |

Note : Cheveux & Barbe Rapide (40 min) dure plus longtemps que la version normale (30 min) ; laissé tel quel comme sur le site (Q37), à corriger si le salon le souhaite.

### Calcul des créneaux (v1)
Tranches de 15 min dans le planning du barbier ; un créneau est proposé si la prestation entière tient avant la fin de journée. Quelques créneaux marqués « déjà pris » de façon pseudo-aléatoire mais stable (même graine → mêmes créneaux). Les réservations de l'utilisateur bloquent leur créneau. Pas de créneau dans le passé.

## 6. Fichiers fournis

- `assets/images/salon/` : `comptoir-logo.jpg` (carte de l'accueil), `fauteuil.jpg`, `entree.jpg`
- `assets/images/illustrations/` : `ciseaux.png`, `peigne.png`, `blaireau.png`, `flacon.png` (traits dorés, fond transparent)
- `design/captures/` : captures de référence du parcours de réservation (app d'origine, **non versionnées**, usage local uniquement)

## 7. Hors v1 (v2 et après)

League, Express, paiement en ligne (Stripe / TWINT), vrais SMS, calcul des points de fidélité, logique de parrainage, rappel la veille du rendez-vous, espace barbier / gérant, portraits des barbiers, tests sur émulateur Android.

## 8. Prérequis avant de coder

- **Xcode** installé (App Store), licence acceptée, runtime simulateur iOS téléchargé (Réglages → Components). Ensuite : `brew install cocoapods watchman`.
