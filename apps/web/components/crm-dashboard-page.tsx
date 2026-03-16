'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'parejas', label: 'Parejas' },
  { id: 'packs', label: 'Packs' },
  { id: 'presupuestos', label: 'Presupuestos' },
  { id: 'actividades', label: 'Actividades' },
  { id: 'automatizaciones', label: 'Automatizaciones' },
  { id: 'ajustes', label: 'Ajustes' },
] as const;

type SectionId = (typeof sidebarItems)[number]['id'];

const weekdayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;

type CalendarDay = {
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
};

type Pack = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type Couple = {
  id: string;
  name1: string;
  lastName1: string;
  name2: string;
  lastName2: string;
  email1: string;
  email2?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  language?: string | null;
  weddingDate?: string | null;
  location?: string | null;
  state?: string | null;
  packId?: string | null;
  pack?: Pack | null;
};

type CoupleFormData = {
  name1: string;
  lastName1: string;
  name2: string;
  lastName2: string;
  email1: string;
  email2: string;
  phone1: string;
  phone2: string;
  language: string;
  weddingDate: string;
  location: string;
  packId: string;
  state: string;
};

type PackFormData = {
  name: string;
  description: string;
  price: string;
};

const initialCoupleFormData: CoupleFormData = {
  name1: '',
  lastName1: '',
  name2: '',
  lastName2: '',
  email1: '',
  email2: '',
  phone1: '',
  phone2: '',
  language: 'es',
  weddingDate: '',
  location: '',
  packId: '',
  state: '0',
};

