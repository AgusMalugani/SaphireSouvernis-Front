import { describe, expect, it } from 'vitest';
import {
  isCloudinaryEligibleUrl,
  toCloudinaryDisplayUrl,
} from './cloudinaryDisplayUrl';

const cloudinarySampleUrl =
  'https://res.cloudinary.com/dxt4qdckz/image/upload/v1742676933/saphire/wgg1n9ot1fwtdpbxkzag.jpg';

describe('isCloudinaryEligibleUrl', () => {
  it('returns true for cloudinary host with /upload/ path', () => {
    expect(isCloudinaryEligibleUrl(cloudinarySampleUrl)).toBe(true);
  });

  it('returns false for non-cloudinary host', () => {
    expect(isCloudinaryEligibleUrl('http://www.exampleImg.com/estampitas')).toBe(
      false,
    );
  });

  it('returns false for cloudinary-like host without /upload/', () => {
    expect(
      isCloudinaryEligibleUrl('https://res.cloudinary.com/demo/image/fetch/sample.jpg'),
    ).toBe(false);
  });

  it('returns false for empty or invalid values', () => {
    expect(isCloudinaryEligibleUrl('')).toBe(false);
    expect(isCloudinaryEligibleUrl(null)).toBe(false);
    expect(isCloudinaryEligibleUrl('not-a-url')).toBe(false);
  });
});

describe('toCloudinaryDisplayUrl', () => {
  it('inserts w_400,h_400,c_fill after /upload/', () => {
    expect(toCloudinaryDisplayUrl(cloudinarySampleUrl)).toBe(
      'https://res.cloudinary.com/dxt4qdckz/image/upload/w_400,h_400,c_fill/v1742676933/saphire/wgg1n9ot1fwtdpbxkzag.jpg',
    );
  });

  it('returns original URL when not eligible', () => {
    const externalUrl = 'http://www.exampleImg.com/estampitas';
    expect(toCloudinaryDisplayUrl(externalUrl)).toBe(externalUrl);
  });

  it('does not double-insert transform when already present', () => {
    const alreadyTransformed =
      'https://res.cloudinary.com/dxt4qdckz/image/upload/w_400,h_400,c_fill/v1742676933/saphire/wgg1n9ot1fwtdpbxkzag.jpg';
    expect(toCloudinaryDisplayUrl(alreadyTransformed)).toBe(alreadyTransformed);
  });
});
