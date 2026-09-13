import styled from 'styled-components';

export const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: 40px 36px;
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 28px;
  color: ${({ theme }) => theme.colors.accentBright};
`;

export const LogoText = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 1.3rem;
  margin-bottom: 6px;
`;

export const Subtitle = styled.p`
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 28px;
  line-height: 1.5;
`;

export const RoleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RoleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.display};
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  transition: border-color 0.15s ease, transform 0.1s ease, background 0.15s ease;

  svg {
    color: ${({ theme }) => theme.colors.accentBright};
    flex: 0 0 auto;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    background: ${({ theme }) => theme.colors.bgSurfaceRaised};
  }
  &:active {
    transform: scale(0.98);
  }
`;

export const RoleButtonSub = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 400;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.03em;
`;

export const Input = styled.input`
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.accent};
`;

export const HelpTip = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgSurfaceRaised};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.65rem;
  font-weight: 700;
  cursor: help;

  &:hover span {
    display: block;
  }
`;

export const HelpBubble = styled.span`
  display: none;
  position: absolute;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  background: ${({ theme }) => theme.colors.bgSurfaceRaised};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 10px;
  font-size: 0.7rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
  z-index: 10;
`;

export const SubmitButton = styled.button`
  margin-top: 4px;
  padding: 13px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.font.display};
  font-weight: 700;
  letter-spacing: 0.04em;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

export const ForgotLink = styled.button`
  align-self: center;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: underline;
  margin-top: 4px;

  &:hover {
    color: ${({ theme }) => theme.colors.accentBright};
  }
`;

export const BackLink = styled.button`
  display: block;
  margin: 18px auto 0;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.accentBright};
  }
`;