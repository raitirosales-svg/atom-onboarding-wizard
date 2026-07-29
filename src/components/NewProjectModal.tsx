import React, { useState } from 'react';
import { X, Building2, Palette, Image as ImageIcon, Sparkles, Plus } from 'lucide-react';
import { Project } from '../types/canvas';

interface NewProjectModalProps {
  onCreateProject: (projectData: {
    name: string;
    industry: Project['industry'];
    brandColor: string;
    logo?: string;
  }) => void;
  onClose: () => void;
}

const INDUSTRY_OPTIONS: Project['industry'][] = [
  'E-commerce',
  'Salud',
  'Servicios Financieros',
  'Inmobiliario',
  'Educación',
  'Otro',
];

const COLOR_PRESETS = [
  '#2563EB', // Atom Blue
  '#059669', // Emerald
  '#7C3AED', // Purple
  '#DC2626', // Red
  '#D97706', // Amber
  '#DB2777', // Pink
  '#0284C7', // Sky
  '#0D9488', // Teal
];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  onCreateProject,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState<Project['industry']>('E-commerce');
  const [brandColor, setBrandColor] = useState('#2563EB');
  const [logo, setLogo] = useState<string | undefined>(undefined);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateProject({
      name: name.trim(),
      industry,
      brandColor,
      logo,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div
          className="p-5 border-b border-slate-200 flex items-center justify-between"
          style={{ backgroundColor: `${brandColor}10` }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
              style={{ backgroundColor: brandColor }}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Nuevo Proyecto de Onboarding</h2>
              <p className="text-xs text-slate-500">
                Configura los datos del cliente para cargar su plantilla base.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Client Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nombre de la Empresa / Cliente *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cliente XYZ, Tienda Moda, Clínica Salud"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Industria (Carga plantilla inicial)
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as Project['industry'])}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {INDUSTRY_OPTIONS.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Color */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Color Primario de Marca del Cliente
            </label>

            <div className="flex items-center gap-2 mb-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBrandColor(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    brandColor === color ? 'border-slate-900 scale-110 shadow-md' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
              />
              <span className="text-xs font-mono font-semibold text-slate-600 uppercase">
                {brandColor}
              </span>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Logotipo del Cliente (Opcional)
            </label>

            <div className="flex items-center gap-3">
              {logo ? (
                <div className="relative group w-14 h-14 rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain p-1" />
                  <button
                    type="button"
                    onClick={() => setLogo(undefined)}
                    className="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/50">
                  <ImageIcon className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">Subir imagen de logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Crear Proyecto & Abrir Canvas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
