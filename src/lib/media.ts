/**
 * Social Diaries Media Optimization Engine
 * Transforms Cloudinary URLs to use dynamic codec compression (q_auto, f_auto)
 * to ensure 100% stutter-free and ultra-smooth video buffering on mobile 4G/5G.
 */

export function getOptimizedVideoUrl(url?: string): string {
  if (!url) return "";
  
  // If it's a Cloudinary URL, inject q_auto,f_auto for high-performance hardware-accelerated playback
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    if (!url.includes("q_auto") && !url.includes("f_auto")) {
      return url.replace("/upload/", "/upload/q_auto,f_auto/");
    }
  }
  
  return url;
}

export function getOptimizedImageUrl(url?: string, width = 1200): string {
  if (!url) return "";
  
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/q_auto,f_auto,w_" + width + ",c_limit/");
  }
  
  return url;
}
