import { 
  UserClient, 
  Subscription, 
  PlanDefinition, 
  PaymentTransaction, 
  TemplateItem, 
  SupportTicket, 
  AuditLog, 
  ActiveSession, 
  GatewayStatus,
  AdminUser
} from './types';

// ======================== CLIENTS & ENTREPRISES ERP ========================
export const INITIAL_CLIENTS: UserClient[] = [
  {
    id: 'usr_01',
    name: 'Amadou Diallo',
    email: 'amadou.diallo@agro-dakar.sn',
    company: 'Agro Dakar SA',
    phone: '+221 77 452 18 90',
    country: 'Sénégal',
    address: 'Avenue Lamine Guèye, Dakar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    status: 'active',
    role: 'client_admin',
    plan: 'STANDARD',
    paymentMethod: 'orange_money',
    mrr: 15000,
    lastLogin: 'Aujourd\'hui 10:24',
    createdAt: '2025-11-12'
  },
  {
    id: 'usr_02',
    name: 'Koffi Mensah',
    email: 'koffi.mensah@sahel-logistics.ci',
    company: 'Sahel Logistics CI',
    phone: '+225 07 88 99 10',
    country: 'Côte d\'Ivoire',
    address: 'Zone Industrielle de Yopougon, Abidjan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    status: 'active',
    role: 'client_admin',
    plan: 'STANDARD',
    paymentMethod: 'mtn_money',
    mrr: 15000,
    lastLogin: 'Hier 18:45',
    createdAt: '2026-01-05'
  },
  {
    id: 'usr_03',
    name: 'Fatou Ndiaye',
    email: 'contact@senegal-btp.com',
    company: 'Sénégal BTP & Travaux',
    phone: '+221 78 300 44 55',
    country: 'Sénégal',
    address: 'Route des Almadies, Dakar',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    status: 'active',
    role: 'client_admin',
    plan: 'STANDARD',
    paymentMethod: 'wave',
    mrr: 15000,
    lastLogin: 'Il y a 3 jours',
    createdAt: '2025-08-20'
  },
  {
    id: 'usr_04',
    name: 'Mamadou Touré',
    email: 'direction@afric-distribution.ml',
    company: 'Afric Distribution Bamako',
    phone: '+223 66 12 34 56',
    country: 'Mali',
    address: 'Quartier du Fleuve, Bamako',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    status: 'active',
    role: 'client_admin',
    plan: 'STANDARD',
    paymentMethod: 'orange_money',
    mrr: 15000,
    lastLogin: 'Hier 09:10',
    createdAt: '2026-02-14'
  }
];

