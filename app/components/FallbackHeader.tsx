// app/components/FallbackHeader.tsx

export default function FallbackHeader() {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo-box.png" alt="Schulbox Icon" className="h-10 block md:hidden" />
            <img src="/logo.png" alt="Schulbox Logo" className="h-10 hidden md:block" />
          </a>
          <div className="text-sm text-gray-600 hidden md:block">Ein Fehler ist aufgetreten</div>
          <div className="flex items-center gap-4 text-gray-600">
            <a href="/" title="Zur Startseite">
              <span role="img" aria-label="Startseite" className="text-xl">🏠</span>
            </a>
          </div>
        </div>
      </header>
    );
  }
  