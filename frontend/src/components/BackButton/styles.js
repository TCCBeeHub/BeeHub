import styled from "styled-components";

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 18px;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.bgSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.76rem;
  font-weight: 600;
  transition: 0.15s ease;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.borderStrong};
    background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;
