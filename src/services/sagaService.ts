import axios from "axios";
import type {
  SagaEventSubmission,
  SagaFlow,
  SagaListener,
} from "../common/types/sagaEvent";

const DEFAULT_TIMEOUT = 6000;
const PROTOCOL = "http";

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
  const baseHost = port ? `${host}:${port}` : host;
  const [first, ...rest] = host.split(".");
  const domainId =
    first && first !== "localhost"
      ? first
      : (fallback && fallback.trim()) || "local";
  const tail = rest.join(".");
  const restHost = tail
    ? `${tail}${port ? `:${port}` : ""}`
    : baseHost;

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
  restHost: string,
  listener: SagaListener,
): Promise<string | null> {
  const url = `${PROTOCOL}://${domainId}.${restHost}/${listener.id}`;
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
  restHost: string,
  listeners: SagaListener[],
): Promise<string | null> {
  if (!listeners.length) {
    return null;
  }

  const settled = await Promise.allSettled(
    listeners.map((listener) => fetchListenerEvent(domainId, restHost, listener)),
  );

  for (const result of settled) {
    if (result.status === "fulfilled" && result.value) {
      return result.value;
    }
  }

  return null;
}

export async function submitSagaEvent(
  submission: SagaEventSubmission & { restHost: string },
): Promise<void> {
  const url = `${PROTOCOL}://${submission.queue}.${submission.domainId}.${submission.restHost}/${submission.eventName}`;
  await axios.post(url, submission.payload, { timeout: DEFAULT_TIMEOUT });
}
