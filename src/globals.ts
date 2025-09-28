export {};

declare global {
  function $now(): number;
}

(globalThis as any).$now = () => Date.now();