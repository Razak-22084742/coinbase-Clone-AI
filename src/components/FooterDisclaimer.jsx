// components/FooterDisclaimer.jsx — Disclaimer block rendered at the very bottom of every page

export default function FooterDisclaimer() {
  const year = new Date().getFullYear();

  return (
    <div className="w-full bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-gray-500 leading-relaxed">
        <p>
          This is a demo project built for academic purposes. Do not enter
          real personal information, real passwords, or any sensitive data.
          All data submitted may be visible in a development database and is
          not protected to production standards. Not affiliated with Coinbase.
        </p>
        <p className="mt-2 text-gray-400">
          &copy; {year} Crypto App — Student project
        </p>
      </div>
    </div>
  );
}
