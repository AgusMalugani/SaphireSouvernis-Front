import { buildProductMetadataPayload } from './buildProductMetadataPayload';

/**
 * @param {{ product: Record<string, unknown>, files: File[] }} params
 * @returns {FormData}
 */
export function buildProductMultipartFormData({ product, files }) {
  const metadata = buildProductMetadataPayload(product);
  const formData = new FormData();

  formData.append('name', metadata.name);
  formData.append('price', String(metadata.price));
  formData.append('details', metadata.details);

  metadata.categories.forEach((categoryName) => {
    formData.append('categories', categoryName);
  });

  if (metadata.stock !== undefined) {
    formData.append('stock', String(metadata.stock));
  }

  files.forEach((file) => {
    formData.append('files', file);
  });

  return formData;
}
