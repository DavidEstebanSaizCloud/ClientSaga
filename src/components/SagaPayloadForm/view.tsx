import { Fragment } from "react";
import type { FieldArrayPath, Path, RegisterOptions } from "react-hook-form";
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
import { useSagaPayloadForm, type SagaPayloadFormProps } from "./useSagaPayloadForm";

export default function SagaPayloadForm(props: SagaPayloadFormProps) {
  const { banner, schema, onSubmit, eventName, isLocked, successState, isRefreshing } =
    useSagaPayloadForm(props);
  const { formState } = useFormContext<SagaFormValues>();

  if (successState) {
    return (
      <S.SuccessState role="status" aria-live="polite">
        <S.SuccessIcon aria-hidden="true">✓</S.SuccessIcon>
        <S.SuccessTitle>{successState.title}</S.SuccessTitle>
        <S.SuccessMessage>{successState.description}</S.SuccessMessage>
      </S.SuccessState>
    );
  }

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
            disabled={isLocked}
            data-loading={formState.isSubmitting}
          >
            <span>Enviar</span>
            {formState.isSubmitting && <S.Spinner aria-hidden="true" />}
          </S.SubmitButton>
        </S.Actions>
      </S.Form>
      {banner && (
        <S.ErrorModal role="alert" aria-live="assertive">
          <S.Banner intent={banner.intent}>
            <strong>{banner.message}</strong>
            {banner.detail && <span>{banner.detail}</span>}
          </S.Banner>
        </S.ErrorModal>
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
    return <PrimitiveField name={name} label={label} type={schema} disabled={disabled} />;
  }

  if (isSchemaArray(schema)) {
    return <ArrayField name={name} label={label} schema={schema} disabled={disabled} />;
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

function PrimitiveField({ name, label, type, disabled }: PrimitiveFieldProps) {
  const { register, getFieldState, formState } = useFormContext<SagaFormValues>();
  const inputId = name.replace(/[^a-zA-Z0-9]/g, "-");
  const fieldState = getFieldState(name, formState);
  const errorMessage = fieldState.error?.message;
  const isInvalid = Boolean(errorMessage);

  const registerOptions: RegisterOptions<SagaFormValues, Path<SagaFormValues>> = type ===
  "number"
    ? {
        valueAsNumber: true,
        required: "Campo obligatorio",
        validate: (value: unknown) => {
          const numericValue = typeof value === "number" ? value : Number(value);
          return !Number.isNaN(numericValue) ? true : "Introduce un número válido";
        },
      }
    : {
        required: "Campo obligatorio",
      };

  return (
    <S.InputGroup data-invalid={isInvalid || undefined}>
      <S.Label htmlFor={inputId}>{label}</S.Label>
      <S.Input
        id={inputId}
        type={type === "number" ? "number" : "text"}
        inputMode={type === "number" ? "decimal" : undefined}
        disabled={disabled}
        data-invalid={isInvalid || undefined}
        {...register(name, registerOptions)}
      />
      {errorMessage && <S.ErrorText>{errorMessage}</S.ErrorText>}
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
    if (disabled) {
      return;
    }
    fieldArray.append(buildDefaultValue(template));
  };

  const handleRemove = (index: number) => {
    if (disabled) {
      return;
    }
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
