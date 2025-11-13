import styled from "styled-components";
import Colors from "../../styles/Colors";

export const Page = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 4rem 1rem;
  display: grid;
  gap: 2rem;
`;

export const Hero = styled.header`
  display: grid;
  gap: 0.75rem;
`;

export const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
`;

export const HealthBadge = styled.span<{ intent: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  background: ${({ intent }) =>
    intent === "excellent"
      ? Colors.success
      : intent === "good"
        ? Colors.primary
        : Colors.warning};
`;

export const Grid = styled.section`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;
