import styled from 'styled-components';

export const Card = styled.div`
  max-width: 640px;
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 32px;
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
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: 84px;
  height: 84px;
  flex: 0 0 auto;
`;

export const Avatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${({ $imageUrl, theme }) =>
    $imageUrl ? `url(${$imageUrl}) center/cover` : theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.accentBright};
`;

export const AvatarEditButton = styled.button`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: 2px solid ${({ theme }) => theme.colors.bgSurface};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const AvatarHint = styled.p`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.02em;
`;

export const Input = styled.input`
  padding: 11px 13px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.88rem;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 14px;
  min-height: 110px;
  resize: vertical;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.88rem;
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const FooterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
`;

export const SaveButton = styled.button`
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.display};
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.03em;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

export const SavedMessage = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.success};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
`;