// ======================== ABONNEMENTS STANDARD ========================
export const INITIAL_PLANS: PlanDefinition[] = [
  {
    id: 'plan_standard',
    name: 'STANDARD',
    priceMonthly: 15000,
    priceYearly: 150000,
    description: 'Abonnement complet KONTROL ERP avec accès illimité aux modules commerciaux, factures, bons et règlements via l\'agrégateur GeniuSPay.',
    features: [
      'ERP Gestion Commerciale & Facturation illimitée',
      'Génération de Bons de commande, Bons de livraison, Fiches & Contrats',
      'Moyen de Paiement sécurisé via GeniuSPay (Orange Money, MTN MoMo, Wave)',
      'Gestion multi-utilisateurs & rôles d\'entreprise',
      'Exports comptables normalisés OHADA',
      'Sauvegardes et synchronisation temps réel'
    ],
    subscriberCount: 4,
    isPopular: true
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_01',
    userId: 'usr_01',
    userName: 'Amadou Diallo',
    userEmail: 'amadou.diallo@agro-dakar.sn',
    company: 'Agro Dakar SA',
    planName: 'STANDARD',
    price: 15000,
    billingCycle: 'mensuel',
    status: 'actif',
    startDate: '2025-11-12',
    nextBillingDate: '2026-09-12',
    autoRenew: true,
    paymentChannel: 'orange_money',
    daysRemaining: 21,
    country: 'Sénégal',
    address: 'Avenue Lamine Guèye, Dakar',
    geniusPaySubId: 'GP_SUB_01'
  },
  {
    id: 'sub_02',
    userId: 'usr_02',
    userName: 'Koffi Mensah',
    userEmail: 'koffi.mensah@sahel-logistics.ci',
    company: 'Sahel Logistics CI',
    planName: 'STANDARD',
    price: 15000,
    billingCycle: 'mensuel',
    status: 'actif',
    startDate: '2026-01-05',
    nextBillingDate: '2026-09-05',
    autoRenew: true,
    paymentChannel: 'mtn_money',
    daysRemaining: 14,
    country: 'Côte d\'Ivoire',
    address: 'Zone Industrielle de Yopougon, Abidjan',
    geniusPaySubId: 'GP_SUB_02'
  },
  {
    id: 'sub_03',
    userId: 'usr_03',
    userName: 'Fatou Ndiaye',
    userEmail: 'contact@senegal-btp.com',
    company: 'Sénégal BTP & Travaux',
    planName: 'STANDARD',
    price: 15000,
    billingCycle: 'mensuel',
    status: 'actif',
    startDate: '2025-08-20',
    nextBillingDate: '2026-08-28',
    autoRenew: true,
    paymentChannel: 'wave',
    daysRemaining: 6,
    country: 'Sénégal',
    address: 'Route des Almadies, Dakar',
    geniusPaySubId: 'GP_SUB_03'
  },
  {
    id: 'sub_04',
    userId: 'usr_04',
    userName: 'Mamadou Touré',
    userEmail: 'direction@afric-distribution.ml',
    company: 'Afric Distribution Bamako',
    planName: 'STANDARD',
    price: 15000,
    billingCycle: 'mensuel',
    status: 'actif',
    startDate: '2026-02-14',
    nextBillingDate: '2026-09-14',
    autoRenew: true,
    paymentChannel: 'orange_money',
    daysRemaining: 23,
    country: 'Mali',
    address: 'Quartier du Fleuve, Bamako',
    geniusPaySubId: 'GP_SUB_04'
  }
];

// ======================== BORDEREAUX DE PAIEMENT GENIUSPAY (EXCLUSIVEMENT ABONNEMENTS) ========================
export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx_01',
    transactionId: 'GP_TX_98412',
    purpose: 'Abonnement KONTROL Standard',
    planName: 'STANDARD',
    clientName: 'Amadou Diallo',
    company: 'Agro Dakar SA',
    amount: 15000,
    currency: 'XOF',
    aggregator: 'GeniuSPay',
    paymentNetwork: 'Orange Money',
    status: 'success',
    timestamp: '2026-08-12 09:15:22',
    slipReference: 'GENIUSPAY_SLIP_OM_98412'
  },
  {
    id: 'tx_02',
    transactionId: 'GP_TX_98413',
    purpose: 'Abonnement KONTROL Standard',
    planName: 'STANDARD',
    clientName: 'Koffi Mensah',
    company: 'Sahel Logistics CI',
    amount: 15000,
    currency: 'XOF',
    aggregator: 'GeniuSPay',
    paymentNetwork: 'MTN Mobile Money',
    status: 'success',
    timestamp: '2026-08-05 14:20:10',
    slipReference: 'GENIUSPAY_SLIP_MTN_98413'
  },
  {
    id: 'tx_03',
    transactionId: 'GP_TX_98414',
    purpose: 'Abonnement KONTROL Standard',
    planName: 'STANDARD',
    clientName: 'Fatou Ndiaye',
    company: 'Sénégal BTP & Travaux',
    amount: 15000,
    currency: 'XOF',
    aggregator: 'GeniuSPay',
    paymentNetwork: 'Wave',
    status: 'success',
    timestamp: '2026-07-28 11:00:00',
    slipReference: 'GENIUSPAY_SLIP_WAVE_98414'
  },
  {
    id: 'tx_04',
    transactionId: 'GP_TX_98415',
    purpose: 'Abonnement KONTROL Standard',
    planName: 'STANDARD',
    clientName: 'Mamadou Touré',
    company: 'Afric Distribution Bamako',
    amount: 15000,
    currency: 'XOF',
    aggregator: 'GeniuSPay',
    paymentNetwork: 'Orange Money',
    status: 'success',
    timestamp: '2026-08-14 16:45:00',
    slipReference: 'GENIUSPAY_SLIP_OM_98415'
  }
];

