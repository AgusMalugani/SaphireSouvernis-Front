import { describe, expect, it } from 'vitest';
import {
  canAdvanceFromImageStep,
  CREATE_IMAGE_REQUIRED_MESSAGE,
  EDIT_IMAGE_REQUIRED_MESSAGE,
  getImageStepBlockMessage,
  hasExistingProductImage,
} from './canAdvanceFromImageStep';

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

describe('canAdvanceFromImageStep', () => {
  it('create mode requires new file', () => {
    expect(
      canAdvanceFromImageStep({
        mode: 'create',
        hasNewFile: false,
        existingImageUrl: 'https://example.com/a.jpg',
      }),
    ).toBe(false);
    expect(
      canAdvanceFromImageStep({ mode: 'create', hasNewFile: true }),
    ).toBe(true);
  });

  it('edit mode allows advance with existing img_url only', () => {
    expect(
      canAdvanceFromImageStep({
        mode: 'edit',
        hasNewFile: false,
        existingImageUrl: 'https://res.cloudinary.com/demo/upload/a.jpg',
      }),
    ).toBe(true);
  });

  it('edit mode without img_url requires new file', () => {
    expect(
      canAdvanceFromImageStep({
        mode: 'edit',
        hasNewFile: false,
        existingImageUrl: '',
      }),
    ).toBe(false);
    expect(
      canAdvanceFromImageStep({
        mode: 'edit',
        hasNewFile: true,
        existingImageUrl: '',
      }),
    ).toBe(true);
  });
});

describe('getImageStepBlockMessage', () => {
  it('returns create message by default', () => {
    expect(getImageStepBlockMessage({ mode: 'create' })).toBe(
      CREATE_IMAGE_REQUIRED_MESSAGE,
    );
  });

  it('returns edit-specific message when no img_url', () => {
    expect(getImageStepBlockMessage({ mode: 'edit', existingImageUrl: '' })).toBe(
      EDIT_IMAGE_REQUIRED_MESSAGE,
    );
  });
});
