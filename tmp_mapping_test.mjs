// Temporary debug script removed.

function isPrimitiveSchema(schema) {
  return schema === "string" || schema === "number";
}
function isSchemaArray(schema) {
  return Array.isArray(schema);
}
function isSchemaObject(schema) {
  return typeof schema === "object" && schema !== null && !Array.isArray(schema);
}
function buildDefaultValuesFromObject(schema) {
  return Object.entries(schema).reduce((acc, [key, branch]) => {
    acc[key] = buildDefaultValue(branch);
    return acc;
  }, {});
}
function buildDefaultValue(schema) {
  if (isPrimitiveSchema(schema)) return "";
  if (isSchemaArray(schema)) {
    if (!schema.length) return [];
    return [buildDefaultValue(schema[0])];
  }
  if (isSchemaObject(schema)) {
    return buildDefaultValuesFromObject(schema);
  }
  return null;
}
function buildDefaultValuesFromMapping(schema, mapping) {
  if (!mapping) {
    return buildDefaultValuesFromObject(schema);
  }
  return buildValuesFromMappingRecord(schema, mapping);
}
function buildValuesFromMappingRecord(schema, mapping) {
  return Object.entries(schema).reduce((acc, [key, branch]) => {
    const branchMapping = mapping?.[key];
    acc[key] = buildDefaultValueFromMapping(branch, branchMapping);
    return acc;
  }, {});
}
function buildDefaultValueFromMapping(schema, mappingValue) {
  if (typeof mappingValue === "undefined") {
    return buildDefaultValue(schema);
  }
  if (isPrimitiveSchema(schema)) {
    return normalizePrimitiveMappingValue(mappingValue, schema);
  }
  if (isSchemaArray(schema)) {
    const template = schema[0];
    if (!template) return [];
    if (isMappingContainer(mappingValue)) {
      if (isSchemaObject(template)) {
        return [buildValuesFromMappingRecord(template, mappingValue.map)];
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
function normalizePrimitiveMappingValue(value, schemaType) {
  const literalValue = getLiteralMappingValue(value);
  if (schemaType === "number") {
    if (typeof literalValue === "number") {
      return literalValue;
    }
    if (typeof literalValue === "string" && literalValue.trim().length > 0) {
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
function getLiteralMappingValue(value) {
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
function resolveMappingRecord(value) {
  if (isMappingContainer(value)) {
    return value.map;
  }
  if (isPlainRecord(value)) {
    return value;
  }
  return undefined;
}
function isMappingConst(value) {
  return isPlainRecord(value) && "const" in value;
}
function isMappingReference(value) {
  return isPlainRecord(value) && typeof value.from === "string";
}
function isMappingContainer(value) {
  return isPlainRecord(value) && "map" in value && isPlainRecord(value.map);
}
function isPlainRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findEventMapping(domains, eventName) {
  for (const domain of domains) {
    if (!domain.listeners) continue;
    for (const listener of domain.listeners) {
      for (const action of listener.actions) {
        if (action.type === "emit" && action.event === eventName) {
          return action.mapping;
        }
      }
    }
  }
  return undefined;
}

for (const domain of mockSagaFlow.domains) {
  for (const event of domain.events) {
    const mapping = findEventMapping(mockSagaFlow.domains, event.name);
    console.log(domain.id, event.name, Boolean(mapping));
  }
}
