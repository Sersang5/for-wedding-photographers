'use client';

import { useState } from 'react';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'parejas', label: 'Parejas' },
  { id: 'leads', label: 'Leads' },
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

type Couple = {
  id: string;
  names: string;
  email: string;
  phone: string;
  weddingDate: string;
  status: 'Nuevo lead' | 'Reunion agendada' | 'Propuesta enviada' | 'Reserva cerrada';
  packageName: string;
  budget: string;
  owner: string;
};

const couples: Couple[] = [
  {
    id: 'CPL-001',
    names: 'Laura & Jose',
    email: 'laura.jose@gmail.com',
    phone: '+34 611 222 333',
    weddingDate: '2026-06-20',
    status: 'Reunion agendada',
    packageName: 'Pack Signature',
    budget: '2.800 EUR',
    owner: 'Dani',
  },
  {
    id: 'CPL-002',
    names: 'Marta & Pablo',
    email: 'martaypablo@email.com',
    phone: '+34 622 123 456',
    weddingDate: '2026-09-12',
    status: 'Propuesta enviada',
    packageName: 'Pack Storytelling',
    budget: '3.400 EUR',
    owner: 'Dani',
  },
  {
    id: 'CPL-003',
    names: 'Nora & Alex',
    email: 'nora.alex@gmail.com',
    phone: '+34 633 444 777',
    weddingDate: '2026-10-03',
    status: 'Nuevo lead',
    packageName: 'Pack Esencial',
    budget: '2.100 EUR',
    owner: 'Dani',
  },
  {
    id: 'CPL-004',
    names: 'Eva & Samuel',
    email: 'evaysamuel@outlook.com',
    phone: '+34 644 888 999',
    weddingDate: '2027-04-24',
    status: 'Reserva cerrada',
    packageName: 'Pack Editorial',
    budget: '4.200 EUR',
    owner: 'Dani',
  },
];

function getMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getReadableDate(dateValue: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue));
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

function ParejasView() {
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
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-brand-ink">
            Todas las parejas ({couples.length})
          </h3>
          <button
            type="button"
            className="rounded-xl bg-brand-pine px-4 py-2 text-sm font-medium text-brand-cloud transition hover:bg-brand-sage"
          >
            Nueva pareja
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-black/55">
                <th className="px-3 py-3 font-medium">Pareja</th>
                <th className="px-3 py-3 font-medium">Contacto</th>
                <th className="px-3 py-3 font-medium">Fecha boda</th>
                <th className="px-3 py-3 font-medium">Estado</th>
                <th className="px-3 py-3 font-medium">Pack</th>
                <th className="px-3 py-3 font-medium">Valor</th>
                <th className="px-3 py-3 font-medium">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {couples.map((couple) => (
                <tr
                  key={couple.id}
                  className="border-b border-black/5 text-brand-ink hover:bg-brand-sand/25"
                >
                  <td className="px-3 py-3">
                    <div className="font-medium">{couple.names}</div>
                    <div className="text-xs text-black/45">{couple.id}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div>{couple.email}</div>
                    <div className="text-xs text-black/45">{couple.phone}</div>
                  </td>
                  <td className="px-3 py-3">{getReadableDate(couple.weddingDate)}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-brand-sage/15 px-2.5 py-1 text-xs font-medium text-brand-sage">
                      {couple.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">{couple.packageName}</td>
                  <td className="px-3 py-3">{couple.budget}</td>
                  <td className="px-3 py-3">{couple.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
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
          {activeSection === 'parejas' ? <ParejasView /> : null}
          {activeSection === 'leads' ? <PlaceholderView title="Leads" /> : null}
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