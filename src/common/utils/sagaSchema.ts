import type {
  SagaSchema,
  SagaSchemaArray,
  SagaSchemaObject,
  SagaSchemaPrimitive,
} from "../types/sagaEvent";

export function isPrimitiveSchema(
  schema: SagaSchema,
): schema is SagaSchemaPrimitive {
  return schema === "string" || schema === "number";
}

export function isSchemaArray(schema: SagaSchema): schema is SagaSchemaArray {
  return Array.isArray(schema);
}

export function isSchemaObject(schema: SagaSchema): schema is SagaSchemaObject {
  return typeof schema === "object" && schema !== null && !Array.isArray(schema);
}

export function buildDefaultValuesFromObject(
  schema: SagaSchemaObject,
): Record<string, unknown> {
  return Object.entries(schema).reduce<Record<string, unknown>>(
    (acc, [key, branch]) => {
      acc[key] = buildDefaultValue(branch);
      return acc;
    },
    {},
  );
}

export function buildDefaultValue(schema: SagaSchema): unknown {
  if (isPrimitiveSchema(schema)) {
    return "";
  }
  if (isSchemaArray(schema)) {
    if (!schema.length) {
      return [];
    }
    return [buildDefaultValue(schema[0])];
  }
  if (isSchemaObject(schema)) {
    return buildDefaultValuesFromObject(schema);
  }
  return null;
}

export function getFirstPrimitivePath(
  schema: SagaSchemaObject,
): string | null {
  return searchFirstPrimitive(schema, "");
}

function searchFirstPrimitive(schema: SagaSchema, prefix: string): string | null {
  if (isPrimitiveSchema(schema)) {
    return prefix;
  }
  if (isSchemaArray(schema)) {
    if (!schema.length) {
      return null;
    }
    const nextPrefix = prefix ? `${prefix}.0` : "0";
    return searchFirstPrimitive(schema[0], nextPrefix);
  }
  if (isSchemaObject(schema)) {
    const [firstKey] = Object.keys(schema);
    if (!firstKey) {
      return null;
    }
    const nextPrefix = prefix ? `${prefix}.${firstKey}` : firstKey;
    return searchFirstPrimitive(schema[firstKey], nextPrefix);
  }
  return null;
}

export function castValuesToSchema(
  schema: SagaSchema,
  values: unknown,
): unknown {
  if (isPrimitiveSchema(schema)) {
    if (schema === "number") {
      const parsed =
        typeof values === "number" ? values : Number((values ?? "").toString());
      return Number.isNaN(parsed) ? null : parsed;
    }
    return typeof values === "string" ? values : values?.toString?.() ?? "";
  }

  if (isSchemaArray(schema)) {
    if (!Array.isArray(values)) {
      return [];
    }
    if (!schema.length) {
      return values;
    }
    return values.map((item) => castValuesToSchema(schema[0], item));
  }

  if (isSchemaObject(schema)) {
    if (typeof values !== "object" || values === null) {
      return buildDefaultValuesFromObject(schema);
    }
    return Object.entries(schema).reduce<Record<string, unknown>>(
      (acc, [key, branch]) => {
        acc[key] = castValuesToSchema(
          branch,
          (values as Record<string, unknown>)[key],
        );
        return acc;
      },
      {},
    );
  }

  return values;
}
