import styled from "styled-components";
import Colors from "../../styles/Colors";

export const Form = styled.form`
  padding: 1.75rem;
  border-radius: 16px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 1.5rem;
`;

export const EventTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

export const FieldsGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

export const InputGroup = styled.div`
  display: grid;
  gap: 0.35rem;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${Colors.secondary};
`;

export const Input = styled.input`
  border: 1px solid rgba(15, 23, 42, 0.2);
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${Colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  &:disabled {
    background: ${Colors.gray100};
    cursor: not-allowed;
  }
`;

export const Fieldset = styled.div`
  border: 1px dashed rgba(15, 23, 42, 0.15);
  border-radius: 12px;
  padding: 1rem;
  display: grid;
  gap: 1rem;
`;

export const FieldsetTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: ${Colors.secondary};
`;

export const ArrayContainer = styled.div`
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 12px;
  padding: 1rem;
  display: grid;
  gap: 1rem;
`;

export const ArrayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const ArrayItems = styled.div`
  display: grid;
  gap: 1rem;
`;

export const ArrayItem = styled.div`
  border: 1px dashed rgba(15, 23, 42, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
`;

export const ArrayItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: ${Colors.secondary};
`;

export const IconButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 0.45rem 0.85rem;
  background: ${Colors.primary};
  color: #fff;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${Colors.primaryDark};
  }

  &:disabled {
    background: ${Colors.gray300};
    cursor: not-allowed;
  }
`;

export const RemoveButton = styled(IconButton)`
  background: ${Colors.danger};

  &:hover:not(:disabled) {
    background: #b91c1c;
  }
`;

export const EmptyState = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${Colors.gray500};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const SubmitButton = styled.button`
  min-width: 160px;
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: ${Colors.primary};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: ${Colors.primaryDark};
  }

  &:disabled {
    background: ${Colors.gray300};
    cursor: not-allowed;
  }
`;

export const Banner = styled.div<{ intent: "success" | "error" }>`
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid
    ${({ intent }) =>
      intent === "success" ? Colors.success : Colors.danger};
  background: ${({ intent }) =>
    intent === "success"
      ? "rgba(22, 163, 74, 0.12)"
      : "rgba(220, 38, 38, 0.12)"};
  color: ${({ intent }) =>
    intent === "success" ? Colors.success : Colors.danger};
  display: grid;
  gap: 0.35rem;
`;
