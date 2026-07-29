import React, { useState, useEffect } from 'react';
import { X, Send, RotateCcw, Bot, User, CheckCheck, Sparkles } from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import { WhatsAppNodeData } from '../types';
import { useLanguage } from '../i18n';

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node<WhatsAppNodeData>[];
  edges: Edge[];
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: string[];
  timestamp: string;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
}) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  if (!isOpen) return null;

  const getStartingNode = () => {
    const targetIds = new Set(edges.map((e) => e.target));
    const startNodes = nodes.filter((n) => !targetIds.has(n.id));
    return startNodes[0] || nodes[0];
  };

  const getTimeString = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const startSimulation = () => {
    const startNode = getStartingNode();
    if (!startNode) return;

    setCurrentNodeId(startNode.id);
    const initialData = startNode.data;

    const initialMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'bot',
      text: initialData.description || initialData.label || '¡Hola! ¿En qué puedo ayudarte?',
      options: initialData.options,
      timestamp: getTimeString(),
    };

    setMessages([initialMsg]);
  };

  useEffect(() => {
    if (isOpen) {
      startSimulation();
    }
  }, [isOpen]);

  const advanceFlow = (sourceNodeId: string, handleChoice?: string) => {
    const outgoingEdges = edges.filter((e) => e.source === sourceNodeId);
    let nextEdge: Edge | undefined;

    if (handleChoice) {
      nextEdge = outgoingEdges.find((e) => e.sourceHandle === handleChoice);
    }

    if (!nextEdge && outgoingEdges.length > 0) {
      nextEdge = outgoingEdges[0];
    }

    if (nextEdge) {
      const targetNode = nodes.find((n) => n.id === nextEdge!.target);
      if (targetNode) {
        setCurrentNodeId(targetNode.id);
        const data = targetNode.data;

        // If it's a Smarton AI node, trigger AI generation simulation
        if (data.nodeType === 'smarton') {
          setIsAiThinking(true);
          setTimeout(() => {
            setIsAiThinking(false);
            const aiMsg: ChatMessage = {
              id: Math.random().toString(),
              sender: 'bot',
              text: `[Smarton AI]: ${data.description || 'Procesando tu solicitud con Inteligencia Artificial...'}`,
              options: data.options,
              timestamp: getTimeString(),
            };
            setMessages((prev) => [...prev, aiMsg]);
          }, 1000);
        } else {
          const botMsg: ChatMessage = {
            id: Math.random().toString(),
            sender: 'bot',
            text: data.description || data.label || 'Continuando flujo...',
            options: data.options,
            timestamp: getTimeString(),
          };
          setMessages((prev) => [...prev, botMsg]);
        }
      }
    }
  };

  const handleOptionClick = (optionText: string, index: number) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: optionText,
      timestamp: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    if (currentNodeId) {
      advanceFlow(currentNodeId, `button_${index}`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: userInput,
      timestamp: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInput('');

    if (currentNodeId) {
      advanceFlow(currentNodeId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="flex h-[85vh] w-full max-w-md flex-col rounded-3xl border border-slate-700 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Phone Top Bar */}
        <div className="flex items-center justify-between bg-[#0F1E3A] px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--atom-orange)] text-white font-bold">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold">Atom WhatsApp Bot</h3>
              <p className="text-[10px] text-orange-200">{t('simulatorOnline')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={startSimulation}
              title={t('simulatorReset')}
              className="rounded p-1 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded p-1 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* WhatsApp Chat Wall Background */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5] dark:bg-[#0b141a]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-xl px-3 py-2 text-xs shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#d9fdd3] text-slate-800 dark:bg-[#005c4b] dark:text-slate-100 rounded-tr-none'
                    : 'bg-white text-slate-800 dark:bg-[#202c33] dark:text-slate-100 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'user' && <CheckCheck className="h-3 w-3 text-sky-500" />}
                </div>
              </div>

              {/* Render Option Buttons for Bot Messages */}
              {msg.sender === 'bot' && msg.options && msg.options.length > 0 && (
                <div className="mt-1.5 flex flex-col gap-1 w-[82%]">
                  {msg.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(opt, idx)}
                      className="w-full rounded-lg border border-orange-500/40 bg-white py-1.5 px-3 text-center text-xs font-semibold text-orange-700 shadow-xs hover:bg-orange-50 dark:bg-[#202c33] dark:text-orange-400 dark:hover:bg-[#2a3942] transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isAiThinking && (
            <div className="flex items-center gap-2 rounded-lg bg-white/90 p-2.5 text-xs text-fuchsia-700 dark:bg-[#202c33] dark:text-fuchsia-300 w-fit">
              <Sparkles className="h-4 w-4 animate-spin text-fuchsia-500" />
              <span>{t('simulatorThinking')}</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 bg-[#f0f2f5] p-2.5 dark:bg-[#202c33]"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={t('simulatorPlaceholder')}
            className="flex-1 rounded-full border-none bg-white px-4 py-2 text-xs text-slate-800 focus:outline-hidden dark:bg-[#2a3942] dark:text-slate-100"
          />
          <button
            type="submit"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--atom-orange)] text-white hover:bg-[var(--atom-orange-hover)]"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
