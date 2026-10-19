import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/use-session";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel admin — Meteficha.bet (demo)" },
      {
        name: "description",
        content: "Painel administrativo demonstrativo do Meteficha.bet: usuarios, jogos, eventos e apostas simuladas.",
      },
    ],
  }),
  component: Admin,
});

type Profile = { id: string; full_name: string | null; demo_balance: number; created_at: string };
type GameRow = { id: string; name: string; category: string; rtp: number; active: boolean };
type EventRow = { id: string; competition: string; home_team: string; away_team: string; status: string };
type BetRow = { id: string; user_id: string; stake_demo: number; status: string; created_at: string };

function Admin() {
  const { session, isAdmin, loading: sessionLoading } = useSession();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [games, setGames] = useState<GameRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [bets, setBets] = useState<BetRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading || !isAdmin) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    Promise.all([
      supabase.from("profiles").select("id, full_name, demo_balance, created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("casino_games").select("id, name, category, rtp, active").order("name"),
      supabase.from("sports_events").select("id, competition, home_team, away_team, status").order("starts_at", { ascending: false }).limit(20),
      supabase.from("demo_bets").select("id, user_id, stake_demo, status, created_at").order("created_at", { ascending: false }).limit(20),
    ]).then(([p, g, e, b]) => {
      if (!active) return;
      setProfiles(p.data ?? []);
      setGames(g.data ?? []);
      setEvents(e.data ?? []);
      setBets(b.data ?? []);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [isAdmin, sessionLoading]);

  if (sessionLoading || loading) {
    return (
      <main id="main" className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-20 text-sm text-muted-foreground">
        <Loader2 className="animate-spin" size={16} /> Carregando painel...
      </main>
    );
  }

  if (!session || !isAdmin) {
    return (
      <main id="main" className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShieldAlert className="mx-auto text-destructive" size={32} />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Acesso restrito</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta area e exclusiva para administradores do ambiente demonstrativo.
        </p>
        <Link to="/" className="mt-6 inline-block rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground">
          Voltar ao inicio
        </Link>
      </main>
    );
  }

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Painel administrativo (demo)</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Gestao de usuarios, jogos e eventos simulados. Nenhuma acao aqui movimenta dinheiro real:
        apenas fichas virtuais e dados de demonstracao.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Usuarios e saldo virtual</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Saldo demo</th>
                <th className="px-4 py-2">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-2 text-foreground">{p.full_name ?? "Sem nome"}</td>
                  <td className="px-4 py-2 text-foreground">{p.demo_balance.toFixed(2)} fichas</td>
                  <td className="px-4 py-2 text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">Nenhum usuario cadastrado ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">Jogos de cassino (demo)</h2>
          <div className="mt-3 flex flex-col gap-2">
            {games.map((g) => (
              <div key={g.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm">
                <span className="text-foreground">{g.name}</span>
                <span className="text-xs text-muted-foreground">{g.category} · RTP {g.rtp}%</span>
              </div>
            ))}
            {games.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum jogo cadastrado.</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Eventos sportsbook (demo)</h2>
          <div className="mt-3 flex flex-col gap-2">
            {events.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm">
                <span className="text-foreground">{e.home_team} vs {e.away_team}</span>
                <span className="text-xs text-muted-foreground">{e.status}</span>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum evento cadastrado.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-foreground">Ultimas apostas demonstrativas</h2>
        <div className="mt-3 flex flex-col gap-2">
          {bets.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm">
              <span className="text-muted-foreground">{new Date(b.created_at).toLocaleString("pt-BR")}</span>
              <span className="text-foreground">{b.stake_demo} fichas</span>
              <span className="text-xs text-muted-foreground">{b.status}</span>
            </div>
          ))}
          {bets.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma aposta registrada ainda.</p>
          )}
        </div>
      </section>
    </main>
  );
}
