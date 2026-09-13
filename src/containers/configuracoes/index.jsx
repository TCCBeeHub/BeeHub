import { useEffect, useState } from "react";
import { Bell, LockKeyhole, Palette, ShieldCheck, Save } from "lucide-react";
import * as S from "./styles";

const DEFAULTS = {
  notificacoes: true,
  email: true,
  resumo: true,
  privacidade: true,
  temaCompacto: false,
};

export function Configuracoes() {
  const [form, setForm] = useState(() => {
    try {
      return {
        ...DEFAULTS,
        ...JSON.parse(localStorage.getItem("beehub-config") || "{}"),
      };
    } catch {
      return DEFAULTS;
    }
  });
  const [salvo, setSalvo] = useState(false);
  useEffect(() => {
    localStorage.setItem("beehub-config", JSON.stringify(form));
  }, [form]);
  const toggle = (key) => setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  const salvar = () => {
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2200);
  };
  return (
    <S.Page>
      <S.Title>CONFIGURAÇÕES</S.Title>
      <S.Subtitle>
        Controle suas preferências, privacidade e avisos do BeeHub.
      </S.Subtitle>
      <S.Grid>
        <S.Card>
          <S.CardTitle>
            <Bell size={17} /> Notificações
          </S.CardTitle>
          <S.ToggleRow>
            <div>
              <strong>Notificações do sistema</strong>
              <span>Avisos sobre etapas, mensagens e arquivos.</span>
            </div>
            <S.Toggle
              $active={form.notificacoes}
              onClick={() => toggle("notificacoes")}
            >
              <span />
            </S.Toggle>
          </S.ToggleRow>
          <S.ToggleRow>
            <div>
              <strong>Receber e-mails</strong>
              <span>Resumo de atividades importantes.</span>
            </div>
            <S.Toggle $active={form.email} onClick={() => toggle("email")}>
              <span />
            </S.Toggle>
          </S.ToggleRow>
          <S.ToggleRow>
            <div>
              <strong>Resumo semanal</strong>
              <span>Uma visão rápida do andamento do seu TCC.</span>
            </div>
            <S.Toggle $active={form.resumo} onClick={() => toggle("resumo")}>
              <span />
            </S.Toggle>
          </S.ToggleRow>
        </S.Card>
        <S.Card>
          <S.CardTitle>
            <ShieldCheck size={17} /> Privacidade
          </S.CardTitle>
          <S.ToggleRow>
            <div>
              <strong>Perfil visível na comunidade</strong>
              <span>Permite que colegas encontrem seu nome em projetos.</span>
            </div>
            <S.Toggle
              $active={form.privacidade}
              onClick={() => toggle("privacidade")}
            >
              <span />
            </S.Toggle>
          </S.ToggleRow>
          <S.Info>
            Dados institucionais como R.M., escola e e-mail ficam protegidos e
            não aparecem na área pública de TCCs.
          </S.Info>
        </S.Card>
        <S.Card>
          <S.CardTitle>
            <Palette size={17} /> Aparência
          </S.CardTitle>
          <S.ToggleRow>
            <div>
              <strong>Modo compacto</strong>
              <span>
                Reduz espaçamentos para mostrar mais conteúdo na tela.
              </span>
            </div>
            <S.Toggle
              $active={form.temaCompacto}
              onClick={() => toggle("temaCompacto")}
            >
              <span />
            </S.Toggle>
          </S.ToggleRow>
          <S.Preview>
            <span>BeeHub</span>
            <small>Visual atual · roxo escuro</small>
          </S.Preview>
        </S.Card>
        <S.Card>
          <S.CardTitle>
            <LockKeyhole size={17} /> Segurança
          </S.CardTitle>
          <S.SecurityLine>
            <div>
              <strong>Senha</strong>
              <span>
                Para trocar sua senha, confirme sua identidade com a secretaria.
              </span>
            </div>
            <S.ActionButton type="button">Solicitar alteração</S.ActionButton>
          </S.SecurityLine>
          <S.SecurityLine>
            <div>
              <strong>Sessões</strong>
              <span>Você está conectado neste dispositivo.</span>
            </div>
            <S.ActionButton type="button">
              Encerrar outras sessões
            </S.ActionButton>
          </S.SecurityLine>
        </S.Card>
      </S.Grid>
      <S.Footer>
        <S.SaveButton type="button" onClick={salvar}>
          <Save size={15} /> SALVAR PREFERÊNCIAS
        </S.SaveButton>
        {salvo && <S.Saved>Preferências salvas!</S.Saved>}
      </S.Footer>
    </S.Page>
  );
}
