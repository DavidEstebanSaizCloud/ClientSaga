import type {
  SagaListenerMapping,
  SagaListenerMappingValue,
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
    const template = schema[0];
    if (!template) {
      return [];
    }
    return [buildDefaultValue(template)];
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
    const firstItem = schema[0];
    if (!firstItem) {
      return null;
    }
    const nextPrefix = prefix ? `${prefix}.0` : "0";
    return searchFirstPrimitive(firstItem, nextPrefix);
  }
  if (isSchemaObject(schema)) {
    const [firstKey] = Object.keys(schema);
    if (!firstKey) {
      return null;
    }
    const branch = schema[firstKey];
    if (typeof branch === "undefined") {
      return null;
    }
    const nextPrefix = prefix ? `${prefix}.${firstKey}` : firstKey;
    return searchFirstPrimitive(branch, nextPrefix);
  }
  return null;
}

export function castValuesToSchema(
  schema: SagaSchema,
  values: unknown,
): unknown {
  if (isPrimitiveSchema(schema)) {
    if (schema === "number") {
      const rawValue =
        typeof values === "number"
          ? values
          : typeof values === "string"
            ? values
            : "";
      const parsed =
        typeof rawValue === "number" ? rawValue : Number(rawValue);
      return Number.isNaN(parsed) ? null : parsed;
    }
    if (typeof values === "string") {
      return values;
    }
    if (typeof values === "number" || typeof values === "boolean") {
      return `${values}`;
    }
    return "";
  }

  if (isSchemaArray(schema)) {
    if (!Array.isArray(values)) {
      return [];
    }
    const template = schema[0];
    if (!template) {
      return values;
    }
    return values.map((item) => castValuesToSchema(template, item));
  }

  if (isSchemaObject(schema)) {
    if (typeof values !== "object" || values === null) {
      return buildDefaultValuesFromObject(schema);
    }
    return Object.entries(schema).reduce<Record<string, unknown>>(
      (acc, [key, branch]) => {
        if (typeof branch === "undefined") {
          return acc;
        }
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

export function buildDefaultValuesFromMapping(
  schema: SagaSchemaObject,
  mapping?: SagaListenerMapping,
): Record<string, unknown> {
  if (!mapping) {
    return buildDefaultValuesFromObject(schema);
  }
  return buildValuesFromMappingRecord(schema, mapping);
}

function buildValuesFromMappingRecord(
  schema: SagaSchemaObject,
  mapping?: SagaListenerMapping,
): Record<string, unknown> {
  return Object.entries(schema).reduce<Record<string, unknown>>(
    (acc, [key, branch]) => {
      const branchMapping = mapping?.[key];
      acc[key] = buildDefaultValueFromMapping(branch, branchMapping);
      return acc;
    },
    {},
  );
}

function buildDefaultValueFromMapping(
  schema: SagaSchema,
  mappingValue?: SagaListenerMappingValue,
): unknown {
  if (typeof mappingValue === "undefined") {
    return buildDefaultValue(schema);
  }

  if (isPrimitiveSchema(schema)) {
    return normalizePrimitiveMappingValue(mappingValue, schema);
  }

  if (isSchemaArray(schema)) {
    const template = schema[0];
    if (!template) {
      return [];
    }

    if (isMappingContainer(mappingValue)) {
      if (isSchemaObject(template)) {
        return [
          buildValuesFromMappingRecord(template, mappingValue.map),
        ];
      }
      return [buildDefaultValue(template)];
    }

    return [buildDefaultValueFromMapping(template, mappingValue)];
  }

  if (isSchemaObject(schema)) {
    const record = resolveMappingRecord(mappingValue);
    if (!record) {
      return buildDefaultValuesFromObject(schema);
    }
    return buildValuesFromMappingRecord(schema, record);
  }

  return buildDefaultValue(schema);
}

function normalizePrimitiveMappingValue(
  value: SagaListenerMappingValue,
  schemaType: SagaSchemaPrimitive,
): string | number {
  const literalValue = getLiteralMappingValue(value);
  if (schemaType === "number") {
    if (typeof literalValue === "number") {
      return literalValue;
    }
    if (
      typeof literalValue === "string" &&
      literalValue.trim().length > 0
    ) {
      const numericValue = Number(literalValue);
      if (!Number.isNaN(numericValue)) {
        return numericValue;
      }
    }
    return "";
  }

  if (
    typeof literalValue === "string" ||
    typeof literalValue === "number" ||
    typeof literalValue === "boolean"
  ) {
    return `${literalValue}`;
  }

  return "";
}

function getLiteralMappingValue(
  value: SagaListenerMappingValue,
): unknown {
  if (isMappingConst(value)) {
    return value.const;
  }
  if (isMappingReference(value)) {
    return value.from;
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  return undefined;
}

function resolveMappingRecord(
  value: SagaListenerMappingValue,
): SagaListenerMapping | undefined {
  if (isMappingContainer(value)) {
    return value.map;
  }
  if (isPlainRecord(value)) {
    return value as SagaListenerMapping;
  }
  return undefined;
}

function isMappingConst(
  value: SagaListenerMappingValue,
): value is { const: string | number | boolean } {
  return (
    isPlainRecord(value) &&
    "const" in value &&
    (typeof value.const === "string" ||
      typeof value.const === "number" ||
      typeof value.const === "boolean")
  );
}

function isMappingReference(
  value: SagaListenerMappingValue,
): value is { from: string } {
  return isPlainRecord(value) && typeof value.from === "string";
}

function isMappingContainer(
  value: SagaListenerMappingValue,
): value is { map: SagaListenerMapping } {
  return (
    isPlainRecord(value) &&
    "map" in value &&
    isPlainRecord(value.map)
  );
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
