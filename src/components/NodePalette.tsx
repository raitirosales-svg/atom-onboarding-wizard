import React, { useState } from 'react';
import { NODE_PALETTE, PaletteNodeInfo } from '../data/nodePalette';
import { NodeCategory } from '../types/canvas';
import { useTranslation } from '../i18n/LanguageContext';
import {
  MessageSquareText,
  FileCode,
  GitFork,
  GitBranch,
  CornerDownRight,
  Clock,
  StopCircle,
  Database,
  MapPin,
  Sparkles,
  Wand2,
  Tag,
  TrendingUp,
  FolderCheck,
  Users,
  Plug,
  CreditCard,
  Server,
  Globe,
  Send,
  UserCheck,
  Search,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  MessageSquareText,
  FileCode,
  GitFork,
  GitBranch,
  CornerDownRight,
  Clock,
  StopCircle,
  Database,
  MapPin,
  Sparkles,
  Wand2,
  Tag,
  TrendingUp,
  FolderCheck,
  Users,
  Plug,
  CreditCard,
  Server,
  Globe,
  Send,
  UserCheck,
};

const CATEGORIES: NodeCategory[] = [
  'Comunicación',
  'Lógica',
  'Datos',
  'IA',
  'Clasificación',
  'Integraciones',
];

interface NodePaletteProps {
  expectedIntegrations?: string[];
  onAddNode: (item: PaletteNodeInfo) => void;
}

export const NodePalette: React.FC<NodePaletteProps> = ({
  expectedIntegrations,
  onAddNode,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [showAllIntegrations, setShowAllIntegrations] = useState(false);

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Filter expected integrations (exclude non-functional choices)
  const validExpected = (expectedIntegrations || []).filter(
    (item) => item !== 'Ninguna por ahora' && item !== 'No está claro aún'
  );

  const hasContextIntegrations = validExpected.length > 0;

  // Build the integration palette items
  const getIntegrationItems = (): PaletteNodeInfo[] => {
    const allCatalog: PaletteNodeInfo[] = NODE_PALETTE.filter((i) => i.category === 'Integraciones');

    if (!hasContextIntegrations || showAllIntegrations) {
      return allCatalog;
    }

    // Build list corresponding specifically to expectedIntegrations mapped strictly to allowed components
    const result: PaletteNodeInfo[] = [];

    validExpected.forEach((exp) => {
      const lower = exp.toLowerCase();
      if (lower.includes('crm')) {
        result.push({
          type: 'crm',
          category: 'Integraciones',
          label: 'CRM',
          description: 'Crea o actualiza contactos, tratos o prospectos en CRM (HubSpot, Salesforce, Zoho).',
          iconName: 'Plug',
          color: '#DC2626',
          isIntegration: true,
        });
      } else if (
        lower.includes('cliente') ||
        lower.includes('usuario') ||
        lower.includes('identifica') ||
        lower.includes('auth') ||
        lower.includes('reconocimiento')
      ) {
        result.push({
          type: 'customer_recognition',
          category: 'Integraciones',
          label: 'Reconocimiento de cliente',
          description: 'Identifica y consulta información del cliente mediante API o servicio de autenticación.',
          iconName: 'UserCheck',
          color: '#7C3AED',
          isIntegration: true,
        });
      } else {
        result.push({
          type: 'http_request',
          category: 'Integraciones',
          label: `Petición HTTP (${exp})`,
          description: `Solicitud REST API / Webhook externa para ${exp}.`,
          iconName: 'Send',
          color: '#2563EB',
          isIntegration: true,
        });
      }
    });

    return result.length > 0 ? result : allCatalog;
  };

  const integrationItems = getIntegrationItems();

  const getFilteredItemsForCategory = (cat: NodeCategory): PaletteNodeInfo[] => {
    let sourceList: PaletteNodeInfo[];
    if (cat === 'Integraciones') {
      sourceList = integrationItems;
    } else {
      sourceList = NODE_PALETTE.filter((i) => i.category === cat);
    }

    if (!search.trim()) return sourceList;

    const query = search.toLowerCase();
    return sourceList.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  };

  const onDragStart = (event: React.DragEvent, item: PaletteNodeInfo) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-72 bg-white border-r border-slate-200 h-full flex flex-col shadow-sm z-20 shrink-0 select-none">
      {/* Palette Header */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/80 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            {t('paletteTitle')}
          </h3>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
            Arrastra o Clic
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar bloque o integración..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Categories Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {CATEGORIES.map((category) => {
          const itemsInCat = getFilteredItemsForCategory(category);
          if (itemsInCat.length === 0) return null;

          const isCollapsed = !!collapsedCategories[category];
          const isIntegrationCategory = category === 'Integraciones';

          return (
            <div key={category} className="space-y-1.5">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full flex items-center justify-between py-1 px-2 rounded-md font-bold text-xs transition-colors ${
                  isIntegrationCategory
                    ? 'text-purple-800 bg-purple-50 hover:bg-purple-100'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isIntegrationCategory && <Plug className="w-3.5 h-3.5 text-purple-600" />}
                  <span>{category}</span>
                  {isIntegrationCategory && hasContextIntegrations && !showAllIntegrations && (
                    <span className="text-[9px] bg-purple-200/80 text-purple-900 font-bold px-1.5 py-0.2 rounded-full">
                      Acordadas
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({itemsInCat.length})
                  </span>
                </div>
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {/* Items Grid/List */}
              {!isCollapsed && (
                <div className="space-y-2 pt-1 pl-1">
                  {itemsInCat.map((item, idx) => {
                    const Icon = ICON_MAP[item.iconName] || MessageSquareText;
                    const isInt = !!item.isIntegration;

                    return (
                      <div
                        key={`${item.type}-${idx}`}
                        draggable
                        onDragStart={(e) => onDragStart(e, item)}
                        onClick={() => onAddNode(item)}
                        className={`group cursor-grab active:cursor-grabbing p-2.5 rounded-xl transition-all border shadow-2xs hover:shadow-md ${
                          isInt
                            ? 'bg-gradient-to-r from-purple-50/60 to-white border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50'
                            : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs mt-0.5"
                            style={{ backgroundColor: item.color }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 truncate">
                                {item.label}
                              </h4>
                              {isInt && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-md shrink-0">
                                  API
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Toggle button if context integrations are active */}
                  {isIntegrationCategory && hasContextIntegrations && (
                    <button
                      onClick={() => setShowAllIntegrations((prev) => !prev)}
                      className="w-full text-center py-1.5 text-[10px] font-bold text-purple-700 bg-purple-50/80 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors mt-1"
                    >
                      {showAllIntegrations
                        ? 'Ver solo integraciones del contexto'
                        : '+ Ver catálogo completo de integraciones'}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
