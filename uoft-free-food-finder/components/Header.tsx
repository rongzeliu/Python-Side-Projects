import Link from "next/link";

const links = [
  { href: "/", label: "Map" },
  { href: "/feed", label: "Feed" },
  { href: "/submit", label: "Submit" },
];

export function Header({ current }: { current: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--navy)_92%,transparent)] text-[var(--cream)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight">UofT Free Food Finder</span>
          <span className="hidden text-xs uppercase tracking-[0.18em] text-[var(--gold)] sm:inline">
            UTSG
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 ${
                current === link.href
                  ? "bg-[var(--gold)] text-[var(--navy)]"
                  : "text-[var(--cream)]/85 hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
