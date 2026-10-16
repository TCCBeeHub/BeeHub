# BeeHub

Front-end responsivo em React para gerenciamento acadêmico alinhado ao MER. A aplicação possui login ligado a uma API REST, acesso público para visitantes, alternância entre tema claro e escuro e telas para administrador, aluno e professor.

## Executar

```sh
npm install
Copy-Item .env.example .env
npm run dev
```

O servidor de desenvolvimento encaminha `/api` para `http://localhost:8080`, endereço padrão do backend Java. Para outro endereço, altere `BEEHUB_API_PROXY_TARGET` no `.env`. Em ambientes publicados, configure `VITE_API_BASE_URL` para a URL base da API e um proxy reverso quando front-end e API estiverem em origens diferentes.

```sh
npm run build
npm run lint
```

Sem a API disponível, o front-end exibe o erro de conexão e não cria usuários, sessões, entidades ou dados de exemplo. A interface não deve ser considerada um sistema de autenticação enquanto o backend não estiver em execução.

## Contrato de integração com o backend Java

A URL base é `VITE_API_BASE_URL` (padrão `/api`). Os nomes de propriedades abaixo são os usados pelo front-end e seguem os atributos do MER.

### Login e sessão

Na tela inicial, três cards direcionam o acesso de **Aluno**, **Professor** e **Visitante**. Os cards de aluno e professor abrem o formulário de credenciais; o visitante segue para o conteúdo público sem autenticação. O acesso administrativo continua disponível por um link separado, sem adicionar um quarto card. A seleção só organiza a navegação: o papel e as permissões efetivos continuam sendo determinados pela resposta do backend.

`POST /api/auth/login`

```json
{
  "identifier": "RM do aluno/professor ou usuário do administrador",
  "password": "senha"
}
```

Resposta `200 OK`:

```json
{
  "accessToken": "<token>",
  "role": "aluno",
  "user": {
    "displayName": "Nome para exibição",
    "rmAluno": "2026001",
    "email": "aluno@etec.sp.gov.br",
    "idCurso": 1,
    "idGrupo": 1
  }
}
```

`role` deve ser `aluno`, `professor` ou `administrador`, conforme resolvido e autorizado pelo servidor — nunca é selecionado pelo usuário no formulário. O objeto `user` deve conter os atributos públicos da entidade correspondente ao papel e, opcionalmente, `displayName`. O token é enviado nas chamadas autenticadas como `Authorization: Bearer <accessToken>` e fica em `sessionStorage` até o logout, o fim da sessão do navegador ou uma resposta `401`. O back-end deve retornar `401` para credenciais inválidas ou expiradas e nunca incluir senhas ou hashes na resposta.

Visitantes não fazem login e não recebem sessão autenticada. O link **Continuar como visitante** acessa somente a representação pública devolvida por `GET /api/portal`.

### Dados do painel e escopo

`GET /api/portal` devolve um objeto com arrays para todas as oito entidades do MER:

```json
{
  "administradores": [],
  "etecs": [],
  "cursos": [],
  "professores": [],
  "alunos": [],
  "orientacoes": [],
  "grupos": [],
  "tccs": []
}
```

O servidor deve filtrar a resposta pelo usuário autenticado. Para aluno, retorne somente seu próprio perfil e os cursos, grupos, TCCs e orientações necessários para representar seus vínculos. Para professor, retorne somente o perfil e os registros ligados às suas orientações. Administradores podem receber os cadastros necessários à gestão. Para visitante, retorne cursos, ETECs associadas e apenas TCCs com status `APROVADO` ou `PUBLICADO`; os demais arrays ficam vazios. Todas as propriedades de senha (`senha` e `senhaAdmin`) devem ser omitidas. A interface também rejeita respostas incompletas ou que contenham esses campos.

Os filtros da interface servem para navegação e apresentação; **não substituem autorização**. O backend Java deve autenticar e autorizar cada leitura e alteração, proteger rotas e validar novamente todas as regras de negócio.

### Operações das entidades

