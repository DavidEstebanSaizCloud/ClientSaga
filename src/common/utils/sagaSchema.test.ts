import { describe, expect, it } from "vitest";
import {
  buildDefaultValuesFromObject,
  castValuesToSchema,
  getFirstPrimitivePath,
} from "./sagaSchema";
import type { SagaSchemaObject } from "../types/sagaEvent";

describe("sagaSchema utilities", () => {
  const schema: SagaSchemaObject = {
    orderId: "string",
    amount: "number",
    address: {
      city: "string",
      zip: "string",
    },
    lines: [
      {
        sku: "string",
        qty: "number",
      },
    ],
  };

  it("builds default values preserving the schema shape", () => {
    const defaults = buildDefaultValuesFromObject(schema);
    expect(defaults).toMatchObject({
      orderId: "",
      amount: "",
      address: { city: "", zip: "" },
    });
    expect(Array.isArray(defaults["lines"])).toBe(true);
    expect((defaults["lines"] as unknown[]).length).toBe(1);
  });

  it("casts values back to the schema types", () => {
    const casted = castValuesToSchema(schema, {
      orderId: "123",
      amount: "89.5",
      address: { city: "Madrid", zip: "28001" },
      lines: [{ sku: "A", qty: "2" }],
    });

    expect(casted).toMatchObject({
      orderId: "123",
      amount: 89.5,
      lines: [{ qty: 2 }],
    });
    expect(typeof (casted as Record<string, unknown>)["amount"]).toBe("number");
  });

  it("retrieves the first primitive path for focus management", () => {
    const path = getFirstPrimitivePath(schema);
    expect(path).toBe("orderId");
  });
});
