import styled from "styled-components";
import Colors from "../../styles/Colors";

export const Timeline = styled.section`
  padding: 1.5rem;
  border-radius: 16px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 1.5rem;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
`;

export const Header = styled.header`
  display: grid;
  gap: 0.5rem;
`;

export const DomainMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: ${Colors.gray500};
`;

export const Progress = styled.span`
  font-weight: 600;
  color: ${Colors.secondary};
`;

export const List = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
`;

export const EventItem = styled.li`
  position: relative;
  padding-left: 2.25rem;
  min-height: 2.75rem;
  display: grid;
  gap: 0.25rem;

  &::before {
    content: "";
    position: absolute;
    left: 0.85rem;
    top: 0.35rem;
    bottom: -0.35rem;
    width: 2px;
    background: rgba(100, 116, 139, 0.3);
  }

  &:last-child::before {
    display: none;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0.35rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 999px;
    border: 2px solid ${Colors.gray300};
    background: #fff;
  }

  &[data-active="true"]::after {
    border-color: ${Colors.primary};
    background: ${Colors.primary};
  }
`;

export const EventName = styled.span`
  font-weight: 600;
  color: ${Colors.secondary};
`;

export const ActiveBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${Colors.primary};
`;
