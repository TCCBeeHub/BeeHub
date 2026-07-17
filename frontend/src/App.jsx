import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RequireAuth } from './components/RequireAuth';
import { RequireRole } from './components/RequireRole';
import { useAuth } from './context/AuthContext';

// Importações de Autenticação
import { Welcome } from './containers/auth/Welcome';
import { LoginAluno } from './containers/auth/LoginAluno';
import { LoginProfessor } from './containers/auth/LoginProfessor';

// Importações do Sistema
import { Home } from './containers/home';
import { Projetos } from './containers/projetos';
import { Configuracoes } from './containers/configuracoes';
import { Conversas } from './containers/conversas';
import { Perfil } from './containers/perfil';

// NOVAS IMPORTAÇÕES (Aba do Header)
import { Cursos } from './containers/cursos';
import { Suporte } from './containers/suporte';
import { Sobre } from './containers/sobre';

// Importações do Professor
import { Grupos } from './containers/professor/Grupos';
import { RevisaoProjeto } from './containers/professor/RevisaoProjeto';

// A rota "/" mostra uma página diferente dependendo de quem logou:
// aluno/visitante veem o Dashboard, professor vê a grade de Grupos.
function HomeGate() {
  const { role } = useAuth();
  return role === 'professor' ? <Grupos /> : <Home />;
}

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
        <Route path="/" element={<HomeGate />} />

        {/* NOVAS ROTAS DO HEADER */}
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/suporte" element={<Suporte />} />
        <Route path="/sobre" element={<Sobre />} />

        {/* Visitante não acessa estas 3 — RequireRole redireciona pra "/" */}
        <Route
          path="/projetos"
          element={
            <RequireRole exclude={['visitante']}>
              <Projetos />
            </RequireRole>
          }
        />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route
          path="/conversas"
          element={
            <RequireRole exclude={['visitante']}>
              <Conversas />
            </RequireRole>
          }
        />
        <Route
          path="/perfil"
          element={
            <RequireRole exclude={['visitante']}>
              <Perfil />
            </RequireRole>
          }
        />

        <Route path="/revisao/:groupId" element={<RevisaoProjeto />} />
      </Route>
    </Routes>
  );
}