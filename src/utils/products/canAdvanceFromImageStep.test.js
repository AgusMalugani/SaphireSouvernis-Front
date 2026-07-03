import { describe, expect, it } from 'vitest';
import {
  canAdvanceFromImageStep,
  CREATE_IMAGE_REQUIRED_MESSAGE,
  EDIT_IMAGE_REQUIRED_MESSAGE,
  getImageStepBlockMessage,
  hasExistingProductImage,
  hasExistingProductImages,
} from './canAdvanceFromImageStep';
import { PRODUCT_IMAGE_PLACEHOLDER_URL } from './productImageUrls';

describe('hasExistingProductImage', () => {
  it('returns true for non-empty trimmed url', () => {
    expect(hasExistingProductImage('  https://example.com/a.jpg  ')).toBe(true);
  });

  it('returns false for empty or whitespace', () => {
    expect(hasExistingProductImage('')).toBe(false);
    expect(hasExistingProductImage('   ')).toBe(false);
    expect(hasExistingProductImage(null)).toBe(false);
  });
});

describe('hasExistingProductImages', () => {
  it('returns true when at least one valid url exists', () => {
    expect(
      hasExistingProductImages(['https://example.com/a.jpg', '']),
    ).toBe(true);
  });

  it('returns false for empty array', () => {
    expect(hasExistingProductImages([])).toBe(false);
  });
});

describe('canAdvanceFromImageStep', () => {
  it('create mode requires at least one new file', () => {
    expect(
      canAdvanceFromImageStep({
        mode: 'create',
        newFilesCount: 0,
        existingImageUrls: ['https://example.com/a.jpg'],
      }),
    ).toBe(false);
    expect(canAdvanceFromImageStep({ mode: 'create', newFilesCount: 1 })).toBe(
      true,
    );
  });

  it('edit mode allows advance with persisted urls only', () => {
    expect(
      canAdvanceFromImageStep({
        mode: 'edit',
        newFilesCount: 0,
        existingImageUrls: [
          'https://res.cloudinary.com/demo/upload/a.jpg',
          'https://res.cloudinary.com/demo/upload/b.jpg',
        ],
      }),
    ).toBe(true);
  });

  it('edit mode without urls requires new files', () => {
    expect(
      canAdvanceFromImageStep({
        mode: 'edit',
        newFilesCount: 0,
        existingImageUrls: [],
      }),
    ).toBe(false);
    expect(
      canAdvanceFromImageStep({
        mode: 'edit',
        newFilesCount: 3,
        existingImageUrls: [],
      }),
    ).toBe(true);
  });

  it('edit with placeholder-only urls blocks advance', () => {
    expect(
      canAdvanceFromImageStep({
        mode: 'edit',
        newFilesCount: 0,
        existingImageUrls: [PRODUCT_IMAGE_PLACEHOLDER_URL],
      }),
    ).toBe(false);
  });
});

describe('getImageStepBlockMessage', () => {
  it('returns create message by default', () => {
    expect(getImageStepBlockMessage({ mode: 'create' })).toBe(
      CREATE_IMAGE_REQUIRED_MESSAGE,
    );
  });

  it('returns edit-specific message when no persisted urls', () => {
    expect(
      getImageStepBlockMessage({ mode: 'edit', existingImageUrls: [] }),
    ).toBe(EDIT_IMAGE_REQUIRED_MESSAGE);
  });
});
