import { useState } from 'react';
import { toCloudinaryDisplayUrl } from '../../utils/images/cloudinaryDisplayUrl';

function ProductImagePreview({ originalUrl, alt = 'Vista previa', className = '' }) {
  const displayUrl = toCloudinaryDisplayUrl(originalUrl);
  const [imageSource, setImageSource] = useState(displayUrl || originalUrl);

  const handleImageError = () => {
    if (originalUrl && imageSource !== originalUrl) {
      setImageSource(originalUrl);
    }
  };

  if (!originalUrl) {
    return null;
  }

  return (
    <img
      src={imageSource}
      alt={alt}
      className={className}
      onError={handleImageError}
    />
  );
}

export default ProductImagePreview;
