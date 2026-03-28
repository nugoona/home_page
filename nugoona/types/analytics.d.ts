interface Window {
  gtag: (...args: unknown[]) => void;
  dataLayer: Record<string, unknown>[];
  fbq: (...args: unknown[]) => void;
  _fbq: (...args: unknown[]) => void;
}