// ======================== MODÈLES & DOCUMENTS D'ENTREPRISE ========================
export const INITIAL_TEMPLATES: TemplateItem[] = [
  // 1. FACTURES & DEVIS
  {
    id: 'tpl_invoice_standard',
    title: 'Facture Standard Normalisée OHADA',
    category: 'factures',
    docTypeLabel: 'Facture Commerciale',
    currentVersion: 'v2.4',
    lastModified: '2026-08-10',
    author: 'Admin KONTROL',
    variables: ['{{nom_entreprise}}', '{{adresse_entreprise}}', '{{pays}}', '{{ninea_rccm}}', '{{numero_facture}}', '{{date_facturation}}', '{{date_echeance}}', '{{client_nom}}', '{{montant_ht}}', '{{montant_tva}}', '{{montant_ttc}}', '{{reference_jiniuspay}}'],
    content: `<!-- MODELE DE FACTURE NORMALISEE KONTROL -->
<div class="invoice-box" style="font-family: sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #003050; padding-bottom: 12px;">
    <div>
      <h2 style="color: #003050; margin: 0;">{{nom_entreprise}}</h2>
      <p style="color: #64748b; margin: 4px 0;">{{adresse_entreprise}} - {{pays}}</p>
      <p style="font-size: 11px; color: #64748b;">NINEA / RCCM : {{ninea_rccm}}</p>
    </div>
    <div style="text-align: right;">
      <h3 style="color: #50B0E0; margin: 0;">FACTURE N° {{numero_facture}}</h3>
      <p style="margin: 4px 0; font-size: 12px;">Émise le : {{date_facturation}}</p>
      <p style="margin: 4px 0; font-size: 12px; color: #e11d48; font-weight: bold;">Échéance : {{date_echeance}}</p>
    </div>
  </div>

  <div style="margin: 20px 0; padding: 12px; background: #f8fafc; border-radius: 6px;">
    <h4 style="margin: 0 0 6px 0; color: #003050;">Facturé à :</h4>
    <p style="margin: 0; font-weight: bold;">{{client_nom}}</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
    <tr style="background: #003050; color: white; text-align: left;">
      <th style="padding: 8px;">Désignation</th>
      <th style="padding: 8px; text-align: right;">Montant HT (FCFA)</th>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px;">Prestations de services / Vente de marchandises</td>
      <td style="padding: 10px; text-align: right; font-weight: bold;">{{montant_ht}}</td>
    </tr>
  </table>

  <div style="margin-top: 20px; text-align: right;">
    <p style="margin: 4px 0;">TVA (18%) : <strong>{{montant_tva}} FCFA</strong></p>
    <h3 style="color: #003050; margin: 8px 0;">Total TTC : {{montant_ttc}} FCFA</h3>
  </div>

  <div style="margin-top: 24px; padding: 12px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #64748b;">
    <span>Règlement enregistré via l'agrégateur JiniusPay (Bordereau : {{reference_jiniuspay}} - Orange Money, MTN MoMo, Wave).</span>
  </div>
</div>`,
    versionHistory: [
      {
        version: 'v2.4',
        modifiedAt: '2026-08-10 14:00',
        modifiedBy: 'Admin KONTROL',
        content: `<!-- MODELE DE FACTURE NORMALISEE KONTROL -->`,
        comment: 'Conformité mentions légales OHADA & TVA régionale 18%'
      }
    ]
  },

  // 2. BONS
  {
    id: 'tpl_bon_commande',
    title: 'Bon de Commande & Réception Fournisseur',
    category: 'bons',
    docTypeLabel: 'Bon de Commande',
    currentVersion: 'v1.6',
    lastModified: '2026-08-05',
    author: 'Admin KONTROL',
    variables: ['{{nom_entreprise}}', '{{fournisseur_nom}}', '{{num_bon_commande}}', '{{date_emission}}', '{{lieu_livraison}}', '{{total_articles}}', '{{signature_acheteur}}'],
    content: `<!-- MODELE BON DE COMMANDE KONTROL -->
<div class="bon-commande-box" style="font-family: sans-serif; padding: 20px; border: 1px solid #cbd5e1; border-radius: 8px;">
  <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #50B0E0; padding-bottom: 8px;">
    <div>
      <h2 style="color: #003050; margin: 0;">{{nom_entreprise}}</h2>
      <p style="color: #64748b; font-size: 12px; margin: 4px 0;">BON DE COMMANDE OFFICIEL</p>
    </div>
    <div style="text-align: right;">
      <h3 style="color: #003050; margin: 0;">N° {{num_bon_commande}}</h3>
      <p style="font-size: 11px; margin: 2px 0;">Date : {{date_emission}}</p>
    </div>
  </div>

  <div style="margin: 16px 0; padding: 10px; background: #f1f5f9; border-radius: 6px;">
    <p style="margin: 2px 0;"><strong>Fournisseur :</strong> {{fournisseur_nom}}</p>
    <p style="margin: 2px 0;"><strong>Lieu de livraison prévu :</strong> {{lieu_livraison}}</p>
  </div>

  <div style="margin-top: 16px; border: 1px solid #e2e8f0; border-radius: 4px; padding: 12px;">
    <p style="margin: 0; font-size: 12px;">Total des articles commandés : <strong>{{total_articles}}</strong></p>
  </div>

  <div style="margin-top: 30px; display: flex; justify-content: space-between; font-size: 12px;">
    <div>Visa Direction : ____________________</div>
    <div>Signature Responsable Achat : {{signature_acheteur}}</div>
  </div>
</div>`,
    versionHistory: [
      {
        version: 'v1.6',
        modifiedAt: '2026-08-05 09:20',
        modifiedBy: 'Admin KONTROL',
        content: `<!-- MODELE BON DE COMMANDE KONTROL -->`,
        comment: 'Ajout clause de conformité réception magasin'
      }
    ]
  },
  {
    id: 'tpl_bon_livraison',
    title: 'Bon de Livraison Client & Décharge',
    category: 'bons',
    docTypeLabel: 'Bon de Livraison',
    currentVersion: 'v1.4',
    lastModified: '2026-07-22',
    author: 'Admin KONTROL',
    variables: ['{{nom_entreprise}}', '{{num_bon_livraison}}', '{{client_nom}}', '{{adresse_livraison}}', '{{transporteur}}', '{{date_reception}}', '{{emargement_client}}'],
    content: `<!-- MODELE BON DE LIVRAISON KONTROL -->
<div class="bon-livraison-box" style="font-family: sans-serif; padding: 20px; border: 1px solid #cbd5e1; border-radius: 8px;">
  <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #003050; padding-bottom: 8px;">
    <h2 style="color: #003050; margin: 0;">{{nom_entreprise}}</h2>
    <h3 style="color: #50B0E0; margin: 0;">BON DE LIVRAISON N° {{num_bon_livraison}}</h3>
  </div>

  <div style="margin: 16px 0; font-size: 12.5px;">
    <p><strong>Destinataire :</strong> {{client_nom}}</p>
    <p><strong>Adresse de déchargement :</strong> {{adresse_livraison}}</p>
    <p><strong>Transporteur / Chauffeur :</strong> {{transporteur}}</p>
  </div>

  <div style="margin-top: 24px; padding: 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; font-size: 11.5px;">
    Mention : Les marchandises ont été reconnues conformes en quantité et qualité lors de la remise.
  </div>

  <div style="margin-top: 30px; display: flex; justify-content: space-between; font-size: 12px;">
    <div>Date de remise : {{date_reception}}</div>
    <div>Émargement & Cachet Client : {{emargement_client}}</div>
  </div>
</div>`,
    versionHistory: [
      {
        version: 'v1.4',
        modifiedAt: '2026-07-22 15:40',
        modifiedBy: 'Admin KONTROL',
        content: `<!-- MODELE BON DE LIVRAISON KONTROL -->`,
        comment: 'Standardisation du volet transporteur'
      }
    ]
  },

  // 3. FICHES
  {
    id: 'tpl_fiche_paie',
    title: 'Bulletin de Paie / Fiche de Salaire Standard',
    category: 'fiches',
    docTypeLabel: 'Fiche de Paie',
    currentVersion: 'v2.1',
    lastModified: '2026-08-01',
    author: 'Admin KONTROL',
    variables: ['{{nom_entreprise}}', '{{nom_salarie}}', '{{matricule_salarie}}', '{{poste_occupe}}', '{{periode_paie}}', '{{salaire_base}}', '{{primes_indemnites}}', '{{cotisations_sociales}}', '{{salaire_net_payer}}'],
    content: `<!-- MODELE BULLETIN DE PAIE KONTROL -->
<div class="fiche-paie-box" style="font-family: sans-serif; padding: 24px; border: 1px solid #cbd5e1; border-radius: 8px;">
  <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #003050; padding-bottom: 10px;">
    <div>
      <h3 style="margin: 0; color: #003050;">{{nom_entreprise}}</h3>
      <p style="margin: 2px 0; font-size: 11.5px; color: #64748b;">BULLETIN DE PAIE INDIVIDUEL</p>
    </div>
    <div style="text-align: right;">
      <p style="margin: 0; font-weight: bold; color: #50B0E0;">Période : {{periode_paie}}</p>
    </div>
  </div>

  <div style="margin: 16px 0; padding: 12px; background: #f8fafc; border-radius: 6px; font-size: 12px;">
    <p style="margin: 2px 0;"><strong>Salarié(e) :</strong> {{nom_salarie}} (Matricule : {{matricule_salarie}})</p>
    <p style="margin: 2px 0;"><strong>Fonction / Poste :</strong> {{poste_occupe}}</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 12px;">
    <tr style="background: #003050; color: white;">
      <th style="padding: 6px 10px; text-align: left;">Éléments de rémunération</th>
      <th style="padding: 6px 10px; text-align: right;">Montant (FCFA)</th>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px;">Salaire de base brut</td>
      <td style="padding: 8px; text-align: right;">{{salaire_base}}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px;">Primes et indemnités diverses</td>
      <td style="padding: 8px; text-align: right;">+ {{primes_indemnites}}</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px; color: #e11d48;">Cotisations sociales & Retenues fiscales (IPRES/CNSS/CSS)</td>
      <td style="padding: 8px; text-align: right; color: #e11d48;">- {{cotisations_sociales}}</td>
    </tr>
  </table>

  <div style="margin-top: 18px; padding: 12px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
    <span style="font-weight: bold; color: #065f46;">NET À PAYER :</span>
    <span style="font-size: 16px; font-weight: 900; color: #065f46;">{{salaire_net_payer}} FCFA</span>
  </div>
</div>`,
    versionHistory: [
      {
        version: 'v2.1',
        modifiedAt: '2026-08-01 11:15',
        modifiedBy: 'Admin KONTROL',
        content: `<!-- MODELE BULLETIN DE PAIE KONTROL -->`,
        comment: 'Mise à jour barème cotisations IPRES / CSS'
      }
    ]
  },
  {
    id: 'tpl_fiche_client',
    title: 'Fiche Synthèse Client & Compte Tier',
    category: 'fiches',
    docTypeLabel: 'Fiche Client',
    currentVersion: 'v1.2',
    lastModified: '2026-07-10',
    author: 'Admin KONTROL',
    variables: ['{{nom_entreprise}}', '{{client_nom}}', '{{client_rc}}', '{{client_telephone}}', '{{client_email}}', '{{plafond_credit}}', '{{encours_actuel}}'],
    content: `<!-- MODELE FICHE CLIENT KONTROL -->
<div class="fiche-client-box" style="font-family: sans-serif; padding: 20px; border: 1px solid #cbd5e1; border-radius: 8px;">
  <h3 style="color: #003050; margin: 0 0 12px 0;">FICHE DE RENSEIGNEMENT CLIENT CRM</h3>
  <p><strong>Raison Sociale :</strong> {{client_nom}}</p>
  <p><strong>RC / NINEA :</strong> {{client_rc}}</p>
  <p><strong>Téléphone :</strong> {{client_telephone}} | <strong>Email :</strong> {{client_email}}</p>
  <p><strong>Plafond de crédit autorisé :</strong> {{plafond_credit}} FCFA</p>
  <p><strong>Encours financier actuel :</strong> {{encours_actuel}} FCFA</p>
</div>`,
    versionHistory: [
      {
        version: 'v1.2',
        modifiedAt: '2026-07-10 14:00',
        modifiedBy: 'Admin KONTROL',
        content: `<!-- MODELE FICHE CLIENT KONTROL -->`,
        comment: 'Ajout suivi de l\'encours autorisé'
      }
    ]
  },

  // 4. CONTRATS
  {
    id: 'tpl_contrat_prestation',
    title: 'Contrat de Prestation de Services B2B',
    category: 'contrats',
    docTypeLabel: 'Contrat Prestation',
    currentVersion: 'v1.8',
    lastModified: '2026-08-01',
    author: 'Admin KONTROL',
    variables: ['{{nom_entreprise}}', '{{prestataire_nom}}', '{{objet_mission}}', '{{duree_contrat}}', '{{montant_honoraires}}', '{{modalites_paiement}}', '{{date_signature}}'],
    content: `<!-- MODELE DE CONTRAT PRESTATION KONTROL -->
<div class="contrat-box" style="font-family: sans-serif; padding: 24px; border: 1px solid #cbd5e1; border-radius: 8px; line-height: 1.6;">
  <h2 style="color: #003050; text-align: center; margin-top: 0;">CONTRAT DE PRESTATION DE SERVICES</h2>
  
  <p><strong>ENTRE LES SOUSSIGNÉS :</strong></p>
  <p>La société <strong>{{nom_entreprise}}</strong>, d'une part,<br/>
  ET <strong>{{prestataire_nom}}</strong>, d'autre part.</p>

  <h4 style="color: #003050; margin-bottom: 4px;">Article 1 - Objet de la mission</h4>
  <p style="margin-top: 0;">{{objet_mission}}</p>

  <h4 style="color: #003050; margin-bottom: 4px;">Article 2 - Durée et Exécution</h4>
  <p style="margin-top: 0;">Le présent contrat est conclu pour une durée de : {{duree_contrat}}.</p>

  <h4 style="color: #003050; margin-bottom: 4px;">Article 3 - Rémunération et Modalités</h4>
  <p style="margin-top: 0;">Montant convenu : <strong>{{montant_honoraires}} FCFA</strong> selon les modalités suivantes : {{modalites_paiement}}.</p>

  <div style="margin-top: 36px; display: flex; justify-content: space-between;">
    <div>Fait le : {{date_signature}}<br/>Pour l'Entreprise (Cachet)</div>
    <div>Pour le Prestataire (Signature)</div>
  </div>
</div>`,
    versionHistory: [
      {
        version: 'v1.8',
        modifiedAt: '2026-08-01 10:00',
        modifiedBy: 'Admin KONTROL',
        content: `<!-- MODELE DE CONTRAT PRESTATION KONTROL -->`,
        comment: 'Ajout clause de confidentialité'
      }
    ]
  },
  {
    id: 'tpl_contrat_travail',
    title: 'Contrat de Travail à Durée Indéterminée (CDI)',
    category: 'contrats',
    docTypeLabel: 'Contrat de Travail',
    currentVersion: 'v1.5',
    lastModified: '2026-06-18',
    author: 'Admin KONTROL',
    variables: ['{{nom_entreprise}}', '{{nom_employe}}', '{{titre_poste}}', '{{date_embauche}}', '{{salaire_mensuel_brut}}', '{{lieu_travail}}'],
    content: `<!-- MODELE CONTRAT DE TRAVAIL KONTROL -->
<div class="contrat-travail-box" style="font-family: sans-serif; padding: 24px; border: 1px solid #cbd5e1; border-radius: 8px;">
  <h2 style="color: #003050; text-align: center; margin-top: 0;">CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE</h2>
  <p>L'employeur <strong>{{nom_entreprise}}</strong> engage <strong>{{nom_employe}}</strong> en qualité de <strong>{{titre_poste}}</strong> à compter du <strong>{{date_embauche}}</strong>.</p>
  <p>Lieu d'affectation : {{lieu_travail}}.</p>
  <p>Rémunération mensuelle brute : <strong>{{salaire_mensuel_brut}} FCFA</strong>.</p>
</div>`,
    versionHistory: [
      {
        version: 'v1.5',
        modifiedAt: '2026-06-18 16:30',
        modifiedBy: 'Admin KONTROL',
        content: `<!-- MODELE CONTRAT DE TRAVAIL KONTROL -->`,
        comment: 'Mise en conformité Code du Travail'
      }
    ]
  },

  // 5. REÇUS & BORDEREAUX
  {
    id: 'tpl_recu_paiement',
    title: 'Bordereau & Quittance d\'Abonnement GeniuSPay',
    category: 'recus',
    docTypeLabel: 'Bordereau de Règlement',
    currentVersion: 'v2.0',
    lastModified: '2026-08-12',
    author: 'Admin KONTROL',
    variables: ['{{nom_entreprise}}', '{{numero_bordereau}}', '{{client_nom}}', '{{montant_abonnement}}', '{{reseau_paiement}}', '{{reference_geniuspay}}', '{{date_reglement}}'],
    content: `<!-- MODELE BORDEREAU D'ABONNEMENT GENIUSPAY -->
<div class="recu-box" style="font-family: sans-serif; padding: 20px; border: 2px dashed #003050; border-radius: 8px; background: #fdfefe;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">
    <h3 style="color: #003050; margin: 0;">{{nom_entreprise}}</h3>
    <span style="font-weight: bold; color: #16a34a; font-size: 13px;">BORDEREAU D'ABONNEMENT N° {{numero_bordereau}}</span>
  </div>

  <div style="margin: 16px 0; font-size: 13px; line-height: 1.6;">
    <p>Souscripteur : <strong>{{client_nom}}</strong></p>
    <p>Objet : <strong>Abonnement Licence KONTROL Standard</strong></p>
    <p>Montant encaissé : <strong style="font-size: 16px; color: #003050;">{{montant_abonnement}} FCFA</strong></p>
    <p>Moyen de Paiement : <strong>GeniuSPay</strong> (Réseau : <strong>{{reseau_paiement}}</strong>)</p>
    <p>Réf. Bordereau : <strong>{{reference_geniuspay}}</strong></p>
    <p>Date d'encaissement : <strong>{{date_reglement}}</strong></p>
  </div>

  <div style="text-align: right; margin-top: 20px; font-size: 12px;">
    <p>Pour acquit et quittance d'abonnement,</p>
    <p><strong>Service Comptable KONTROL</strong></p>
  </div>
</div>`,
    versionHistory: [
      {
        version: 'v2.0',
        modifiedAt: '2026-08-12 11:00',
        modifiedBy: 'Admin KONTROL',
        content: `<!-- MODELE BORDEREAU D'ABONNEMENT GENIUSPAY -->`,
        comment: 'Standardisation bordereau GeniuSPay pour abonnements'
      }
    ]
  }
];

