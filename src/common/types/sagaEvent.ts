export type SagaSchemaPrimitive = "string" | "number";

export type SagaSchema =
  | SagaSchemaPrimitive
  | SagaSchemaObject
  | SagaSchemaArray;

export interface SagaSchemaObject {
  [key: string]: SagaSchemaPrimitive | SagaSchemaObject | SagaSchemaArray;
}

export type SagaSchemaArray =
  | SagaSchemaPrimitive[]
  | SagaSchemaObject[];

export interface SagaEventDefinition {
  name: string;
  payloadSchema: SagaSchemaObject;
}

export interface SagaDomain {
  id: string;
  queue: string;
  events: SagaEventDefinition[];
  listeners?: SagaListener[];
}

export interface SagaFlow {
  name: string;
  version: number;
  event: string;
  domains: SagaDomain[];
}

export interface SagaEventSubmission {
  domainId: string;
  eventName: string;
  payload: Record<string, unknown>;
}

export type SagaFormValues = Record<string, unknown>;

export interface SagaListener {
  id: string;
  delayMs: number;
  on: {
    event: string;
  };
  actions: SagaListenerAction[];
}

export type SagaListenerAction =
  | SagaListenerSetStateAction
  | SagaListenerEmitAction;

export interface SagaListenerSetStateAction {
  type: "set-state";
  status: string;
}

export interface SagaListenerEmitAction {
  type: "emit";
  event: string;
  toDomain: string;
  mapping: SagaListenerMapping;
}

export type SagaListenerMapping = Record<string, SagaListenerMappingValue>;

export type SagaListenerMappingValue =
  | string
  | number
  | boolean
  | SagaMappingConst
  | SagaMappingReference
  | SagaMappingContainer;

export interface SagaMappingConst {
  const: string | number | boolean;
}

export interface SagaMappingReference {
  from: string;
}

export interface SagaMappingContainer {
  map: SagaListenerMapping;
  objectFrom?: string;
  arrayFrom?: string;
}