const initialPackFormData: PackFormData = {
  name: '',
  description: '',
  price: '',
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api';

function normalizeOptional(value: string): string | undefined {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function parsePrice(value: string): number {
  const normalized = value.trim().replace(',', '.');
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error('El precio debe ser un numero mayor o igual a 0.');
  }

  return parsed;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDateForInput(dateValue?: string | null): string {
  if (!dateValue) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
    return dateValue.slice(0, 10);
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toISOString().slice(0, 10);
}

async function fetchApi<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    let message = 'No se pudo completar la peticion.';

    try {
      const payload = (await response.json()) as { message?: string | string[] };

      if (Array.isArray(payload.message)) {
        message = payload.message.join(', ');
      } else if (payload.message) {
        message = payload.message;
      }
    } catch {
      message = `Error HTTP ${response.status}`;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function getMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getReadableDate(dateValue?: string | null): string {
  if (!dateValue) {
    return '-';
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
}

function getStateLabel(state?: string | null): string {
  if (state === '0') {
    return 'Nueva boda';
  }

  return state ?? '-';
}

function getPackLabel(couple: Couple): string {
  return couple.pack?.name ?? '-';
}

function getLanguageLabel(language?: string | null): string {
  if (language === 'es') {
    return 'Espanol';
  }

  if (language === 'en') {
    return 'Ingles';
  }

  return language ?? '-';
}
function buildCalendarDays(referenceDate: Date): CalendarDay[] {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const isCurrentMonthToday =
    today.getFullYear() === year && today.getMonth() === month;

  const days: CalendarDay[] = [];

  for (let i = startDay - 1; i >= 0; i -= 1) {
    days.push({
      dayNumber: daysInPrevMonth - i,
      inCurrentMonth: false,
      isToday: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      dayNumber: day,
      inCurrentMonth: true,
      isToday: isCurrentMonthToday && today.getDate() === day,
    });
  }

  const trailingDays = (7 - (days.length % 7)) % 7;
  for (let day = 1; day <= trailingDays; day += 1) {
    days.push({
      dayNumber: day,
      inCurrentMonth: false,
      isToday: false,
    });
  }

  return days;
}

function DashboardView() {
  const currentDate = new Date();
  const monthLabel = getMonthLabel(currentDate);
  const calendarDays = buildCalendarDays(currentDate);

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-black/5 bg-white/85 p-6 shadow-panel backdrop-blur-md">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-clay">
          Bienvenido de vuelta
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-brand-ink md:text-4xl">
          Hola, Dani. Hoy toca cerrar otra gran historia.
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-black/65 md:text-base">
          Organiza sesiones, reuniones y entregas desde un unico panel. El
          calendario te ayudara a mantener cada fecha de boda bajo control.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1fr_310px]">
        <article className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-panel backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold capitalize text-brand-ink">
              {monthLabel}
            </h3>
            <span className="rounded-full bg-brand-sage/15 px-3 py-1 text-xs font-medium text-brand-sage">
              Agenda de bodas
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-black/45">
            {weekdayLabels.map((weekday) => (
              <div key={weekday} className="py-1">
                {weekday}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <div
                key={`${day.dayNumber}-${index}`}
                className={`h-16 rounded-xl border p-2 text-sm transition md:h-20 ${
                  day.isToday
                    ? 'border-brand-clay bg-brand-clay/10 text-brand-clay'
                    : day.inCurrentMonth
                      ? 'border-black/5 bg-brand-cloud text-brand-ink'
                      : 'border-transparent bg-black/[0.03] text-black/35'
                }`}
              >
                <span className="font-medium">{day.dayNumber}</span>
                {day.inCurrentMonth && day.dayNumber % 5 === 0 ? (
                  <div className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-sage" />
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-panel backdrop-blur-md">
          <h3 className="text-lg font-semibold">Hoy en resumen</h3>
          <ul className="mt-4 space-y-3 text-sm text-black/70">
            <li className="rounded-xl bg-brand-sand/45 p-3">
              10:00 - Reunion inicial con Laura & Jose
            </li>
            <li className="rounded-xl bg-brand-sand/45 p-3">
              13:30 - Llamada seguimiento presupuesto
            </li>
            <li className="rounded-xl bg-brand-sand/45 p-3">
              17:00 - Entrega galeria preboda
            </li>
          </ul>

          <button
            type="button"
            className="mt-6 w-full rounded-xl bg-brand-pine px-4 py-3 text-sm font-medium text-brand-cloud transition hover:bg-brand-sage"
          >
            Nueva actividad
          </button>
        </aside>
      </div>
    </section>
  );
}

type CoupleFormModalProps = {
  mode: 'create' | 'edit';
  isOpen: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  formData: CoupleFormData;
  packs: Pack[];
  onClose: () => void;
  onChange: (field: keyof CoupleFormData, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete?: () => Promise<void>;
};

function CoupleFormModal({
  mode,
  isOpen,
  isSaving,
  errorMessage,
  formData,
  packs,
  onClose,
  onChange,
  onSubmit,
  onDelete,
}: CoupleFormModalProps) {
  if (!isOpen) {
    return null;
  }

  const isEditMode = mode === 'edit';

  async function handleDeleteClick() {
    if (!isEditMode || !onDelete || isSaving) {
      return;
    }

    const confirmed = window.confirm('Estas seguro de eliminar la pareja?');
    if (!confirmed) {
      return;
    }

    await onDelete();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-black/10 bg-white p-6 shadow-panel">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-clay">
              {isEditMode ? 'Editar pareja' : 'Nueva pareja'}
            </p>
            
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-black/15 px-3 py-1 text-sm text-black/70 transition hover:bg-black/5"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 rounded-xl bg-brand-sand/35 px-3 py-2 text-sm font-semibold text-brand-ink">
              Ella
            </div>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-brand-ink">Nombre *</span>
              <input
                required
                value={formData.name1}
                onChange={(event) => onChange('name1', event.target.value)}
                className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-brand-ink">Apellidos</span>
              <input
                value={formData.lastName1}
                onChange={(event) => onChange('lastName1', event.target.value)}
                className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-brand-ink">Email</span>
              <input
                type="email"
                value={formData.email1}
                onChange={(event) => onChange('email1', event.target.value)}
                className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-brand-ink">Telefono</span>
              <input
                value={formData.phone1}
                onChange={(event) => onChange('phone1', event.target.value)}
                className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
              />
            </label>

            <div className="md:col-span-2 mt-1 rounded-xl bg-brand-sand/35 px-3 py-2 text-sm font-semibold text-brand-ink">
              Él
            </div>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-brand-ink">Nombre *</span>
              <input
                required
                value={formData.name2}
                onChange={(event) => onChange('name2', event.target.value)}
                className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-brand-ink">Apellidos</span>
              <input
                value={formData.lastName2}
                onChange={(event) => onChange('lastName2', event.target.value)}
                className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-brand-ink">Email</span>
              <input
                type="email"
                value={formData.email2}
                onChange={(event) => onChange('email2', event.target.value)}
                className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-brand-ink">Telefono</span>
              <input
                value={formData.phone2}
                onChange={(event) => onChange('phone2', event.target.value)}
                className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
              />
            </label>

            <div className="md:col-span-2 my-2 border-t border-black/10" />

            <label className="space-y-1 text-sm">
              <span className="font-medium text-brand-ink">Fecha de la boda *</span>
              <input
                required
                type="date"
                value={formData.weddingDate}
                onChange={(event) => onChange('weddingDate', event.target.value)}
                className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-brand-ink">Ubicación</span>
              <input
                value={formData.location}
                onChange={(event) => onChange('location', event.target.value)}
                className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-brand-ink">Idioma</span>
              <select
                value={formData.language}
                onChange={(event) => onChange('language', event.target.value)}
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 outline-none transition focus:border-brand-clay"
              >
                <option value="es">Espanol</option>
                <option value="en">Ingles</option>
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-brand-ink">Pack</span>
              <select
                value={formData.packId}
                onChange={(event) => onChange('packId', event.target.value)}
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 outline-none transition focus:border-brand-clay"
              >
                <option value="">Sin pack</option>
                {packs.map((pack) => (
                  <option key={pack.id} value={pack.id}>
                    {pack.name} ({formatPrice(pack.price)})
                  </option>
                ))}
              </select>
            </label>
          </div>

          {errorMessage ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-2">
            <div>
              {isEditMode ? (
                <button
                  type="button"
                  onClick={() => {
                    void handleDeleteClick();
                  }}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                  Eliminar
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-black/15 px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-black/5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-brand-pine px-4 py-2 text-sm font-medium text-brand-cloud transition hover:bg-brand-sage disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

type ParejasViewProps = {
  couples: Couple[];
  packs: Pack[];
  isLoading: boolean;
  errorMessage: string | null;
  onCreate: (formData: CoupleFormData) => Promise<void>;
  onUpdate: (id: string, formData: CoupleFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

function ParejasView({
  couples,
  packs,
  isLoading,
  errorMessage,
  onCreate,
  onUpdate,
  onDelete,
}: ParejasViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCoupleId, setEditingCoupleId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CoupleFormData>(initialCoupleFormData);

  const filteredCouples = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return couples;
    }

    return couples.filter((couple) => {
      const searchableContent = [
        `${couple.name1} ${couple.lastName1} ${couple.name2} ${couple.lastName2}`,
        couple.location ?? '',
        couple.state ?? '',
        couple.pack?.name ?? '',
        couple.weddingDate ?? '',
      ]
        .join(' ')
        .toLowerCase();

      return searchableContent.includes(query);
    });
  }, [couples, searchTerm]);

  function openCreateModal() {
    setEditingCoupleId(null);
    setFormError(null);
    setFormData(initialCoupleFormData);
    setIsModalOpen(true);
  }

  function openEditModal(couple: Couple) {
    setEditingCoupleId(couple.id);
    setFormError(null);
    setFormData({
      name1: couple.name1 ?? '',
      lastName1: couple.lastName1 ?? '',
      name2: couple.name2 ?? '',
      lastName2: couple.lastName2 ?? '',
      email1: couple.email1 ?? '',
      email2: couple.email2 ?? '',
      phone1: couple.phone1 ?? '',
      phone2: couple.phone2 ?? '',
      language: couple.language ?? 'es',
      weddingDate: formatDateForInput(couple.weddingDate),
      location: couple.location ?? '',
      packId: couple.packId ?? couple.pack?.id ?? '',
      state: couple.state ?? '0',
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setEditingCoupleId(null);
    setFormData(initialCoupleFormData);
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      if (editingCoupleId) {
        await onUpdate(editingCoupleId, formData);
      } else {
        await onCreate(formData);
      }
      closeModal();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la pareja. Intentalo de nuevo.';
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!editingCoupleId) {
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      await onDelete(editingCoupleId);
      closeModal();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar la pareja. Intentalo de nuevo.';
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleFormChange(field: keyof CoupleFormData, value: string) {
    setFormData((previousValue) => ({ ...previousValue, [field]: value }));
  }

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-black/5 bg-white/85 p-6 shadow-panel backdrop-blur-md">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-clay">
          Gestion de clientes
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-brand-ink md:text-4xl">
          Parejas
        </h2>
        <p className="mt-3 text-sm text-black/65 md:text-base">
          Vista centralizada con todas las parejas activas de Lenwed.
        </p>
      </header>

      <article className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-panel backdrop-blur-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-brand-ink">
            Parejas ({filteredCouples.length})
          </h3>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-xl bg-brand-pine px-4 py-2 text-sm font-medium text-brand-cloud transition hover:bg-brand-sage"
          >
            Nueva pareja
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por pareja, estado, pack o ubicacion"
            className="w-full max-w-md rounded-xl border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-brand-clay"
          />
          <span className="text-xs text-black/50">Total: {couples.length}</span>
        </div>

        {errorMessage ? (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-black/55">
                <th className="px-3 py-3 font-medium">Pareja</th>
                <th className="px-3 py-3 font-medium">Fecha</th>
                <th className="px-3 py-3 font-medium">Estado</th>
                <th className="px-3 py-3 font-medium">Pack</th>
                <th className="px-3 py-3 font-medium">Ubicacion</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-3 py-6 text-center text-black/60" colSpan={5}>
                    Cargando parejas...
                  </td>
                </tr>
              ) : filteredCouples.length === 0 ? (
                <tr>
                  <td className="px-3 py-6 text-center text-black/60" colSpan={5}>
                    No hay resultados para tu busqueda.
                  </td>
                </tr>
              ) : (
                filteredCouples.map((couple) => (
                  <tr
                    key={couple.id}
                    className="border-b border-black/5 text-brand-ink hover:bg-brand-sand/25"
                  >
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(couple)}
                        className="text-left font-medium underline decoration-brand-clay/40 underline-offset-4 transition hover:text-brand-clay"
                      >
                        {couple.name1} {couple.lastName1} & {couple.name2}{' '}
                        {couple.lastName2}
                      </button>
                    </td>
                    <td className="px-3 py-3">{getReadableDate(couple.weddingDate)}</td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-brand-sage/15 px-2.5 py-1 text-xs font-medium text-brand-sage">
                        {getStateLabel(couple.state)}
                      </span>
                    </td>
                    <td className="px-3 py-3">{getPackLabel(couple)}</td>
                    <td className="px-3 py-3">{couple.location ?? '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>

      <CoupleFormModal
        mode={editingCoupleId ? 'edit' : 'create'}
        isOpen={isModalOpen}
        isSaving={isSaving}
        errorMessage={formError}
        formData={formData}
        packs={packs}
        onClose={closeModal}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onDelete={editingCoupleId ? handleDelete : undefined}
      />
    </section>
  );
}

type PackFormModalProps = {
  mode: 'create' | 'edit';
  isOpen: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  formData: PackFormData;
  onClose: () => void;
  onChange: (field: keyof PackFormData, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete?: () => Promise<void>;
};

function PackFormModal({
  mode,
  isOpen,
  isSaving,
  errorMessage,
  formData,
  onClose,
  onChange,
  onSubmit,
  onDelete,
}: PackFormModalProps) {
  if (!isOpen) {
    return null;
  }

  const isEditMode = mode === 'edit';

  async function handleDeleteClick() {
    if (!isEditMode || !onDelete || isSaving) {
      return;
    }

    const confirmed = window.confirm('Estas seguro de eliminar el pack?');
    if (!confirmed) {
      return;
    }

    await onDelete();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-black/10 bg-white p-6 shadow-panel">
        <div className="mb-4 flex items-start justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-clay">
            {isEditMode ? 'Editar pack' : 'Nuevo pack'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-black/15 px-3 py-1 text-sm text-black/70 transition hover:bg-black/5"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1 text-sm">
            <span className="font-medium text-brand-ink">Nombre *</span>
            <input
              required
              value={formData.name}
              onChange={(event) => onChange('name', event.target.value)}
              className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium text-brand-ink">Descripcion</span>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(event) => onChange('description', event.target.value)}
              className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium text-brand-ink">Precio *</span>
            <input
              required
              inputMode="decimal"
              value={formData.price}
              onChange={(event) => onChange('price', event.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-black/15 px-3 py-2 outline-none transition focus:border-brand-clay"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-2">
            <div>
              {isEditMode ? (
                <button
                  type="button"
                  onClick={() => {
                    void handleDeleteClick();
                  }}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Eliminar
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-black/15 px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-black/5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-brand-pine px-4 py-2 text-sm font-medium text-brand-cloud transition hover:bg-brand-sage disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

type PacksViewProps = {
  packs: Pack[];
  isLoading: boolean;
  errorMessage: string | null;
  onCreate: (formData: PackFormData) => Promise<void>;
  onUpdate: (id: string, formData: PackFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

function PacksView({
  packs,
  isLoading,
  errorMessage,
  onCreate,
  onUpdate,
  onDelete,
}: PacksViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingPackId, setEditingPackId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PackFormData>(initialPackFormData);

  function openCreateModal() {
    setEditingPackId(null);
    setFormError(null);
    setFormData(initialPackFormData);
    setIsModalOpen(true);
  }

  function openEditModal(pack: Pack) {
    setEditingPackId(pack.id);
    setFormError(null);
    setFormData({
      name: pack.name,
      description: pack.description,
      price: String(pack.price),
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setEditingPackId(null);
    setFormData(initialPackFormData);
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      if (editingPackId) {
        await onUpdate(editingPackId, formData);
      } else {
        await onCreate(formData);
      }
      closeModal();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el pack. Intentalo de nuevo.';
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!editingPackId) {
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      await onDelete(editingPackId);
      closeModal();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el pack. Intentalo de nuevo.';
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleFormChange(field: keyof PackFormData, value: string) {
    setFormData((previousValue) => ({ ...previousValue, [field]: value }));
  }

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-black/5 bg-white/85 p-6 shadow-panel backdrop-blur-md">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-clay">Catalogo comercial</p>
        <h2 className="mt-2 text-3xl font-semibold text-brand-ink md:text-4xl">Packs</h2>
        <p className="mt-3 text-sm text-black/65 md:text-base">
          Configura los packs que puede ofrecer el fotografo a cada pareja.
        </p>
      </header>

      <article className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-panel backdrop-blur-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-brand-ink">Packs ({packs.length})</h3>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-xl bg-brand-pine px-4 py-2 text-sm font-medium text-brand-cloud transition hover:bg-brand-sage"
          >
            Nuevo pack
          </button>
        </div>

        {errorMessage ? (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-black/55">
                <th className="px-3 py-3 font-medium">Nombre</th>
                <th className="px-3 py-3 font-medium">Descripcion</th>
                <th className="px-3 py-3 font-medium">Precio</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-3 py-6 text-center text-black/60" colSpan={3}>
                    Cargando packs...
                  </td>
                </tr>
              ) : packs.length === 0 ? (
                <tr>
                  <td className="px-3 py-6 text-center text-black/60" colSpan={3}>
                    Todavia no hay packs creados.
                  </td>
                </tr>
              ) : (
                packs.map((pack) => (
                  <tr
                    key={pack.id}
                    className="border-b border-black/5 text-brand-ink hover:bg-brand-sand/25"
                  >
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(pack)}
                        className="text-left font-medium underline decoration-brand-clay/40 underline-offset-4 transition hover:text-brand-clay"
                      >
                        {pack.name}
                      </button>
                    </td>
                    <td className="px-3 py-3">{pack.description || '-'}</td>
                    <td className="px-3 py-3">{formatPrice(pack.price)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>

      <PackFormModal
        mode={editingPackId ? 'edit' : 'create'}
        isOpen={isModalOpen}
        isSaving={isSaving}
        errorMessage={formError}
        formData={formData}
        onClose={closeModal}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onDelete={editingPackId ? handleDelete : undefined}
      />
    </section>
  );
}

function PlaceholderView({ title }: { title: string }) {
  return (
    <section className="rounded-3xl border border-black/5 bg-white/85 p-6 shadow-panel backdrop-blur-md">
      <h2 className="text-3xl font-semibold text-brand-ink">{title}</h2>
      <p className="mt-2 text-sm text-black/65">
        Esta seccion estara disponible en los siguientes pasos del desarrollo.
      </p>
    </section>
  );
}

export function CrmDashboardPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
  const [couples, setCouples] = useState<Couple[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [isCouplesLoading, setIsCouplesLoading] = useState(true);
  const [isPacksLoading, setIsPacksLoading] = useState(true);
  const [couplesError, setCouplesError] = useState<string | null>(null);
  const [packsError, setPacksError] = useState<string | null>(null);

  async function loadCouples() {
    setIsCouplesLoading(true);
    setCouplesError(null);

    try {
      const data = await fetchApi<Couple[]>(`${API_BASE_URL}/couples`);
      setCouples(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las parejas.';
      setCouplesError(message);
    } finally {
      setIsCouplesLoading(false);
    }
  }

  async function loadPacks() {
    setIsPacksLoading(true);
    setPacksError(null);

    try {
      const data = await fetchApi<Pack[]>(`${API_BASE_URL}/packs`);
      setPacks(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudieron cargar los packs.';
      setPacksError(message);
    } finally {
      setIsPacksLoading(false);
    }
  }

  useEffect(() => {
    void loadCouples();
    void loadPacks();
  }, []);
  async function handleCreateCouple(formData: CoupleFormData) {
    const payload = {
      name1: formData.name1.trim(),
      lastName1: normalizeOptional(formData.lastName1),
      name2: formData.name2.trim(),
      lastName2: normalizeOptional(formData.lastName2),
      email1: normalizeOptional(formData.email1),
      email2: normalizeOptional(formData.email2),
      phone1: normalizeOptional(formData.phone1),
      phone2: normalizeOptional(formData.phone2),
      language: normalizeOptional(formData.language),
      weddingDate: formData.weddingDate,
      location: normalizeOptional(formData.location),
      state: '0',
      packId: normalizeOptional(formData.packId),
    };

    await fetchApi<Couple>(`${API_BASE_URL}/couples`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    await loadCouples();
  }

  async function handleUpdateCouple(id: string, formData: CoupleFormData) {
    const payload = {
      name1: formData.name1.trim(),
      lastName1: normalizeOptional(formData.lastName1),
      name2: formData.name2.trim(),
      lastName2: normalizeOptional(formData.lastName2),
      email1: normalizeOptional(formData.email1),
      email2: normalizeOptional(formData.email2),
      phone1: normalizeOptional(formData.phone1),
      phone2: normalizeOptional(formData.phone2),
      language: normalizeOptional(formData.language),
      weddingDate: formData.weddingDate,
      location: normalizeOptional(formData.location),
      state: normalizeOptional(formData.state),
      packId: normalizeOptional(formData.packId),
    };

    await fetchApi<Couple>(`${API_BASE_URL}/couples/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    await loadCouples();
  }

  async function handleDeleteCouple(id: string) {
    await fetchApi<void>(`${API_BASE_URL}/couples/${id}`, {
      method: 'DELETE',
    });

    await loadCouples();
  }

  async function handleCreatePack(formData: PackFormData) {
    const payload = {
      name: formData.name.trim(),
      description: normalizeOptional(formData.description) ?? '',
      price: parsePrice(formData.price),
    };

    await fetchApi<Pack>(`${API_BASE_URL}/packs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    await Promise.all([loadPacks(), loadCouples()]);
  }

  async function handleUpdatePack(id: string, formData: PackFormData) {
    const payload = {
      name: formData.name.trim(),
      description: normalizeOptional(formData.description) ?? '',
      price: parsePrice(formData.price),
    };

    await fetchApi<Pack>(`${API_BASE_URL}/packs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    await Promise.all([loadPacks(), loadCouples()]);
  }

  async function handleDeletePack(id: string) {
    await fetchApi<void>(`${API_BASE_URL}/packs/${id}`, {
      method: 'DELETE',
    });

    await Promise.all([loadPacks(), loadCouples()]);
  }
  return (
    <main className="dashboard-fade-in h-screen overflow-hidden p-4 md:p-8">
      <div className="mx-auto grid h-full max-w-7xl gap-5 md:grid-cols-[260px_1fr]">
        <aside className="h-full overflow-hidden rounded-3xl border border-black/5 bg-brand-pine p-6 text-brand-cloud shadow-panel">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-sand/80">
              Lenwed CRM
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Lenwed</h1>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = item.id === activeSection;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? 'bg-brand-cloud text-brand-pine'
                      : 'text-brand-cloud/80 hover:bg-white/10 hover:text-brand-cloud'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
            <p className="font-medium">Tu semana</p>
            <p className="mt-1 text-brand-sand/80">
              3 reuniones, 2 entregas y 1 boda por confirmar.
            </p>
          </div>
        </aside>

        <div className="lenwed-scroll-area h-full overflow-y-auto">
          {activeSection === 'dashboard' ? <DashboardView /> : null}
          {activeSection === 'parejas' ? (
            <ParejasView
              couples={couples}
              packs={packs}
              isLoading={isCouplesLoading}
              errorMessage={couplesError}
              onCreate={handleCreateCouple}
              onUpdate={handleUpdateCouple}
              onDelete={handleDeleteCouple}
            />
          ) : null}
          {activeSection === 'packs' ? (
            <PacksView
              packs={packs}
              isLoading={isPacksLoading}
              errorMessage={packsError}
              onCreate={handleCreatePack}
              onUpdate={handleUpdatePack}
              onDelete={handleDeletePack}
            />
          ) : null}
          {activeSection === 'presupuestos' ? (
            <PlaceholderView title="Presupuestos" />
          ) : null}
          {activeSection === 'actividades' ? (
            <PlaceholderView title="Actividades" />
          ) : null}
          {activeSection === 'automatizaciones' ? (
            <PlaceholderView title="Automatizaciones" />
          ) : null}
          {activeSection === 'ajustes' ? <PlaceholderView title="Ajustes" /> : null}
        </div>
      </div>
    </main>
  );
}

