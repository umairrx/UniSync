export function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) return String(err.message);
  return "An unknown error occurred";
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  defaultMessage = "Operation failed",
): Promise<[T | null, string | null]> {
  try {
    const data = await operation();
    return [data, null];
  } catch (err) {
    return [null, extractErrorMessage(err) || defaultMessage];
  }
}
