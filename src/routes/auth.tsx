import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Dices, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import authBg from "@/assets/auth-background.webp";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Meteficha.bet (conta demonstrativa)" },
      {
        name: "description",
        content:
          "Crie sua conta demonstrativa gratuita no Meteficha.bet e receba saldo virtual para testar cassino e sportsbook sem dinheiro real.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta ao Meteficha.bet demo!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success(
          "Conta demo criada! Voce recebeu saldo virtual para jogar."
        );
      }
      navigate({ to: "/" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Nao foi possivel continuar."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main id="main" className="grid min-h-[calc(100vh-7rem)] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={authBg}
          alt="Fundo escuro de cassino com luzes verdes e douradas e silhuetas de fichas e cartas"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background via-background/40 to-transparent p-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-demo/20 px-3 py-1 text-xs font-semibold text-demo">
            Conta 100% demonstrativa
          </span>
          <h2 className="mt-3 text-2xl font-bold text-foreground">
            Seu saldo virtual te espera.
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Cadastre-se gratis e explore cassino e sportsbook simulados, sem
            nenhum valor financeiro real envolvido.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Dices className="text-primary" size={22} />
            Meteficha<span className="text-primary">.bet</span>
          </div>

          <div className="mt-6 flex rounded-md border border-border p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-sm py-2 text-sm font-semibold transition-colors ${
                mode === "login"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-sm py-2 text-sm font-semibold transition-colors ${
                mode === "register"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Criar conta demo
            </button>
          </div>

          <h1 className="mt-6 text-xl font-bold text-foreground">
            {mode === "login" ? "Que bom te ver de novo" : "Comece a jogar na demo"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login"
              ? "Acesse sua conta demonstrativa do Meteficha.bet."
              : "Voce recebera saldo virtual gratuito automaticamente."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label className="text-sm font-medium text-foreground">Nome</label>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Seu nome"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                placeholder="voce@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Senha</label>
              <div className="relative mt-1">
                <input
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 pr-10 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {mode === "login" ? "Entrar" : "Criar conta demo"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Ambiente 100% demonstrativo. Nenhum dado financeiro real e
            solicitado ou armazenado.
          </p>
        </div>
      </div>
    </main>
  );
}
