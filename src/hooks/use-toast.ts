// Legacy bridge: forwards `useToast()` / `toast()` calls to sonner so we have
// a SINGLE toast system across the app. Prevents duplicate notifications that
// appeared when some code used shadcn's `useToast` and other code used sonner
// simultaneously (both toasters mounted, same message rendered twice).
import { toast as sonnerToast } from "@/lib/toast";

type LegacyToastArgs = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | string;
  action?: any;
  duration?: number;
  id?: string | number;
};

function normalizeMessage(v: React.ReactNode): string {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return "";
  }
}

// Simple in-memory dedupe: if the exact same title+description was fired in
// the last 1200ms, coalesce into a single toast (sonner reuses the id).
const recent = new Map<string, number>();
const DEDUPE_MS = 1200;

function stableIdFor(title: string, description: string): string {
  const key = `${title}\u0001${description}`;
  const now = Date.now();
  const last = recent.get(key);
  recent.set(key, now);
  // Cheap GC
  if (recent.size > 100) {
    for (const [k, t] of recent) if (now - t > 5000) recent.delete(k);
  }
  if (last && now - last < DEDUPE_MS) return `dedupe:${key}`;
  return `dedupe:${key}:${now}`;
}

export function toast(args: LegacyToastArgs) {
  const title = normalizeMessage(args.title);
  const description = normalizeMessage(args.description);
  const id = args.id ?? stableIdFor(title, description);
  const opts: any = {
    id,
    description: args.description || undefined,
    duration: args.duration,
  };
  if (args.variant === "destructive") {
    return sonnerToast.error(args.title || "Erro", opts);
  }
  return sonnerToast(args.title || "", opts);
}

export function useToast() {
  return {
    toast,
    dismiss: (id?: string | number) => sonnerToast.dismiss(id as any),
    toasts: [] as any[],
  };
}
