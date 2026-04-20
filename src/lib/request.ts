export async function withTimeout<T>(
  promise: PromiseLike<T>,
  options: { ms?: number; message?: string } = {},
): Promise<T> {
  const { ms = 15000, message = "Request timed out. Please try again." } = options;

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });

  try {
    return (await Promise.race([Promise.resolve(promise), timeout])) as T;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return fallback;
}