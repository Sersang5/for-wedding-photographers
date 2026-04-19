
'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'bodas', label: 'Bodas' },
  { id: 'packs', label: 'Packs' },
  { id: 'presupuestos', label: 'Presupuestos' },
  { id: 'actividades', label: 'Actividades' },
  { id: 'automatizaciones', label: 'Automatizaciones' },
  { id: 'ajustes', label: 'Ajustes' },
] as const;

type SectionId = (typeof sidebarItems)[number]['id'];

type Pack = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type WeddingState = {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

type Wedding = {
  id: string;
  organizationId: string;
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
  stateId?: string | null;
  state?: WeddingState | null;
  packId?: string | null;
  pack?: Pack | null;
};

type WeddingFormData = {
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
  stateId: string;
};

type PackFormData = {
  name: string;
  description: string;
  price: string;
};

const initialWeddingFormData: WeddingFormData = {
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
  stateId: '',
};

const initialPackFormData: PackFormData = {
  name: '',
  description: '',
  price: '',
};

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

function getOrganizationId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('organizationId');
}

async function fetchApi<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const organizationId = getOrganizationId();

  if (organizationId) {
    headers.set('x-organization-id', organizationId);
  }

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

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

function DashboardView() {
  return (
    <section className="rounded-3xl border border-black/5 bg-white/85 p-6 shadow-panel backdrop-blur-md">
      <h2 className="text-3xl font-semibold text-brand-ink">Dashboard</h2>
      <p className="mt-2 text-sm text-black/65">
        Agenda, resumen y actividad de la semana.
      </p>
    </section>
  );
}

function PlaceholderView({ title }: { title: string }) {
  return (
    <section className="rounded-3xl border border-black/5 bg-white/85 p-6 shadow-panel backdrop-blur-md">
      <h2 className="text-3xl font-semibold text-brand-ink">{title}</h2>
      <p className="mt-2 text-sm text-black/65">
        Esta seccion estara disponible en siguientes iteraciones.
      </p>
    </section>
  );
}

