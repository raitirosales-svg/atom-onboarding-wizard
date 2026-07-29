import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, MessageSquare, Send, Sparkles, Plug, RefreshCw } from 'lucide-react';
import { NodeComment } from '../types/canvas';
import { useTranslation } from '../i18n/LanguageContext';
import { NODE_PALETTE } from '../data/nodePalette';

interface NodeInspectorProps {
  node: any;
  onUpdateNode: (nodeId: string, updatedData: any) => void;
  onAddComment: (nodeId: string, commentText: string, author: string) => void;
  onDeleteComment: (commentId: string) => void;
  onClose: () => void;
  autoFocusComments?: boolean;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  onUpdateNode,
  onAddComment,
  onDeleteComment,
  onClose,
  autoFocusComments = false,
}) => {
  const { t } = useTranslation();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  if (!node) return null;

  const data = node.data || {};
  const [label, setLabel] = useState(data.label || '');
  const [description, setDescription] = useState(data.description || '');
  const [fieldName, setFieldName] = useState(data.fieldName || '');
  const [fieldScope, setFieldScope] = useState<'permanent' | 'temporary'>(data.fieldScope || 'permanent');
  const [systemName, setSystemName] = useState(data.systemName || '');
  const [options, setOptions] = useState<string[]>(data.options || ['Opción 1', 'Opción 2', 'Otro']);

  const [newOptionText, setNewOptionText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('Especialista Onboarding');

  // Keep state in sync when selected node changes
  useEffect(() => {
    if (node) {
      const d = node.data || {};
      setLabel(d.label || '');
      setDescription(d.description || '');
      setFieldName(d.fieldName || '');
      setFieldScope(d.fieldScope || 'permanent');
      setSystemName(d.systemName || '');
      setOptions(d.options || ['Opción 1', 'Opción 2', 'Otro']);
      setCommentText('');

      if (autoFocusComments && commentInputRef.current) {
        setTimeout(() => commentInputRef.current?.focus(), 100);
      }
    }
  }, [node?.id, autoFocusComments]);

  const comments: NodeComment[] = data.comments || [];

  const handleSaveGeneral = () => {
    onUpdateNode(node.id, {
      label,
      description,
      fieldName,
      systemName,
      options,
    });
  };

  const handleAddOption = () => {
    if (!newOptionText.trim()) return;
    const newOpts = [...options, newOptionText.trim()];
    setOptions(newOpts);
    setNewOptionText('');
    onUpdateNode(node.id, { options: newOpts });
  };

  const handleRemoveOption = (indexToRemove: number) => {
    const newOpts = options.filter((_, idx) => idx !== indexToRemove);
    setOptions(newOpts);
    onUpdateNode(node.id, { options: newOpts });
  };

  const handleOptionChange = (index: number, val: string) => {
    const newOpts = [...options];
    newOpts[index] = val;
    setOptions(newOpts);
    onUpdateNode(node.id, { options: newOpts });
  };

  const handleAddCommentSubmit = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(node.id, commentText.trim(), commentAuthor);
    setCommentText('');
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="w-80 sm:w-96 bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl z-30 shrink-0"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: data.color || '#2563EB' }}
          />
          <h3 className="font-bold text-slate-900 text-sm truncate max-w-[200px]">
            {data.category || 'Propiedades del Paso'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Component Type Replacement Selector */}
        <div className="bg-slate-50/90 border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-2xs">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-700">
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              Tipo de Componente
            </span>
            <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200">
              Reemplazar Tipo
            </span>
          </label>
          <select
            value={data.type || 'message'}
            onChange={(e) => {
              const selectedType = e.target.value;
              const paletteItem = NODE_PALETTE.find((i) => i.type === selectedType);
              if (paletteItem) {
                onUpdateNode(node.id, {
                  type: paletteItem.type,
                  category: paletteItem.category,
                  color: paletteItem.color,
                  iconName: paletteItem.iconName,
                  isIntegration: paletteItem.isIntegration,
                  options: paletteItem.type === 'eval_response' && (!options || options.length === 0)
                    ? paletteItem.defaultOptions || ['Opción 1', 'Opción 2', 'Otro']
                    : options,
                });
              }
            }}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
          >
            {NODE_PALETTE.map((item) => (
              <option key={item.type} value={item.type}>
                {item.category} → {item.label} {item.isIntegration ? '(API)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Título del Paso / Nodo
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => {
              setLabel(e.target.value);
              onUpdateNode(node.id, { label: e.target.value });
            }}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            placeholder="e.g. Mensaje Bienvenida"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Descripción / Instrucciones del Paso
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              onUpdateNode(node.id, { description: e.target.value });
            }}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700 leading-relaxed"
            placeholder="¿Qué sucede en este paso? e.g. El bot saluda y presenta las opciones..."
          />
        </div>

        {/* Node specific settings */}
        {data.type === 'save_field' && (
          <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                Nombre del Campo / Variable
              </label>
              <input
                type="text"
                value={fieldName}
                onChange={(e) => {
                  setFieldName(e.target.value);
                  onUpdateNode(node.id, { fieldName: e.target.value, fieldScope });
                }}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-full px-3 py-1.5 text-sm border border-emerald-300 rounded-lg bg-white font-mono text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                placeholder="e.g. nombre_cliente, presupuesto"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
                Tipo de Almacenamiento
              </label>
              <div className="space-y-1.5">
                <label className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
                  fieldScope === 'permanent'
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50/50'
                }`}>
                  <input
                    type="radio"
                    name="fieldScope"
                    value="permanent"
                    checked={fieldScope === 'permanent'}
                    onChange={() => {
                      setFieldScope('permanent');
                      onUpdateNode(node.id, { fieldName, fieldScope: 'permanent' });
                    }}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold block text-emerald-900">
                      {t('scopePermanent')}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      {t('scopePermanentDesc')}
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
                  fieldScope === 'temporary'
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50/50'
                }`}>
                  <input
                    type="radio"
                    name="fieldScope"
                    value="temporary"
                    checked={fieldScope === 'temporary'}
                    onChange={() => {
                      setFieldScope('temporary');
                      onUpdateNode(node.id, { fieldName, fieldScope: 'temporary' });
                    }}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold block text-emerald-900">
                      {t('scopeTemporary')}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      {t('scopeTemporaryDesc')}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {data.isIntegration && (
          <div className="bg-purple-50/80 border border-purple-200 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-900">
              <Plug className="w-4 h-4 text-purple-600" />
              Configuración de Integración
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-purple-800 mb-1">
                Sistema o servicio a conectar
              </label>
              <input
                type="text"
                value={systemName}
                onChange={(e) => {
                  setSystemName(e.target.value);
                  onUpdateNode(node.id, { systemName: e.target.value });
                }}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-full px-3 py-1.5 text-sm border border-purple-300 rounded-lg bg-white text-purple-950 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. HubSpot CRM, MercadoPago API, MySQL"
              />
            </div>
          </div>
        )}

        {/* Eval response options list */}
        {data.type === 'eval_response' && (
          <div className="border border-amber-200 bg-amber-50/40 p-3.5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
                Opciones de Respuesta del Cliente
              </label>
              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                {options.length} Ramas
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleRemoveOption(idx)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Eliminar opción"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') handleAddOption();
                }}
                placeholder="Nueva opción (e.g. Agendar cita)"
                className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleAddOption}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md flex items-center gap-1 transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir
              </button>
            </div>
          </div>
        )}

        {/* COMMENTS SECTION - AVAILABLE FOR EVERY NODE */}
        <div className="border-t border-slate-200 pt-5 space-y-3 bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-blue-600" />
              Comentarios y Acuerdos de este Componente
            </h4>
            <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold">
              {comments.length}
            </span>
          </div>

          {comments.length === 0 ? (
            <p className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200/80 leading-relaxed">
              No hay comentarios registrados en este nodo. Escribe abajo requerimientos o acuerdos técnicos sobre este componente.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {comments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs space-y-1 relative group shadow-2xs"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="text-blue-700">{comm.author}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {comm.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{comm.text}</p>

                  <button
                    onClick={() => onDeleteComment(comm.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                    title="Eliminar comentario"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Comment Form */}
          <form onSubmit={(e) => handleAddCommentSubmit(e)} className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-bold text-slate-600">Autor:</label>
              <select
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Especialista Onboarding">Especialista Onboarding</option>
                <option value="Cliente">Cliente</option>
                <option value="Desarrollador / Lider Técnico">Desarrollador</option>
              </select>
            </div>

            <div className="flex gap-2">
              <textarea
                ref={commentInputRef}
                rows={2}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (commentText.trim()) {
                      handleAddCommentSubmit(e);
                    }
                  }
                }}
                placeholder="Escribe un punto, observación o acuerdo sobre este componente..."
                className="flex-1 p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white leading-relaxed"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors shrink-0 font-bold text-xs shadow-xs"
                title="Añadir comentario"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

