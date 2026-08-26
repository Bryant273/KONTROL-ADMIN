# KONTROL ERP — Interface d'Administration Centrale

Plateforme d'administration, de supervision et de gestion pour **KONTROL ERP Cloud**. Cette application offre une vue centralisée à 360° sur les entreprises clientes, les abonnements, les bordereaux d'encaissement via **GeniuSPay**, les modèles de documents d'entreprise, le support client SLA et la sécurité des accès administrateurs.

---

## 🏛️ Architecture & Stack Technique

- **Framework Frontend** : React 18+ avec TypeScript & Vite
- **Styling & Design System** : Tailwind CSS avec design tokens rigoureux, typographie optimisée et palette d'entreprise KONTROL (`#002845`, `#3B96D2`, `#E06020`)
- **Icônes & Visuels** : `lucide-react`
- **Graphiques & Visualisations** : `recharts` (répartitions financières, encaissements, flux d'activité)
- **Persistance & Base de Données** : Google Cloud Firestore / Firebase (collections `clients`, `subscriptions`, `transactions`, `templates`, `tickets`, `admin_users`, `audit_logs`)

---

## 🚀 Modules Fonctionnels

### 1. Pilotage & Tableau de Bord (`dashboard`)
- **Indicateurs Clés (KPIs)** :
  - **MRR Récurrent** : Calcul dynamique basé sur le forfait unique **STANDARD à 15 000 FCFA / mois** par entreprise active.
  - **Entreprises Actives** : Suivi du nombre de comptes clients en service.
  - **Passerelle GeniuSPay** : État opérationnel des canaux de collecte (Orange Money, MTN Mobile Money, Wave, Carte Bancaire).
  - **Tickets SLA Urgents** : Surveillance des alertes nécessitant une intervention immédiate.
- **Visualisations & Graphiques** : Évolution des encaissements mensuels, flux d'activité récente, répartition géographique des entreprises.

### 2. Gestion des Entreprises & Clients (`users`)
- **Annuaire des Entreprises** : Fiche complète de chaque client avec raison sociale, contact référent, adresse et pays unique (Sénégal, Côte d'Ivoire, Cameroun, Mali, Gabon, etc.).
- **État & Forfait** : Suivi de statut (Actif, En attente, Suspendu) avec plan **STANDARD (15 000 FCFA/mois)**.
- **Opérations** : Création rapide d'une nouvelle entreprise avec génération automatique de l'abonnement et du bordereau d'encaissement initial.

### 3. Abonnements Standard KONTROL (`subscriptions`)
- **Forfait Unique STANDARD** : Tarification stricte à **15 000 FCFA / mois** par entreprise.
- **Cycle de Facturation** : Dates d'effet, prochaines échéances de prélèvement, statut de renouvellement automatique.
- **Relances & Alertes** : Détection des abonnements arrivant à échéance sous 7 jours et émission de relances de paiement.

### 4. Bordereaux & Paiements GeniuSPay (`payments`)
- **Agrégateur GeniuSPay** : Supervision des canaux de règlement :
  - *Orange Money*
  - *MTN Mobile Money*
  - *Wave*
  - *Carte Bancaire*
- **Bordereaux d'Encaissement** : Émission, suivi de statut (Validé, En attente, Échoué, Remboursé), réessais et quittances de règlement (`REC-GP-...`).
- **Gestion des Passerelles** : Bascule du mode Test/Sandbox et Production en temps réel.

### 5. Modèles & Templates de Documents (`templates`)
- **Gestionnaire de Modèles d'Entreprise** :
  - Facture Standard v2.1
  - Devis & Proposition Commerciale
  - Reçu d'Encaissement GeniuSPay
  - Contrat de Prestation de Services
- **Moteur d'Injection de Variables** : Remplacement dynamique des balises `{{nom_entreprise}}`, `{{montant_total}}`, `{{recu_numero}}`, `{{mode_reglement}}`, etc., avec prévisualisation en direct.

### 6. Support Client & SLA (`support`)
- **Gestion des Tickets** : Catégorisation (*Paiement GeniuSPay*, *Facturation*, *Technique*, *Compte*, *Intégration*).
- **Suivi SLA & Priorités** : Indicateurs Urgents, Élevés, Normaux et suivi des délais de réponse.
- **Réponses Rapides (Canned Replies)** : Modèles de réponses préenregistrées pour validation d'abonnement et assistance passerelle.

### 7. Utilisateurs Admin & Contrôle d'Accès (`admin_team`)
- **Rôles RBAC (Role-Based Access Control)** :
  - `super_admin` : Accès intégral et gestion de la configuration système.
  - `financial_admin` : Gestion des abonnements, transactions et finances.
  - `support_agent` : Traitement des tickets et assistance clients.
  - `content_manager` : Édition des modèles de documents.
- **Bascule Rapide de Profil** : Possibilité de tester les différents périmètres d'accès depuis le menu utilisateur.

### 8. Journal d'Audit & Sécurité (`audit`)
- **Traçabilité Complète** : Enregistrement immuable des actions sensibles (création client, modification d'abonnement, bascule de passerelle, etc.).
- **Gestion des Sessions** : Vue sur les sessions actives avec adresse IP, navigateur et possibilité de révocation immédiate.

### 9. Explorateur de Données (`data_explorer`)
- Vue tabulaire directe et recherche plein texte sur toutes les collections Firestore de l'ERP.

### 10. Supervision & Assistant Opérationnel
- Panneau latéral droit escamotable fournissant une checklist quotidienne d'actions recommandées et un diagnostic automatisé sur l'état de la plateforme.

---

## 🛠️ Commandes de Développement & Build

```bash
# Lancement du serveur de développement (Port 3000)
npm run dev

# Compilation de production
npm run build

# Vérification du typage TypeScript & Lint
npm run lint
```

---

## 🔒 Configuration & Sécurité

- Les variables d'environnement requises sont documentées dans `.env.example`.
- Les règles de sécurité Firestore sont définies dans `firestore.rules`.
