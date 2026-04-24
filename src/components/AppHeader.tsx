import { Link, useLocation } from "@tanstack/react-router";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/analytics", label: "Analytics" },
] as const;

export function AppHeader() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="outline-none">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 shadow-soft">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-elegant"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          AI Model Online
        </div>
      </div>
    </header>
  );
}
