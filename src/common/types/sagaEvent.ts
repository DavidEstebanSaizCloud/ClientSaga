export type SagaSchemaPrimitive = "string" | "number";

export type SagaSchema =
  | SagaSchemaPrimitive
  | SagaSchemaObject
  | SagaSchemaArray;

export type SagaSchemaObject = Record<string, SagaSchema>;

export type SagaSchemaArray = SagaSchema[];

export interface SagaEventDefinition {
  name: string;
  payloadSchema: SagaSchemaObject;
}

export interface SagaDomain {
  id: string;
  queue: string;
  events: SagaEventDefinition[];
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
