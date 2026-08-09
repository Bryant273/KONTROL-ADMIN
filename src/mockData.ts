import { 
  UserClient, 
  Subscription, 
  PlanDefinition, 
  PaymentTransaction, 
  TemplateItem, 
  SupportTicket, 
  AuditLog, 
  ActiveSession,
  GatewayStatus 
} from './types';

export const INITIAL_CLIENTS: UserClient[] = [
  {
    id: 'usr_01',
    name: 'Amadou Diallo',
    email: 'a.diallo@africom-group.com',
    company: 'Africom Logistics & Distribution',
    phone: '+221 77 452 19 80',
    status: 'active',
    role: 'client_admin',
    plan: 'Enterprise',
    paymentMethod: 'orange_money',
    mrr: 450000,
    lastLogin: 'Aujourd\'hui, 14:32',
    ip: '197.224.12.89',
    createdAt: '2025-01-15',
    loginHistory: [
      { date: '2026-08-08 14:32:10', ip: '197.224.12.89', device: 'Chrome 127 / macOS', location: 'Dakar, SN', status: 'success' },
      { date: '2026-08-07 09:15:44', ip: '197.224.12.89', device: 'Chrome 127 / macOS', location: 'Dakar, SN', status: 'success' },
      { date: '2026-08-05 18:20:01', ip: '197.224.15.102', device: 'Safari / iPhone 15', location: 'Dakar, SN', status: 'success' },
      { date: '2026-08-01 11:04:12', ip: '197.224.12.89', device: 'Chrome 127 / macOS', location: 'Dakar, SN', status: 'failed' },
    ]
  },
  {
    id: 'usr_02',
    name: 'Aïcha Kone',
    email: 'kone.aicha@ivoire-tech.ci',
    company: 'Ivoire Tech Solutions',
    phone: '+225 07 88 12 34 56',
    status: 'active',
    role: 'client_admin',
    plan: 'Pro',
    paymentMethod: 'mtn_money',
    mrr: 180000,
    lastLogin: 'Hier, 18:05',
    ip: '160.155.88.12',
    createdAt: '2025-03-22',
    loginHistory: [
      { date: '2026-08-07 18:05:22', ip: '160.155.88.12', device: 'Firefox 128 / Windows 11', location: 'Abidjan, CI', status: 'success' },
      { date: '2026-08-04 10:12:00', ip: '160.155.88.12', device: 'Firefox 128 / Windows 11', location: 'Abidjan, CI', status: 'success' }
    ]
  },
  {
    id: 'usr_03',
    name: 'Jean-Marc Bamba',
    email: 'jm.bamba@sahel-pharma.com',
    company: 'Sahel Pharma Distribution',
    phone: '+223 66 90 11 22',
    status: 'active',
    role: 'client_admin',
    plan: 'Starter',
    paymentMethod: 'orange_money',
    mrr: 75000,
    lastLogin: '06 Aoû 2026, 11:14',
    ip: '41.73.110.45',
    createdAt: '2025-06-10',
    loginHistory: [
      { date: '2026-08-06 11:14:33', ip: '41.73.110.45', device: 'Edge / Windows 10', location: 'Bamako, ML', status: 'success' }
    ]
  },
  {
    id: 'usr_04',
    name: 'Sarah Jenkins',
    email: 'sarah.j@global-trade.io',
    company: 'Global Trade Partners Ltd',
    phone: '+44 20 7946 0912',
    status: 'suspended',
    role: 'client_admin',
    plan: 'Enterprise',
    paymentMethod: 'stripe',
    mrr: 650000,
    lastLogin: '28 Jul 2026, 16:40',
    ip: '82.165.197.1',
    createdAt: '2024-11-05',
    loginHistory: [
      { date: '2026-07-28 16:40:12', ip: '82.165.197.1', device: 'Chrome / macOS', location: 'London, UK', status: 'success' },
      { date: '2026-07-28 16:38:00', ip: '185.220.101.4', device: 'Unknown Script', location: 'Frankfurt, DE', status: 'failed' }
    ]
  },
  {
    id: 'usr_05',
    name: 'Koffi Mensah',
    email: 'koffi@togo-agri.tg',
    company: 'Togo Agri Export',
    phone: '+228 90 12 34 56',
    status: 'pending',
    role: 'client_admin',
    plan: 'Pro',
    paymentMethod: 'mtn_money',
    mrr: 180000,
    lastLogin: 'En attente de 1ère connexion',
    ip: '—',
    createdAt: '2026-08-08',
    loginHistory: []
  },
  {
    id: 'usr_06',
    name: 'Fatou Ndiaye',
    email: 'f.ndiaye@dakar-retail.sn',
    company: 'Dakar Retail Group',
    phone: '+221 78 120 44 99',
    status: 'active',
    role: 'client_admin',
    plan: 'Pro',
    paymentMethod: 'orange_money',
    mrr: 180000,
    lastLogin: 'Aujourd\'hui, 16:10',
    ip: '197.224.20.15',
    createdAt: '2025-09-01',
    loginHistory: [
      { date: '2026-08-08 16:10:05', ip: '197.224.20.15', device: 'Chrome / Android', location: 'Dakar, SN', status: 'success' }
    ]
  }
];

