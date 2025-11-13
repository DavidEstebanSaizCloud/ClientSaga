import ExampleCard from "../../components/ExampleCard/view";
import { useHome } from "./useHome";
import * as S from "./styled";

export default function HomePage() {
  const { hero, metrics, highlightedUsers, health, isLoading } = useHome();

  return (
    <S.Page>
      <S.Hero>
        <S.HeroTitle>{hero}</S.HeroTitle>
        <p>Monitoriza usuarios, salud del producto y acciones recomendadas.</p>
        <S.HealthBadge intent={health}>Product health: {health}</S.HealthBadge>
      </S.Hero>

      <S.Grid>
        <ExampleCard
          title="Product health"
          description={
            metrics
              ? `NPS ${metrics.netPromoterScore} · Churn ${metrics.churnRate}%`
              : "Sin datos todavía"
          }
        />

        <ExampleCard
          title="Usuarios destacados"
          description={
            highlightedUsers.length
              ? highlightedUsers.map((user) => user.name).join(", ")
              : "Sin usuarios destacados"
          }
        />

        <ExampleCard
          title="Estado"
          description={isLoading ? "Actualizando métricas" : "Todo sincronizado"}
        />
      </S.Grid>
    </S.Page>
  );
}
