import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../common/constants/queryKeys";
import type {
  SagaDomain,
  SagaFormValues,
  SagaListenerAction,
  SagaListenerEmitAction,
  SagaListenerMapping,
  SagaPublish,
} from "../../common/types/sagaEvent";
import {
  buildDefaultValuesFromMapping,
  castValuesToSchema,
  getFirstPrimitivePath,
} from "../../common/utils/sagaSchema";
import {
  fetchFirstMatchingListenerEvent,
  fetchSagaConfig,
  resolveDomainParts,
  submitSagaEvent,
} from "../../services/sagaService";
import type { SagaTimelineEvent } from "../../components/SagaTimeline/useSagaTimeline";

type SubmissionStatus = "idle" | "success" | "error";

type SagaEventSubmitHandler = ReturnType<UseFormReturn<SagaFormValues>["handleSubmit"]>;

interface ActiveEventResult {
  publish: SagaPublish;
  mapping?: SagaListenerMapping;
  initialPayload?: Record<string, unknown>;
}

interface UseSagaEventResult {
  sagaName: string;
  domain?: SagaDomain;
  activeEvent?: SagaPublish;
  eventsList: SagaTimelineEvent[];
  handleSubmit: SagaEventSubmitHandler;
  form: UseFormReturn<SagaFormValues>;
  status: SubmissionStatus;
  errorMessage: string;
  isLocked: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  loadError: unknown;
}

export function useSagaEvent(): UseSagaEventResult {
  const { domainId, restHost } = useMemo(
    () =>
      resolveDomainParts(
        window.location.hostname,
        window.location.port,
        import.meta.env.VITE_DOMAIN,
      ),
    [],
  );
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentEventName, setCurrentEventName] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const firstFocusDoneRef = useRef(false);

  const form = useForm<SagaFormValues>({
    defaultValues: {},
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const sagaQuery = useQuery({
    queryKey: [QUERY_KEYS.sagaFlow, domainId, restHost],
    queryFn: () => fetchSagaConfig(domainId, restHost),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  const domain: SagaDomain | undefined = useMemo(() => {
    if (!sagaQuery.data) {
      return undefined;
    }
    const normalizedDomain = domainId.toLowerCase();
    return (
      sagaQuery.data.domains.find(
        (item) =>
          item.name?.toLowerCase() === normalizedDomain ||
          item.id.toLowerCase() === normalizedDomain,
      ) ?? sagaQuery.data.domains[0]
    );
  }, [domainId, sagaQuery.data]);

  const activeEventQuery = useQuery<ActiveEventResult>({
    queryKey: [QUERY_KEYS.activeEvent, domain?.id],
    enabled: Boolean(domain),
    queryFn: async () => {
      if (!domain) {
        throw new Error("No se encontró el dominio solicitado.");
      }
      return resolveActivePublish(domain);
    },
    refetchOnWindowFocus: false,
    refetchInterval: status === "success" ? 5000 : false,
  });

  const activeEvent = activeEventQuery.data?.publish;
  const activeEventMapping = activeEventQuery.data?.mapping;
  const activeInitialPayload = activeEventQuery.data?.initialPayload;

  useEffect(() => {
    if (!activeEvent) {
      form.reset({});
      return;
    }
    const eventChanged = activeEvent.event !== currentEventName;
    if (!eventChanged && status !== "success") {
      return;
    }
    const defaults =
      activeInitialPayload && typeof activeInitialPayload === "object"
        ? (castValuesToSchema(
            activeEvent.payloadSchema,
            activeInitialPayload,
          ) as Record<string, unknown>)
        : buildDefaultValuesFromMapping(activeEvent.payloadSchema, activeEventMapping);
    form.reset(defaults);
    setCurrentEventName(activeEvent.event);
    if (eventChanged) {
      setStatus("idle");
      setErrorMessage("");
      setIsRefreshing(false);
      firstFocusDoneRef.current = false;
    }
  }, [activeEvent, activeEventMapping, currentEventName, form, status]);

  useEffect(() => {
    if (!activeEvent) {
      return;
    }
    const firstPath = getFirstPrimitivePath(activeEvent.payloadSchema);
    if (!firstPath || firstFocusDoneRef.current) {
      return;
    }
    requestAnimationFrame(() => {
      form.setFocus(firstPath);
      firstFocusDoneRef.current = true;
    });
  }, [activeEvent, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!activeEvent || !domain) {
      return;
    }
    try {
      setStatus("idle");
      setErrorMessage("");

      const payload = castValuesToSchema(activeEvent.payloadSchema, values) as Record<
        string,
        unknown
      >;

      await submitSagaEvent({
        domainId: domain.id,
        queue: domain.queue,
        eventName: activeEvent.event,
        payload,
      });
      setStatus("success");
      setIsRefreshing(true);
      await activeEventQuery.refetch();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Error desconocido");
      setIsRefreshing(false);
    }
  });

  const eventsList: SagaTimelineEvent[] = useMemo(() => {
    if (!domain) {
      return [];
    }
    return (domain.publishes ?? []).map((event) => ({
      name: event.event,
      isActive: event.event === activeEvent?.event,
    }));
  }, [activeEvent?.event, domain]);

  const isLocked = form.formState.isSubmitting || status === "success";

  return {
    sagaName: sagaQuery.data?.name ?? "Saga actual",
    domain,
    activeEvent,
    eventsList,
    handleSubmit,
    form,
    status,
    errorMessage,
    isLocked,
    isLoading: sagaQuery.isLoading || activeEventQuery.isLoading,
    isRefreshing,
    loadError: sagaQuery.error ?? activeEventQuery.error,
  };
}

async function resolveActivePublish(domain: SagaDomain): Promise<ActiveEventResult> {
  if (!domain.publishes || !domain.publishes.length) {
    throw new Error("El dominio no tiene eventos configurados.");
  }

  const listenerResult =
    (await fetchFirstMatchingListenerEvent(domain.id, domain.listeners ?? [])) ?? null;
  const listenerEvent = listenerResult?.event ?? null;
  const firstPublish = domain.publishes[0];
  if (!firstPublish) {
    throw new Error("No se pudo determinar el evento inicial.");
  }
  const preferredEvent =
    listenerEvent ??
    domain.publishes.find((item) => item.start)?.event ??
    firstPublish.event;

  const publish =
    domain.publishes.find((item) => item.event === preferredEvent) ?? firstPublish;

  if (!publish) {
    throw new Error("No se pudo determinar el evento activo.");
  }

  return {
    publish,
    mapping: findMappingForEvent(domain, publish.event),
    initialPayload: listenerResult?.payload,
  };
}

function findMappingForEvent(
  domain: SagaDomain,
  eventName: string,
): SagaListenerMapping | undefined {
  if (!domain.listeners) {
    return undefined;
  }
  const listener = domain.listeners.find((entry) => entry.on.event === eventName);
  if (!listener) {
    return undefined;
  }
  const emitAction = listener.actions.find(isEmitAction);
  return emitAction?.mapping;
}

function isEmitAction(action: SagaListenerAction): action is SagaListenerEmitAction {
  return action.type === "emit";
}