// ======================== UTILISATEURS ADMINISTRATEURS BACK-OFFICE ========================
export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm_01',
    name: 'Amadou Diallo',
    email: 'admin.super@kontrol.io',
    role: 'super_admin',
    status: 'active',
    lastLogin: 'A l\'instant',
    createdAt: '2025-01-10',
    phone: '+221 77 452 18 90',
    department: 'Direction',
    permissions: ['ALL_ACCESS', 'MANAGE_USERS', 'MANAGE_BILLING', 'MANAGE_TEMPLATES', 'VIEW_AUDIT', 'MANAGE_ADMINS']
  },
  {
    id: 'adm_02',
    name: 'Awa Diop',
    email: 'finance@kontrol.io',
    role: 'financial_admin',
    status: 'active',
    lastLogin: 'Aujourd\'hui 11:20',
    createdAt: '2025-03-15',
    phone: '+221 78 120 45 67',
    department: 'Finance',
    permissions: ['VIEW_BILLING', 'MANAGE_PAYMENTS', 'EXPORT_DATA', 'VIEW_SUBSCRIPTIONS']
  },
  {
    id: 'adm_03',
    name: 'Moussa Konaté',
    email: 'support.lead@kontrol.io',
    role: 'support_agent',
    status: 'active',
    lastLogin: 'Hier 17:30',
    createdAt: '2025-05-20',
    phone: '+225 05 44 33 22',
    department: 'Support',
    permissions: ['MANAGE_TICKETS', 'REPLY_TICKETS', 'VIEW_CLIENTS']
  },
  {
    id: 'adm_04',
    name: 'Fatimata Traoré',
    email: 'templates@kontrol.io',
    role: 'content_manager',
    status: 'active',
    lastLogin: 'Il y a 2 jours',
    createdAt: '2025-08-01',
    phone: '+223 76 99 88 77',
    department: 'Produit',
    permissions: ['MANAGE_TEMPLATES', 'PUBLISH_VERSIONS', 'PREVIEW_DOCS']
  }
];

