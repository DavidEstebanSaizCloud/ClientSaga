import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PropsWithChildren } from "react";
import type { SagaFlow } from "../../common/types/sagaEvent";
import { useSagaEvent } from "./useSagaEvent";

const sagaFlowFixture: SagaFlow = {
  name: "Fixture Saga",
  version: 1,
  event: "InventoryReserved",
  domains: [
    {
      id: "inventory",
      queue: "inventory",
      events: [
        {
          name: "InventoryReserved",
          payloadSchema: {
            reservationId: "string",
            orderId: "string",
            items: [
              {
                sku: "string",
                qty: "number",
              },
            ],
            amount: "number",
          },
        },
      ],
    },
    {
      id: "order",
      queue: "orders",
      events: [
        {
          name: "OrderPlaced",
          payloadSchema: {
            orderId: "string",
          },
        },
      ],
      listeners: [
        {
          id: "order-to-inventory",
          delayMs: 10,
          on: { event: "OrderPlaced" },
          actions: [
            {
              type: "emit",
              event: "InventoryReserved",
              toDomain: "inventory",
              mapping: {
                reservationId: { const: "RES-001" },
                orderId: "orderId",
                items: {
                  arrayFrom: "lines",
                  map: {
                    sku: "sku",
                    qty: "qty",
                  },
                },
                amount: { const: 99.5 },
              },
            },
          ],
        },
      ],
    },
  ],
};

vi.mock("../../services/sagaService", () => ({
  fetchSagaFlow: vi.fn(async () => sagaFlowFixture),
  submitSagaEvent: vi.fn(),
}));

describe("useSagaEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("prefills default values from mapping definition", async () => {
    vi.stubEnv("VITE_DOMAIN", "inventory");

    const queryClient = new QueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(useSagaEvent, { wrapper });

    await waitFor(() => {
      expect(result.current.activeEvent?.name).toBe("InventoryReserved");
    });

    expect(result.current.form.getValues()).toMatchObject({
      reservationId: "RES-001",
      orderId: expect.any(String),
      items: [{ sku: expect.any(String), qty: expect.anything() }],
      amount: 99.5,
    });
  });
});
