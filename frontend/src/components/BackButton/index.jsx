import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import * as S from "./styles";

export function BackButton({ fallback = "/" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const canGoBack = window.history.length > 1;

  const handleBack = () => {
    if (canGoBack) navigate(-1);
    else if (location.pathname !== fallback) navigate(fallback);
  };

  return (
    <S.Button
      type="button"
      onClick={handleBack}
      disabled={!canGoBack && location.pathname === fallback}
    >
      <ArrowLeft size={15} />
      Voltar à página anterior
    </S.Button>
  );
}