export const INITIAL_PLANS: PlanDefinition[] = [
  {
    id: 'plan_starter',
    name: 'Starter',
    priceMonthly: 75000,
    priceYearly: 750000,
    description: 'Idéal pour TPE et PME naissantes nécessitant une comptabilité et gestion de stock de base.',
    features: [
      'Jusqu\'à 3 utilisateurs',
      'Facturation & Devis illimités',
      'Paiements Mobile Money intégrés',
      'Export PDF & Excel basique',
      'Support email 48h'
    ],
    subscriberCount: 42
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    priceMonthly: 180000,
    priceYearly: 1800000,
    description: 'Pour les entreprises en pleine croissance requérant automatisation, RH et multi-boutiques.',
    features: [
      'Jusqu\'à 15 utilisateurs',
      'Gestion multi-magasins & stocks avancés',
      'Module Paie & Ressources Humaines',
      'Passerelles Stripe / PayPal / OM / MTN',
      'Rapprochement bancaire auto',
      'Support prioritaire SLA 4h'
    ],
    subscriberCount: 118,
    isPopular: true
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    priceMonthly: 450000,
    priceYearly: 4500000,
    description: 'Pour les grands groupes exigeant une sur-mesure, API dédiées et audit trail complet.',
    features: [
      'Utilisateurs illimités',
      'Multi-filiales & Consolidation',
      'Intégration API & Webhooks personnalisés',
      'Chiffrement AES-256 & Audit Logs',
      'Templates sur-mesure avec versioning',
      'Account Manager dédié & SLA 1h'
    ],
    subscriberCount: 35
  },
  {
    id: 'plan_custom',
    name: 'Custom',
    priceMonthly: 850000,
    priceYearly: 8500000,
    description: 'Infrastructure dédiée Cloud privé avec gouvernance sur-mesure et support 24/7.',
    features: [
      'Serveurs Cloud dédiés MinIO/S3',
      'Garantie de disponibilité SLA 99.99%',
      'Connecteurs ERP propriétaires',
      'Audits de sécurité trimestriels',
      'Support 24/7 Téléphone & WhatsApp'
    ],
    subscriberCount: 8
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_101',
    userId: 'usr_01',
    userName: 'Amadou Diallo',
    userEmail: 'a.diallo@africom-group.com',
    company: 'Africom Logistics & Distribution',
    planName: 'Enterprise',
    price: 450000,
    billingCycle: 'mensuel',
    status: 'actif',
    startDate: '2025-01-15',
    nextBillingDate: '2026-08-15',
    autoRenew: true,
    paymentChannel: 'orange_money',
    daysRemaining: 7
  },
  {
    id: 'sub_102',
    userId: 'usr_02',
    userName: 'Aïcha Kone',
    userEmail: 'kone.aicha@ivoire-tech.ci',
    company: 'Ivoire Tech Solutions',
    planName: 'Pro',
    price: 180000,
    billingCycle: 'mensuel',
    status: 'expire_bientot',
    startDate: '2025-03-22',
    nextBillingDate: '2026-08-10',
    autoRenew: true,
    paymentChannel: 'mtn_money',
    daysRemaining: 2
  },
  {
    id: 'sub_103',
    userId: 'usr_03',
    userName: 'Jean-Marc Bamba',
    userEmail: 'jm.bamba@sahel-pharma.com',
    company: 'Sahel Pharma Distribution',
    planName: 'Starter',
    price: 75000,
    billingCycle: 'mensuel',
    status: 'actif',
    startDate: '2025-06-10',
    nextBillingDate: '2026-09-10',
    autoRenew: true,
    paymentChannel: 'orange_money',
    daysRemaining: 33
  },
  {
    id: 'sub_104',
    userId: 'usr_04',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@global-trade.io',
    company: 'Global Trade Partners Ltd',
    planName: 'Enterprise',
    price: 650000,
    billingCycle: 'mensuel',
    status: 'suspendu',
    startDate: '2024-11-05',
    nextBillingDate: '2026-07-05',
    autoRenew: false,
    paymentChannel: 'stripe',
    daysRemaining: 0
  },
  {
    id: 'sub_105',
    userId: 'usr_06',
    userName: 'Fatou Ndiaye',
    userEmail: 'f.ndiaye@dakar-retail.sn',
    company: 'Dakar Retail Group',
    planName: 'Pro',
    price: 180000,
    billingCycle: 'annuel',
    status: 'actif',
    startDate: '2025-09-01',
    nextBillingDate: '2026-09-01',
    autoRenew: true,
    paymentChannel: 'orange_money',
    daysRemaining: 24
  }
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx_9901',
    transactionId: 'OM-SN-20260808-8849102',
    clientName: 'Amadou Diallo',
    company: 'Africom Logistics & Distribution',
    amount: 450000,
    currency: 'XOF',
    gateway: 'Orange Money',
    status: 'success',
    timestamp: '2026-08-08 14:15:02',
    gatewayRef: 'OM_REF_88192039102',
    hashSignature: '0x7f8a91b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
    payload: {
      msisdn: '221774521980',
      status_code: '200_SUCCESS',
      fee_xof: 4500,
      settlement_date: '2026-08-08',
      ip_origin: '197.224.12.89'
    }
  },
  {
    id: 'tx_9902',
    transactionId: 'MTN-CI-20260808-1120492',
    clientName: 'Aïcha Kone',
    company: 'Ivoire Tech Solutions',
    amount: 180000,
    currency: 'XOF',
    gateway: 'MTN Mobile Money',
    status: 'pending',
    timestamp: '2026-08-08 13:40:11',
    gatewayRef: 'MTN_REF_002931023',
    hashSignature: '0xa1b2c3d4e5f60718293a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    payload: {
      msisdn: '2250788123456',
      status_code: 'PENDING_USER_PIN',
      retry_count: 1,
      ip_origin: '160.155.88.12'
    }
  },
  {
    id: 'tx_9903',
    transactionId: 'ST-INT-20260807-550192',
    clientName: 'Sarah Jenkins',
    company: 'Global Trade Partners Ltd',
    amount: 1100,
    currency: 'EUR',
    gateway: 'Stripe',
    status: 'failed',
    timestamp: '2026-08-07 09:22:18',
    gatewayRef: 'ch_3Pz9K2E2eZvKYlo21G5qW7',
    hashSignature: '0x9876543210fedcba0123456789abcdef0123456789abcdef0123456789abcdef',
    payload: {
      card_last4: '4242',
      failure_reason: 'insufficient_funds',
      risk_level: 'normal',
      stripe_code: 'card_declined'
    }
  },
  {
    id: 'tx_9904',
    transactionId: 'PP-GLOBAL-20260806-0012',
    clientName: 'Dakar Retail Group',
    company: 'Dakar Retail Group',
    amount: 180000,
    currency: 'XOF',
    gateway: 'PayPal',
    status: 'success',
    timestamp: '2026-08-06 17:05:40',
    gatewayRef: 'PAYID-M2918203912',
    hashSignature: '0x1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef0',
    payload: {
      payer_id: 'PP_NDIAYE_9912',
      fee_amount: 3200,
      verified_account: true
    }
  },
  {
    id: 'tx_9905',
    transactionId: 'OM-ML-20260805-4412091',
    clientName: 'Jean-Marc Bamba',
    company: 'Sahel Pharma Distribution',
    amount: 75000,
    currency: 'XOF',
    gateway: 'Orange Money',
    status: 'success',
    timestamp: '2026-08-05 10:11:55',
    gatewayRef: 'OM_REF_551920192',
    hashSignature: '0x3f2e1d0c9b8a7f6e5d4c3b2a10f9e8d7c6b5a493827100112233445566778899',
    payload: {
      msisdn: '22366901122',
      status_code: '200_SUCCESS'
    }
  }
];

