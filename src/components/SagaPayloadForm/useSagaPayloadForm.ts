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
}

interface BannerState {
  intent: "success" | "error";
  message: string;
  detail?: string;
}

export function useSagaPayloadForm(props: SagaPayloadFormProps) {
  const banner = useMemo<BannerState | null>(() => {
    if (props.status === "success") {
      return {
        intent: "success",
        message: "Enviado con éxito",
      };
    }
    if (props.status === "error") {
      return {
        intent: "error",
        message: "Error al enviar la información",
        detail: props.errorMessage,
      };
    }
    return null;
  }, [props.errorMessage, props.status]);

  return {
    ...props,
    banner,
  };
}
