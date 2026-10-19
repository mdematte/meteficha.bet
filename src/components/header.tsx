import { Link } from "@tanstack/react-router";
import { Dices, LogIn, LogOut, ShieldCheck } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
          <Dices className="text-primary" size={22} />
          Meteficha<span className="text-primary">.bet</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <Link to="/" className="hover:text-foreground transition-colors">Cassino</Link>
          <Link to="/sportsbook" className="hover:text-foreground transition-colors">Sportsbook</Link>
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <ShieldCheck size={16} /> Painel
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {session && (
            <Link
              to="/conta"
              className="hidden sm:flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Minha conta
            </Link>
          )}
          {session ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <LogOut size={16} /> Sair
            </button>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <LogIn size={16} /> Entrar
            </Link>
          )}
          <button
            className="sm:hidden rounded-md border border-border px-2 py-1.5 text-sm text-foreground"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <div className="sm:hidden flex flex-col gap-1 border-t border-border bg-background px-4 py-3 text-sm">
          <Link to="/" onClick={() => setOpen(false)} className="py-2 text-muted-foreground">Cassino</Link>
          <Link to="/sportsbook" onClick={() => setOpen(false)} className="py-2 text-muted-foreground">Sportsbook</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="py-2 text-muted-foreground">Painel admin</Link>
          )}
        </div>
      )}
    </header>
  );
}
