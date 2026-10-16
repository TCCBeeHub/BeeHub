import styled from 'styled-components';

export const BackLink = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 18px;

  &:hover {
    color: ${({ theme }) => theme.colors.accentBright};
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

export const ColorDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex: 0 0 auto;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
`;

export const SectionLabel = styled.h4`
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 8px;
  margin-top: 18px;

  &:first-child {
    margin-top: 0;
  }
`;

export const BodyText = styled.p`
  font-size: 0.88rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const Tag = styled.span`
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const TagRemovable = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 6px 5px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const TagRemoveButton = styled.button`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgSurfaceRaised};
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export const AddMemberRow = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

export const AddMemberInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.8rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const AddMemberButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

export const LinksRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const LinkItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: border-color 0.15s ease;

  svg {
    color: ${({ theme }) => theme.colors.accentBright};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

export const LinkLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// --- comentários ---

export const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  max-height: 220px;
  overflow-y: auto;
`;

export const CommentItem = styled.div`
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px 14px;
`;

export const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentBright};
  margin-bottom: 4px;
`;

export const CommentDate = styled.span`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textFaint};
`;

export const CommentText = styled.p`
  font-size: 0.84rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.5;
`;

export const EmptyComment = styled.p`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textFaint};
  margin-bottom: 16px;
`;

export const CommentForm = styled.form`
  display: flex;
  gap: 8px;
`;

export const CommentInput = styled.input`
  flex: 1;
  padding: 11px 14px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.85rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const SendButton = styled.button`
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;
