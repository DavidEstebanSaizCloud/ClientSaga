import { useMemo, type PropsWithChildren } from "react";
import { initializeRandomTheme } from "../../styles/themeManager";
import type { ThemeDefinition } from "../../styles/themes";
import * as S from "./styled";

export interface LayoutProps {
  companyName?: string;
  logoSrc?: string;
  logoAlt?: string;
}

export default function Layout({
  children,
  companyName,
  logoSrc,
  logoAlt,
}: PropsWithChildren<LayoutProps>) {
  const theme: ThemeDefinition = useMemo(() => initializeRandomTheme(), []);
  const domainFromHost = useMemo(() => {
    if (typeof window !== "undefined" && window.location?.hostname) {
      const [first] = window.location.hostname.split(".");
      if (first) {
        return first;
      }
    }
    return null;
  }, []);

  const effectiveCompanyName = domainFromHost ?? companyName ?? theme.companyName;
  const effectiveLogoSrc = logoSrc ?? theme.logo.src;
  const effectiveLogoAlt = logoAlt ?? theme.logo.alt;
  const palette = theme.layout;

  return (
    <S.Wrapper $palette={palette}>
      <S.Header $palette={palette}>
        <S.Logo src={effectiveLogoSrc} alt={effectiveLogoAlt} $palette={palette} />
        <S.CompanyName $palette={palette}>{effectiveCompanyName}</S.CompanyName>
      </S.Header>

      <S.Content $palette={palette}>{children}</S.Content>
    </S.Wrapper>
  );
}
