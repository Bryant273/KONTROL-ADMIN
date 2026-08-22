import React, { useState } from 'react';
import { 
  FileCode, 
  FileText, 
  Layers, 
  Save, 
  CheckCircle2, 
  Tag, 
  Eye, 
  Sparkles, 
  Receipt, 
  Truck, 
  UserCheck, 
  ScrollText, 
  X,
  History,
  Copy,
  Check
} from 'lucide-react';
import { TemplateItem, TemplateCategory, TemplateVersion } from '../types';

interface TemplatesViewProps {
  templates: TemplateItem[];
  onUpdateTemplate: (tpl: TemplateItem) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  onUpdateTemplate
}) => {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('factures');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || 'tpl_invoice_standard');
  
  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || 
                          templates.find(t => t.category === activeCategory) || 
                          templates[0];

  const [editableContent, setEditableContent] = useState<string>(currentTemplate?.content || '');
  const [commitComment, setCommitComment] = useState<string>('');
  const [showVersionDrawer, setShowVersionDrawer] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);

  // Switch template
  const handleSelectTemplate = (tpl: TemplateItem) => {
    setSelectedTemplateId(tpl.id);
    setEditableContent(tpl.content);
    setCommitComment('');
    setSaveSuccessNotice(false);
  };

  const handleInsertVariable = (varName: string) => {
    setEditableContent(prev => prev + ' ' + varName);
    setCopiedVariable(varName);
    setTimeout(() => setCopiedVariable(null), 1500);
  };

  const handleSaveNewVersion = () => {
    if (!currentTemplate) return;

    const currentVerParts = currentTemplate.currentVersion.replace('v', '').split('.');
    const major = parseInt(currentVerParts[0] || '1', 10);
    const minor = parseInt(currentVerParts[1] || '0', 10) + 1;
    const newVerStr = `v${major}.${minor}`;

    const newVersionObj: TemplateVersion = {
      version: newVerStr,
      modifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      modifiedBy: 'Admin KONTROL',
      content: editableContent,
      comment: commitComment || 'Mise à jour du modèle par l\'administrateur.'
    };

    const updatedTpl: TemplateItem = {
      ...currentTemplate,
      currentVersion: newVerStr,
      content: editableContent,
      lastModified: newVersionObj.modifiedAt,
      versionHistory: [newVersionObj, ...currentTemplate.versionHistory]
    };

    onUpdateTemplate(updatedTpl);
    setCommitComment('');
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  const handleRestoreVersion = (ver: TemplateVersion) => {
    setEditableContent(ver.content);
    setShowVersionDrawer(false);
  };

  const filteredTemplates = templates.filter(t => t.category === activeCategory);

  // Generate realistic live preview HTML
  const generatePreviewHTML = (raw: string) => {
    return raw
      .replace(/\{\{nom_entreprise\}\}/g, 'AGRO DAKAR SA')
      .replace(/\{\{adresse_entreprise\}\}/g, 'Avenue Lamine Guèye, Dakar')
      .replace(/\{\{pays\}\}/g, 'Sénégal')
      .replace(/\{\{ninea_rccm\}\}/g, 'SN-DKR-2022-B-99812')
      .replace(/\{\{numero_facture\}\}/g, 'FACT-2026-0812')
      .replace(/\{\{date_facturation\}\}/g, '22/08/2026')
      .replace(/\{\{date_echeance\}\}/g, '12/09/2026')
      .replace(/\{\{client_nom\}\}/g, 'Société Sahélienne de Distribution')
      .replace(/\{\{montant_ht\}\}/g, '12 711 864')
      .replace(/\{\{montant_tva\}\}/g, '2 288 136')
      .replace(/\{\{montant_ttc\}\}/g, '15 000 000')
      .replace(/\{\{num_bon_commande\}\}/g, 'BC-2026-0045')
      .replace(/\{\{num_bon_livraison\}\}/g, 'BL-2026-0098')
      .replace(/\{\{fournisseur_nom\}\}/g, 'Société Générale des Engrais')
      .replace(/\{\{date_emission\}\}/g, '22/08/2026')
      .replace(/\{\{lieu_livraison\}\}/g, 'Entrepôt Central - Zone Portuaire, Dakar')
      .replace(/\{\{total_articles\}\}/g, '500 Sacs de 50kg (Total: 25 Tonnes)')
      .replace(/\{\{signature_acheteur\}\}/g, 'Amadou Diallo (Directeur Logistique)')
      .replace(/\{\{adresse_livraison\}\}/g, 'Zone Franche Industrielle de Yopougon, Abidjan')
      .replace(/\{\{transporteur\}\}/g, 'Sahel Express Transports (Camion Matricule: DK-4829-CI)')
      .replace(/\{\{date_reception\}\}/g, '22/08/2026 à 14h30')
      .replace(/\{\{emargement_client\}\}/g, 'Koffi Mensah (Cachet Reçu)')
      .replace(/\{\{nom_salarie\}\}/g, 'Fatou Ndiaye')
      .replace(/\{\{matricule_salarie\}\}/g, 'EMP-SN-042')
      .replace(/\{\{poste_occupe\}\}/g, 'Responsable Commerciale KONTROL')
      .replace(/\{\{periode_paie\}\}/g, 'Août 2026')
      .replace(/\{\{salaire_base\}\}/g, '450 000')
      .replace(/\{\{primes_indemnites\}\}/g, '120 000')
      .replace(/\{\{cotisations_sociales\}\}/g, '48 500')
      .replace(/\{\{salaire_net_payer\}\}/g, '521 500')
      .replace(/\{\{client_rc\}\}/g, 'RCCM SN-DKR-2024-B-10293')
      .replace(/\{\{client_telephone\}\}/g, '+221 78 300 44 55')
      .replace(/\{\{client_email\}\}/g, 'contact@senegal-btp.com')
      .replace(/\{\{plafond_credit\}\}/g, '5 000 000')
      .replace(/\{\{encours_actuel\}\}/g, '1 250 000')
      .replace(/\{\{prestataire_nom\}\}/g, 'Cabinet Conseil & Audit OHADA')
      .replace(/\{\{objet_mission\}\}/g, 'Assistance à l\'intégration de la comptabilité analytique KONTROL ERP.')
      .replace(/\{\{duree_contrat\}\}/g, '6 mois renouvelables')
      .replace(/\{\{montant_honoraires\}\}/g, '3 000 000')
      .replace(/\{\{modalites_paiement\}\}/g, 'Paiements mensuels de 500 000 FCFA via GeniuSPay')
      .replace(/\{\{date_signature\}\}/g, '22/08/2026')
      .replace(/\{\{nom_employe\}\}/g, 'Moussa Konaté')
      .replace(/\{\{titre_poste\}\}/g, 'Développeur Intégrateur ERP')
      .replace(/\{\{date_embauche\}\}/g, '01/09/2026')
      .replace(/\{\{salaire_mensuel_brut\}\}/g, '650 000')
      .replace(/\{\{lieu_travail\}\}/g, 'Siège Social KONTROL - Dakar')
      .replace(/\{\{recu_numero\}\}/g, 'REC-GP-2026-9041')
      .replace(/\{\{montant_recu\}\}/g, '15 000')
      .replace(/\{\{mode_reglement\}\}/g, 'GeniuSPay (Orange Money)')
      .replace(/\{\{reference_transaction\}\}/g, 'GP_OM_SN_8471923')
      .replace(/\{\{date_reglement\}\}/g, '22/08/2026 15:30');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-kontrol p-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[#003050] text-[#50B0E0] flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#003050]">
                Gestionnaire de Modèles & Documents d'Entreprise
              </h1>
              <p className="text-[12px] text-[#7a9ab0]">
                Génération des Factures, Bons, Fiches, Contrats et Reçus paramétrables depuis l'interface entreprise.
              </p>
            </div>
          </div>
        </div>

        {/* 5 Categories Navigation Pills */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 bg-[#F0F0F0] p-1 rounded-[8px] border border-[rgba(0,48,80,0.12)]">
          <button
            onClick={() => {
              setActiveCategory('factures');
              const firstInCat = templates.find(t => t.category === 'factures');
              if (firstInCat) handleSelectTemplate(firstInCat);
            }}
            className={`px-2.5 py-1.5 rounded-[6px] text-[11.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'factures' ? 'bg-[#003050] text-white shadow-xs' : 'text-[#7a9ab0] hover:text-[#003050]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#50B0E0]" />
            <span>Factures</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('bons');
              const firstInCat = templates.find(t => t.category === 'bons');
              if (firstInCat) handleSelectTemplate(firstInCat);
            }}
            className={`px-2.5 py-1.5 rounded-[6px] text-[11.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'bons' ? 'bg-[#003050] text-white shadow-xs' : 'text-[#7a9ab0] hover:text-[#003050]'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-[#E06020]" />
            <span>Bons</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('fiches');
              const firstInCat = templates.find(t => t.category === 'fiches');
              if (firstInCat) handleSelectTemplate(firstInCat);
            }}
            className={`px-2.5 py-1.5 rounded-[6px] text-[11.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'fiches' ? 'bg-[#003050] text-white shadow-xs' : 'text-[#7a9ab0] hover:text-[#003050]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fiches</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('contrats');
              const firstInCat = templates.find(t => t.category === 'contrats');
              if (firstInCat) handleSelectTemplate(firstInCat);
            }}
            className={`px-2.5 py-1.5 rounded-[6px] text-[11.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'contrats' ? 'bg-[#003050] text-white shadow-xs' : 'text-[#7a9ab0] hover:text-[#003050]'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5 text-purple-600" />
            <span>Contrats</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('recus');
              const firstInCat = templates.find(t => t.category === 'recus');
              if (firstInCat) handleSelectTemplate(firstInCat);
            }}
            className={`px-2.5 py-1.5 rounded-[6px] text-[11.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'recus' ? 'bg-[#003050] text-white shadow-xs' : 'text-[#7a9ab0] hover:text-[#003050]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Reçus</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Selector Column + Editor + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Templates Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <div className="text-[10.5px] font-bold uppercase text-[#7a9ab0] tracking-wider font-mono px-1">
            Modèles de la section ({filteredTemplates.length})
          </div>

          <div className="space-y-1.5">
            {filteredTemplates.map((tpl) => {
              const isSelected = tpl.id === currentTemplate?.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`w-full text-left p-3 rounded-[8px] border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#50B0E0] ring-2 ring-[#50B0E0]/20 shadow-xs'
                      : 'card-kontrol hover:border-[rgba(0,48,80,0.25)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="badge b-premium text-[9px] font-mono">
                      {tpl.currentVersion}
                    </span>
                    <span className="text-[10px] text-[#7a9ab0]">{tpl.docTypeLabel}</span>
                  </div>
                  <div className="text-[12.5px] font-bold text-[#003050] line-clamp-1">{tpl.title}</div>
                  <div className="text-[11px] text-[#7a9ab0] mt-0.5">Modifié : {tpl.lastModified}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor & Visual Preview */}
        {currentTemplate && (
          <div className="lg:col-span-9 card-kontrol p-4 space-y-4">
            {/* Template Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(0,48,80,0.12)] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[15px] font-extrabold text-[#003050]">
                    {currentTemplate.title}
                  </h2>
                  <span className="badge b-standard font-mono">
                    {currentTemplate.currentVersion}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#7a9ab0]">
                  Type : <strong className="text-[#003050]">{currentTemplate.docTypeLabel}</strong> • Par {currentTemplate.author}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVersionDrawer(!showVersionDrawer)}
                  className="btn btn-ol btn-sm text-[11.5px] cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-[#50B0E0]" />
                  Historique ({currentTemplate.versionHistory.length})
                </button>

                <button
                  onClick={handleSaveNewVersion}
                  className="btn btn-ok btn-sm text-[11.5px] font-bold cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Publier Version
                </button>
              </div>
            </div>

            {saveSuccessNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-[6px] text-[12px] font-bold flex items-center gap-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Nouvelle version du modèle enregistrée et synchronisée !
              </div>
            )}

            {/* Variable Tags Selector */}
            <div className="space-y-1.5 bg-[#F0F0F0] p-3 rounded-[6px] border border-[rgba(0,48,80,0.12)]">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#7a9ab0] tracking-wider font-mono">
                <span>Variables d'Entreprise Injectables (Cliquer pour insérer dans le modèle)</span>
                <span className="text-[#50B0E0]">{copiedVariable ? `Inséré: ${copiedVariable}` : 'Handlebars {{...}}'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentTemplate.variables.map((v, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertVariable(v)}
                    className="px-2 py-0.5 bg-white border border-[rgba(0,48,80,0.12)] hover:border-[#50B0E0] hover:text-[#50B0E0] rounded-[5px] text-[11px] font-mono font-bold text-[#003050] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Tag className="w-3 h-3 text-[#50B0E0]" />
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor & Visual Live Preview Side-By-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Code Editor */}
              <div className="space-y-1">
                <label className="block text-[10.5px] font-bold uppercase text-[#7a9ab0] font-mono">
                  Code Source du Modèle (HTML / Handlebars)
                </label>
                <textarea
                  rows={14}
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  className="w-full bg-[#001f35] text-[#90d5ff] font-mono text-[11.5px] p-3 rounded-[6px] border border-white/10 focus:outline-none focus:border-[#50B0E0] leading-relaxed resize-none shadow-inner"
                />
              </div>

              {/* Live Preview Pane */}
              <div className="space-y-1">
                <label className="block text-[10.5px] font-bold uppercase text-[#7a9ab0] font-mono">
                  Aperçu Document Généré (Temps Réel)
                </label>
                <div 
                  className="w-full h-[320px] bg-white border border-[rgba(0,48,80,0.15)] rounded-[6px] p-3 overflow-y-auto shadow-xs text-slate-800"
                  dangerouslySetInnerHTML={{ __html: generatePreviewHTML(editableContent) }}
                />
              </div>
            </div>

            {/* Commit Message Input */}
            <div className="pt-1">
              <label className="block text-[10.5px] font-bold uppercase text-[#7a9ab0] mb-0.5">
                Note de modification pour le Changelog Administrateur
              </label>
              <input
                type="text"
                value={commitComment}
                onChange={(e) => setCommitComment(e.target.value)}
                placeholder="ex: Mise à jour du taux de TVA légal ou ajout du champ matricule de transport"
                className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] px-3 py-1.5 text-[12px] outline-none focus:border-[#50B0E0]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Version History Drawer Modal */}
      {showVersionDrawer && currentTemplate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card-kontrol max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 space-y-3 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[rgba(0,48,80,0.12)] pb-2">
              <div>
                <h3 className="text-[14px] font-bold text-[#003050]">
                  Historique des Versions & Restauration
                </h3>
                <p className="text-[11.5px] text-[#7a9ab0]">
                  Modèle : <strong className="text-[#003050]">{currentTemplate.title}</strong>
                </p>
              </div>
              <button onClick={() => setShowVersionDrawer(false)} className="rab">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {currentTemplate.versionHistory.map((ver, idx) => (
                <div key={idx} className="p-3 rounded-[6px] bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="badge b-premium font-mono text-[10px]">
                      {ver.version}
                    </span>
                    <span className="text-[11px] text-[#7a9ab0]">{ver.modifiedAt} par {ver.modifiedBy}</span>
                  </div>
                  <p className="text-[12px] font-medium text-[#2d4a60] italic">
                    "{ver.comment}"
                  </p>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => handleRestoreVersion(ver)}
                      className="btn btn-ol btn-sm py-1 px-2.5 text-[11px]"
                    >
                      Restaurer cette version
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-[rgba(0,48,80,0.12)]">
              <button
                onClick={() => setShowVersionDrawer(false)}
                className="btn btn-dk btn-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