type WeddingFormModalProps = {
  mode: 'create' | 'edit';
  isOpen: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  formData: WeddingFormData;
  packs: Pack[];
  states: WeddingState[];
  onClose: () => void;
  onChange: (field: keyof WeddingFormData, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete?: () => Promise<void>;
};

function WeddingFormModal({
  mode,
  isOpen,
  isSaving,
  errorMessage,
  formData,
  packs,
  states,
  onClose,
  onChange,
  onSubmit,
  onDelete,
}: WeddingFormModalProps) {
  if (!isOpen) {
    return null;
  }

  const isEditMode = mode === 'edit';

  async function handleDeleteClick() {
    if (!isEditMode || !onDelete || isSaving) {
      return;
    }

    const confirmed = window.confirm('Estas seguro de eliminar la boda?');

    if (!confirmed) {
      return;
    }

    await onDelete();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-black/10 bg-white p-6 shadow-panel">
        <form onSubmit={onSubmit} className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-clay">
            {isEditMode ? 'Editar boda' : 'Nueva boda'}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <input required value={formData.name1} onChange={(event) => onChange('name1', event.target.value)} placeholder="Nombre 1" className="rounded-xl border border-black/15 px-3 py-2" />
            <input value={formData.lastName1} onChange={(event) => onChange('lastName1', event.target.value)} placeholder="Apellidos 1" className="rounded-xl border border-black/15 px-3 py-2" />
            <input required value={formData.name2} onChange={(event) => onChange('name2', event.target.value)} placeholder="Nombre 2" className="rounded-xl border border-black/15 px-3 py-2" />
            <input value={formData.lastName2} onChange={(event) => onChange('lastName2', event.target.value)} placeholder="Apellidos 2" className="rounded-xl border border-black/15 px-3 py-2" />
            <input type="email" value={formData.email1} onChange={(event) => onChange('email1', event.target.value)} placeholder="Email 1" className="rounded-xl border border-black/15 px-3 py-2" />
            <input type="email" value={formData.email2} onChange={(event) => onChange('email2', event.target.value)} placeholder="Email 2" className="rounded-xl border border-black/15 px-3 py-2" />
            <input value={formData.phone1} onChange={(event) => onChange('phone1', event.target.value)} placeholder="Telefono 1" className="rounded-xl border border-black/15 px-3 py-2" />
            <input value={formData.phone2} onChange={(event) => onChange('phone2', event.target.value)} placeholder="Telefono 2" className="rounded-xl border border-black/15 px-3 py-2" />
            <input required type="date" value={formData.weddingDate} onChange={(event) => onChange('weddingDate', event.target.value)} className="rounded-xl border border-black/15 px-3 py-2" />
            <input value={formData.location} onChange={(event) => onChange('location', event.target.value)} placeholder="Ubicacion" className="rounded-xl border border-black/15 px-3 py-2" />

            <select value={formData.language} onChange={(event) => onChange('language', event.target.value)} className="rounded-xl border border-black/15 px-3 py-2">
              <option value="es">Espanol</option>
              <option value="en">Ingles</option>
            </select>
            <select value={formData.packId} onChange={(event) => onChange('packId', event.target.value)} className="rounded-xl border border-black/15 px-3 py-2">
              <option value="">Sin pack</option>
              {packs.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name} ({formatPrice(pack.price)})
                </option>
              ))}
            </select>

            <select value={formData.stateId} onChange={(event) => onChange('stateId', event.target.value)} className="rounded-xl border border-black/15 px-3 py-2 md:col-span-2">
              <option value="">Estado por defecto</option>
              {states
                .filter((state) => state.isActive)
                .map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
            </select>
          </div>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

          <div className="flex items-center justify-between">
            <div>
              {isEditMode ? (
                <button type="button" onClick={() => void handleDeleteClick()} className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                  Eliminar
                </button>
              ) : null}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="rounded-xl border border-black/15 px-4 py-2 text-sm">
                Cancelar
              </button>
              <button type="submit" disabled={isSaving} className="rounded-xl bg-brand-pine px-4 py-2 text-sm text-brand-cloud">
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

type BodasViewProps = {
  weddings: Wedding[];
  packs: Pack[];
  states: WeddingState[];
  isLoading: boolean;
  errorMessage: string | null;
  onCreate: (formData: WeddingFormData) => Promise<void>;
  onUpdate: (id: string, formData: WeddingFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onChangeState: (weddingId: string, stateId: string) => Promise<void>;
};

function BodasView({ weddings, packs, states, isLoading, errorMessage, onCreate, onUpdate, onDelete, onChangeState }: BodasViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingWeddingId, setEditingWeddingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WeddingFormData>(initialWeddingFormData);

  const filteredWeddings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return weddings;
    }

    return weddings.filter((wedding) => {
      const searchable = `${wedding.name1} ${wedding.lastName1} ${wedding.name2} ${wedding.lastName2} ${wedding.state?.name ?? ''} ${wedding.location ?? ''}`.toLowerCase();
      return searchable.includes(query);
    });
  }, [weddings, searchTerm]);

  function openCreateModal() {
    setEditingWeddingId(null);
    setFormError(null);
    setFormData(initialWeddingFormData);
    setIsModalOpen(true);
  }

  function openEditModal(wedding: Wedding) {
    setEditingWeddingId(wedding.id);
    setFormError(null);
    setFormData({
      name1: wedding.name1 ?? '',
      lastName1: wedding.lastName1 ?? '',
      name2: wedding.name2 ?? '',
      lastName2: wedding.lastName2 ?? '',
      email1: wedding.email1 ?? '',
      email2: wedding.email2 ?? '',
      phone1: wedding.phone1 ?? '',
      phone2: wedding.phone2 ?? '',
      language: wedding.language ?? 'es',
      weddingDate: formatDateForInput(wedding.weddingDate),
      location: wedding.location ?? '',
      packId: wedding.packId ?? wedding.pack?.id ?? '',
      stateId: wedding.stateId ?? wedding.state?.id ?? '',
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      if (editingWeddingId) {
        await onUpdate(editingWeddingId, formData);
      } else {
        await onCreate(formData);
      }

      setIsModalOpen(false);
      setEditingWeddingId(null);
      setFormData(initialWeddingFormData);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo guardar la boda.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-5">
      <article className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-panel backdrop-blur-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-brand-ink">Bodas</h3>
          <button type="button" onClick={openCreateModal} className="rounded-xl bg-brand-pine px-4 py-2 text-sm font-medium text-brand-cloud">Nueva boda</button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar por boda, estado o ubicacion" className="w-full max-w-md rounded-xl border border-black/15 px-3 py-2 text-sm" />
          <span className="text-xs text-black/50">Total: {weddings.length}</span>
        </div>

        {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-black/55">
                <th className="px-3 py-3 font-medium">Boda</th>
                <th className="px-3 py-3 font-medium">Fecha</th>
                <th className="px-3 py-3 font-medium">Estado</th>
                <th className="px-3 py-3 font-medium">Pack</th>
                <th className="px-3 py-3 font-medium">Ubicacion</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td className="px-3 py-6 text-center text-black/60" colSpan={5}>Cargando bodas...</td></tr>
              ) : filteredWeddings.length === 0 ? (
                <tr><td className="px-3 py-6 text-center text-black/60" colSpan={5}>No hay resultados.</td></tr>
              ) : (
                filteredWeddings.map((wedding) => (
                  <tr key={wedding.id} className="border-b border-black/5 text-brand-ink hover:bg-brand-sand/25">
                    <td className="px-3 py-3"><button type="button" onClick={() => openEditModal(wedding)} className="text-left font-medium underline decoration-brand-clay/40 underline-offset-4">{wedding.name1} {wedding.lastName1} y {wedding.name2} {wedding.lastName2}</button></td>
                    <td className="px-3 py-3">{getReadableDate(wedding.weddingDate)}</td>
                    <td className="px-3 py-3">
                      <select value={wedding.stateId ?? wedding.state?.id ?? ''} onChange={(event) => void onChangeState(wedding.id, event.target.value)} className="min-w-[220px] rounded-xl border border-black/15 bg-white px-3 py-1.5 text-xs">
                        {(states.filter((state) => state.isActive || state.id === (wedding.stateId ?? wedding.state?.id ?? ''))).map((state) => (
                          <option key={state.id} value={state.id}>{state.name}{state.isActive ? '' : ' (inactivo)'}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">{wedding.pack?.name ?? '-'}</td>
                    <td className="px-3 py-3">{wedding.location ?? '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>

      <WeddingFormModal mode={editingWeddingId ? 'edit' : 'create'} isOpen={isModalOpen} isSaving={isSaving} errorMessage={formError} formData={formData} packs={packs} states={states} onClose={() => setIsModalOpen(false)} onChange={(field, value) => setFormData((previous) => ({ ...previous, [field]: value }))} onSubmit={handleSubmit} onDelete={editingWeddingId ? async () => { await onDelete(editingWeddingId); setIsModalOpen(false); } : undefined} />
    </section>
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

function PacksView({ packs, isLoading, errorMessage, onCreate, onUpdate, onDelete }: PacksViewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackId, setEditingPackId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PackFormData>(initialPackFormData);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      if (editingPackId) {
        await onUpdate(editingPackId, formData);
      } else {
        await onCreate(formData);
      }

      setIsModalOpen(false);
      setEditingPackId(null);
      setFormData(initialPackFormData);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-5">
      <article className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-panel backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-brand-ink">Packs</h3>
          <button type="button" onClick={() => { setEditingPackId(null); setFormData(initialPackFormData); setIsModalOpen(true); }} className="rounded-xl bg-brand-pine px-4 py-2 text-sm font-medium text-brand-cloud">Nuevo pack</button>
        </div>

        {errorMessage ? <p className="mb-4 text-sm text-red-600">{errorMessage}</p> : null}

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
              <tr><td className="px-3 py-6 text-center text-black/60" colSpan={3}>Cargando packs...</td></tr>
            ) : packs.length === 0 ? (
              <tr><td className="px-3 py-6 text-center text-black/60" colSpan={3}>No hay packs.</td></tr>
            ) : (
              packs.map((pack) => (
                <tr key={pack.id} className="border-b border-black/5 text-brand-ink hover:bg-brand-sand/25">
                  <td className="px-3 py-3"><button type="button" onClick={() => { setEditingPackId(pack.id); setFormData({ name: pack.name, description: pack.description, price: String(pack.price) }); setIsModalOpen(true); }} className="text-left font-medium underline decoration-brand-clay/40 underline-offset-4">{pack.name}</button></td>
                  <td className="px-3 py-3">{pack.description || '-'}</td>
                  <td className="px-3 py-3">{formatPrice(pack.price)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-black/10 bg-white p-6 shadow-panel">
            <form onSubmit={submit} className="space-y-4">
              <input required value={formData.name} onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))} placeholder="Nombre" className="w-full rounded-xl border border-black/15 px-3 py-2" />
              <textarea value={formData.description} onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))} placeholder="Descripcion" className="w-full rounded-xl border border-black/15 px-3 py-2" rows={4} />
              <input required value={formData.price} onChange={(event) => setFormData((prev) => ({ ...prev, price: event.target.value }))} placeholder="0.00" className="w-full rounded-xl border border-black/15 px-3 py-2" />
              <div className="flex justify-between">
                {editingPackId ? <button type="button" onClick={() => void onDelete(editingPackId)} className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">Eliminar</button> : <div />}
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-black/15 px-4 py-2 text-sm">Cancelar</button>
                  <button type="submit" disabled={isSaving} className="rounded-xl bg-brand-pine px-4 py-2 text-sm text-brand-cloud">{isSaving ? 'Guardando...' : 'Guardar'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

type WeddingStatesSettingsViewProps = {
  states: WeddingState[];
  isLoading: boolean;
  errorMessage: string | null;
  onCreate: (name: string) => Promise<void>;
  onUpdate: (id: string, payload: { name?: string; isActive?: boolean }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (stateIds: string[]) => Promise<void>;
};

function WeddingStatesSettingsView({ states, isLoading, errorMessage, onCreate, onUpdate, onDelete, onReorder }: WeddingStatesSettingsViewProps) {
  const [newName, setNewName] = useState('');
  const orderedStates = useMemo(() => [...states].sort((a, b) => a.sortOrder - b.sortOrder), [states]);

  return (
    <section className="space-y-5">
      <article className="rounded-3xl border border-black/5 bg-white/90 p-6 shadow-panel backdrop-blur-md">
        <h3 className="text-xl font-semibold text-brand-ink">Ajustes - Parametrizacion</h3>
        <p className="mt-1 text-sm text-black/60">Estados de boda</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Nuevo estado" className="w-full max-w-sm rounded-xl border border-black/15 px-3 py-2 text-sm" />
          <button type="button" onClick={() => void onCreate(newName.trim()).then(() => setNewName(''))} className="rounded-xl bg-brand-pine px-4 py-2 text-sm text-brand-cloud">Crear estado</button>
        </div>

        {errorMessage ? <p className="mt-3 text-sm text-red-600">{errorMessage}</p> : null}

        <table className="mt-4 min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-black/55">
              <th className="px-3 py-3 font-medium">Orden</th>
              <th className="px-3 py-3 font-medium">Nombre</th>
              <th className="px-3 py-3 font-medium">Codigo</th>
              <th className="px-3 py-3 font-medium">Estado</th>
              <th className="px-3 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className="px-3 py-6 text-center text-black/60" colSpan={5}>Cargando estados...</td></tr>
            ) : orderedStates.length === 0 ? (
              <tr><td className="px-3 py-6 text-center text-black/60" colSpan={5}>No hay estados.</td></tr>
            ) : (
              orderedStates.map((state, index) => (
                <tr key={state.id} className="border-b border-black/5 text-brand-ink">
                  <td className="px-3 py-3">
                    <button type="button" onClick={() => { if (index > 0) { const reordered = [...orderedStates]; const [item] = reordered.splice(index, 1); reordered.splice(index - 1, 0, item); void onReorder(reordered.map((value) => value.id)); } }} className="mr-1 rounded-lg border border-black/15 px-2 py-1 text-xs">?</button>
                    <button type="button" onClick={() => { if (index < orderedStates.length - 1) { const reordered = [...orderedStates]; const [item] = reordered.splice(index, 1); reordered.splice(index + 1, 0, item); void onReorder(reordered.map((value) => value.id)); } }} className="rounded-lg border border-black/15 px-2 py-1 text-xs">?</button>
                  </td>
                  <td className="px-3 py-3">{state.name}</td>
                  <td className="px-3 py-3 font-mono text-xs">{state.code}</td>
                  <td className="px-3 py-3">{state.isActive ? 'Activo' : 'Inactivo'}</td>
                  <td className="px-3 py-3">
                    <button type="button" onClick={() => { const newName = window.prompt('Nuevo nombre del estado', state.name); if (newName && newName.trim()) { void onUpdate(state.id, { name: newName.trim() }); } }} className="mr-2 rounded-lg border border-black/15 px-2 py-1 text-xs">Renombrar</button>
                    <button type="button" onClick={() => void onUpdate(state.id, { isActive: !state.isActive })} className="mr-2 rounded-lg border border-black/15 px-2 py-1 text-xs">{state.isActive ? 'Desactivar' : 'Activar'}</button>
                    <button type="button" onClick={() => { if (window.confirm(`Eliminar estado ${state.name}?`)) { void onDelete(state.id); } }} className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}

export function CrmDashboardPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [weddingStates, setWeddingStates] = useState<WeddingState[]>([]);
  const [isWeddingsLoading, setIsWeddingsLoading] = useState(true);
  const [isPacksLoading, setIsPacksLoading] = useState(true);
  const [isWeddingStatesLoading, setIsWeddingStatesLoading] = useState(true);
  const [weddingsError, setWeddingsError] = useState<string | null>(null);
  const [packsError, setPacksError] = useState<string | null>(null);
  const [weddingStatesError, setWeddingStatesError] = useState<string | null>(null);

  async function loadWeddings() { try { setIsWeddingsLoading(true); setWeddingsError(null); setWeddings(await fetchApi<Wedding[]>(`${API_BASE_URL}/weddings`)); } catch (error) { setWeddingsError(error instanceof Error ? error.message : 'No se pudieron cargar las bodas.'); } finally { setIsWeddingsLoading(false); } }
  async function loadPacks() { try { setIsPacksLoading(true); setPacksError(null); setPacks(await fetchApi<Pack[]>(`${API_BASE_URL}/packs`)); } catch (error) { setPacksError(error instanceof Error ? error.message : 'No se pudieron cargar los packs.'); } finally { setIsPacksLoading(false); } }
  async function loadWeddingStates() { try { setIsWeddingStatesLoading(true); setWeddingStatesError(null); setWeddingStates(await fetchApi<WeddingState[]>(`${API_BASE_URL}/wedding-states?includeInactive=true`)); } catch (error) { setWeddingStatesError(error instanceof Error ? error.message : 'No se pudieron cargar los estados.'); } finally { setIsWeddingStatesLoading(false); } }

  useEffect(() => { void Promise.all([loadWeddings(), loadPacks(), loadWeddingStates()]); }, []);

  async function handleCreateWedding(formData: WeddingFormData) { await fetchApi<Wedding>(`${API_BASE_URL}/weddings`, { method: 'POST', body: JSON.stringify({ name1: formData.name1.trim(), lastName1: normalizeOptional(formData.lastName1), name2: formData.name2.trim(), lastName2: normalizeOptional(formData.lastName2), email1: normalizeOptional(formData.email1), email2: normalizeOptional(formData.email2), phone1: normalizeOptional(formData.phone1), phone2: normalizeOptional(formData.phone2), language: normalizeOptional(formData.language), weddingDate: formData.weddingDate, location: normalizeOptional(formData.location), stateId: normalizeOptional(formData.stateId), packId: normalizeOptional(formData.packId) }) }); await loadWeddings(); }
  async function handleUpdateWedding(id: string, formData: WeddingFormData) { await fetchApi<Wedding>(`${API_BASE_URL}/weddings/${id}`, { method: 'PATCH', body: JSON.stringify({ name1: formData.name1.trim(), lastName1: normalizeOptional(formData.lastName1), name2: formData.name2.trim(), lastName2: normalizeOptional(formData.lastName2), email1: normalizeOptional(formData.email1), email2: normalizeOptional(formData.email2), phone1: normalizeOptional(formData.phone1), phone2: normalizeOptional(formData.phone2), language: normalizeOptional(formData.language), weddingDate: formData.weddingDate, location: normalizeOptional(formData.location), stateId: normalizeOptional(formData.stateId), packId: normalizeOptional(formData.packId) }) }); await loadWeddings(); }
  async function handleDeleteWedding(id: string) { await fetchApi<void>(`${API_BASE_URL}/weddings/${id}`, { method: 'DELETE' }); await loadWeddings(); }
  async function handleChangeWeddingState(weddingId: string, stateId: string) { const updated = await fetchApi<Wedding>(`${API_BASE_URL}/weddings/${weddingId}/state`, { method: 'PATCH', body: JSON.stringify({ stateId }) }); setWeddings((previous) => previous.map((wedding) => wedding.id === weddingId ? updated : wedding)); }

  async function handleCreatePack(formData: PackFormData) { await fetchApi<Pack>(`${API_BASE_URL}/packs`, { method: 'POST', body: JSON.stringify({ name: formData.name.trim(), description: normalizeOptional(formData.description) ?? '', price: parsePrice(formData.price) }) }); await Promise.all([loadPacks(), loadWeddings()]); }
  async function handleUpdatePack(id: string, formData: PackFormData) { await fetchApi<Pack>(`${API_BASE_URL}/packs/${id}`, { method: 'PATCH', body: JSON.stringify({ name: formData.name.trim(), description: normalizeOptional(formData.description) ?? '', price: parsePrice(formData.price) }) }); await Promise.all([loadPacks(), loadWeddings()]); }
  async function handleDeletePack(id: string) { await fetchApi<void>(`${API_BASE_URL}/packs/${id}`, { method: 'DELETE' }); await Promise.all([loadPacks(), loadWeddings()]); }

  async function handleCreateWeddingState(name: string) { await fetchApi<WeddingState>(`${API_BASE_URL}/wedding-states`, { method: 'POST', body: JSON.stringify({ name }) }); await Promise.all([loadWeddingStates(), loadWeddings()]); }
  async function handleUpdateWeddingState(id: string, payload: { name?: string; isActive?: boolean }) { await fetchApi<WeddingState>(`${API_BASE_URL}/wedding-states/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); await Promise.all([loadWeddingStates(), loadWeddings()]); }
  async function handleDeleteWeddingState(id: string) { await fetchApi<void>(`${API_BASE_URL}/wedding-states/${id}`, { method: 'DELETE' }); await Promise.all([loadWeddingStates(), loadWeddings()]); }
  async function handleReorderWeddingStates(stateIds: string[]) { setWeddingStates(await fetchApi<WeddingState[]>(`${API_BASE_URL}/wedding-states/reorder`, { method: 'PATCH', body: JSON.stringify({ stateIds }) })); }

  return (
    <main className="dashboard-fade-in h-screen overflow-hidden p-4 md:p-8">
      <div className="mx-auto grid h-full max-w-7xl gap-5 md:grid-cols-[260px_1fr]">
        <aside className="h-full overflow-hidden rounded-3xl border border-black/5 bg-brand-pine p-6 text-brand-cloud shadow-panel">
          <h1 className="mb-8 text-2xl font-semibold">Lenwed</h1>
          <nav className="space-y-2">{sidebarItems.map((item) => (<button key={item.id} type="button" onClick={() => setActiveSection(item.id)} className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition ${item.id === activeSection ? 'bg-brand-cloud text-brand-pine' : 'text-brand-cloud/80 hover:bg-white/10 hover:text-brand-cloud'}`}>{item.label}</button>))}</nav>
        </aside>

        <div className="lenwed-scroll-area h-full overflow-y-auto">
          {activeSection === 'dashboard' ? <DashboardView /> : null}
          {activeSection === 'bodas' ? <BodasView weddings={weddings} packs={packs} states={weddingStates} isLoading={isWeddingsLoading} errorMessage={weddingsError} onCreate={handleCreateWedding} onUpdate={handleUpdateWedding} onDelete={handleDeleteWedding} onChangeState={handleChangeWeddingState} /> : null}
          {activeSection === 'packs' ? <PacksView packs={packs} isLoading={isPacksLoading} errorMessage={packsError} onCreate={handleCreatePack} onUpdate={handleUpdatePack} onDelete={handleDeletePack} /> : null}
          {activeSection === 'presupuestos' ? <PlaceholderView title="Presupuestos" /> : null}
          {activeSection === 'actividades' ? <PlaceholderView title="Actividades" /> : null}
          {activeSection === 'automatizaciones' ? <PlaceholderView title="Automatizaciones" /> : null}
          {activeSection === 'ajustes' ? <WeddingStatesSettingsView states={weddingStates} isLoading={isWeddingStatesLoading} errorMessage={weddingStatesError} onCreate={handleCreateWeddingState} onUpdate={handleUpdateWeddingState} onDelete={handleDeleteWeddingState} onReorder={handleReorderWeddingStates} /> : null}
        </div>
      </div>
    </main>
  );
}

