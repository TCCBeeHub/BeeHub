import styled from "styled-components";

export const Card = styled.section`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 30px;
  box-shadow: ${({ theme }) => theme.shadow.card};
`;

export const Title = styled.h1`
  font-size: 1.3rem;
  margin-bottom: 24px;
`;

export const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
  padding-bottom: 22px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  flex: 0 0 auto;
`;

export const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ $imageUrl, theme }) =>
    $imageUrl ? `url(${$imageUrl}) center/cover` : theme.colors.bgSurfaceAlt};
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  overflow: hidden;
`;

export const AvatarEditButton = styled.button`
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 2px solid ${({ theme }) => theme.colors.bgSurface};
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const AvatarHint = styled.p`
  max-width: 420px;
  font-size: 0.76rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 16px;
  font-size: 0.76rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Input = styled.input`
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.82rem;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 130px;
  padding: 12px;
  resize: vertical;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.82rem;
  line-height: 1.5;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const FooterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px;
`;

export const SaveButton = styled.button`
  padding: 11px 18px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.74rem;
  font-weight: 700;
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

export const SavedMessage = styled.span`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.success};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
`;
