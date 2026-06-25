import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const INTERACTION_BASE =
  'transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98]';

export const BACK_TO_HOME_CLASS = `inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm text-stone-500 hover:text-rose-500 ${INTERACTION_BASE}`;

export const PRIMARY_CTA_CLASS =
  'group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-105 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98]';

export const GHOST_CTA_CLASS =
  'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-500 shadow-sm hover:bg-stone-50 hover:border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98]';

export function BackToHomeLink() {
  return (
    <Link to="/" className={BACK_TO_HOME_CLASS}>
      <FiArrowLeft size={16} aria-hidden="true" />
      Volver al inicio
    </Link>
  );
}

export function PageHeader({ eyebrow, title, titleId, subtitle }) {
  return (
    <header className={subtitle ? 'space-y-2' : 'space-y-1'}>
      {eyebrow && (
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
          {eyebrow}
        </span>
      )}
      <h1
        id={titleId}
        className="font-display text-3xl font-bold text-stone-800 sm:text-4xl"
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm font-light leading-relaxed text-stone-500">{subtitle}</p>
      )}
    </header>
  );
}

export function GlassArticle({ children, ariaLabelledBy, className = '' }) {
  return (
    <article
      aria-labelledby={ariaLabelledBy}
      className={`space-y-6 rounded-2xl border border-white/60 bg-white/60 p-8 shadow-sm ring-1 ring-black/5 backdrop-blur-md sm:p-10 ${className}`}
    >
      {children}
    </article>
  );
}

export function ConsumerPageLayout({ children, maxWidth = 'max-w-2xl' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-stone-50 to-pink-50/30 px-6 py-16 sm:px-8">
      <div className={`mx-auto ${maxWidth}`}>
        <div className="mb-8">
          <BackToHomeLink />
        </div>
        {children}
      </div>
    </div>
  );
}

export function ContentSection({ title, children }) {
  return (
    <section className="space-y-3">
      {title && (
        <h2 className="font-display text-lg font-semibold text-stone-800">{title}</h2>
      )}
      {children}
    </section>
  );
}
