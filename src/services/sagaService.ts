import type { SagaEventSubmission, SagaFlow } from "../common/types/sagaEvent";

const mockSagaFlow: SagaFlow = {
  name: "cambio-de-titular-utility",
  version: 1,
  event: "actualizacion-de-datos",
  domains: [
    {
      id: "gestion-de-clientes",
      queue: "cola-gestion-clientes",
      events: [
        {
          name: "solicitud-de-cambio",
          payloadSchema: {
            clienteId: "string",
            nombreNuevoTitular: "string",
            documentoIdentidadNuevoTitular: "string",
          },
        },
        {
          name: "actualizacion-de-datos",
          payloadSchema: {
            clienteId: "string",
            nombreNuevoTitular: "string",
            documentoIdentidadNuevoTitular: "string",
          },
        },
      ],
      listeners: [
        {
          id: "listener-verificacion-identidad",
          on: {
            event: "solicitud-de-cambio",
          },
          actions: [
            {
              type: "emit",
              event: "verificacion-de-identidad",
              mapping: {
                clienteId: "clienteId",
                nombreNuevoTitular: "nombreNuevoTitular",
                documentoIdentidadNuevoTitular: "documentoIdentidadNuevoTitular",
              },
            },
          ],
        },
      ],
    },
    {
      id: "servicio-al-cliente",
      queue: "cola-servicio-cliente",
      events: [
        {
          name: "verificacion-de-identidad",
          payloadSchema: {
            clienteId: "string",
            nombreNuevoTitular: "string",
            documentoIdentidadNuevoTitular: "string",
          },
        },
        {
          name: "confirmacion-al-nuevo-titular",
          payloadSchema: {
            clienteId: "string",
            mensaje: "string",
          },
        },
      ],
      listeners: [
        {
          id: "listener-revision-contrato",
          on: {
            event: "verificacion-de-identidad",
          },
          actions: [
            {
              type: "emit",
              event: "revision-de-contrato",
              mapping: {
                clienteId: "clienteId",
                nombreNuevoTitular: "nombreNuevoTitular",
                documentoIdentidadNuevoTitular: "documentoIdentidadNuevoTitular",
              },
            },
          ],
        },
      ],
    },
    {
      id: "legal",
      queue: "cola-legal",
      events: [
        {
          name: "revision-de-contrato",
          payloadSchema: {
            clienteId: "string",
            nombreNuevoTitular: "string",
            documentoIdentidadNuevoTitular: "string",
          },
        },
      ],
      listeners: [
        {
          id: "listener-actualizacion-datos",
          on: {
            event: "revision-de-contrato",
          },
          actions: [
            {
              type: "emit",
              event: "actualizacion-de-datos",
              toDomain: "gestion-de-clientes",
              mapping: {
                clienteId: "clienteId",
                nombreNuevoTitular: "nombreNuevoTitular",
                documentoIdentidadNuevoTitular: "documentoIdentidadNuevoTitular",
              },
            },
          ],
        },
      ],
    },
    {
      id: "facturacion",
      queue: "cola-facturacion",
      events: [
        {
          name: "notificacion-a-facturacion",
          payloadSchema: {
            clienteId: "string",
            nombreNuevoTitular: "string",
            documentoIdentidadNuevoTitular: "string",
          },
        },
      ],
      listeners: [
        {
          id: "listener-notificacion-facturacion",
          on: {
            event: "actualizacion-de-datos",
          },
          actions: [
            {
              type: "emit",
              event: "notificacion-a-facturacion",
              mapping: {
                clienteId: "clienteId",
                nombreNuevoTitular: "nombreNuevoTitular",
                documentoIdentidadNuevoTitular: "documentoIdentidadNuevoTitular",
              },
            },
          ],
        },
      ],
    },
    {
      id: "sistemas-de-informacion",
      queue: "cola-sistemas-informacion",
      events: [
        {
          name: "ajuste-en-sistemas",
          payloadSchema: {
            clienteId: "string",
            nombreNuevoTitular: "string",
            documentoIdentidadNuevoTitular: "string",
          },
        },
      ],
      listeners: [
        {
          id: "listener-ajuste-sistemas",
          on: {
            event: "notificacion-a-facturacion",
          },
          actions: [
            {
              type: "emit",
              event: "ajuste-en-sistemas",
              mapping: {
                clienteId: "clienteId",
                nombreNuevoTitular: "nombreNuevoTitular",
                documentoIdentidadNuevoTitular: "documentoIdentidadNuevoTitular",
              },
            },
          ],
        },
        {
          id: "listener-confirmacion-titular",
          on: {
            event: "ajuste-en-sistemas",
          },
          actions: [
            {
              type: "emit",
              event: "confirmacion-al-nuevo-titular",
              toDomain: "servicio-al-cliente",
              mapping: {
                clienteId: "clienteId",
                mensaje: {
                  const: "El cambio de titularidad ha sido completado exitosamente.",
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

const mockDelay = (ms = 450) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export async function fetchSagaFlow(): Promise<SagaFlow> {
  await mockDelay();
  return mockSagaFlow;
}

export async function submitSagaEvent(submission: SagaEventSubmission): Promise<void> {
  await mockDelay(600);
  const shouldFail = submission.eventName === "OrderConfirmed";

  if (shouldFail) {
    throw new Error("Mocked failure while sending saga event");
  }

  console.info("Saga event dispatched", submission);
}
