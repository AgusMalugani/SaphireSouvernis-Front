import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { BACK_TO_HOME_CLASS, PageHeader } from './ConsumerPageLayout.jsx';

export function BackToDashboardLink({ label = 'Volver al inventario' }) {
  return (
    <Link to="/dashboard" className={BACK_TO_HOME_CLASS}>
      <FiArrowLeft size={16} aria-hidden="true" />
      {label}
    </Link>
  );
}

export function AdminPageShell({
  eyebrow = 'Panel de administración',
  title,
  titleId,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  centered = false,
  showBackToDashboard = false,
  backToDashboardLabel,
}) {
  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 sm:px-8">
      <div className={`mx-auto ${maxWidth}`}>
        {showBackToDashboard && (
          <div className={`mb-4 ${centered ? 'flex justify-center' : ''}`}>
            <BackToDashboardLink label={backToDashboardLabel} />
          </div>
        )}
        <div className={`mb-8 ${centered ? 'text-center' : ''}`}>
          <PageHeader
            eyebrow={eyebrow}
            title={title}
            titleId={titleId}
            subtitle={subtitle}
          />
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdminGlassCard({ children }) {
  return (
    <div className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
      {children}
    </div>
  );
}

export function AdminWideShell({ eyebrow, title, titleId, subtitle, children }) {
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <PageHeader
            eyebrow={eyebrow}
            title={title}
            titleId={titleId}
            subtitle={subtitle}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
