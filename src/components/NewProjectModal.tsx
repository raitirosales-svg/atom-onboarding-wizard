import React, { useState } from 'react';
import {
  X,
  Building2,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Tag as TagIcon,
  HelpCircle,
} from 'lucide-react';
import { Project, ProjectContexto } from '../types/canvas';
import { useTranslation } from '../i18n/LanguageContext';

interface NewProjectModalProps {
  onCreateProject: (projectData: {
    name: string;
    industry: Project['industry'];
    brandColor: string;
    logo?: string;
    contexto: ProjectContexto;
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

const BOT_GOALS_OPTIONS = [
  'Generar leads',
  'Agendar citas',
  'Responder preguntas frecuentes',
  'Vender productos',
  'Dar soporte post-venta',
  'Calificar prospectos',
  'Otro',
];

const INTEGRATIONS_OPTIONS = [
  'CRM',
  'Petición HTTP',
  'Reconocimiento de cliente',
  'Ninguna por ahora',
  'No está claro aún',
];

const DEFAULT_TIPIFICATIONS = [
  'Fin Autogestión (resuelto por el bot)',
  'Seguimiento Autogestión (requiere reactivación o intervención humana)',
];

const FUNNEL_STAGES_OPTIONS = ['Awareness', 'Interest', 'Consideration', 'Opportunity'];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  onCreateProject,
  onClose,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // PASO 1
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState<Project['industry']>('E-commerce');
  const [brandColor, setBrandColor] = useState('#2563EB');
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [language, setLanguage] = useState<'SP' | 'EN' | 'PT'>('SP');
  const [brandTone, setBrandTone] = useState('Cercano y amigable');
  const [toneDetails, setToneDetails] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');

  // PASO 2
  const [selectedBotGoals, setSelectedBotGoals] = useState<string[]>(['Generar leads', 'Responder preguntas frecuentes']);
  const [priorityUseCases, setPriorityUseCases] = useState('');
  const [whatNotToDo, setWhatNotToDo] = useState('');
  const [humanHandoffTrigger, setHumanHandoffTrigger] = useState('');
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(['CRM']);

  // PASO 3
  const [successfulEnding, setSuccessfulEnding] = useState('');
  const [selectedTypifications, setSelectedTypifications] = useState<string[]>([...DEFAULT_TIPIFICATIONS]);
  const [customTypificationInput, setCustomTypificationInput] = useState('');
  const [selectedFunnelStages, setSelectedFunnelStages] = useState<string[]>(['Awareness', 'Interest', 'Opportunity']);
  const [tags, setTags] = useState<string[]>(['cliente_nuevo', 'soporte_whatsapp']);
  const [tagInput, setTagInput] = useState('');

  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [step]);

  // Handlers for step 1
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

  // Chip toggle helpers
  const toggleGoal = (goal: string) => {
    setSelectedBotGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const toggleIntegration = (item: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleTypification = (typ: string) => {
    setSelectedTypifications((prev) =>
      prev.includes(typ) ? prev.filter((t) => t !== typ) : [...prev, typ]
    );
  };

  const handleAddCustomTypification = () => {
    if (!customTypificationInput.trim()) return;
    const val = customTypificationInput.trim();
    if (!selectedTypifications.includes(val)) {
      setSelectedTypifications((prev) => [...prev, val]);
    }
    setCustomTypificationInput('');
  };

  const toggleFunnelStage = (stage: string) => {
    setSelectedFunnelStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    );
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const formatted = tagInput.trim().toLowerCase().replace(/\s+/g, '_');
    if (!tags.includes(formatted)) {
      setTags((prev) => [...prev, formatted]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Next step validation
  const goToStep = (targetStep: number) => {
    if (targetStep > 1 && !name.trim()) {
      alert('Por favor, ingresa el nombre de la empresa o cliente.');
      return;
    }
    setStep(targetStep);
  };

  const handleNext = (e?: React.MouseEvent | React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (step === 1) {
      if (!name.trim()) {
        alert('Por favor, ingresa el nombre de la empresa o cliente.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (step === 1) {
      if (!name.trim()) {
        alert('Por favor, completa el nombre del cliente.');
      } else {
        setStep(2);
      }
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (step !== 3) {
      return;
    }

    if (!name.trim()) {
      alert('Por favor, completa el nombre del cliente.');
      setStep(1);
      return;
    }

    const contexto: ProjectContexto = {
      brandTone,
      toneDetails: toneDetails.trim(),
      companyInfo: companyInfo.trim(),
      language,
      botGoals: selectedBotGoals,
      priorityUseCases: priorityUseCases.trim(),
      whatNotToDo: whatNotToDo.trim(),
      humanHandoffTrigger: humanHandoffTrigger.trim(),
      expectedIntegrations: selectedIntegrations,
      successfulEnding: successfulEnding.trim(),
      typifications: selectedTypifications,
      funnelStages: selectedFunnelStages,
      suggestedTags: tags,
    };

    onCreateProject({
      name: name.trim(),
      industry,
      brandColor,
      logo,
      contexto,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div
          className="p-5 border-b border-slate-200 flex items-center justify-between"
          style={{ backgroundColor: `${brandColor}10` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md shrink-0"
              style={{ backgroundColor: brandColor }}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {t('wizardTitle')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('wizardSubtitle')} {name || 'Client'}
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

        {/* TOP PROGRESS INDICATOR */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between gap-2 text-xs font-semibold">
          <div
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              step === 1 ? 'text-blue-700 font-extrabold' : 'text-slate-600 hover:text-blue-600'
            }`}
            onClick={() => goToStep(1)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 1
                  ? 'bg-blue-600 text-white'
                  : step > 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {step > 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '1'}
            </span>
            <span className="hidden sm:inline">{t('wizardStep1')}</span>
            <span className="sm:hidden">1. Info</span>
          </div>

          <div className="h-0.5 flex-1 bg-slate-200 max-w-[40px] mx-1" />

          <div
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              step === 2 ? 'text-blue-700 font-extrabold' : 'text-slate-600 hover:text-blue-600'
            }`}
            onClick={() => goToStep(2)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 2
                  ? 'bg-blue-600 text-white'
                  : step > 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {step > 2 ? <CheckCircle2 className="w-3.5 h-3.5" /> : '2'}
            </span>
            <span className="hidden sm:inline">{t('wizardStep2')}</span>
            <span className="sm:hidden">2. Goals</span>
          </div>

          <div className="h-0.5 flex-1 bg-slate-200 max-w-[40px] mx-1" />

          <div
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              step === 3 ? 'text-blue-700 font-extrabold' : 'text-slate-600 hover:text-blue-600'
            }`}
            onClick={() => goToStep(3)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className="hidden sm:inline">{t('wizardStep3')}</span>
            <span className="sm:hidden">3. Closure</span>
          </div>
        </div>

        {/* STEP CONTENT BODY FORM */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* SCROLLABLE STEP CONTENT */}
          <div ref={contentRef} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* PASO 1 — Información del proyecto */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  PASO 1 — Información Básica & Identidad de Marca
                </h3>
                <p className="text-xs text-slate-500">
                  Registra los datos corporativos para la plantilla de diagrama e instructivos de la ficha técnica.
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nombre del Cliente / Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tienda Moda Global, Clínica MediSalud, Inmobiliaria Premier"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Language Selection (EN, SP, PT) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Idioma del Flujo Conversacional *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('SP')}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      language === 'SP'
                        ? 'bg-blue-50 border-blue-600 text-blue-800 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">🇪🇸</span>
                    <span>Español (SP)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('EN')}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      language === 'EN'
                        ? 'bg-blue-50 border-blue-600 text-blue-800 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">🇺🇸</span>
                    <span>English (EN)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('PT')}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      language === 'PT'
                        ? 'bg-blue-50 border-blue-600 text-blue-800 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">🇧🇷</span>
                    <span>Português (PT)</span>
                  </button>
                </div>
              </div>

              {/* Industry & Color Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Rubro / Industria *
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as Project['industry'])}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {INDUSTRY_OPTIONS.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Color de Marca
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                    />
                    <div className="flex items-center gap-1 overflow-x-auto py-1">
                      {COLOR_PRESETS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setBrandColor(color)}
                          className={`w-6 h-6 rounded-full border-2 shrink-0 transition-transform ${
                            brandColor === color ? 'border-slate-900 scale-110 shadow-xs' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Logo de la Empresa (Opcional)
                </label>
                <div className="flex items-center gap-3">
                  {logo ? (
                    <div className="relative group w-12 h-12 rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
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
                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/50">
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-600">Cargar logotipo en PNG/JPG</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Tono de marca */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tono de Marca
                  </label>
                  <select
                    value={brandTone}
                    onChange={(e) => setBrandTone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Formal y profesional">Formal y profesional</option>
                    <option value="Cercano y amigable">Cercano y amigable</option>
                    <option value="Juvenil y casual">Juvenil y casual</option>
                    <option value="Técnico y directo">Técnico y directo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Detalles del Tono (Instrucciones)
                  </label>
                  <input
                    type="text"
                    value={toneDetails}
                    onChange={(e) => setToneDetails(e.target.value)}
                    placeholder="e.g. Siempre tutear, usar emojis moderados, jamás usar modismos"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Company Info */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Información General de la Empresa
                </label>
                <textarea
                  rows={2}
                  value={companyInfo}
                  onChange={(e) => setCompanyInfo(e.target.value)}
                  placeholder="¿Qué hace la empresa, a quién le vende y cuál es el contexto relevante para el bot?"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* PASO 2 — Objetivos del bot */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  PASO 2 — Objetivos de Negocio del Bot
                </h3>
                <p className="text-xs text-slate-500">
                  Define el alcance operacional antes de diseñar el diagrama conversacional.
                </p>
              </div>

              {/* Bot Goals Chips */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  ¿Qué debe lograr el bot? (Selecciona los que apliquen)
                </label>
                <div className="flex flex-wrap gap-2">
                  {BOT_GOALS_OPTIONS.map((goal) => {
                    const isSelected = selectedBotGoals.includes(goal);
                    return (
                      <button
                        type="button"
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority Use Cases */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Casos de Uso Prioritarios
                </label>
                <textarea
                  rows={2}
                  value={priorityUseCases}
                  onChange={(e) => setPriorityUseCases(e.target.value)}
                  placeholder="e.g. Responder precio del catálogo, derivar clientes VIP a un asesor de ventas, agendar consultas médicas..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* What NOT to do */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  ¿Qué NO debe hacer el bot? (Opcional)
                </label>
                <input
                  type="text"
                  value={whatNotToDo}
                  onChange={(e) => setWhatNotToDo(e.target.value)}
                  placeholder="e.g. No prometer descuentos especiales sin autorización, no dar diagnósticos, no solicitar tarjetas de crédito"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Human Handoff Trigger */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  ¿Cuándo debe derivar a un humano?
                </label>
                <input
                  type="text"
                  value={humanHandoffTrigger}
                  onChange={(e) => setHumanHandoffTrigger(e.target.value)}
                  placeholder="e.g. Cuando el usuario escriba 'asesor', al seleccionar opción 'Hablar con ventas', o tras 2 intentos no entendidos"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Expected Integrations */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Integraciones Esperadas
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEGRATIONS_OPTIONS.map((item) => {
                    const isSelected = selectedIntegrations.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleIntegration(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                            : 'bg-purple-50/50 text-purple-900 border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PASO 3 — Cierre y tipificaciones */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  PASO 3 — Cierre de Conversación & Tipificaciones Atom
                </h3>
                <p className="text-xs text-slate-500">
                  Establece los criterios de éxito, tipificaciones y etiquetas requeridas para Atom Chat.
                </p>
              </div>

              {/* Successful Ending */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  ¿Cómo termina una conversación exitosa?
                </label>
                <textarea
                  rows={2}
                  value={successfulEnding}
                  onChange={(e) => setSuccessfulEnding(e.target.value)}
                  placeholder="e.g. El cliente recibe el enlace de pago o cita confirmada y se envía encuesta de satisfacción"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Tipificaciones a usar */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tipificaciones de Cierre a Utilizar en Atom
                </label>
                <div className="space-y-2">
                  {selectedTypifications.map((typ) => (
                    <div
                      key={typ}
                      className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{typ}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleTypification(typ)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Quitar tipificación"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add Custom Typification */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={customTypificationInput}
                      onChange={(e) => setCustomTypificationInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTypification())}
                      placeholder="Agregar tipificación personalizada (e.g. Venta Cerrada, Lead Cualificado)"
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTypification}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Añadir
                    </button>
                  </div>
                </div>
              </div>

              {/* Funnel Stages */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Etapas del Funnel que el Bot Debe Marcar
                </label>
                <div className="flex flex-wrap gap-2">
                  {FUNNEL_STAGES_OPTIONS.map((stage) => {
                    const isSelected = selectedFunnelStages.includes(stage);
                    return (
                      <button
                        type="button"
                        key={stage}
                        onClick={() => toggleFunnelStage(stage)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                            : 'bg-amber-50/60 text-amber-900 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {stage}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Suggested Tags Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Etiquetas Iniciales Sugeridas (Tags Atom)
                </label>
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-xl min-h-[42px]">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg"
                    >
                      <TagIcon className="w-3 h-3 text-blue-600" />
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-600 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder={tags.length === 0 ? "Escribe etiqueta y presiona Enter..." : "Añadir más..."}
                    className="flex-1 min-w-[120px] bg-transparent text-xs text-slate-800 focus:outline-none p-1 font-medium"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Escribe la etiqueta y presiona Enter para agregarla.
                </p>
              </div>
            </div>
          )}
          </div>

          {/* ACTIONS FOOTER - Always visible at bottom */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <div>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {step < 3 ? (
                <button
                  key="btn-step-next"
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  key="btn-step-submit"
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Crear Proyecto & Abrir Canvas</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
