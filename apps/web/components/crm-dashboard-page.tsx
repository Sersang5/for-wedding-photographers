const sidebarItems = [
  { label: 'Dashboard', active: true },
  { label: 'Contactos', active: false },
  { label: 'Leads', active: false },
  { label: 'Presupuestos', active: false },
  { label: 'Actividades', active: false },
  { label: 'Automatizaciones', active: false },
  { label: 'Ajustes', active: false },
] as const;

const weekdayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;

type CalendarDay = {
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
};

function getMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
  }).format(date);
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

export function CrmDashboardPage() {
  const currentDate = new Date();
  const monthLabel = getMonthLabel(currentDate);
  const calendarDays = buildCalendarDays(currentDate);

  return (
    <main className="dashboard-fade-in min-h-screen p-4 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-black/5 bg-brand-pine p-6 text-brand-cloud shadow-panel">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-brand-sand/80">
              CRM Vertical
            </p>
            <h1 className="mt-2 text-2xl font-semibold">WeddingFlow</h1>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className={`block rounded-xl px-3 py-2 text-sm transition ${
                  item.active
                    ? 'bg-brand-cloud text-brand-pine'
                    : 'text-brand-cloud/80 hover:bg-white/10 hover:text-brand-cloud'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
            <p className="font-medium">Tu semana</p>
            <p className="mt-1 text-brand-sand/80">
              3 reuniones, 2 entregas y 1 boda por confirmar.
            </p>
          </div>
        </aside>

        <section className="space-y-5">
          <header className="rounded-3xl border border-black/5 bg-white/85 p-6 shadow-panel backdrop-blur-md">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-clay">
              Bienvenido de vuelta
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-brand-ink md:text-4xl">
              Hola, Marta. Hoy toca cerrar otra gran historia.
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-black/65 md:text-base">
              Organiza sesiones, reuniones y entregas desde un único panel. El
              calendario te ayudará a mantener cada fecha de boda bajo control.
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
                  10:00 - Reunión inicial con Laura & Dani
                </li>
                <li className="rounded-xl bg-brand-sand/45 p-3">
                  13:30 - Llamada seguimiento presupuesto
                </li>
                <li className="rounded-xl bg-brand-sand/45 p-3">
                  17:00 - Entrega galería preboda
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
      </div>
    </main>
  );
}