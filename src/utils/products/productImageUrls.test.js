import { describe, expect, it } from 'vitest';
import {
  getPrimaryProductImageUrl,
  getProductImageUrls,
  hasValidProductImages,
  isPlaceholderImageUrl,
  PRODUCT_IMAGE_PLACEHOLDER_URL,
} from './productImageUrls';

describe('productImageUrls', () => {
  it('uses img_urls when present', () => {
    const product = {
      img_urls: ['https://a.com/1.jpg', 'https://a.com/2.jpg'],
      img_url: 'https://a.com/1.jpg',
    };
    expect(getProductImageUrls(product)).toEqual([
      'https://a.com/1.jpg',
      'https://a.com/2.jpg',
    ]);
    expect(getPrimaryProductImageUrl(product)).toBe('https://a.com/1.jpg');
  });

  it('falls back to img_url when img_urls empty', () => {
    const product = { img_urls: [], img_url: 'https://legacy.com/x.jpg' };
    expect(getProductImageUrls(product)).toEqual(['https://legacy.com/x.jpg']);
  });

  it('treats placeholder as no image', () => {
    const product = {
      img_urls: [],
      img_url: PRODUCT_IMAGE_PLACEHOLDER_URL,
    };
    expect(getProductImageUrls(product)).toEqual([]);
    expect(hasValidProductImages(product)).toBe(false);
    expect(isPlaceholderImageUrl(PRODUCT_IMAGE_PLACEHOLDER_URL)).toBe(true);
  });
});
