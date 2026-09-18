import { useState, type ImgHTMLAttributes } from "react";
import { FiImage } from "react-icons/fi";
import { useColors } from "../../../utils/types";

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Applied to the fallback placeholder when the image is missing/fails — falls back to `className` if omitted, so a fixed-size slot keeps its size either way. */
  fallbackClassName?: string;
  iconSize?: number;
}

/**
 * Drop-in <img> replacement that shows a visible "image unavailable" placeholder
 * instead of either the browser's broken-image glyph or a blank invisible box —
 * a dead URL should still read as "a photo belongs here", not as empty space.
 */
const SafeImage = ({ src, alt, className, fallbackClassName, iconSize = 20, style, ...rest }: SafeImageProps) => {
  const [failed, setFailed] = useState(false);
  const colors = useColors();

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center ${fallbackClassName ?? className ?? ""}`}
        style={{ background: `${colors.neutral800}80`, ...style }}
        role="img"
        aria-label={alt}
      >
        <FiImage size={iconSize} style={{ color: `${colors.neutral500}90` }} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
};

export default SafeImage;
