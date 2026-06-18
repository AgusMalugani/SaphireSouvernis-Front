import { describe, expect, it } from 'vitest';
import { parseClientEnv } from './parseClientEnv';

const validRawEnv = {
  VITE_API_URL: 'http://localhost:3000/api/v1',
  VITE_SHOP_URL: 'https://saphire-souvenirs-shop.vercel.app',
  VITE_LOGO_URL:
    'https://res.cloudinary.com/dxt4qdckz/image/upload/v1744589272/logo-saphire_it2k6r.png',
  VITE_WHATSAPP_NUM: '3417120039',
};

describe('parseClientEnv', () => {
  it('returns camelCase envs on happy path', () => {
    expect(parseClientEnv(validRawEnv)).toEqual({
      apiUrl: validRawEnv.VITE_API_URL,
      shopUrl: validRawEnv.VITE_SHOP_URL,
      logoUrl: validRawEnv.VITE_LOGO_URL,
      whatsappNum: validRawEnv.VITE_WHATSAPP_NUM,
    });
  });

  it('throws when VITE_API_URL is missing', () => {
    const { VITE_API_URL: _removed, ...envWithoutApiUrl } = validRawEnv;
    expect(() => parseClientEnv(envWithoutApiUrl)).toThrow(/VITE_API_URL/i);
  });

  it('throws when VITE_LOGO_URL is empty', () => {
    expect(() =>
      parseClientEnv({ ...validRawEnv, VITE_LOGO_URL: '' }),
    ).toThrow(/VITE_LOGO_URL/i);
  });

  it('throws when VITE_API_URL lacks /api/v1 suffix', () => {
    expect(() =>
      parseClientEnv({ ...validRawEnv, VITE_API_URL: 'http://localhost:3000' }),
    ).toThrow(/api\/v1/i);
  });
});
