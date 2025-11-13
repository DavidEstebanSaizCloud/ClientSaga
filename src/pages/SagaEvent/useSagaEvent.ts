import { useEffect, useMemo, useState } from "react";
import { useForm, type Path } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../common/constants/queryKeys";
import type {
  SagaDomain,
  SagaEventDefinition,
  SagaFormValues,
} from "../../common/types/sagaEvent";
import {
  buildDefaultValuesFromObject,
  castValuesToSchema,
  getFirstPrimitivePath,
} from "../../common/utils/sagaSchema";
import { fetchSagaFlow, submitSagaEvent } from "../../services/sagaService";
import type { SagaTimelineEvent } from "../../components/SagaTimeline/useSagaTimeline";

type SubmissionStatus = "idle" | "success" | "error";

export function useSagaEvent() {
  const domainId = import.meta.env["VITE_DOMAIN"] ?? "order";
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<SagaFormValues>({
    defaultValues: {},
    mode: "onTouched",
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

  useEffect(() => {
    if (!activeEvent) {
      form.reset({});
      return;
    }
    const defaults = buildDefaultValuesFromObject(activeEvent.payloadSchema);
    form.reset(defaults);
    setStatus("idle");
    setErrorMessage("");
  }, [activeEvent, form]);

  useEffect(() => {
    if (!activeEvent) {
      return;
    }
    const firstPath = getFirstPrimitivePath(activeEvent.payloadSchema);
    if (!firstPath) {
      return;
    }
    requestAnimationFrame(() => {
      form.setFocus(firstPath as Path<SagaFormValues>);
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
        eventName: activeEvent.name,
        payload,
      });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Error desconocido");
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
