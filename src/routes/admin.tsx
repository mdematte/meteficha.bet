import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Boxes,
  FileClock,
  Gamepad2,
  Loader2,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/use-session";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — Meteficha.bet" },
      {
        name: "description",
        content:
          "Painel administrativo do Meteficha.bet: usuarios, catalogo de jogos, provedores, categorias, sessoes de teste, logs de auditoria e controles de ativacao. Ambiente de desenvolvimento/homologacao, sem dinheiro real.",
      },
    ],
  }),
  component: Admin,
});

type Profile = { id: string; full_name: string | null; demo_balance: number; created_at: string };
type RoleRow = { user_id: string; role: string };
type GameRow = Database["public"]["Tables"]["casino_games"]["Row"];
type ProviderRow = Database["public"]["Tables"]["game_providers"]["Row"];
type CategoryRow = Database["public"]["Tables"]["game_categories"]["Row"];
type SessionRow = Database["public"]["Tables"]["integration_sessions"]["Row"];
type LogRow = Database["public"]["Tables"]["audit_logs"]["Row"];
type Controls = Database["public"]["Tables"]["operation_controls"]["Row"];

type ProviderStatus = ProviderRow["status"];
type IntegrationEnvironment = ProviderRow["environment"];
type GameIntegrationType = GameRow["integration_type"];

const TABS = [
  { id: "overview", label: "Visão geral", icon: Activity },
  { id: "users", label: "Usuários", icon: Users },
  { id: "catalog", label: "Catálogo", icon: Gamepad2 },
  { id: "providers", label: "Provedores", icon: Boxes },
  { id: "categories", label: "Categorias", icon: Tags },
  { id: "sessions", label: "Sessões de teste", icon: ShieldCheck },
  { id: "logs", label: "Logs de auditoria", icon: FileClock },
  { id: "controls", label: "Controles", icon: Lock },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PROVIDER_STATUS_LABEL: Record<ProviderStatus, string> = {
  desativado: "Desativada",
  configurado: "Configurada",
  em_validacao: "Em validação",
  sandbox_validado: "Sandbox validado",
  aguardando_autorizacao: "Aguardando autorização",
  producao_autorizada: "Produção autorizada",
  erro: "Erro",
};

const PROVIDER_STATUS_CLASS: Record<ProviderStatus, string> = {
  desativado: "bg-muted text-muted-foreground",
  configurado: "bg-secondary/15 text-secondary",
  em_validacao: "bg-demo/15 text-demo",
  sandbox_validado: "bg-success/15 text-success",
  aguardando_autorizacao: "bg-accent/15 text-accent",
  producao_autorizada: "bg-primary/15 text-primary",
  erro: "bg-destructive/15 text-destructive",
};

const ENV_LABEL: Record<IntegrationEnvironment, string> = {
  development: "Desenvolvimento",
  sandbox: "Sandbox",
  production: "Produção",
};

const GAME_TYPE_LABEL: Record<GameIntegrationType, string> = {
  fictitious: "Fictício",
  sandbox: "Sandbox",
  production: "Produção real",
};

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}>
      {children}
    </span>
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="cp-card p-5">
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">{children}</p>;
}

