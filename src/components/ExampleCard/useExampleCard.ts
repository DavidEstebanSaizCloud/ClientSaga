import { useMemo } from "react";
import type { ReactNode } from "react";

export interface ExampleCardProps {
  title: string;
  description?: string;
  footer?: ReactNode;
}

export function useExampleCard(props: ExampleCardProps) {
  const { title, description = "", footer } = props;

  const descriptor = useMemo(
    () => ({
      isVerbose: description.length > 140,
    }),
    [description],
  );

  return {
    title,
    description,
    footer,
    ...descriptor,
  };
}
