import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Gerado para o Meteficha.bet (Lovable Cloud / Supabase).
// IMPORTANTE: este projeto opera exclusivamente em modo demonstrativo.
// Nenhuma rota, funcao ou tabela deste backend processa dinheiro real,
// deposito, saque, pagamento ou transferencia financeira.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
