import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "@/styles.css?url";
import { DemoBanner } from "@/components/demo-banner";
import { Header } from "@/components/header";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "Meteficha.bet — Cassino e Sportsbook demonstrativo",
      },
      {
        name: "description",
        content:
          "Meteficha.bet e uma plataforma demonstrativa de cassino e sportsbook. Saldo virtual, apostas simuladas, sem dinheiro real.",
      },
      { property: "og:title", content: "Meteficha.bet — Demonstrativo" },
      {
        property: "og:description",
        content:
          "Experimente jogos de cassino e apostas esportivas em modo 100% demonstrativo, sem dinheiro real.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <DemoBanner />
        <Header />
        <Outlet />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
