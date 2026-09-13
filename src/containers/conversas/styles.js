import styled from "styled-components";
export const Page = styled.div`
  max-width: 1050px;
  margin: 0 auto;
`;
export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 18px;
  margin-bottom: 20px;
  h1 {
    font-size: 1.35rem;
  }
  p {
    margin-top: 5px;
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;
export const MessageCount = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.accentBright};
`;
export const ChatLayout = styled.div`
  display: grid;
  grid-template-columns: 310px 1fr;
  min-height: 600px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgSurface};
  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;
export const Inbox = styled.aside`
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: 14px;
  @media (max-width: 820px) {
    border-right: 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;
export const SearchBox = styled.label`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ theme }) => theme.colors.textMuted};
  input {
    flex: 1;
    background: none;
    border: 0;
    outline: 0;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 0.78rem;
  }
`;
export const ConversationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accentDim : "transparent"};
  text-align: left;
  color: ${({ theme }) => theme.colors.textPrimary};
  > div:last-child {
    display: flex;
    flex-direction: column;
    min-width: 0;
    strong {
      font-size: 0.78rem;
    }
    span {
      font-size: 0.68rem;
      color: ${({ theme }) => theme.colors.textMuted};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
export const PersonIcon = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.bgSurfaceAlt};
  color: ${({ theme }) => theme.colors.accentBright};
  flex: 0 0 auto;
`;
export const Chat = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;
export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  strong {
    display: block;
    font-size: 0.88rem;
  }
  span {
    display: block;
    margin-top: 3px;
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;
export const Online = styled.span`
  color: ${({ theme }) => theme.colors.success}!important;
`;
export const MessageList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  overflow: auto;
  min-height: 420px;
`;
export const Bubble = styled.div`
  max-width: 75%;
  align-self: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
  padding: 10px 12px;
  border-radius: 14px;
  background: ${({ $mine, theme }) =>
    $mine ? theme.colors.accentDim : theme.colors.bgSurfaceAlt};
  color: ${({ theme }) => theme.colors.textPrimary};
  span {
    font-size: 0.8rem;
    line-height: 1.45;
  }
  small {
    display: block;
    text-align: right;
    margin-top: 4px;
    font-size: 0.62rem;
    color: ${({ theme }) => theme.colors.textFaint};
  }
`;
export const Compose = styled.form`
  display: flex;
  gap: 9px;
  padding: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  input {
    flex: 1;
    padding: 11px 13px;
    border-radius: ${({ theme }) => theme.radius.pill};
    background: ${({ theme }) => theme.colors.bgSurfaceAlt};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  button {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accentDim};
    color: ${({ theme }) => theme.colors.textPrimary};
    display: grid;
    place-items: center;
  }
`;
