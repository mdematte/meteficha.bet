import { createFileRoute, Link } from "@tanstack/react-router";
import { Dices, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import casinoHero from "@/assets/casino-hero.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meteficha.bet — Cassino demonstrativo com saldo virtual" },
      {
        name: "description",
        content:
          "Jogue slots, roleta e blackjack demonstrativos no Meteficha.bet com saldo virtual gratuito. Nenhuma aposta envolve dinheiro real.",
      },
    ],
  }),
  component: Home,
});

const games = [
  { name: "Roleta Neon", category: "Mesa", rtp: "96.4%" },
  { name: "Blackjack Fichas", category: "Mesa", rtp: "98.1%" },
  { name: "Slot Fortuna Verde", category: "Slot", rtp: "95.2%" },
  { name: "Slot Touro de Ouro", category: "Slot", rtp: "94.8%" },
  { name: "Crash Demo", category: "Instantaneo", rtp: "97.0%" },
  { name: "Dados da Sorte", category: "Mesa", rtp: "96.9%" },
];

function Home() {
  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="cp-fade-in">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-demo/15 px-3 py-1 text-xs font-semibold text-demo">
            <Sparkles size={14} /> 100% demonstrativo — sem dinheiro real
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Entre no jogo. <span className="cp-gradient-text">Explore outro nivel.</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            O Meteficha.bet e um ambiente de demonstracao para testar jogos de
            cassino e apostas esportivas simuladas. Voce recebe saldo virtual
            gratuito ao se cadastrar e pode jogar livremente — sem deposito,
            sem saque, sem risco financeiro.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="rounded-md px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-blue)" }}
            >
              Criar conta demo gratuita
            </Link>
            <Link
              to="/sportsbook"
              className="rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-secondary/50 hover:bg-muted"
            >
              Ver sportsbook demo
            </Link>
          </div>
        </div>
        <div className="cp-card-image cp-gradient-border">
          <img
            src={casinoHero}
            alt="Lobby de cassino cyberpunk escuro com roleta holografica e fichas de poker em luz neon azul e roxa"
            className="w-full rounded-2xl border border-border object-cover"
          />
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">Jogos demonstrativos</h2>
          <span className="text-xs text-muted-foreground">RTP exibido e simulado</span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <div key={game.name} className="cp-card group p-5">
              <div className="flex items-center justify-between">
                <Dices className="text-secondary" size={20} />
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {game.category}
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-foreground">{game.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">RTP demo: {game.rtp}</p>
              <Link
                to="/auth"
                className="mt-4 inline-block text-sm font-semibold text-secondary hover:underline"
              >
                Jogar com saldo virtual
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        <div className="cp-card p-5">
          <Trophy className="text-secondary" size={20} />
          <h3 className="mt-3 font-semibold text-foreground">Saldo virtual gratis</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Toda nova conta recebe fichas demonstrativas para explorar a
            plataforma sem custo.
          </p>
        </div>
        <div className="cp-card p-5">
          <ShieldCheck className="text-primary" size={20} />
          <h3 className="mt-3 font-semibold text-foreground">Sem dinheiro real</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Nao ha deposito, saque, pagamento ou conversao de saldo em dinheiro
            em nenhuma tela ou rota.
          </p>
        </div>
        <div className="cp-card p-5">
          <Sparkles className="text-accent" size={20} />
          <h3 className="mt-3 font-semibold text-foreground">Historico completo</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe suas apostas e resultados simulados no seu painel
            pessoal.
          </p>
        </div>
      </section>
    </main>
  );
}