export const INITIAL_TEMPLATES: TemplateItem[] = [
  {
    id: 'tpl_01',
    title: 'Facture d\'Abonnement Standard KONTROL',
    category: 'factures',
    currentVersion: 'v2.1',
    lastModified: '2026-08-02 11:30',
    author: 'Admin KONTROL',
    variables: ['{{client_nom}}', '{{entreprise_nom}}', '{{facture_num}}', '{{montant_ht}}', '{{montant_tva}}', '{{montant_ttc}}', '{{date_echeance}}', '{{lien_orange_money}}'],
    content: `FACTURE N° {{facture_num}}
KONTROL ERP – Société Editrice

CLIENT :
{{entreprise_nom}}
A l'attention de : {{client_nom}}

DÉSIGNATION :
Souscription Licence KONTROL ERP (Plan : {{plan_nom}})
Période : Mensuelle d'Abonnement

MONTANT HT : {{montant_ht}} XOF
TVA (18%) : {{montant_tva}} XOF
TOTAL NET A PAYER : {{montant_ttc}} XOF

Payer directement par Mobile Money : {{lien_orange_money}}
Date limite d'échéance : {{date_echeance}}`,
    versionHistory: [
      {
        version: 'v2.1',
        modifiedAt: '2026-08-02 11:30',
        modifiedBy: 'Admin KONTROL',
        content: `FACTURE N° {{facture_num}}\nKONTROL ERP – Société Editrice\n...`,
        comment: 'Ajout de la variable {{lien_orange_money}} et du montant TVA 18%.'
      },
      {
        version: 'v2.0',
        modifiedAt: '2026-06-15 09:00',
        modifiedBy: 'Admin KONTROL',
        content: `FACTURE N° {{facture_num}}\nKONTROL ERP\n...`,
        comment: 'Refonte complète du design de facture et mentions légales.'
      },
      {
        version: 'v1.0',
        modifiedAt: '2025-01-10 14:00',
        modifiedBy: 'System Init',
        content: `Facture KONTROL\nClient: {{client_nom}}\nMontant: {{montant_ttc}}`,
        comment: 'Version initiale initiale créée à l\'installation.'
      }
    ]
  },
  {
    id: 'tpl_02',
    title: 'Contrat de Licence ERP SaaS Enterprise',
    category: 'contrats',
    currentVersion: 'v1.4',
    lastModified: '2026-07-18 16:45',
    author: 'Service Juridique KONTROL',
    variables: ['{{client_nom}}', '{{entreprise_nom}}', '{{siret_rccm}}', '{{date_signature}}', '{{sla_garantie}}'],
    content: `CONTRAT DE LICENCE D'UTILISATION KONTROL ERP SAAS

ENTRE LES SOUSSIGNÉS :
La Société KONTROL ERP SAS, d'une part,
ET
{{entreprise_nom}} (RCCM: {{siret_rccm}}), représentée par {{client_nom}}, d'autre part.

ARTICLE 1 : OBJET DU CONTRAT
KONTROL ERP concède au Client un droit d'accès personnel, non exclusif et intransférable au logiciel KONTROL ERP SaaS.

ARTICLE 2 : GARANTIE DE SERVICE (SLA)
Le taux de disponibilité garanti est fixé à {{sla_garantie}}% en mensuel.

ARTICLE 3 : CONFIDENTIALITÉ & DONNÉES (AES-256)
Les données sont hébergées de manière sécurisée avec chiffrement AES-256.

Fait le {{date_signature}}.`,
    versionHistory: [
      {
        version: 'v1.4',
        modifiedAt: '2026-07-18 16:45',
        modifiedBy: 'Service Juridique KONTROL',
        content: `CONTRAT DE LICENCE D'UTILISATION KONTROL ERP SAAS...`,
        comment: 'Mise en conformité RGPD / Protection des données OHADA.'
      }
    ]
  },
  {
    id: 'tpl_03',
    title: 'Email de Relance - Échéance Imminente',
    category: 'emails',
    currentVersion: 'v3.0',
    lastModified: '2026-08-01 08:15',
    author: 'Support Client',
    variables: ['{{client_nom}}', '{{plan_nom}}', '{{next_billing_date}}', '{{pay_link}}'],
    content: `Objet: [KONTROL ERP] Votre abonnement {{plan_nom}} arrive à échéance le {{next_billing_date}}

Bonjour {{client_nom}},

Nous vous rappelons que votre abonnement KONTROL ERP (Plan {{plan_nom}}) sera renouvelé automatiquement le {{next_billing_date}}.

Pour éviter toute interruption de vos services et garder le contrôle sur vos stocks et factures, veuillez vérifier votre moyen de paiement :

Lien de paiement sécurisé (Orange Money / MTN / CB) :
{{pay_link}}

L'équipe KONTROL ERP reste à votre entière disposition.`,
    versionHistory: [
      {
        version: 'v3.0',
        modifiedAt: '2026-08-01 08:15',
        modifiedBy: 'Support Client',
        content: `Objet: [KONTROL ERP] Votre abonnement {{plan_nom}}...`,
        comment: 'Optimisation de la clarté du call to action et ajout lien direct.'
      }
    ]
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_801',
    ticketNumber: 'TKT-2026-0801',
    clientName: 'Aïcha Kone',
    company: 'Ivoire Tech Solutions',
    subject: 'Échec du renouvellement par MTN Mobile Money',
    category: 'facturation',
    priority: 'urgent',
    status: 'open',
    assignedTo: 'Moussa Traoré (Support N2)',
    createdAt: '2026-08-08 15:10',
    slaMinutesRemaining: 38,
    messages: [
      {
        id: 'msg_1',
        sender: 'Aïcha Kone',
        isAgent: false,
        content: 'Bonjour, j\'essaie de valider le paiement de mon abonnement Pro via MTN Mobile Money Côte d\'Ivoire mais le push OTP n\'arrive pas sur mon téléphone (+225 07 88 12 34 56). Merci de vérifier le statut de la passerelle.',
        timestamp: '2026-08-08 15:10'
      },
      {
        id: 'msg_2',
        sender: 'System Bot',
        isAgent: true,
        content: '[Note Interne Automatique] Détection d\'une latence de 4200ms sur le gateway MTN CI. Le ticket a été surclassé en URGENT (SLA 1h).',
        timestamp: '2026-08-08 15:11',
        isInternalNote: true
      }
    ]
  },
  {
    id: 'tkt_802',
    ticketNumber: 'TKT-2026-0798',
    clientName: 'Amadou Diallo',
    company: 'Africom Logistics & Distribution',
    subject: 'Demande de webhook sur-mesure pour synchronisation SAP',
    category: 'intégration',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'Cheikh Ndiaye (Lead Tech)',
    createdAt: '2026-08-08 11:20',
    slaMinutesRemaining: 145,
    messages: [
      {
        id: 'msg_10',
        sender: 'Amadou Diallo',
        isAgent: false,
        content: 'Bonjour l\'équipe KONTROL, nous aimerions recevoir les événements de validation de facture directement sur notre serveur SAP via HTTPS POST signé HMAC-SHA256.',
        timestamp: '2026-08-08 11:20'
      },
      {
        id: 'msg_11',
        sender: 'Cheikh Ndiaye',
        isAgent: true,
        content: 'Bonjour M. Diallo, nous avons préparé la clé secrète HMAC dans votre espace développeur. Pouvez-vous tester le webhook sandbox ?',
        timestamp: '2026-08-08 13:00'
      }
    ]
  },
  {
    id: 'tkt_803',
    ticketNumber: 'TKT-2026-0790',
    clientName: 'Jean-Marc Bamba',
    company: 'Sahel Pharma Distribution',
    subject: 'Ajout de 2 utilisateurs supplémentaires au plan Starter',
    category: 'compte',
    priority: 'normal',
    status: 'waiting',
    assignedTo: 'Mariam Coulibaly',
    createdAt: '2026-08-07 16:00',
    slaMinutesRemaining: 520,
    messages: [
      {
        id: 'msg_20',
        sender: 'Jean-Marc Bamba',
        isAgent: false,
        content: 'Comment ajouter 2 pharmaciens de plus dans le module de vente sans passer directement au plan Pro ?',
        timestamp: '2026-08-07 16:00'
      }
    ]
  },
  {
    id: 'tkt_804',
    ticketNumber: 'TKT-2026-0750',
    clientName: 'Fatou Ndiaye',
    company: 'Dakar Retail Group',
    subject: 'Demande de duplicata de facture de Juillet',
    category: 'facturation',
    priority: 'low',
    status: 'resolved',
    assignedTo: 'Mariam Coulibaly',
    createdAt: '2026-08-04 10:00',
    slaMinutesRemaining: 0,
    messages: [
      {
        id: 'msg_30',
        sender: 'Fatou Ndiaye',
        isAgent: false,
        content: 'Bonjour, merci de m\'envoyer la facture payée du 01/07.',
        timestamp: '2026-08-04 10:00'
      },
      {
        id: 'msg_31',
        sender: 'Mariam Coulibaly',
        isAgent: true,
        content: 'Bonjour Mme Ndiaye, la facture vous a été renvoyée par email et reste téléchargeable sur votre portail.',
        timestamp: '2026-08-04 10:25'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_901',
    timestamp: '2026-08-08 18:02:14',
    actor: 'admin.super@kontrol.io',
    actorRole: 'Super Admin',
    action: 'SUSPEND_USER',
    target: 'Sarah Jenkins (usr_04)',
    ip: '197.224.12.1',
    severity: 'alert',
    hashSignature: '0xe83f2a10b99182d38472910293128472891029384712039128374'
  },
  {
    id: 'log_902',
    timestamp: '2026-08-08 15:11:00',
    actor: 'system.gateway',
    actorRole: 'Service Process',
    action: 'PAYMENT_CALLBACK_SUCCESS',
    target: 'Transaction OM-SN-20260808-8849102',
    ip: '10.0.4.12',
    severity: 'info',
    hashSignature: '0xa1192837491029384712938471293847129384712938471293'
  },
  {
    id: 'log_903',
    timestamp: '2026-08-08 11:30:22',
    actor: 'admin.juridique@kontrol.io',
    actorRole: 'Content Manager',
    action: 'TEMPLATE_UPDATE_VERSION',
    target: 'Facture d\'Abonnement Standard (tpl_01 -> v2.1)',
    ip: '197.224.12.89',
    severity: 'info',
    hashSignature: '0xc8293019283749102938471293847129384712938471293847'
  },
  {
    id: 'log_904',
    timestamp: '2026-08-07 22:15:00',
    actor: 'admin.finance@kontrol.io',
    actorRole: 'Financial Admin',
    action: 'MANUAL_RENEWAL_TRIGGER',
    target: 'Abonnement sub_105 (Fatou Ndiaye)',
    ip: '41.202.219.10',
    severity: 'warning',
    hashSignature: '0xf9281029384712039128374910293847129384712938471293'
  },
  {
    id: 'log_905',
    timestamp: '2026-08-06 09:00:10',
    actor: 'admin.super@kontrol.io',
    actorRole: 'Super Admin',
    action: 'ROLE_PERMISSIONS_UPDATE',
    target: 'Rôle Support Agent: +CanViewFinancialReports',
    ip: '197.224.12.1',
    severity: 'warning',
    hashSignature: '0x38291029384712039128374910293847129384712938471293'
  }
];

export const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'sess_1',
    userEmail: 'admin.super@kontrol.io',
    userName: 'Super Admin KONTROL',
    ip: '197.224.12.1',
    device: 'Chrome 127 / macOS Sonoma',
    location: 'Dakar, SN (HQ)',
    loginTime: '2026-08-08 08:30:00',
    lastActive: 'A l\'instant',
    isCurrent: true
  },
  {
    id: 'sess_2',
    userEmail: 'moussa.t@kontrol.io',
    userName: 'Moussa Traoré (Support)',
    ip: '160.155.10.4',
    device: 'Firefox 128 / Windows 11',
    location: 'Abidjan, CI',
    loginTime: '2026-08-08 12:15:00',
    lastActive: 'Il y a 5 min'
  },
  {
    id: 'sess_3',
    userEmail: 'mariam.c@kontrol.io',
    userName: 'Mariam Coulibaly (Finance)',
    ip: '41.73.100.12',
    device: 'Safari / iPad Pro',
    location: 'Bamako, ML',
    loginTime: '2026-08-08 14:00:00',
    lastActive: 'Il y a 22 min'
  }
];

