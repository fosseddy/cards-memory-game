export {};

declare global {
  interface Window {
    showGrid: boolean;
    flipSpeed: number;
    unflipDelay: number;
    fadeSpeed: number;
  }
}
