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
  CheckCircle2
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 font-jakarta tracking-tight">
              Gestionnaire de Templates & Modèles
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0284C7] text-[10px] font-black uppercase tracking-wider">
              Versioning v2.1
            </span>
          </div>
          <p className="text-[13px] font-medium text-slate-500 mt-1">
            Personnalisation des factures, contrats d'engagement et emails de relance automatique.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl text-[12px] font-extrabold">
          <button
            onClick={() => {
              setActiveCategory('factures');
              const firstInCat = templates.find(t => t.category === 'factures');
              if (firstInCat) handleSelectTemplate(firstInCat);
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeCategory === 'factures' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#0284C7]" />
            Factures
          </button>

          <button
            onClick={() => {
              setActiveCategory('contrats');
              const firstInCat = templates.find(t => t.category === 'contrats');
              if (firstInCat) handleSelectTemplate(firstInCat);
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeCategory === 'contrats' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-500" />
            Contrats
          </button>

          <button
            onClick={() => {
              setActiveCategory('emails');
              const firstInCat = templates.find(t => t.category === 'emails');
              if (firstInCat) handleSelectTemplate(firstInCat);
            }}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeCategory === 'emails' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-emerald-500" />
            Emails
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Templates list + Editor + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Template Selector Column */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono px-2">
            Modèles disponibles ({filteredTemplates.length})
          </div>

          <div className="space-y-2">
            {filteredTemplates.map((tpl) => {
              const isSelected = tpl.id === selectedTemplateId;
              return (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded-full">
                      {tpl.currentVersion}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{tpl.lastModified.split(' ')[0]}</span>
                  </div>
                  <div className="text-[13px] font-extrabold text-slate-900 line-clamp-1">{tpl.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Modifié par: {tpl.author}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor & Preview Pane */}
        {currentTemplate && (
          <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            {/* Template Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 font-jakarta">
                    {currentTemplate.title}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold">
                    {currentTemplate.currentVersion}
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-500">
                  Dernière révision: {currentTemplate.lastModified} par {currentTemplate.author}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVersionDrawer(!showVersionDrawer)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-[12px] font-extrabold transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4 text-slate-600" />
                  Historique Versions ({currentTemplate.versionHistory.length})
                </button>

                <button
                  onClick={handleSaveNewVersion}
                  className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-2xl text-[12px] font-black shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  Publier Nouvelle Version
                </button>
              </div>
            </div>

            {saveSuccessNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-[12px] font-extrabold flex items-center gap-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Nouvelle version publiée avec succès et enregistrée dans le versioning !
              </div>
            )}

            {/* Variable Tags Selector */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <div className="flex items-center justify-between text-[10.5px] font-black uppercase text-slate-500 tracking-wider font-mono">
                <span>Variables dynamiques disponibles (Cliquez pour insérer)</span>
                <span>Format: Handlebars</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentTemplate.variables.map((v, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertVariable(v)}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:border-[#0284C7] hover:text-[#0284C7] rounded-xl text-[11px] font-mono font-extrabold text-slate-700 shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3 text-sky-500" />
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor & Visual Live Preview Side-By-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Code Editor */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase text-slate-500 font-mono">
                  Éditeur de Modèle (Source)
                </label>
                <textarea
                  rows={14}
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  className="w-full bg-slate-950 text-sky-300 font-mono text-[11.5px] p-4 rounded-2xl border border-slate-800 focus:outline-none focus:border-[#0284C7] leading-relaxed resize-none shadow-inner"
                />
              </div>

              {/* Live Preview Pane */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase text-slate-500 font-mono">
                  Aperçu Visuel en Direct (Rendu Client)
                </label>
                <div className="w-full h-[330px] bg-slate-50 border border-slate-200 rounded-2xl p-5 overflow-y-auto text-[12px] font-medium text-slate-800 whitespace-pre-wrap leading-relaxed shadow-2xs">
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
            <div className="pt-2">
              <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                Note de révision pour le Changelog Admin
              </label>
              <input
                type="text"
                value={commitComment}
                onChange={(e) => setCommitComment(e.target.value)}
                placeholder="ex: Ajout de la mention d'exonération TVA et lien direct Mobile Money"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-[12px] focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Version History Drawer Modal */}
      {showVersionDrawer && currentTemplate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 font-jakarta">
                  Historique des Versions & Restauration
                </h3>
                <p className="text-[12px] text-slate-500 font-medium">
                  Modèle: <strong className="text-slate-900">{currentTemplate.title}</strong>
                </p>
              </div>
              <button onClick={() => setShowVersionDrawer(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {currentTemplate.versionHistory.map((ver, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded-full">
                      {ver.version}
                    </span>
                    <span className="text-[11px] text-slate-400">{ver.modifiedAt} par {ver.modifiedBy}</span>
                  </div>
                  <p className="text-[12px] font-medium text-slate-700 italic">
                    "{ver.comment}"
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleRestoreVersion(ver)}
                      className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0284C7] rounded-xl text-[11px] font-bold transition-colors"
                    >
                      Restaurer cette version
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowVersionDrawer(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-[12px] font-bold"
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