export const GATEWAYS_STATUS: GatewayStatus[] = [
  {
    name: 'Orange Money',
    key: 'orange_money',
    status: 'operational',
    mode: 'live',
    latencyMs: 145,
    volume24h: 38500000
  },
  {
    name: 'MTN Mobile Money',
    key: 'mtn_money',
    status: 'degraded',
    mode: 'live',
    latencyMs: 3200,
    volume24h: 18200000
  },
  {
    name: 'Stripe',
    key: 'stripe',
    status: 'operational',
    mode: 'live',
    latencyMs: 82,
    volume24h: 14200000
  },
  {
    name: 'PayPal',
    key: 'paypal',
    status: 'operational',
    mode: 'live',
    latencyMs: 110,
    volume24h: 8900000
  }
];

export const REVENUE_MONTHLY_DATA = [
  { month: 'Jan', mrr: 12500000, orangeMoney: 6200000, mtnMoney: 3800000, stripe: 1500000, paypal: 1000000 },
  { month: 'Fév', mrr: 14200000, orangeMoney: 7100000, mtnMoney: 4200000, stripe: 1800000, paypal: 1100000 },
  { month: 'Mar', mrr: 16800000, orangeMoney: 8500000, mtnMoney: 4900000, stripe: 2100000, paypal: 1300000 },
  { month: 'Avr', mrr: 18900000, orangeMoney: 9800000, mtnMoney: 5400000, stripe: 2200000, paypal: 1500000 },
  { month: 'Mai', mrr: 21400000, orangeMoney: 11200000, mtnMoney: 6100000, stripe: 2500000, paypal: 1600000 },
  { month: 'Juin', mrr: 24100000, orangeMoney: 12800000, mtnMoney: 6800000, stripe: 2800000, paypal: 1700000 },
  { month: 'Juil', mrr: 26800000, orangeMoney: 14100000, mtnMoney: 7500000, stripe: 3200000, paypal: 2000000 },
  { month: 'Aoû', mrr: 29800000, orangeMoney: 15900000, mtnMoney: 8100000, stripe: 3600000, paypal: 2200000 }
];
