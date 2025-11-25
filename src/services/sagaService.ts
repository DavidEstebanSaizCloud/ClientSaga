import axios from "axios";
import type {
  SagaEventSubmission,
  SagaFlow,
  SagaListener,
} from "../common/types/sagaEvent";

const DEFAULT_TIMEOUT = 6000;
const PROTOCOL = "http";

export function resolveDomainFromUrl(hostname: string, fallback?: string): string {
  const candidate = hostname.split(".")[0] ?? "";
  if (candidate && candidate !== "localhost") {
    return candidate;
  }
  if (fallback && fallback.trim().length > 0) {
    return fallback.trim();
  }
  return "local";
}

export async function fetchSagaConfig(domainId: string): Promise<SagaFlow> {
  const candidates = [
    `${PROTOCOL}://${domainId}.tia.deployreal.com/config.json`,
    `${PROTOCOL}://${domainId}.tia.deployreal.com/config`,
  ];

  let lastError: unknown;
  for (const url of candidates) {
    try {
      const response = await axios.get<SagaFlow>(url, { timeout: DEFAULT_TIMEOUT });
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("No se pudo obtener config.json");
}

export async function fetchListenerEvent(
  domainId: string,
  listener: SagaListener,
): Promise<string | null> {
  const url = `${PROTOCOL}://${domainId}.tia.deployreal.com/${listener.id}`;
  try {
    const response = await axios.get<{ event?: string }>(url, {
      timeout: DEFAULT_TIMEOUT,
    });
    const eventName = response.data?.event;
    return typeof eventName === "string" && eventName.length > 0 ? eventName : null;
  } catch (error) {
    // No interrumpimos el flujo si un listener falla; simplemente devolvemos null.
    console.warn(`Listener ${listener.id} (${domainId}) no respondió`, error);
    return null;
  }
}

export async function fetchFirstMatchingListenerEvent(
  domainId: string,
  listeners: SagaListener[],
): Promise<string | null> {
  if (!listeners.length) {
    return null;
  }

  const settled = await Promise.allSettled(
    listeners.map((listener) => fetchListenerEvent(domainId, listener)),
  );

  for (const result of settled) {
    if (result.status === "fulfilled" && result.value) {
      return result.value;
    }
  }

  return null;
}

export async function submitSagaEvent(submission: SagaEventSubmission): Promise<void> {
  const url = `${PROTOCOL}://${submission.queue}.${submission.domainId}.tia.deployreal.com/${submission.eventName}`;
  await axios.post(url, submission.payload, { timeout: DEFAULT_TIMEOUT });
}
