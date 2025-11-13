export function logInfo(message: string, ...context: unknown[]) {
  if (import.meta.env.DEV) {
    console.info(`[ClientSaga] ${message}`, ...context);
  }
}

export function logError(message: string, error: unknown) {
  console.error(`[ClientSaga] ${message}`, error);
}
