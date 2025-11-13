import * as S from "./styled";
import {
  useSagaTimeline,
  type SagaTimelineProps,
} from "./useSagaTimeline";

export default function SagaTimeline(props: SagaTimelineProps) {
  const { domainId, queue, events, activeIndex } = useSagaTimeline(props);

  return (
    <S.Timeline aria-label="Eventos del dominio">
      <S.Header>
        <S.DomainMeta>
          <span>Dominio: {domainId ?? "—"}</span>
          <span>Queue: {queue ?? "—"}</span>
        </S.DomainMeta>
        {events.length > 0 && (
          <S.Progress>
            Evento {activeIndex + 1} de {events.length}
          </S.Progress>
        )}
      </S.Header>

      <S.List>
        {events.map((event) => (
          <S.EventItem key={event.name} data-active={event.isActive}>
            <S.EventName>{event.name}</S.EventName>
            {event.isActive && (
              <S.ActiveBadge>Evento activo</S.ActiveBadge>
            )}
          </S.EventItem>
        ))}
      </S.List>
    </S.Timeline>
  );
}
