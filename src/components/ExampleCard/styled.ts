import styled from "styled-components";
import Colors from "../../styles/Colors";

export const Card = styled.article`
  display: grid;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #fff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
`;

export const Desc = styled.p`
  margin: 0;
  color: ${Colors.gray500};
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;
