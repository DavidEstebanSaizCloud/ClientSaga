import styled, { keyframes } from "styled-components";
import Colors from "../../styles/Colors";

export const Form = styled.form`
  padding: 1.5rem;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #d0d7de;
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

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${Colors.secondary};
`;

export const InputGroup = styled.div`
  display: grid;
  gap: 0.35rem;

  &[data-invalid="true"] ${Label} {
    color: ${Colors.danger};
  }
`;

export const Input = styled.input`
  border: 1px solid #d0d7de;
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${Colors.primary};
    background: #f6f8fa;
  }

  &[data-invalid="true"] {
    border-color: ${Colors.danger};
    background: rgba(207, 34, 46, 0.05);
  }

  &:disabled {
    background: ${Colors.gray100};
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.span`
  font-size: 0.8rem;
  color: ${Colors.danger};
`;

export const Fieldset = styled.div`
  border: 1px solid #d0d7de;
  border-radius: 10px;
  padding: 1rem;
  background: #f6f8fa;
  display: grid;
  gap: 1rem;
`;

export const FieldsetTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: ${Colors.secondary};
`;

export const ArrayContainer = styled.div`
  border: 1px solid #d0d7de;
  border-radius: 10px;
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
  border: 1px solid #d0d7de;
  border-radius: 8px;
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
  border: 1px solid #d0d7de;
  border-radius: 6px;
  padding: 0.45rem 0.85rem;
  background: #f6f8fa;
  color: ${Colors.secondary};
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #eaeef2;
  }

  &:disabled {
    background: ${Colors.gray100};
    color: ${Colors.gray500};
    cursor: not-allowed;
  }
`;

export const RemoveButton = styled(IconButton)`
  color: ${Colors.danger};
  border-color: ${Colors.danger};
  background: #fff;

  &:hover:not(:disabled) {
    background: rgba(207, 34, 46, 0.06);
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
  border: 1px solid ${Colors.primary};
  border-radius: 10px;
  padding: 0.8rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: ${Colors.primary};
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;

  &:hover:not(:disabled) {
    background: ${Colors.primaryDark};
    border-color: ${Colors.primaryDark};
  }

  &:disabled {
    background: ${Colors.gray300};
    border-color: ${Colors.gray300};
    cursor: not-allowed;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.span`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  animation: ${spin} 0.8s linear infinite;
`;

export const Banner = styled.div<{ intent: "success" | "error" }>`
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid
    ${({ intent }) =>
      intent === "success" ? Colors.success : Colors.danger};
  background: ${({ intent }) =>
    intent === "success"
      ? "rgba(26, 127, 55, 0.08)"
      : "rgba(207, 34, 46, 0.08)"};
  color: ${({ intent }) =>
    intent === "success" ? Colors.success : Colors.danger};
  display: grid;
  gap: 0.35rem;
`;

export const ErrorModal = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

export const SuccessState = styled.section`
  padding: 3rem 2rem;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #d0d7de;
  display: grid;
  gap: 0.75rem;
  justify-items: center;
  text-align: center;
`;

export const SuccessIcon = styled.span`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: rgba(22, 163, 74, 0.12);
  border: 2px solid ${Colors.success};
  color: ${Colors.success};
  font-size: 2rem;
  display: grid;
  place-items: center;
  font-weight: 700;
`;

export const SuccessTitle = styled.h2`
  margin: 0;
  font-size: 2rem;
  color: ${Colors.secondary};
`;

export const SuccessMessage = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${Colors.gray500};
`;

export const PollingRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.85rem;
  border-radius: 12px;
  border: 1px dashed rgba(15, 23, 42, 0.12);
  color: ${Colors.secondary};

  ${Spinner} {
    border-color: rgba(59, 130, 246, 0.25);
    border-top-color: ${Colors.primary};
  }
`;
