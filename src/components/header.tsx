import { Link } from "@tanstack/react-router";
import { Gem, LogIn, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "@/lib/use-session";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { session, isAdmin } = useSession();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg glow-primary" style={{ background: "var(--gradient-brand)" }}>
            <Gem className="text-primary-foreground" size={16} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-extrabold uppercase tracking-tight text-foreground sm:text-lg">
              METEFICHA<span className="text-gradient-brand">.BET</span>
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:block">
              Entre no jogo. Explore outro nível.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <Link to="/" className="transition-colors hover:text-foreground">Cassino</Link>
          <Link to="/sportsbook" className="transition-colors hover:text-foreground">Sportsbook</Link>
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1 transition-colors hover:text-foreground">
              <ShieldCheck size={16} /> Painel
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {session && (
            <Link
              to="/conta"
              className="hidden items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-secondary/50 hover:bg-muted sm:flex"
            >
              Minha conta
            </Link>
          )}
          {session ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-secondary/50 hover:bg-muted"
            >
              <LogOut size={16} /> Sair
            </button>
          ) : (
            <Link
              to="/auth"
              className="btn-brand flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold"
            >
              <LogIn size={16} /> Entrar
            </Link>
          )}
          <button
            className="rounded-md border border-border px-2 py-1.5 text-foreground transition-colors hover:border-secondary/50 sm:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-border bg-background px-4 py-3 text-sm sm:hidden">
          <Link to="/" onClick={() => setOpen(false)} className="py-2 text-muted-foreground transition-colors hover:text-foreground">Cassino</Link>
          <Link to="/sportsbook" onClick={() => setOpen(false)} className="py-2 text-muted-foreground transition-colors hover:text-foreground">Sportsbook</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="py-2 text-muted-foreground transition-colors hover:text-foreground">Painel admin</Link>
          )}
        </div>
      )}
    </header>
  );
}