// ======================== TICKETS SUPPORT ========================
export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_01',
    ticketNumber: 'TKT-1042',
    clientName: 'Amadou Diallo',
    company: 'Agro Dakar SA',
    subject: 'Confirmation de renouvellement GeniuSPay',
    category: 'genius_pay',
    priority: 'urgent',
    status: 'open',
    assignedTo: 'Moussa Konaté',
    createdAt: '2026-08-20',
    slaMinutesRemaining: 45,
    messages: [
      {
        id: 'msg_1',
        sender: 'Amadou Diallo',
        isAgent: false,
        content: 'Bonjour, notre règlement d\'abonnement via GeniuSPay de 15 000 FCFA a bien été validé, merci de confirmer la quittance.',
        timestamp: '2026-08-20 11:30'
      }
    ]
  },
  {
    id: 'tkt_02',
    ticketNumber: 'TKT-1043',
    clientName: 'Koffi Mensah',
    company: 'Sahel Logistics CI',
    subject: 'Personnalisation du modèle de bon de livraison',
    category: 'technique',
    priority: 'normal',
    status: 'in_progress',
    assignedTo: 'Fatimata Traoré',
    createdAt: '2026-08-21',
    slaMinutesRemaining: 180,
    messages: [
      {
        id: 'msg_2',
        sender: 'Koffi Mensah',
        isAgent: false,
        content: 'Bonjour, nous souhaitons insérer le champ matricule du camion sur nos bons de livraison.',
        timestamp: '2026-08-21 09:15'
      }
    ]
  }
];

