// Snack can occasionally fail to import binary assets from GitHub.
// Using a data URI keeps HomeScreen stable even when `assets/inMedia/bg.png` is missing.
// Replace `BG_IMAGE_URI` with your own base64 PNG (data URI) if desired.

export const BG_IMAGE_URI =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+9L6cAAAAASUVORK5CYII=';
