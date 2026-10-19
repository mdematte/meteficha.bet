# Meteficha.bet — Plataforma Demonstrativa de Cassino e Sportsbook

> **STATUS ATUAL:** projeto em fase inicial. Este repositorio ainda nao contem a aplicacao (frontend/backend) implementada — apenas esta documentacao de escopo e regras de produto. As proximas etapas de desenvolvimento (telas, autenticacao, banco de dados, simulador) serao construidas em cima das regras abaixo, que sao INEGOCIAVEIS e nao podem ser contornadas em nenhuma versao futura sem um projeto separado de habilitacao.

## 1. Natureza do projeto

O Meteficha.bet e uma plataforma **100% demonstrativa** de cassino online e sportsbook, destinada a:

- Testes de interface (UX/UI);
- Validacao de regras de negocio;
- Avaliacao tecnica de arquitetura;
- Prototipagem de fluxos de usuario e administrador.

Nao e, em nenhuma hipotese, uma plataforma de apostas real nesta fase.

## 2. REGRA INEGOCIAVEL — Modo Demonstrativo Obrigatorio

O projeto DEVE operar exclusivamente em modo demonstrativo. Isso vale tanto para a interface quanto para o backend, as politicas do banco de dados e as rotas de execucao.

### 2.1 Proibido implementar, habilitar ou simular como reais:

- Apostas com dinheiro real;
- Depositos ou saques;
- Processamento de pagamentos (gateways como Stripe, Mercado Pago, PIX real, etc.);
- Transferencias financeiras entre usuarios ou para contas externas;
- Conversao de saldo virtual em dinheiro;
- Carteira financeira real (wallet com valor monetario sacavel);
- Integracao financeira ativa com qualquer provedor de pagamento;
- Operacoes reais de cassino ou sportsbook (jogos com RNG certificado, odds reais de casas de apostas, liquidacao financeira real).

### 2.2 Onde a restricao se aplica (nao basta esconder na UI)

| Camada | Regra |
|---|---|
| **Frontend** | Nenhum botao, formulario ou fluxo pode levar a uma operacao financeira real. Saldo exibido e sempre rotulado como "saldo demo" / "ficha virtual". |
| **Backend (server functions / APIs)** | Nenhuma rota de execucao pode chamar gateway de pagamento real, iniciar saque, processar deposito ou liquidar aposta com valor sacavel. Qualquer chamada desse tipo deve ser removida ou substituida por uma simulacao controlada (ledger interno, sem saida de dinheiro). |
| **Banco de dados (RLS/policies)** | Nenhuma policy deve permitir update de saldo que resulte em transferencia externa. Transacoes financeiras reais (ex.: tabela `withdrawals`/`deposits` com status "processado via gateway real") nao existem nesta fase. |
| **Infra/Integracoes** | Nenhuma chave de API de gateway de pagamento real (Stripe, Mercado Pago, PagSeguro, etc.) e configurada ou utilizada em producao. |

### 2.3 O que E permitido (modo demonstrativo)

- Saldo virtual ("fichas demo") creditado automaticamente no cadastro, sem deposito real;
- Apostas simuladas com RNG controlado/deterministico, sem saida de dinheiro;
- Historico completo de transacoes demo (ledger interno, auditavel);
- Painel administrativo para gerenciar usuarios, saldos demo, relatorios e configuracoes do simulador;
- Autenticacao real (login/cadastro) via Supabase, pois isso nao envolve dinheiro;
- Estrutura de dados *preparada* (campos, tabelas, nomenclatura) para uma futura integracao real — mas **sem a integracao em si ativa ou funcional**.

## 3. Evolucao futura (fora do escopo atual)

Qualquer operacao futura com dinheiro real (apostas reais, depositos, saques, gateways de pagamento, jogos de terceiros licenciados, sportsbook com liquidacao financeira) exigira:

1. Projeto separado de habilitacao financeira;
2. Validacao juridica e regulatoria (licenca de jogo, compliance);
3. Integracoes autorizadas e contratadas com provedores financeiros;
4. Controles de seguranca adicionais (KYC/AML, antifraude, auditoria financeira);
5. Aprovacao explicita e documentada antes de qualquer deploy em producao.

Enquanto essa aprovacao nao existir, **todo codigo deste repositorio deve permanecer em modo demonstrativo**, inclusive apos integrar APIs de jogos/gateways para fins de prototipagem (essas integracoes, quando adicionadas, devem ser mockadas/sandbox, nunca em modo de producao real).

## 4. Proximos passos de implementacao

As proximas etapas (a serem feitas em pedidos subsequentes) incluem: autenticacao (Supabase Auth), schema de banco (profiles, user_roles, saldo demo, apostas simuladas, historico de transacoes), paineis de usuario e administrador, e simulador de jogos/sportsbook — tudo seguindo rigorosamente as regras da Secao 2.
