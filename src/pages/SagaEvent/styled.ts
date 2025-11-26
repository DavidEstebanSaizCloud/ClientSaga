import styled from "styled-components";
import Colors from "../../styles/Colors";

export const Page = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  display: grid;
  gap: 2rem;
`;

export const Header = styled.header`
  display: grid;
  gap: 0.5rem;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  color: ${Colors.secondary};
`;

export const Subtitle = styled.p`
  margin: 0;
  color: ${Colors.gray500};
  font-size: 1rem;
`;

export const Layout = styled.section`
  display: grid;
  gap: 2rem;
  grid-template-columns: minmax(260px, 1fr) minmax(0, 2fr);
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const StateCard = styled.article`
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #fff;
  text-align: center;
  font-size: 1rem;
  color: ${Colors.secondary};
`;

export const Highlight = styled.span`
  font-weight: 600;
  color: ${Colors.primary};
`;
