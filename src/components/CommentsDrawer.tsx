import React, { useState, useEffect } from 'react';
import { X, MessageSquare, CornerDownRight, Trash2, Send, Plus } from 'lucide-react';
import { NodeComment } from '../types/canvas';

interface CommentsDrawerProps {
  comments: NodeComment[];
  nodes?: any[];
  selectedNodeId?: string | null;
  onAddComment?: (nodeId: string, commentText: string, author: string) => void;
  onSelectNode: (nodeId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onClose: () => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  comments,
  nodes = [],
  selectedNodeId,
  onAddComment,
  onSelectNode,
  onDeleteComment,
  onClose,
}) => {
  const [targetNodeId, setTargetNodeId] = useState<string>('general');
  const [commentAuthor, setCommentAuthor] = useState<string>('Especialista Onboarding');
  const [commentText, setCommentText] = useState<string>('');

  useEffect(() => {
    if (selectedNodeId && nodes.some((n) => n.id === selectedNodeId)) {
      setTargetNodeId(selectedNodeId);
    } else if (nodes.length > 0 && targetNodeId === 'general') {
      // keep 'general' as default option if desired
    }
  }, [selectedNodeId, nodes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (onAddComment) {
      onAddComment(targetNodeId || 'general', commentText.trim(), commentAuthor);
    }
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
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">
            Comentarios y Acuerdos del Flujo ({comments.length})
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* List scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              No hay comentarios registrados
            </p>
            <p className="text-xs text-slate-400">
              Escribe un nuevo comentario abajo o selecciona un nodo en el canvas para añadir notas técnicas y acuerdos.
            </p>
          </div>
        ) : (
          comments.map((comm) => (
            <div
              key={comm.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-blue-300 transition-all group relative"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSelectNode(comm.nodeId)}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline truncate max-w-[200px]"
                >
                  <CornerDownRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">
                    {comm.nodeTitle || (comm.nodeId === 'general' ? 'Flujo General' : `Nodo ${comm.nodeId}`)}
                  </span>
                </button>
                <span className="text-[10px] text-slate-400">{comm.timestamp}</span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed pl-1">
                {comm.text}
              </p>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-200/60">
                <span className="font-medium text-slate-600">Por: {comm.author}</span>
                <button
                  onClick={() => onDeleteComment(comm.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-1"
                  title="Eliminar comentario"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Comment Form at Bottom of Drawer */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/90 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            Añadir Comentario
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            {/* Target node selector */}
            <select
              value={targetNodeId}
              onChange={(e) => setTargetNodeId(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="text-[11px] border border-slate-300 rounded-md px-2 py-1 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
            >
              <option value="general">Flujo General</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.data?.label || `Nodo ${n.id}`}
                </option>
              ))}
            </select>

            {/* Author selector */}
            <select
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="text-[11px] border border-slate-300 rounded-md px-2 py-1 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
            >
              <option value="Especialista Onboarding">Especialista</option>
              <option value="Cliente">Cliente</option>
              <option value="Desarrollador / Lider Técnico">Desarrollador</option>
            </select>
          </div>

          <div className="flex gap-2">
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (commentText.trim()) handleSubmit(e);
                }
              }}
              placeholder="Escribe un comentario o acuerdo..."
              className="flex-1 p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors shrink-0 font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

