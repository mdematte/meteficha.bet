import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/use-session";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta demo — Meteficha.bet" },
      {
        name: "description",
        content: "Veja seu saldo virtual e historico de apostas demonstrativas no Meteficha.bet.",
      },
    ],
  }),
  component: Conta,
});

type Bet = {
  id: string;
  selection: string | null;
  stake_demo: number;
  odds: number | null;
  payout_demo: number;
  status: string;
  created_at: string;
};

function Conta() {
  const { session, loading: sessionLoading } = useSession();
  const [balance, setBalance] = useState<number | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    if (!session) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    Promise.all([
      supabase.from("profiles").select("demo_balance").eq("id", session.user.id).maybeSingle(),
      supabase
        .from("demo_bets")
        .select("id, selection, stake_demo, odds, payout_demo, status, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(30),
    ]).then(([profileRes, betsRes]) => {
      if (!active) return;
      setBalance(profileRes.data?.demo_balance ?? 0);
      setBets(betsRes.data ?? []);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [session, sessionLoading]);

  if (sessionLoading || loading) {
    return (
      <main id="main" className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-20 text-sm text-muted-foreground">
        <Loader2 className="animate-spin" size={16} /> Carregando sua conta demo...
      </main>
    );
  }

  if (!session) {
    return (
      <main id="main" className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Entre para ver sua conta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Faca login ou crie uma conta demo gratuita para acompanhar seu saldo virtual.
        </p>
        <Link to="/auth" className="mt-6 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Ir para login
        </Link>
      </main>
    );
  }

  return (
    <main id="main" className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Minha conta demonstrativa</h1>

      <div className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-card p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
          <Wallet className="text-primary" size={22} />
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Saldo virtual (fichas demo)</span>
          <p className="text-2xl font-bold text-foreground">
            {new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(balance ?? 0)} fichas
          </p>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Fichas virtuais sem valor monetario. Nao ha deposito, saque ou conversao em dinheiro real.
      </p>

      <h2 className="mt-10 text-lg font-bold text-foreground">Historico de apostas demo</h2>
      {bets.length === 0 ? (
        <div className="mt-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Voce ainda nao fez nenhuma aposta demonstrativa.
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {bets.map((bet) => (
            <div key={bet.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div>
                <span className="text-sm font-medium text-foreground">{bet.selection ?? "Jogo de cassino"}</span>
                <p className="text-xs text-muted-foreground">
                  {new Date(bet.created_at).toLocaleString("pt-BR")} · Stake {bet.stake_demo} fichas
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  bet.status === "ganhou"
                    ? "bg-primary/15 text-primary"
                    : bet.status === "perdeu"
                      ? "bg-destructive/15 text-destructive"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {bet.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
