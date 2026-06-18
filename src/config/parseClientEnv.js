import { z } from 'zod';

const API_V1_SUFFIX = '/api/v1';

const clientEnvSchema = z
  .object({
    VITE_API_URL: z.string().min(1, 'VITE_API_URL is required'),
    VITE_SHOP_URL: z.string().url('VITE_SHOP_URL must be a valid URL'),
    VITE_LOGO_URL: z.string().url('VITE_LOGO_URL must be a valid URL'),
    VITE_WHATSAPP_NUM: z
      .string()
      .min(1, 'VITE_WHATSAPP_NUM is required')
      .regex(/^\d{7,15}$/, 'VITE_WHATSAPP_NUM must be 7-15 digits'),
  })
  .refine((data) => data.VITE_API_URL.endsWith(API_V1_SUFFIX), {
    message: `VITE_API_URL must end with ${API_V1_SUFFIX}`,
    path: ['VITE_API_URL'],
  })
  .transform((data) => ({
    apiUrl: data.VITE_API_URL,
    shopUrl: data.VITE_SHOP_URL,
    logoUrl: data.VITE_LOGO_URL,
    whatsappNum: data.VITE_WHATSAPP_NUM,
  }));

/**
 * @param {Record<string, string | undefined>} rawViteEnv
 * @returns {{ apiUrl: string, shopUrl: string, logoUrl: string, whatsappNum: string }}
 */
export function parseClientEnv(rawViteEnv) {
  const parseResult = clientEnvSchema.safeParse(rawViteEnv);

  if (!parseResult.success) {
    const issueMessages = parseResult.error.issues.map((issue) => {
      const fieldPath = issue.path.join('.') || 'env';
      return `${fieldPath}: ${issue.message}`;
    });

    throw new Error(
      `Invalid client environment configuration:\n${issueMessages.join('\n')}`,
    );
  }

  return parseResult.data;
}
