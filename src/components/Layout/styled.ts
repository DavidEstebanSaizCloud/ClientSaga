import styled from "styled-components";
import type { LayoutPalette } from "../../styles/themes";

export const Wrapper = styled.div<{ $palette: LayoutPalette }>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: ${({ $palette }) => $palette.textPrimary};
  background: linear-gradient(
    180deg,
    ${({ $palette }) => $palette.backgroundStart} 0%,
    ${({ $palette }) => $palette.backgroundEnd} 100%
  );
`;

export const Header = styled.header<{ $palette: LayoutPalette }>`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: ${({ $palette }) => $palette.headerBg};
  border-bottom: 1px solid ${({ $palette }) => $palette.headerBorder};
  box-shadow: ${({ $palette }) => $palette.surfaceShadow};
`;

export const Logo = styled.img<{ $palette: LayoutPalette }>`
  width: 52px;
  height: 52px;
  object-fit: contain;
  border-radius: 12px;
  background: ${({ $palette }) => $palette.contentBg};
  border: 2px solid ${({ $palette }) => $palette.accent};
`;

export const CompanyName = styled.span<{ $palette: LayoutPalette }>`
  font-size: clamp(1.25rem, 2vw, 1.6rem);
  font-weight: 700;
  color: ${({ $palette }) => $palette.accent};
  letter-spacing: 0.04em;
`;

export const Content = styled.main<{ $palette: LayoutPalette }>`
  flex: 1;
  min-height: 0;
  padding: 2rem;
  overflow-y: auto;
  background: ${({ $palette }) => $palette.contentBg};
  color: ${({ $palette }) => $palette.textSecondary};
  box-shadow: none;
`;
