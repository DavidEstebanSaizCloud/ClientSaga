import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PropsWithChildren } from "react";
import type { SagaFlow } from "../../common/types/sagaEvent";
import { useSagaEvent } from "./useSagaEvent";

const sagaFlowFixture: SagaFlow = {
  name: "Alta empleado",
  version: 1,
  domains: [
    {
      id: "payroll",
      queue: "payroll-queue",
      publishes: [
        {
          event: "configuracion-pago-payroll",
          payloadSchema: {
            empleadoId: "string",
            nombre: "string",
            apellido: "string",
            email: "string",
          },
          start: true,
        },
      ],
      listeners: [
        {
          id: "payroll-on-registro-hr",
          on: {
            event: "configuracion-pago-payroll",
            fromDomain: "hr",
          },
          actions: [
            {
              type: "emit",
              event: "configuracion-pago-payroll",
              mapping: {
                empleadoId: "empleadoId",
                nombre: "nombre",
                apellido: "apellido",
                email: "email",
              },
            },
          ],
        },
      ],
    },
  ],
};

vi.mock("../../services/sagaService", () => ({
  fetchSagaConfig: vi.fn(async () => sagaFlowFixture),
  fetchFirstMatchingListenerEvent: vi.fn(async () => "configuracion-pago-payroll"),
  submitSagaEvent: vi.fn(),
  resolveDomainFromUrl: vi.fn(() => "payroll"),
}));

describe("useSagaEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("prefills default values from listener mapping and selects active event", async () => {
    vi.stubEnv("VITE_DOMAIN", "payroll");

    const queryClient = new QueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(useSagaEvent, { wrapper });

    await waitFor(() => {
      expect(result.current.activeEvent?.event).toBe("configuracion-pago-payroll");
    });

    expect(result.current.form.getValues()).toMatchObject({
      empleadoId: expect.any(String),
      nombre: expect.any(String),
      apellido: expect.any(String),
      email: expect.any(String),
    });
  });
});