| Operação | Endpoint | Uso |
| --- | --- | --- |
| Criar | `POST /api/{colecao}` | Corpo JSON com atributos da entidade; ao criar conta de aluno, professor ou administrador, inclui `senha` ou `senhaAdmin` uma única vez |
| Atualizar | `PUT /api/{colecao}/{chave}` | Corpo JSON com atributos atualizados; a chave é codificada na URL |
| Excluir | `DELETE /api/{colecao}/{chave}` | Exclusão validada pelo backend, incluindo dependências |

`{colecao}` usa os nomes `administradores`, `etecs`, `cursos`, `professores`, `alunos`, `orientacoes`, `grupos` e `tccs`. Após uma alteração aceita, o front-end recarrega `GET /api/portal`. Pode-se responder `200` ou `204` às operações de escrita. Erros devem usar um status HTTP adequado e, quando possível, JSON com `message` ou `detail` para exibição. O servidor deve armazenar senhas somente com hash seguro e nunca devolvê-las em leituras, atualizações ou detalhes.

O MER representado inclui: Administrador (`idAdmin`, `userAdmin`, `senhaAdmin`); ETEC (`codEtec`, `nome`); Curso (`idCurso`, `nome`, `quantAlunos`, `periodo`, `codEtec`); Aluno (`rmAluno`, `senha`, `email`, `linkFoto`, `descricao`, `turma`, `idGrupo`, `idCurso`); Professor (`rmProfessor`, `senha`, `email`, `linkFoto`, `descricao`); Orientação (`idOrientacao`, `idCurso`, `rmProfessor`, `turma`); Grupo (`idGrupo`, `nomeGrupo`, `idOrientacao`, `linkFoto`, `ano`, `capacidadeMaxima`); TCC (`codTCC`, `tema`, `linkSlide`, `linkArtigo`, `status`, `idGrupo`, `descricao`, `linkSite`, `dataCriacao`).

As regras de relação atualmente verificadas também na interface incluem referências existentes, correspondência entre o curso do aluno e o da orientação do grupo, capacidade máxima do grupo, um TCC por grupo e prevenção de exclusões com dependências. O backend permanece a autoridade final dessas validações.

## Acessos e funcionalidades

| Acesso | Escopo da interface |
| --- | --- |
| Visitante | Início público, cursos e TCCs aprovados/publicados, sem dados pessoais |
| Aluno | Próprio perfil, grupo, TCC e orientação relacionada; conversa ainda não integrada |
| Professor | Próprio perfil, orientações, grupos e TCCs sob sua orientação; conversa ainda não integrada |
| Administrador | Gestão das oito entidades do MER |

Não existe papel de coordenador. O chat não faz parte das entidades do MER: a rota contém somente mensagens estáticas de exemplo, o envio é desativado e a tela avisa **“Módulo previsto para a próxima etapa”**. A autenticação, os dados do painel e as alterações de entidades não têm fallback local.

## Tema e organização

O tema claro/escuro está disponível na tela de login e no painel e a preferência fica salva neste navegador. Organização principal:

- `src/App.jsx`: rotas públicas, autenticação e painel.
- `src/containers/portal/index.jsx`: login, navegação por papel, painéis, formulários e chat futuro.
- `src/containers/portal/portal.css`: visual claro/escuro e layout responsivo.
- `src/context/AuthContext.jsx`: sessão autenticada e acesso visitante.
- `src/context/ThemeContext.jsx`: preferência de tema.
- `src/services/httpClient.js`: chamadas HTTP, token Bearer e erros.
- `src/services/authApi.js`: contrato de login.
- `src/services/portalApi.js`: leitura e operações do MER.
- `src/data/merModels.d.ts`: contratos de entidades e payloads da API.
- `src/assets/images/`: imagens de marca existentes e preservadas.

O backend do colega deve implementar ou adaptar os endpoints e payloads deste contrato antes que o login e os cadastros possam operar. Não há credenciais, dados de teste ou servidor Java incluídos nesta entrega.
