import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/use-session";
import sportsHero from "@/assets/sportsbook-hero.webp";

export const Route = createFileRoute("/sportsbook")({
  head: () => ({
    meta: [
      { title: "Sportsbook demonstrativo — Meteficha.bet" },
      {
        name: "description",
        content:
          "Aposte com saldo virtual em jogos simulados de futebol no sportsbook demonstrativo do Meteficha.bet. Sem dinheiro real.",
      },
    ],
  }),
  component: Sportsbook,
});

type SportsEvent = {
  id: string;
  competition: string;
  home_team: string;
  away_team: string;
  starts_at: string;
  odds_home: number;
  odds_draw: number;
  odds_away: number;
  status: string;
};

function Sportsbook() {
  const { session } = useSession();
  const [events, setEvents] = useState<SportsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    supabase
      .from("sports_events")
      .select("*")
      .eq("status", "aberto")
      .order("starts_at", { ascending: true })
      .then(({ data, error: err }) => {
        if (!active) return;
        if (err) setError(err.message);
        setEvents(data ?? []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function placeBet(event: SportsEvent, selection: "home" | "draw" | "away", odds: number) {
    if (!session) {
      toast.error("Crie sua conta demo gratuita para apostar com saldo virtual.");
      return;
    }
    setPlacing(event.id + selection);
    try {
      const stake = 10;
      const { error: err } = await supabase.from("demo_bets").insert({
        user_id: session.user.id,
        event_id: event.id,
        selection,
        stake_demo: stake,
        odds,
        status: "pendente",
      });
      if (err) throw err;
      toast.success("Aposta demonstrativa registrada com fichas virtuais!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Nao foi possivel apostar agora.");
    } finally {
      setPlacing(null);
    }
  }

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="cp-fade-in">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-demo/15 px-3 py-1 text-xs font-semibold text-demo">
            <Trophy size={14} /> Odds e eventos simulados
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
            Sportsbook <span className="cp-gradient-text">demonstrativo</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Aposte com fichas virtuais em partidas simuladas. Nenhum evento e
            real e nenhuma aposta envolve dinheiro de verdade.
          </p>
        </div>
        <div className="cp-card-image cp-gradient-border">
          <img
            src={sportsHero}
            alt="Arena de sportsbook cyberpunk escura com bola de futebol holografica e grafico de odds em luz neon azul e roxa"
            className="w-full rounded-2xl border border-border object-cover"
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-foreground">Eventos abertos (demo)</h2>

        {loading && (
          <div className="mt-6 flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="cp-skeleton h-24 w-full" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            Nao foi possivel carregar os eventos: {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="cp-card mt-6 p-6 text-sm text-muted-foreground">
            Nenhum evento demonstrativo aberto no momento. Volte em breve.
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="cp-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <span className="text-xs font-medium text-muted-foreground">{event.competition}</span>
                <h3 className="font-semibold text-foreground">
                  {event.home_team} vs {event.away_team}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {new Date(event.starts_at).toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={placing === event.id + "home"}
                  onClick={() => placeBet(event, "home", event.odds_home)}
                  className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-secondary/50 hover:bg-muted disabled:opacity-60"
                >
                  Casa <span className="text-secondary">{event.odds_home.toFixed(2)}</span>
                </button>
                <button
                  disabled={placing === event.id + "draw"}
                  onClick={() => placeBet(event, "draw", event.odds_draw)}
                  className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-secondary/50 hover:bg-muted disabled:opacity-60"
                >
                  Empate <span className="text-secondary">{event.odds_draw.toFixed(2)}</span>
                </button>
                <button
                  disabled={placing === event.id + "away"}
                  onClick={() => placeBet(event, "away", event.odds_away)}
                  className="rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-secondary/50 hover:bg-muted disabled:opacity-60"
                >
                  Fora <span className="text-secondary">{event.odds_away.toFixed(2)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
