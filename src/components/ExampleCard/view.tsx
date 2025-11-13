import * as S from "./styled";
import { useExampleCard, type ExampleCardProps } from "./useExampleCard";

export default function ExampleCard(props: ExampleCardProps) {
  const { title, description, footer, isVerbose } = useExampleCard(props);

  return (
    <S.Card aria-label={title} className="card-shadow">
      <S.Title>{title}</S.Title>
      <S.Desc>
        {description}
        {isVerbose ? "…" : ""}
      </S.Desc>
      {footer && <S.Footer>{footer}</S.Footer>}
    </S.Card>
  );
}
