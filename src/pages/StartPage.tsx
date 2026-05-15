import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../auth/AuthContext";

const Hero = styled.section`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.md};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

const HeroImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

const HeroBody = styled.div`
  padding: ${({ theme }) => theme.spacing(8)};
  text-align: center;
`;

const Title = styled.h1`
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  line-height: 1.2;
`;

const Lead = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing(6)} 0;
`;

const CtaRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  justify-content: center;
  flex-wrap: wrap;
`;

const CtaButton = styled(Link)<{ $variant?: "primary" | "ghost" }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(6)}`};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  text-decoration: none;
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "ghost" ? theme.colors.border : "transparent"};
  background: ${({ theme, $variant }) =>
    $variant === "ghost" ? "transparent" : theme.colors.primary};
  color: ${({ theme, $variant }) =>
    $variant === "ghost" ? theme.colors.text : "white"};
  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === "ghost"
        ? theme.colors.surfaceAlt
        : theme.colors.primaryDark};
  }
`;

export function StartPage() {
  const { profile } = useAuth();
  const greeting = profile?.name ? `Hej ${profile.name}!` : "Hej!";

  return (
    <>
      <Hero>
        <HeroImage
          src="/lagbild.jpg"
          alt="Kompisgänget som svenska landslaget"
        />
        <HeroBody>
          <Title>
            {greeting} Välkommen till kompisbet på Fotbolls-VM 2026!
          </Title>
          <Lead>
            Tippa resultatet på alla matcher. Den som plockar flest poäng tar
            hem potten.
          </Lead>
          <CtaRow>
            <CtaButton to="/tipsa">Börja tippa →</CtaButton>
            <CtaButton to="/regler" $variant="ghost">
              Läs reglerna
            </CtaButton>
          </CtaRow>
        </HeroBody>
      </Hero>
    </>
  );
}
