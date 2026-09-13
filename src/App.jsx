import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RequireAuth } from "./components/RequireAuth";
import { RequireRole } from "./components/RequireRole";
import { useAuth } from "./context/AuthContext";

import { Welcome } from "./containers/auth/Welcome";
import { LoginAluno } from "./containers/auth/LoginAluno";
import { LoginProfessor } from "./containers/auth/LoginProfessor";
import { Home } from "./containers/home";
import { Projetos } from "./containers/projetos";
import { Configuracoes } from "./containers/configuracoes";
import { Conversas } from "./containers/conversas";
import { Perfil } from "./containers/perfil";
import { Cursos } from "./containers/cursos";
import { Suporte } from "./containers/suporte";
import { Sobre } from "./containers/sobre";
import { Grupos } from "./containers/professor/Grupos";
import { RevisaoProjeto } from "./containers/professor/RevisaoProjeto";
import { Revisoes } from "./containers/professor/Revisoes";
import { ProjetoDetalhes } from "./containers/projetoDetalhes";

export default function App() {
  return (
    <Routes>
      <Route path="/entrar" element={<Welcome />} />
      <Route path="/entrar/aluno" element={<LoginAluno />} />
      <Route path="/entrar/professor" element={<LoginProfessor />} />

      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Home />} />

        <Route path="/cursos" element={<Cursos />} />
        <Route path="/suporte" element={<Suporte />} />
        <Route path="/sobre" element={<Sobre />} />

        <Route path="/projeto/:id" element={<ProjetoDetalhes />} />

        <Route
          path="/projetos"
          element={
            <RequireRole allow={["aluno"]}>
              <Projetos />
            </RequireRole>
          }
        />
        <Route
          path="/conversas"
          element={
            <RequireRole allow={["aluno", "professor"]}>
              <Conversas />
            </RequireRole>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <RequireRole allow={["aluno", "professor"]}>
              <Configuracoes />
            </RequireRole>
          }
        />
        <Route
          path="/perfil"
          element={
            <RequireRole allow={["aluno", "professor"]}>
              <Perfil />
            </RequireRole>
          }
        />
        <Route
          path="/meu-perfil"
          element={
            <RequireRole allow={["aluno", "professor"]}>
              <Perfil />
            </RequireRole>
          }
        />

        <Route
          path="/grupos"
          element={
            <RequireRole allow={["professor"]}>
              <Grupos />
            </RequireRole>
          }
        />
        <Route
          path="/revisoes"
          element={
            <RequireRole allow={["professor"]}>
              <Revisoes />
            </RequireRole>
          }
        />
        <Route
          path="/revisao/:groupId"
          element={
            <RequireRole allow={["professor"]}>
              <RevisaoProjeto />
            </RequireRole>
          }
        />
      </Route>
    </Routes>
  );
}
