import axios from "axios";
import type {
  SagaEventSubmission,
  SagaFlow,
  SagaListener,
} from "../common/types/sagaEvent";

const DEFAULT_TIMEOUT = 6000;
const PROTOCOL = "https";
const FIXED_HOST = "tia.deployreal.com";

export interface DomainParts {
  domainId: string;
  restHost: string;
  baseHost: string;
}

export function resolveDomainParts(
  host: string,
  port: string,
  fallback?: string,
): DomainParts {
  const [first, ...rest] = host.split(".");
  const domainId =
    first && first !== "localhost" ? first : (fallback && fallback.trim()) || "local";
  const tail = rest.join(".");
  const restHost = tail ? `${tail}${port ? `:${port}` : ""}` : "tia.deployreal.com";
  const baseHost = `${domainId}.${restHost}`;
  return { domainId, restHost, baseHost };
}

export async function fetchSagaConfig(
  domainId: string,
  restHost: string,
): Promise<SagaFlow> {
  const candidates = [
    `${PROTOCOL}://${domainId}.${restHost}/config.json`,
    `${PROTOCOL}://${domainId}.${restHost}/config`,
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
): Promise<{ event?: string; payload?: Record<string, unknown> } | null> {
  const url = `${PROTOCOL}://${domainId}.${FIXED_HOST}/${listener.id}`;
  try {
    const response = await axios.get<{
      event?: string;
      payload?: Record<string, unknown>;
    }>(url, {
      timeout: DEFAULT_TIMEOUT,
    });
    const data = response.data;
    const eventName =
      typeof data?.event === "string" && data.event.length > 0 ? data.event : undefined;

    const payloadCandidate =
      typeof data?.payload === "object" && data.payload !== null
        ? (data.payload as Record<string, unknown>)
        : typeof data === "object" && data !== null
          ? (data as Record<string, unknown>)
          : undefined;

    if (eventName || payloadCandidate) {
      return {
        event: eventName,
        payload: payloadCandidate,
      };
    }

    return null;
  } catch (error) {
    // No interrumpimos el flujo si un listener falla; simplemente devolvemos null.
    console.warn(`Listener ${listener.id} (${domainId}) no respondió`, error);
    return null;
  }
}

export async function fetchFirstMatchingListenerEvent(
  domainId: string,
  listeners: SagaListener[],
): Promise<{ event?: string; payload?: Record<string, unknown> } | null> {
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
  const url = `${PROTOCOL}://${submission.domainId}.${FIXED_HOST}/${submission.queue}/${submission.eventName}`;
  await axios.post(url, submission.payload, { timeout: DEFAULT_TIMEOUT });
}
