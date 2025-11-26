import styled from "styled-components";
import Colors from "../../styles/Colors";

export const Timeline = styled.section`
  padding: 1.25rem;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #d0d7de;
  display: grid;
  gap: 1.25rem;
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
  padding-left: 2rem;
  min-height: 2.5rem;
  display: grid;
  gap: 0.25rem;

  &::before {
    content: "";
    position: absolute;
    left: 0.7rem;
    top: 0.35rem;
    bottom: -0.35rem;
    width: 2px;
    background: #d0d7de;
  }

  &:last-child::before {
    display: none;
  }

  &::after {
    content: "";
    position: absolute;
    left: -0.15rem;
    top: 0.35rem;
    width: 1.25rem;
    height: 1.25rem;
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
