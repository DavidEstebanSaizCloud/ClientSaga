import { FormProvider } from "react-hook-form";
import SagaPayloadForm from "../../components/SagaPayloadForm/view";
import SagaTimeline from "../../components/SagaTimeline/view";
import * as S from "./styled";
import { useSagaEvent } from "./useSagaEvent";

export default function SagaEventPage() {
  const {
    sagaName,
    domain,
    activeEvent,
    eventsList,
    handleSubmit,
    form,
    status,
    errorMessage,
    isLocked,
    isLoading,
    loadError,
  } = useSagaEvent();

  if (isLoading) {
    return (
      <S.Page>
        <S.StateCard>Cargando flujo de la saga…</S.StateCard>
      </S.Page>
    );
  }

  if (!domain || !activeEvent || loadError) {
    const message =
      loadError instanceof Error
        ? loadError.message
        : "No se pudo obtener la configuración del flujo.";
    return (
      <S.Page>
        <S.StateCard>
          <p>{message}</p>
        </S.StateCard>
      </S.Page>
    );
  }

  return (
    <S.Page>
      <S.Header>
        <S.Title>{sagaName}</S.Title>
        <S.Subtitle>
          Dominio activo: <S.Highlight>{domain.id}</S.Highlight> · Queue:{" "}
          <S.Highlight>{domain.queue}</S.Highlight>
        </S.Subtitle>
      </S.Header>

      <S.Layout>
        <SagaTimeline
          domainId={domain.id}
          queue={domain.queue}
          events={eventsList}
        />

        <FormProvider {...form}>
          <SagaPayloadForm
            schema={activeEvent.payloadSchema}
            eventName={activeEvent.name}
            onSubmit={handleSubmit}
            isLocked={isLocked}
            status={status}
            errorMessage={errorMessage}
          />
        </FormProvider>
      </S.Layout>
    </S.Page>
  );
}
