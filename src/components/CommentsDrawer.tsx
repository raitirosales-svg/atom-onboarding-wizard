import React from 'react';
import { X, MessageSquare, CornerDownRight, Trash2 } from 'lucide-react';
import { NodeComment } from '../types/canvas';

interface CommentsDrawerProps {
  comments: NodeComment[];
  onSelectNode: (nodeId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onClose: () => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  comments,
  onSelectNode,
  onDeleteComment,
  onClose,
}) => {
  return (
    <div className="w-80 sm:w-96 bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl z-30 shrink-0">
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
          <div className="text-center py-12 px-4 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">
              No hay comentarios registrados
            </p>
            <p className="text-xs text-slate-400">
              Haz clic en la burbuja de comentario de cualquier nodo en el canvas para agregar notas o resolver dudas con el cliente.
            </p>
          </div>
        ) : (
          comments.map((comm) => (
            <div
              key={comm.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSelectNode(comm.nodeId)}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline truncate max-w-[200px]"
                >
                  <CornerDownRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">
                    {comm.nodeTitle || `Nodo ${comm.nodeId}`}
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
    </div>
  );
};
