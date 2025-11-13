import { useMemo } from "react";

export interface SagaTimelineEvent {
  name: string;
  isActive: boolean;
}

export interface SagaTimelineProps {
  domainId?: string;
  queue?: string;
  events: SagaTimelineEvent[];
}

export function useSagaTimeline(props: SagaTimelineProps) {
  const activeIndex = useMemo(
    () => props.events.findIndex((event) => event.isActive),
    [props.events],
  );

  return {
    ...props,
    activeIndex,
  };
}
