// Window type extensions
interface Window {
  gtag?: (
    command: 'event' | 'config' | 'js',
    targetId: string,
    config?: {
      event_category?: string;
      value?: number;
      event_label?: string;
      non_interaction?: boolean;
      [key: string]: any;
    }
  ) => void;
}
