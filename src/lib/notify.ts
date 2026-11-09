/** Shows a toast, loading the toast library only when one is actually needed. */
export async function notify(kind: "success" | "error", message: string) {
  const { toast } = await import("sonner");
  toast[kind](message);
}
