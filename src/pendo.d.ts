interface Pendo {
  trackAgent: (eventType: string, metadata: object) => void;
}

declare const pendo: Pendo;
