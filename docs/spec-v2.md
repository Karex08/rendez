# Spécification v2 — App de réservation The Barbershop Geneva

Document en construction. Il complète `docs/spec-v1.md` avec ce qui est reporté à la v2. Les sections sont ajoutées au fur et à mesure des décisions validées avec Alex.

## 1. Fidélité : comptage des points

Décidé le 23 oct. 2026.

### Pourquoi la v1 ne compte pas de points

En v1, le solde de points est fixé à 0 dans l'app (`loyaltyPoints` dans `src/store/AppStore.tsx`). Le téléphone du client ne sait ni si le client est vraiment venu, ni combien il a payé. Seul le salon le sait. Le comptage demande donc un **serveur commun** entre l'app client et un **écran salon**.

### Règle de calcul

- **1 CHF payé = 1 point**, prestations et produits compris.
- Les points sont crédités **au paiement**, jamais à la réservation.
- Un rendez-vous annulé ou manqué ne rapporte aucun point.
- Le client ne peut pas déclarer lui-même sa visite (trop facile à tricher).
- Les seuils de niveaux restent ceux de la v1 : Novice 0, Habitué 100, Connaisseur 250, Gentleman 500, Icône 1'000. Les avantages sont toujours provisoires et à valider par le salon.

### Qui crédite les points, selon le mode de paiement

| Paiement | Déclencheur | Effort pour le salon |
|---|---|---|
| Carte ou TWINT dans l'app | Automatique : le prestataire de paiement (ex. Stripe) confirme le paiement au serveur, qui crédite les points | Aucun |
| Cash ou carte au comptoir | Le barbier ou la réception marque le rendez-vous « Payé » dans l'écran salon, avec le montant | Un clic par client |
| Achat de produits, ou client venu sans rendez-vous | Le client montre son QR code personnel dans l'app ; le salon le scanne et saisit le montant | Un scan et un montant |

### À construire

1. **Serveur** : comptes clients, rendez-vous et transactions de points. Le solde d'un client est la somme de ses transactions, ce qui permet de garder un historique et de corriger une erreur.
2. **Écran salon** : une page web sur la tablette du comptoir, avec un accès réservé au personnel.
   - Liste des rendez-vous du jour.
   - Bouton « Payé », avec le montant pré-rempli au prix de la prestation et modifiable (produits ajoutés, remise).
   - Bouton « Scanner un client » pour les produits et les clients sans rendez-vous.
3. **App client** :
   - Le solde réel s'affiche dans l'onglet Fidélité, en remplacement du 0 fixe.
   - Un QR code personnel apparaît dans l'onglet Fidélité.
   - Optionnel : l'historique des points gagnés.
4. **Paiement dans l'app** : quand le paiement par carte ou TWINT sera branché, chaque paiement réussi crédite les points automatiquement.

### Ordre de mise en place recommandé

L'écran salon avec le bouton « Payé » suffit pour démarrer, car la plupart des clients paient au comptoir. Viennent ensuite le QR code, puis le crédit automatique avec le paiement en ligne.

### Questions ouvertes

- Faut-il une plage de validité des points (expiration après 12 mois sans visite ?)
- Les remises (code promo, tarif étudiant) comptent-elles sur le montant payé ou sur le prix catalogue ?
- Qui a accès à l'écran salon : un compte par barbier ou un compte partagé pour le comptoir ?

## 2. Limite de rendez-vous à venir

Décidé le 23 oct. 2026. En v1, un client peut réserver autant de rendez-vous à venir qu'il veut (sans serveur, cela ne bloque que son propre téléphone). Avec le serveur partagé, le salon pourra fixer un maximum de rendez-vous à venir par client (par exemple 3) pour éviter les réservations abusives. Valeur à choisir par le salon ; au-delà, l'app affiche un message au moment de réserver.
