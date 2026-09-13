import styled from "styled-components";

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

export const SubTitle = styled.p`
  font-size: 0.74rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;
export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const FileCard = styled.div`
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;
export const FileInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  > div:last-child {
    display: flex;
    flex-direction: column;
    min-width: 0;
    strong {
      font-size: 0.8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    span {
      font-size: 0.68rem;
      color: ${({ theme }) => theme.colors.textMuted};
      margin-top: 3px;
      line-height: 1.45;
    }
  }
`;
export const FileIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.bgSurfaceRaised};
  color: ${({ theme }) => theme.colors.accentBright};
  flex: 0 0 auto;
`;
export const FileButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 10px;
`;
export const FileButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 9px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgSurfaceRaised};
  font-size: 0.69rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;
export const FileDelete = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 9px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(248, 113, 113, 0.1);
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.69rem;
`;
export const DeliverySummary = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  color: ${({ theme }) => theme.colors.success};
  > div {
    display: flex;
    flex-direction: column;
    strong {
      font-size: 0.78rem;
      color: ${({ theme }) => theme.colors.textPrimary};
    }
    span {
      font-size: 0.67rem;
      color: ${({ theme }) => theme.colors.textMuted};
      margin-top: 3px;
    }
  }
`;
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(5, 2, 12, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 400;
  padding: 20px;
`;
export const PreviewModal = styled.div`
  width: min(900px, 100%);
  height: min(760px, 90vh);
  background: ${({ theme }) => theme.colors.bgSurfaceRaised};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
export const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 17px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  strong {
    display: block;
    font-size: 0.82rem;
  }
  span {
    display: block;
    font-size: 0.66rem;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: 3px;
  }
  button {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;
export const PreviewBody = styled.div`
  flex: 1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;
export const PreviewFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 13px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
export const PreviewNote = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.68rem;
`;
