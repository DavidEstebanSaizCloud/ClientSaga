import { useEffect, useMemo, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../common/constants/queryKeys";
import type {
  SagaDomain,
  SagaEventDefinition,
  SagaFormValues,
  SagaListenerMapping,
} from "../../common/types/sagaEvent";
import {
  buildDefaultValuesFromMapping,
  castValuesToSchema,
  getFirstPrimitivePath,
} from "../../common/utils/sagaSchema";
import { fetchSagaFlow, submitSagaEvent } from "../../services/sagaService";
import type { SagaTimelineEvent } from "../../components/SagaTimeline/useSagaTimeline";

type SubmissionStatus = "idle" | "success" | "error";

interface SubmissionSnapshot {
  status: SubmissionStatus;
  errorMessage: string;
}

const IDLE_SNAPSHOT: SubmissionSnapshot = {
  status: "idle",
  errorMessage: "",
};

type SagaEventSubmitHandler = ReturnType<
  UseFormReturn<SagaFormValues>["handleSubmit"]
>;

interface UseSagaEventResult {
  sagaName: string;
  domain?: SagaDomain;
  activeEvent?: SagaEventDefinition;
  eventsList: SagaTimelineEvent[];
  handleSubmit: SagaEventSubmitHandler;
  form: UseFormReturn<SagaFormValues>;
  status: SubmissionStatus;
  errorMessage: string;
  isLocked: boolean;
  isLoading: boolean;
  loadError: unknown;
}

export function useSagaEvent(): UseSagaEventResult {
  const domainIdEnv = import.meta.env.VITE_DOMAIN;
  const domainId =
    typeof domainIdEnv === "string" && domainIdEnv.length > 0
      ? domainIdEnv
      : "order";
  const [submissionState, setSubmissionState] = useState<
    Record<string, SubmissionSnapshot>
  >({});

  const form = useForm<SagaFormValues>({
    defaultValues: {},
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const sagaQuery = useQuery({
    queryKey: [QUERY_KEYS.sagaFlow],
    queryFn: fetchSagaFlow,
    staleTime: 5 * 60 * 1000,
  });

  const domain: SagaDomain | undefined = useMemo(() => {
    if (!sagaQuery.data) {
      return undefined;
    }
    return (
      sagaQuery.data.domains.find((item) => item.id === domainId) ??
      sagaQuery.data.domains[0]
    );
  }, [domainId, sagaQuery.data]);

  const activeEvent: SagaEventDefinition | undefined = useMemo(() => {
    if (!domain) {
      return undefined;
    }
    return (
      domain.events.find((event) => event.name === sagaQuery.data?.event) ??
      domain.events[0]
    );
  }, [domain, sagaQuery.data?.event]);

  const activeEventMapping = useMemo(() => {
    if (!activeEvent || !sagaQuery.data) {
      return undefined;
    }
    return findEventMapping(
      sagaQuery.data.domains,
      domain?.id ?? null,
      activeEvent.name,
    );
  }, [activeEvent, domain?.id, sagaQuery.data]);

  useEffect(() => {
    if (!activeEvent) {
      form.reset({});
      return;
    }
    const defaults = buildDefaultValuesFromMapping(
      activeEvent.payloadSchema,
      activeEventMapping,
    );
    form.reset(defaults);
  }, [activeEvent, activeEventMapping, form]);

  useEffect(() => {
    if (!activeEvent) {
      return;
    }
    const firstPath = getFirstPrimitivePath(activeEvent.payloadSchema);
    if (!firstPath) {
      return;
    }
    requestAnimationFrame(() => {
      form.setFocus(firstPath);
    });
  }, [activeEvent, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!activeEvent || !domain) {
      return;
    }
    try {
      setSubmissionState((prev) => ({
        ...prev,
        [activeEvent.name]: { ...IDLE_SNAPSHOT },
      }));
      const payload = castValuesToSchema(activeEvent.payloadSchema, values) as Record<
        string,
        unknown
      >;

      await submitSagaEvent({
        domainId: domain.id,
        eventName: activeEvent.name,
        payload,
      });
      setSubmissionState((prev) => ({
        ...prev,
        [activeEvent.name]: {
          status: "success",
          errorMessage: "",
        },
      }));
    } catch (error) {
      setSubmissionState((prev) => ({
        ...prev,
        [activeEvent.name]: {
          status: "error",
          errorMessage:
            error instanceof Error ? error.message : "Error desconocido",
        },
      }));
    }
  });

  const eventsList: SagaTimelineEvent[] = useMemo(() => {
    if (!domain) {
      return [];
    }
    return domain.events.map((event) => ({
      name: event.name,
      isActive: event.name === activeEvent?.name,
    }));
  }, [activeEvent?.name, domain]);

  const activeSnapshot = activeEvent
    ? submissionState[activeEvent.name] ?? IDLE_SNAPSHOT
    : IDLE_SNAPSHOT;
  const status = activeSnapshot.status;
  const errorMessage = activeSnapshot.errorMessage;
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
    isLoading: sagaQuery.isLoading,
    loadError: sagaQuery.error,
  };
}

function findEventMapping(
  domains: SagaDomain[],
  domainId: string | null,
  eventName: string,
): SagaListenerMapping | undefined {
  return (
    findMappingByTargetDomain(domains, domainId, eventName) ??
    findMappingInsideDomain(domains, domainId, eventName)
  );
}

function findMappingByTargetDomain(
  domains: SagaDomain[],
  domainId: string | null,
  eventName: string,
): SagaListenerMapping | undefined {
  for (const sagaDomain of domains) {
    if (!sagaDomain.listeners) {
      continue;
    }
    for (const listener of sagaDomain.listeners) {
      for (const action of listener.actions) {
        if (action.type !== "emit") {
          continue;
        }
        const isMatchingDomain =
          domainId === null || action.toDomain === domainId;
        if (isMatchingDomain && action.event === eventName) {
          return action.mapping;
        }
      }
    }
  }
  return undefined;
}

function findMappingInsideDomain(
  domains: SagaDomain[],
  domainId: string | null,
  eventName: string,
): SagaListenerMapping | undefined {
  if (!domainId) {
    return undefined;
  }
  const domain = domains.find((item) => item.id === domainId);
  if (!domain || !domain.listeners) {
    return undefined;
  }
  const listener = domain.listeners.find(
    (entry) => entry.on.event === eventName,
  );
  if (!listener) {
    return undefined;
  }
  const emitAction = listener.actions.find(
    (action) => action.type === "emit" && action.mapping,
  );
  return emitAction?.mapping;
}
