export {};

declare global {
    interface Window {
        showGrid: boolean;
        showCardFront: boolean;
        flipSpeed: number;
        unflipDelay: number;
        fadeOutSpeed: number;
    }
}
