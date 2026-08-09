import React, { useState } from 'react';
import { 
  FileCode, 
  FileText, 
  Mail, 
  History, 
  Save, 
  Check, 
  RotateCcw, 
  Eye, 
  Code, 
  Sparkles, 
  Plus, 
  Tag,
  Copy,
  Layers,
  CheckCircle2,
  X
} from 'lucide-react';
import { TemplateItem, TemplateVersion } from '../types';

interface TemplatesViewProps {
  templates: TemplateItem[];
  onUpdateTemplate: (tpl: TemplateItem) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  onUpdateTemplate
}) => {
  const [activeCategory, setActiveCategory] = useState<'factures' | 'contrats' | 'emails'>('factures');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || 'tpl_01');
  
  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const [editableContent, setEditableContent] = useState<string>(currentTemplate?.content || '');
  const [commitComment, setCommitComment] = useState<string>('');
  const [showVersionDrawer, setShowVersionDrawer] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  // When selected template changes, sync editable content
  const handleSelectTemplate = (tpl: TemplateItem) => {
    setSelectedTemplateId(tpl.id);
    setEditableContent(tpl.content);
    setCommitComment('');
    setSaveSuccessNotice(false);
  };

  const handleInsertVariable = (varName: string) => {
    setEditableContent(prev => prev + ' ' + varName);
  };

  const handleSaveNewVersion = () => {
    if (!currentTemplate) return;

    // Increment minor version, e.g. v2.1 -> v2.2
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

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-kontrol p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#003050]">
              Gestionnaire de Templates & Modèles
            </h1>
            <span className="badge b-premium font-mono">
              Versioning v2.1
            </span>
          </div>
          <p className="text-[12px] text-[#7a9ab0] mt-0.5">
            Personnalisation des factures, contrats d'engagement et emails de relance automatique.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 bg-[#F0F0F0] p-1 rounded-[8px] text-[12px]">
          <button
            onClick={() => {
              setActiveCategory('factures');
              const firstInCat = templates.find(t => t.category === 'factures');
              if (firstInCat) handleSelectTemplate(firstInCat);
            }}
            className={`px-3 py-1.5 rounded-[6px] font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'factures' ? 'bg-[#003050] text-white shadow-xs' : 'text-[#7a9ab0] hover:text-[#0d1f2d]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#50B0E0]" />
            Factures
          </button>

          <button
            onClick={() => {
              setActiveCategory('contrats');
              const firstInCat = templates.find(t => t.category === 'contrats');
              if (firstInCat) handleSelectTemplate(firstInCat);
            }}
            className={`px-3 py-1.5 rounded-[6px] font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'contrats' ? 'bg-[#003050] text-white shadow-xs' : 'text-[#7a9ab0] hover:text-[#0d1f2d]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-[#E06020]" />
            Contrats
          </button>

          <button
            onClick={() => {
              setActiveCategory('emails');
              const firstInCat = templates.find(t => t.category === 'emails');
              if (firstInCat) handleSelectTemplate(firstInCat);
            }}
            className={`px-3 py-1.5 rounded-[6px] font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'emails' ? 'bg-[#003050] text-white shadow-xs' : 'text-[#7a9ab0] hover:text-[#0d1f2d]'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#1a7a45]" />
            Emails
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Templates list + Editor + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Template Selector Column */}
        <div className="lg:col-span-3 space-y-2">
          <div className="text-[10px] font-bold uppercase text-[#7a9ab0] tracking-wider font-mono px-1">
            Modèles disponibles ({filteredTemplates.length})
          </div>

          <div className="space-y-1.5">
            {filteredTemplates.map((tpl) => {
              const isSelected = tpl.id === selectedTemplateId;
              return (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`w-full text-left p-3 rounded-[8px] border transition-all ${
                    isSelected
                      ? 'bg-white border-[#50B0E0] ring-1 ring-[#50B0E0]/30 shadow-xs'
                      : 'card-kontrol hover:border-[rgba(0,48,80,0.25)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="badge b-premium text-[9.5px]">
                      {tpl.currentVersion}
                    </span>
                    <span className="text-[10px] text-[#7a9ab0]">{tpl.lastModified.split(' ')[0]}</span>
                  </div>
                  <div className="text-[13px] font-bold text-[#003050] line-clamp-1">{tpl.title}</div>
                  <div className="text-[11px] text-[#7a9ab0] mt-0.5">Par: {tpl.author}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor & Preview Pane */}
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
                  Dernière révision: {currentTemplate.lastModified} par {currentTemplate.author}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVersionDrawer(!showVersionDrawer)}
                  className="btn btn-ol btn-sm"
                >
                  <Layers className="w-3.5 h-3.5 text-[#50B0E0]" />
                  Historique ({currentTemplate.versionHistory.length})
                </button>

                <button
                  onClick={handleSaveNewVersion}
                  className="btn btn-or btn-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  Publier Version
                </button>
              </div>
            </div>

            {saveSuccessNotice && (
              <div className="p-2.5 bg-[#e8f7ef] border border-[#1a7a45]/30 text-[#1a7a45] rounded-[6px] text-[12px] font-bold flex items-center gap-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-[#1a7a45]" />
                Nouvelle version publiée avec succès !
              </div>
            )}

            {/* Variable Tags Selector */}
            <div className="space-y-1.5 bg-[#F0F0F0] p-3 rounded-[6px] border border-[rgba(0,48,80,0.12)]">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#7a9ab0] tracking-wider font-mono">
                <span>Variables dynamiques (Cliquer pour insérer)</span>
                <span>Handlebars</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentTemplate.variables.map((v, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertVariable(v)}
                    className="px-2 py-0.5 bg-white border border-[rgba(0,48,80,0.12)] hover:border-[#50B0E0] hover:text-[#50B0E0] rounded-[5px] text-[11px] font-mono font-bold text-[#003050] transition-colors flex items-center gap-1"
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
                  Éditeur de Modèle (Source)
                </label>
                <textarea
                  rows={12}
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  className="w-full bg-[#003050] text-[#50B0E0] font-mono text-[11.5px] p-3 rounded-[6px] border border-white/10 focus:outline-none focus:border-[#50B0E0] leading-relaxed resize-none shadow-inner"
                />
              </div>

              {/* Live Preview Pane */}
              <div className="space-y-1">
                <label className="block text-[10.5px] font-bold uppercase text-[#7a9ab0] font-mono">
                  Aperçu Visuel en Direct
                </label>
                <div className="w-full h-[280px] bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] p-3.5 overflow-y-auto text-[12px] font-medium text-[#0d1f2d] whitespace-pre-wrap leading-relaxed">
                  {editableContent
                    .replace(/\{\{client_nom\}\}/g, 'Amadou Diallo')
                    .replace(/\{\{entreprise_nom\}\}/g, 'Africom Logistics & Distribution')
                    .replace(/\{\{facture_num\}\}/g, 'FACT-2026-0812')
                    .replace(/\{\{montant_ht\}\}/g, '381.356')
                    .replace(/\{\{montant_tva\}\}/g, '68.644')
                    .replace(/\{\{montant_ttc\}\}/g, '450.000')
                    .replace(/\{\{date_echeance\}\}/g, '15/08/2026')
                    .replace(/\{\{lien_orange_money\}\}/g, 'https://pay.kontrol.io/om/8812930')
                    .replace(/\{\{plan_nom\}\}/g, 'Enterprise')
                    .replace(/\{\{sla_garantie\}\}/g, '99.95')}
                </div>
              </div>
            </div>

            {/* Commit Message Input */}
            <div className="pt-1">
              <label className="block text-[10.5px] font-bold uppercase text-[#7a9ab0] mb-0.5">
                Note de révision pour le Changelog Admin
              </label>
              <input
                type="text"
                value={commitComment}
                onChange={(e) => setCommitComment(e.target.value)}
                placeholder="ex: Ajout de la mention d'exonération TVA et lien direct Mobile Money"
                className="w-full bg-[#F0F0F0] border border-[rgba(0,48,80,0.12)] rounded-[6px] px-3 py-1.5 text-[12px] outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Version History Drawer Modal */}
      {showVersionDrawer && currentTemplate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="card-kontrol max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(0,48,80,0.12)] pb-2">
              <div>
                <h3 className="text-[14px] font-bold text-[#003050]">
                  Historique des Versions & Restauration
                </h3>
                <p className="text-[11.5px] text-[#7a9ab0]">
                  Modèle: <strong className="text-[#003050]">{currentTemplate.title}</strong>
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
