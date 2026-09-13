import styled from "styled-components";

export const PageHeader = styled.div`
  margin-bottom: 22px;

  h1 {
    font-size: 1.4rem;
    margin-bottom: 4px;
  }
`;

export const CourseTag = styled.span`
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: ${({ $color }) => $color};
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 22px 24px;
`;

export const CardTitle = styled.h2`
  font-size: 0.95rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textPrimary};

  svg {
    color: ${({ theme }) => theme.colors.accentBright};
  }
`;

/* --- Meu grupo --- */

export const GroupMeta = styled.p`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 12px;
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

/* --- Etapas do TCC --- */

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  overflow: hidden;
  margin-bottom: 6px;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ theme }) => theme.colors.accent};
  transition: width 0.2s ease;
`;

export const ProgressLabel = styled.p`
  font-size: 0.76rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 18px;
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StepRow = styled.button`
  opacity: ${({ $locked }) => ($locked ? 0.5 : 1)};
  cursor: ${({ $locked }) => ($locked ? "not-allowed" : "pointer")};
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  padding: 10px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  }
`;

export const StepCheck = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex: 0 0 auto;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid
    ${({ $done, theme }) =>
      $done ? theme.colors.success : theme.colors.borderStrong};
  background: ${({ $done, theme }) =>
    $done ? theme.colors.success : "transparent"};
  color: ${({ theme }) => theme.colors.bgVoid};
`;

export const StepTitle = styled.span`
  font-size: 0.87rem;
  font-weight: 600;
  color: ${({ $done, theme }) =>
    $done ? theme.colors.textMuted : theme.colors.textPrimary};
  text-decoration: ${({ $done }) => ($done ? "line-through" : "none")};
  display: block;
`;

export const StepDesc = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textFaint};
  display: block;
  margin-top: 2px;
`;

/* --- Entregar ao professor --- */

export const DeliverRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 8px;
`;

export const DeliverField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const DeliverLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const DeliverStatus = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ $sent, theme }) =>
    $sent ? theme.colors.success : theme.colors.textFaint};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
`;

export const DeliverInputRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const DeliverInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.84rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const DeliverButton = styled.button`
  padding: 0 16px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

/* --- Comentários do orientador --- */

export const CommentItem = styled.div`
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px 14px;
  margin-bottom: 10px;
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

export const EmptyText = styled.p`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textFaint};
`;

export const Feedback = styled.div`
  margin: -8px 0 18px;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.8rem;
`;

export const UploadHint = styled.p`
  font-size: 0.78rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: -8px 0 16px;
`;

export const FilePickerRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 8px;
  align-items: center;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const FileChoose = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  padding: 9px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

export const FileName = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const FileActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 7px;
`;

export const FileAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 11px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.75rem;
`;

export const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 11px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(248, 113, 113, 0.1);
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.75rem;
`;

export const PreviewOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(5, 2, 12, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 400;
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
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  strong {
    display: block;
    font-size: 0.82rem;
  }
  span {
    display: block;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.66rem;
  }
  button {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 1.2rem;
  }
`;
export const PreviewBody = styled.div`
  flex: 1;
  background: #fff;
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
export const PreviewFallback = styled.p`
  max-width: 520px;
  padding: 30px;
  text-align: center;
  color: #1f2937;
  line-height: 1.55;
  font-size: 0.86rem;
`;
