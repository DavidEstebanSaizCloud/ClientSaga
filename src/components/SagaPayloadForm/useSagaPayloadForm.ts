import { useMemo } from "react";
import type { FormEventHandler } from "react";
import type { SagaSchemaObject } from "../../common/types/sagaEvent";

export interface SagaPayloadFormProps {
  schema: SagaSchemaObject;
  eventName: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isLocked: boolean;
  status: "idle" | "success" | "error";
  errorMessage: string;
  isRefreshing?: boolean;
}

interface BannerState {
  intent: "error";
  message: string;
  detail?: string;
}

interface SuccessState {
  title: string;
  description: string;
}

export function useSagaPayloadForm(props: SagaPayloadFormProps) {
  const successState = useMemo<SuccessState | null>(() => {
    if (props.status !== "success") {
      return null;
    }
    return {
      title: "Enviado con éxito",
      description: "El evento se registró correctamente.",
    };
  }, [props.status]);

  const banner = useMemo<BannerState | null>(() => {
    if (props.status !== "error") {
      return null;
    }
    return {
      intent: "error",
      message: "Error al enviar la información",
      detail: props.errorMessage,
    };
  }, [props.errorMessage, props.status]);

  return {
    ...props,
    banner,
    successState,
  };
}
