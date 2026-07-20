// Central toast wrapper around sonner with in-memory dedupe to prevent
// duplicate notifications when the same message is fired multiple times
// in a short window (e.g. by overlapping effects / handlers).
import { toast as sonnerToast, type ExternalToast } from "sonner";

const DEDUPE_MS = 1500;
const recent = new Map<string, number>();

function keyFor(kind: string, message: unknown, opts?: ExternalToast) {
  const desc =
    typeof opts?.description === "string" || typeof opts?.description === "number"
      ? String(opts.description)
      : "";
  const msg =
    typeof message === "string" || typeof message === "number" ? String(message) : "";
  return `${kind}\u0001${msg}\u0001${desc}`;
}

function shouldSkip(key: string) {
  const now = Date.now();
  const last = recent.get(key);
  recent.set(key, now);
  if (recent.size > 200) {
    for (const [k, t] of recent) if (now - t > 5000) recent.delete(k);
  }
  return !!(last && now - last < DEDUPE_MS);
}

function wrap<T extends (...args: any[]) => any>(kind: string, fn: T): T {
  return ((message: any, opts?: ExternalToast) => {
    const key = keyFor(kind, message, opts);
    if (shouldSkip(key)) return;
    return fn(message, opts);
  }) as T;
}

const base = wrap("default", (m: any, o?: ExternalToast) => sonnerToast(m, o));

export const toast: typeof sonnerToast = Object.assign(base as any, {
  success: wrap("success", sonnerToast.success.bind(sonnerToast)),
  error: wrap("error", sonnerToast.error.bind(sonnerToast)),
  info: wrap("info", sonnerToast.info.bind(sonnerToast)),
  warning: wrap("warning", sonnerToast.warning.bind(sonnerToast)),
  message: wrap("message", sonnerToast.message.bind(sonnerToast)),
  loading: wrap("loading", sonnerToast.loading.bind(sonnerToast)),
  custom: sonnerToast.custom.bind(sonnerToast),
  promise: sonnerToast.promise.bind(sonnerToast),
  dismiss: sonnerToast.dismiss.bind(sonnerToast),
  getHistory: (sonnerToast as any).getHistory?.bind(sonnerToast),
});
