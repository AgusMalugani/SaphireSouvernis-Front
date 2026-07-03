import { describe, expect, it } from 'vitest';
import { buildProductMultipartFormData } from './buildProductMultipartFormData';

describe('buildProductMultipartFormData', () => {
  it('appends metadata and files without img_url or legacy file key', () => {
    const fileOne = new File(['a'], 'a.jpg', { type: 'image/jpeg' });
    const fileTwo = new File(['b'], 'b.jpg', { type: 'image/jpeg' });
    const formData = buildProductMultipartFormData({
      product: {
        name: 'Llavero',
        price: 2500,
        details: 'Detalle',
        categories: ['SOUVENIRS'],
        stock: true,
        img_url: 'should-not-send',
        img_urls: ['should-not-send'],
        id: 'uuid',
      },
      files: [fileOne, fileTwo],
    });

    expect(formData.get('name')).toBe('Llavero');
    expect(formData.get('price')).toBe('2500');
    expect(formData.get('details')).toBe('Detalle');
    expect(formData.get('categories')).toBe('SOUVENIRS');
    expect(formData.get('stock')).toBe('true');
    expect(formData.get('img_url')).toBe(null);
    expect(formData.get('file')).toBe(null);
    expect(formData.getAll('files')).toHaveLength(2);
  });
});
