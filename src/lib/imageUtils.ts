export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "jpg" | "png";
}

export function getOptimizedImageUrl(url: string, options: ImageOptions = {}): string {
  if (!url) return "";

  const { width, height, quality = "auto", format = "auto" } = options;

  if (!url.includes("cloudinary")) {
    return url;
  }

  const transforms: string[] = [];

  if (width) {
    transforms.push(`w_${width}`);
  }

  if (height) {
    transforms.push(`h_${height}`);
  }

  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);

  const transformString = transforms.join(",");

  return url.replace("/upload/", `/upload/${transformString}/`);
}

export function getImageSizes(width: number): string {
  return `(max-width: 640px) ${width}px, (max-width: 1024px) ${Math.floor(width * 0.75)}px, ${width}px`;
}

export function getBlurDataUrl(width: number, height: number): string {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e2e8f0"/>
    </svg>`
  ).toString("base64")}`;
}
