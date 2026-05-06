// components/DemoNotice.jsx — Small alert shown above login/register forms.
// Reused on both /signin and /signup so the wording stays consistent.

export default function DemoNotice() {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg px-3 py-2.5 text-sm font-semibold"
    >
      <svg
        className="w-5 h-5 shrink-0 text-yellow-700 mt-0.5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2L1 21h22L12 2zm0 4.6l8.5 14.4h-17L12 6.6zm-1 5.4v4h2v-4h-2zm0 5v2h2v-2h-2z" />
      </svg>
      <p className="leading-snug">
        Demo app — do not use your real password. Use a throwaway password you
        don&apos;t use anywhere else.
      </p>
    </div>
  );
}
