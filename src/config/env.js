/**
 * Único módulo en src/ permitido a leer import.meta.env (constitución v1.0.0).
 * Exporta envs validado con Zod vía parseClientEnv.
 */
import { parseClientEnv } from './parseClientEnv';

export const envs = parseClientEnv({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_SHOP_URL: import.meta.env.VITE_SHOP_URL,
  VITE_LOGO_URL: import.meta.env.VITE_LOGO_URL,
  VITE_WHATSAPP_NUM: import.meta.env.VITE_WHATSAPP_NUM,
});
