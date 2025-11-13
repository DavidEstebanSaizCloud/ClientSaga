import { Fragment } from "react";
import type { FieldArrayPath, Path } from "react-hook-form";
import { useFieldArray, useFormContext } from "react-hook-form";
import type {
  SagaSchema,
  SagaSchemaArray,
  SagaSchemaObject,
} from "../../common/types/sagaEvent";
import type { SagaFormValues } from "../../common/types/sagaEvent";
import {
  buildDefaultValue,
  isPrimitiveSchema,
  isSchemaArray,
  isSchemaObject,
} from "../../common/utils/sagaSchema";
import * as S from "./styled";
import {
  useSagaPayloadForm,
  type SagaPayloadFormProps,
} from "./useSagaPayloadForm";

export default function SagaPayloadForm(props: SagaPayloadFormProps) {
  const { banner, schema, onSubmit, eventName, isLocked } =
    useSagaPayloadForm(props);
  const { formState } = useFormContext<SagaFormValues>();

  return (
    <Fragment>
      <S.Form onSubmit={onSubmit} aria-live="polite">
        <div>
          <S.EventTitle>{eventName}</S.EventTitle>
        </div>
        <FieldsRenderer schema={schema} baseName="" disabled={isLocked} />
        <S.Actions>
          <S.SubmitButton
            type="submit"
            disabled={isLocked || formState.isSubmitting}
          >
            Enviar
          </S.SubmitButton>
        </S.Actions>
      </S.Form>
      {banner && (
        <S.Banner intent={banner.intent} role="status">
          <strong>{banner.message}</strong>
          {banner.detail && <span>{banner.detail}</span>}
        </S.Banner>
      )}
    </Fragment>
  );
}

interface FieldsRendererProps {
  schema: SagaSchemaObject;
  baseName: string;
  disabled: boolean;
}

function FieldsRenderer({ schema, baseName, disabled }: FieldsRendererProps) {
  return (
    <S.FieldsGrid>
      {Object.entries(schema).map(([key, branch]) => {
        const fieldName = baseName ? `${baseName}.${key}` : key;
        return (
          <SchemaField
            key={fieldName}
            name={fieldName}
            label={key}
            schema={branch}
            disabled={disabled}
          />
        );
      })}
    </S.FieldsGrid>
  );
}

interface SchemaFieldProps {
  name: string;
  label: string;
  schema: SagaSchema;
  disabled: boolean;
}

function SchemaField({ name, label, schema, disabled }: SchemaFieldProps) {
  if (isPrimitiveSchema(schema)) {
    return (
      <PrimitiveField
        name={name}
        label={label}
        type={schema}
        disabled={disabled}
      />
    );
  }

  if (isSchemaArray(schema)) {
    return (
      <ArrayField
        name={name}
        label={label}
        schema={schema}
        disabled={disabled}
      />
    );
  }

  if (isSchemaObject(schema)) {
    return (
      <S.Fieldset>
        <S.FieldsetTitle>{label}</S.FieldsetTitle>
        <FieldsRenderer schema={schema} baseName={name} disabled={disabled} />
      </S.Fieldset>
    );
  }

  return null;
}

interface PrimitiveFieldProps {
  name: string;
  label: string;
  type: "string" | "number";
  disabled: boolean;
}

function PrimitiveField({
  name,
  label,
  type,
  disabled,
}: PrimitiveFieldProps) {
  const { register } = useFormContext<SagaFormValues>();
  const inputId = name.replace(/[^a-zA-Z0-9]/g, "-");
  const path = name as Path<SagaFormValues>;

  return (
    <S.InputGroup>
      <S.Label htmlFor={inputId}>{label}</S.Label>
      <S.Input
        id={inputId}
        type={type === "number" ? "number" : "text"}
        inputMode={type === "number" ? "decimal" : undefined}
        disabled={disabled}
        {...register(path, type === "number" ? { valueAsNumber: true } : {})}
      />
    </S.InputGroup>
  );
}

interface ArrayFieldProps {
  name: string;
  label: string;
  schema: SagaSchemaArray;
  disabled: boolean;
}

function ArrayField({ name, label, schema, disabled }: ArrayFieldProps) {
  const template = schema[0] ?? "string";
  const { control } = useFormContext<SagaFormValues>();
  const fieldArray = useFieldArray<SagaFormValues>({
    control,
    name: name as FieldArrayPath<SagaFormValues>,
  });

  const handleAdd = () => {
    fieldArray.append(buildDefaultValue(template));
  };

  const handleRemove = (index: number) => {
    fieldArray.remove(index);
  };

  return (
    <S.ArrayContainer>
      <S.ArrayHeader>
        <S.FieldsetTitle>{label}</S.FieldsetTitle>
        <S.IconButton type="button" onClick={handleAdd} disabled={disabled}>
          Añadir
        </S.IconButton>
      </S.ArrayHeader>
      <S.ArrayItems>
        {fieldArray.fields.length === 0 && (
          <S.EmptyState>Sin elementos registrados</S.EmptyState>
        )}
        {fieldArray.fields.map((item, index) => {
          const itemName = `${name}.${index}`;
          return (
            <S.ArrayItem key={item.id}>
              <S.ArrayItemHeader>
                <span>Elemento {index + 1}</span>
                <S.RemoveButton
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                >
                  Eliminar
                </S.RemoveButton>
              </S.ArrayItemHeader>

              {isPrimitiveSchema(template) && (
                <PrimitiveField
                  name={itemName}
                  label={label}
                  type={template}
                  disabled={disabled}
                />
              )}

              {isSchemaObject(template) && (
                <FieldsRenderer
                  schema={template}
                  baseName={itemName}
                  disabled={disabled}
                />
              )}

              {isSchemaArray(template) && (
                <ArrayField
                  name={itemName}
                  label={label}
                  schema={template}
                  disabled={disabled}
                />
              )}
            </S.ArrayItem>
          );
        })}
      </S.ArrayItems>
    </S.ArrayContainer>
  );
}
