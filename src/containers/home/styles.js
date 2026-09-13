import styled from "styled-components";

export const Page = styled.div`
  max-width: 1180px;
  margin: 0 auto;
`;
export const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.6fr 0.8fr;
  gap: 24px;
  padding: 28px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.bgSurface},
    ${({ theme }) => theme.colors.bgSurfaceAlt}
  );
  margin-bottom: 26px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
export const HeroText = styled.div``;
export const Kicker = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.accentBright};
`;
export const HeroTitle = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1.05;
  margin: 10px 0 12px;
`;
export const HeroParagraph = styled.p`
  max-width: 760px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.65;
  font-size: 0.92rem;
`;
export const HeroBadge = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 22px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgSurfaceRaised};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  span {
    font-weight: 700;
    font-size: 1rem;
  }
  small {
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: 7px;
    line-height: 1.5;
  }
`;
export const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
`;
export const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.bgVoid};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.76rem;
  svg {
    color: ${({ theme }) => theme.colors.accentBright};
  }
  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  @media (max-width: 820px) {
    align-items: stretch;
    flex-direction: column;
  }
`;
export const SectionKicker = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textFaint};
`;
export const SearchWrap = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 380px;
  width: 100%;
  padding: 10px 13px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.bgSurface};
  color: ${({ theme }) => theme.colors.textMuted};
  input {
    flex: 1;
    border: 0;
    background: transparent;
    outline: 0;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
export const Feed = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
`;
export const Post = styled.article`
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px;
`;
export const PostTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  > div {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
    strong {
      font-size: 0.85rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    span {
      font-size: 0.72rem;
      color: ${({ theme }) => theme.colors.textFaint};
      margin-top: 2px;
    }
  }
`;
export const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
`;
export const Status = styled.span`
  font-size: 0.66rem;
  font-weight: 700;
  padding: 5px 8px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ $done, theme }) =>
    $done ? "rgba(52,211,153,.12)" : theme.colors.bgSurfaceAlt};
  color: ${({ $done, theme }) =>
    $done ? theme.colors.success : theme.colors.warning};
`;
export const PostTitle = styled.h3`
  font-size: 1rem;
  margin: 18px 0 7px;
`;
export const PostText = styled.p`
  font-size: 0.8rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
`;
export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 14px 0;
`;
export const Tag = styled.span`
  font-size: 0.68rem;
  padding: 5px 9px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  color: ${({ theme }) => theme.colors.textMuted};
`;
export const PostFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  button,
  a {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
  button:hover,
  a:hover {
    color: ${({ theme }) => theme.colors.accentBright};
  }
`;
export const PostLink = styled.a`
  align-items: center;
`;
export const Empty = styled.div`
  padding: 30px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textFaint};
  grid-column: 1/-1;
`;
