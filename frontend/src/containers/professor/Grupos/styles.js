import styled from "styled-components";

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  h1 {
    font-size: 1.4rem;
  }
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.display};
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
`;

export const GroupCard = styled.button`
  text-align: left;
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  transition:
    transform 0.12s ease,
    border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

export const CardTopBar = styled.div`
  height: 6px;
  background: ${({ $color }) => $color};
`;

export const CardBody = styled.div`
  padding: 18px;
`;

export const CardCourseTag = styled.span`
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: ${({ $color }) => $color};
  margin-bottom: 8px;
`;

export const CardTitle = styled.h3`
  font-size: 0.95rem;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const CardMeta = styled.p`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.textFaint};
`;

export const CommentDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.accentBright};
`;

// --- modal "criar novo grupo" ---

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(5, 2, 12, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 380px;
  background: ${({ theme }) => theme.colors.bgSurfaceRaised};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px;
`;

export const ModalTitle = styled.h2`
  font-size: 1.05rem;
  margin-bottom: 18px;
`;

export const ModalField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 14px;
`;

export const ModalInput = styled.input`
  padding: 11px 13px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.88rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

export const MemberChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  margin-bottom: 4px;
`;

export const MemberChip = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 6px 5px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  small {
    font-size: 0.61rem;
    color: ${({ theme }) => theme.colors.textFaint};
  }
`;

export const MemberChipRemove = styled.button`
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

export const ModalCancel = styled.button`
  flex: 1;
  padding: 11px;
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const ModalSubmit = styled.button`
  flex: 1;
  padding: 11px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

export const PageHint = styled.p`
  font-size: 0.76rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;
export const SearchArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
export const SearchBox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 390px;
  width: 100%;
  padding: 10px 13px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSurface};
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ theme }) => theme.colors.textMuted};
  input {
    flex: 1;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 0.78rem;
    background: transparent;
    outline: 0;
  }
`;
export const SearchNote = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textFaint};
`;
export const CardRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
export const FileBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 7px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.accentDim};
  font-size: 0.63rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;
export const ModalSearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  color: ${({ theme }) => theme.colors.textMuted};
`;
export const ModalSearch = styled.input`
  flex: 1;
  outline: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.82rem;
`;
export const ResultList = styled.div`
  margin-top: 7px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 190px;
  overflow: auto;
`;
export const ResultButton = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 9px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  text-align: left;
  color: ${({ theme }) => theme.colors.textPrimary};
  svg {
    color: ${({ theme }) => theme.colors.accentBright};
  }
  span {
    display: flex;
    flex-direction: column;
    strong {
      font-size: 0.75rem;
    }
    small {
      font-size: 0.64rem;
      color: ${({ theme }) => theme.colors.textMuted};
      margin-top: 2px;
    }
  }
  &:hover {
    background: ${({ theme }) => theme.colors.bgSurfaceRaised};
  }
`;
export const NoResult = styled.p`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textFaint};
  padding: 8px;
`;