function Admin() {
  const { session, isAdmin, loading: sessionLoading } = useSession();
  const [tab, setTab] = useState<TabId>("overview");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [games, setGames] = useState<GameRow[]>([]);
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [controls, setControls] = useState<Controls | null>(null);

  useEffect(() => {
    if (sessionLoading || !isAdmin) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setLoadError(null);
    Promise.all([
      supabase.from("profiles").select("id, full_name, demo_balance, created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("casino_games").select("*").order("name"),
      supabase.from("game_providers").select("*").order("name"),
      supabase.from("game_categories").select("*").order("sort_order"),
      supabase.from("integration_sessions").select("*").order("started_at", { ascending: false }).limit(20),
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(30),
      supabase.from("operation_controls").select("*").eq("id", true).maybeSingle(),
    ]).then(([p, r, g, prov, cat, sess, log, ctrl]) => {
      if (!active) return;
      const firstError = [p, r, g, prov, cat, sess, log, ctrl].find((res) => res.error)?.error;
      if (firstError) setLoadError(firstError.message);
      setProfiles(p.data ?? []);
      setRoles(r.data ?? []);
      setGames(g.data ?? []);
      setProviders(prov.data ?? []);
      setCategories(cat.data ?? []);
      setSessions(sess.data ?? []);
      setLogs(log.data ?? []);
      setControls(ctrl.data ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [isAdmin, sessionLoading]);

  const roleByUser = useMemo(() => {
    const map = new Map<string, string>();
    roles.forEach((r) => map.set(r.user_id, r.role));
    return map;
  }, [roles]);

  const providerById = useMemo(() => {
    const map = new Map<string, ProviderRow>();
    providers.forEach((p) => map.set(p.id, p));
    return map;
  }, [providers]);

  const categoryById = useMemo(() => {
    const map = new Map<string, CategoryRow>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  if (sessionLoading || loading) {
    return (
      <main id="main" className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-20 text-sm text-muted-foreground">
        <Loader2 className="animate-spin" size={16} /> Carregando painel administrativo...
      </main>
    );
  }

  if (!session || !isAdmin) {
    return (
      <main id="main" className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShieldAlert className="mx-auto text-destructive" size={32} />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Acesso restrito</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta area e exclusiva para administradores do Meteficha.bet. O papel e verificado no
          backend (has_role via Supabase RLS); nao e possivel contornar isso pelo frontend.
        </p>
        <Link to="/" className="mt-6 inline-block rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground">
          Voltar ao inicio
        </Link>
      </main>
    );
  }

  const productionProviders = providers.filter((p) => p.status === "producao_autorizada").length;
  const sandboxValidated = providers.filter((p) => p.status === "sandbox_validado").length;
  const pendingSessions = sessions.filter((s) => s.status === "iniciada").length;
  const failedSessions = sessions.filter((s) => s.status === "falha").length;

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-demo/15 px-3 py-1 text-xs font-semibold text-demo">
            <ShieldCheck size={14} /> Ambiente de desenvolvimento / homologação
          </span>
          <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
            Painel administrativo <span className="cp-gradient-text">Meteficha.bet</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Estado das integrações, catálogo de jogos, usuários e trilha de auditoria. Nenhuma ação aqui movimenta
            dinheiro real: operações financeiras continuam bloqueadas no backend ate aprovação formal.
          </p>
        </div>
      </div>

      {loadError && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertTriangle size={16} /> Falha ao carregar alguns dados: {loadError}
        </div>
      )}

      <nav className="mt-8 flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              style={active ? { background: "var(--gradient-primary)" } : undefined}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-6">
        {tab === "overview" && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="cp-card p-4">
                <span className="text-xs text-muted-foreground">Usuários</span>
                <p className="mt-1 text-2xl font-bold text-foreground">{profiles.length}</p>
              </div>
              <div className="cp-card p-4">
                <span className="text-xs text-muted-foreground">Jogos no catálogo</span>
                <p className="mt-1 text-2xl font-bold text-foreground">{games.length}</p>
              </div>
              <div className="cp-card p-4">
                <span className="text-xs text-muted-foreground">Provedores em produção</span>
                <p className="mt-1 text-2xl font-bold text-primary">{productionProviders}</p>
              </div>
              <div className="cp-card p-4">
                <span className="text-xs text-muted-foreground">Sandbox validados</span>
                <p className="mt-1 text-2xl font-bold text-success">{sandboxValidated}</p>
              </div>
            </div>

            <SectionCard title="Saúde das integrações" description="Status consolidado dos provedores cadastrados.">
              {providers.length === 0 ? (
                <Empty>Nenhum provedor cadastrado ainda. Cadastre o primeiro provedor de sandbox na aba Provedores.</Empty>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {providers.map((p) => (
                    <Badge key={p.id} className={PROVIDER_STATUS_CLASS[p.status]}>
                      {p.name}: {PROVIDER_STATUS_LABEL[p.status]}
                    </Badge>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Sessões de teste recentes" description="Tentativas de lançamento/autenticação com provedores.">
              <div className="flex gap-4 text-sm">
                <span className="text-muted-foreground">Pendentes: <strong className="text-foreground">{pendingSessions}</strong></span>
                <span className="text-muted-foreground">Falhas: <strong className="text-destructive">{failedSessions}</strong></span>
                <span className="text-muted-foreground">Total: <strong className="text-foreground">{sessions.length}</strong></span>
              </div>
            </SectionCard>
          </div>
        )}

        {tab === "users" && (
          <SectionCard title="Usuários e saldo virtual" description="Cadastros ativos e papel de acesso (admin/user). Papeis vivem em user_roles, nunca em profiles.">
            {profiles.length === 0 ? (
              <Empty>Nenhum usuário cadastrado ainda.</Empty>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2">Nome</th>
                      <th className="px-4 py-2">Papel</th>
                      <th className="px-4 py-2">Saldo demo</th>
                      <th className="px-4 py-2">Criado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((p) => (
                      <tr key={p.id} className="border-t border-border">
                        <td className="px-4 py-2 text-foreground">{p.full_name ?? "Sem nome"}</td>
                        <td className="px-4 py-2">
                          <Badge className={roleByUser.get(p.id) === "admin" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}>
                            {roleByUser.get(p.id) ?? "user"}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-foreground">{p.demo_balance.toFixed(2)} fichas</td>
                        <td className="px-4 py-2 text-muted-foreground">{new Date(p.created_at).toLocaleDateString("pt-BR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              A promoção para administrador é feita por procedimento privilegiado no banco (SQL aprovado), nunca por
              esta tela.
            </p>
          </SectionCard>
        )}

        {tab === "catalog" && (
          <SectionCard
            title="Catálogo de jogos"
            description="Cada jogo indica provedor, ambiente e tipo de integração — distinguindo fictício, sandbox e produção real."
          >
            {games.length === 0 ? (
              <Empty>Nenhum jogo cadastrado no catálogo ainda.</Empty>
            ) : (
              <div className="grid gap-3">
                {games.map((g) => (
                  <div key={g.id} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="font-semibold text-foreground">{g.name}</span>
                      <p className="text-xs text-muted-foreground">
                        {g.category} · Provedor: {g.provider_id ? providerById.get(g.provider_id)?.name ?? "desconhecido" : "—"} ·
                        {" "}Categoria: {g.category_id ? categoryById.get(g.category_id)?.name ?? "—" : "—"}
                      </p>
                      {g.last_validated_at && (
                        <p className="text-[11px] text-muted-foreground">
                          Última validação: {new Date(g.last_validated_at).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-muted text-muted-foreground">{ENV_LABEL[g.environment]}</Badge>
                      <Badge
                        className={
                          g.integration_type === "production"
                            ? "bg-primary/15 text-primary"
                            : g.integration_type === "sandbox"
                              ? "bg-secondary/15 text-secondary"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {GAME_TYPE_LABEL[g.integration_type]}
                      </Badge>
                      <Badge className={g.availability_status === "disponivel" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}>
                        {g.availability_status === "disponivel" ? "Disponível" : g.availability_status === "manutencao" ? "Manutenção" : "Indisponível"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Edição completa (criar/editar jogo, trocar provedor, atualizar imagem) sera implementada na Fase 3
              (catálogo e painel de gestão), ligada as tabelas já criadas.
            </p>
          </SectionCard>
        )}

        {tab === "providers" && (
          <SectionCard
            title="Provedores e estado das integrações"
            description="Nenhum provedor é considerado ativo apenas por ter credenciais configuradas: o status exige validação explícita."
          >
            {providers.length === 0 ? (
              <Empty>
                Nenhum provedor cadastrado ainda. Na Fase 4, o primeiro adaptador de sandbox será registrado aqui após a
                documentação e credenciais de teste do fornecedor.
              </Empty>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2">Provedor</th>
                      <th className="px-4 py-2">Ambiente</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Capacidades</th>
                      <th className="px-4 py-2">Última validação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((p) => (
                      <tr key={p.id} className="border-t border-border align-top">
                        <td className="px-4 py-2 text-foreground">{p.name}</td>
                        <td className="px-4 py-2 text-muted-foreground">{ENV_LABEL[p.environment]}</td>
                        <td className="px-4 py-2">
                          <Badge className={PROVIDER_STATUS_CLASS[p.status]}>{PROVIDER_STATUS_LABEL[p.status]}</Badge>
                        </td>
                        <td className="px-4 py-2 text-xs text-muted-foreground">
                          {[
                            p.supports_wallet && "carteira",
                            p.supports_sso && "login único",
                            p.supports_callbacks && "callbacks",
                            p.supports_history && "histórico",
                          ]
                            .filter(Boolean)
                            .join(", ") || "nenhuma declarada"}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {p.last_validated_at ? new Date(p.last_validated_at).toLocaleDateString("pt-BR") : "ainda não validado"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        )}

        {tab === "categories" && (
          <SectionCard title="Categorias do catálogo" description="Usadas para organizar o lobby, filtros e busca.">
            {categories.length === 0 ? (
              <Empty>Nenhuma categoria cadastrada ainda.</Empty>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Badge key={c.id} className="bg-secondary/15 text-secondary">
                    {c.name}
                  </Badge>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {tab === "sessions" && (
          <SectionCard title="Sessões de teste de integração" description="Tentativas de autenticação/lançamento de jogo junto a provedores, com erro e ambiente registrados.">
            {sessions.length === 0 ? (
              <Empty>Nenhuma sessão de teste registrada ainda.</Empty>
            ) : (
              <div className="flex flex-col gap-2">
                {sessions.map((s) => (
                  <div key={s.id} className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-foreground">{providerById.get(s.provider_id ?? "")?.name ?? "Provedor removido"}</span>
                      <p className="text-xs text-muted-foreground">
                        {ENV_LABEL[s.environment]} · {new Date(s.started_at).toLocaleString("pt-BR")}
                      </p>
                      {s.error_message && <p className="text-[11px] text-destructive">{s.error_message}</p>}
                    </div>
                    <Badge
                      className={
                        s.status === "sucesso"
                          ? "bg-success/15 text-success"
                          : s.status === "falha"
                            ? "bg-destructive/15 text-destructive"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {s.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {tab === "logs" && (
          <SectionCard title="Logs de auditoria" description="Ator, ação, entidade, resultado e correlação. Erros são exibidos de forma sanitizada; nada de senhas, tokens ou segredos.">
            {logs.length === 0 ? (
              <Empty>Nenhum log de auditoria registrado ainda. Logs são gravados pelo backend (service_role), nunca pelo frontend.</Empty>
            ) : (
              <div className="flex flex-col gap-2">
                {logs.map((l) => (
                  <div key={l.id} className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-foreground">{l.action}</span>
                      <p className="text-xs text-muted-foreground">
                        {l.entity}
                        {l.entity_id ? ` #${l.entity_id}` : ""} · {new Date(l.created_at).toLocaleString("pt-BR")}
                      </p>
                      {l.error_message && <p className="text-[11px] text-destructive">{l.error_message}</p>}
                    </div>
                    <Badge className={l.result === "sucesso" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}>
                      {l.result}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {tab === "controls" && (
          <SectionCard
            title="Estado global de operação"
            description="Bloqueios financeiros centralizados no backend. Nenhum deles pode ser removido pelo frontend: a leitura é liberada para avisos, mas a escrita exige papel admin validado via RLS, e a ativação de produção depende de aprovação formal fora desta tela."
          >
            {controls ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { key: "real_bets_enabled", label: "Apostas reais" },
                  { key: "deposits_enabled", label: "Depósitos" },
                  { key: "withdrawals_enabled", label: "Saques" },
                  { key: "payments_enabled", label: "Pagamentos" },
                  { key: "real_wallet_enabled", label: "Carteira real" },
                  { key: "production_integrations_enabled", label: "Integrações de produção com valor" },
                ].map((item) => {
                  const enabled = Boolean(controls[item.key as keyof Controls]);
                  return (
                    <div key={item.key} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm">
                      <span className="text-foreground">{item.label}</span>
                      <Badge className={enabled ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}>
                        {enabled ? "Ativado" : "Bloqueado"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty>Controles de operação ainda não inicializados no banco.</Empty>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Qualquer ativação futura exige validação jurídica da jurisdição, confirmação de autorizações, contrato
              com o provedor, testes de segurança, testes de conciliação/idempotência, controles de prevenção a
              fraude e aprovação explícita de implantação. Nada disso é alterado por esta interface.
            </p>
          </SectionCard>
        )}
      </div>
    </main>
  );
}