// ======================== JOURNAL D'AUDIT ========================
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    timestamp: '2026-08-22 14:30:10',
    actor: 'admin.super@kontrol.io',
    actorRole: 'super_admin',
    action: 'SYSTEM_SYNC',
    target: 'KONTROL ERP Engine',
    severity: 'info',
    hashSignature: '0x8f19ab23c91029e8471629fa'
  },
  {
    id: 'log_02',
    timestamp: '2026-08-22 13:10:00',
    actor: 'finance@kontrol.io',
    actorRole: 'financial_admin',
    action: 'TRANSACTION_VALIDATED',
    target: 'GP_TX_98415 - Abonnement 15 000 FCFA',
    severity: 'info',
    hashSignature: '0x4e29bb991023da45827721cc'
  }
];

// ======================== SESSIONS ========================
export const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'sess_01',
    userEmail: 'admin.super@kontrol.io',
    userName: 'Amadou Diallo',
    device: 'Chrome 124 (macOS)',
    location: 'Dakar, Sénégal',
    loginTime: '2026-08-22 08:00:00',
    lastActive: 'A l\'instant',
    isCurrent: true
  }
];

// ======================== MOYENS DE PAIEMENT VIA GENIUSPAY ========================
export const GATEWAYS_STATUS: GatewayStatus[] = [
  {
    name: 'Orange Money',
    network: 'Orange Money',
    key: 'orange_money',
    status: 'operational',
    mode: 'live',
    latencyMs: 180,
    volume24h: 30000,
    provider: 'GeniuSPay'
  },
  {
    name: 'MTN Mobile Money',
    network: 'MTN Mobile Money',
    key: 'mtn_money',
    status: 'operational',
    mode: 'live',
    latencyMs: 200,
    volume24h: 15000,
    provider: 'GeniuSPay'
  },
  {
    name: 'Wave',
    network: 'Wave',
    key: 'wave',
    status: 'operational',
    mode: 'live',
    latencyMs: 130,
    volume24h: 15000,
    provider: 'GeniuSPay'
  }
];
