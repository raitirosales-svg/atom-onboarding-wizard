import React, { useState } from 'react';
import { NODE_PALETTE, PaletteNodeInfo } from '../data/nodePalette';
import { NodeCategory } from '../types/canvas';
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
  onAddNode: (item: PaletteNodeInfo) => void;
}

export const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  const [search, setSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredItems = NODE_PALETTE.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

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
            Paleta de Bloques
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
          const itemsInCat = filteredItems.filter((i) => i.category === category);
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
                  {itemsInCat.map((item) => {
                    const Icon = ICON_MAP[item.iconName] || MessageSquareText;
                    const isInt = !!item.isIntegration;

                    return (
                      <div
                        key={item.type}
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
