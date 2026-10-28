# BeeHub

Front-end responsivo em React para gerenciamento acadêmico alinhado ao MER. A aplicação possui login por sessão da API Java, acesso público para visitantes, alternância entre tema claro e escuro e telas para administrador, aluno e professor.

## Executar

```sh
npm install
Copy-Item .env.example .env
npm run dev
```

O cliente usa `import.meta.env.VITE_API_BASE_URL` como URL base da API. Para desenvolvimento local, configure `VITE_API_BASE_URL=/api` e `BEEHUB_API_PROXY_TARGET=https://beehub.onrender.com` (ou o endereço local do backend). O proxy Vite encaminha `/api/...` para as rotas correspondentes do backend, sem o prefixo `/api`, evitando CORS no navegador durante o desenvolvimento. Para implantação, configure a URL pública da API e assegure no servidor CORS com origem explícita e suporte a credenciais; o proxy Vite não é usado em produção.

```sh
npm run build
npm run lint
```

Sem a API disponível, o front-end exibe o erro de conexão e não cria usuários, sessões, entidades ou dados de exemplo.

## Contrato de integração com o backend Java

Todas as chamadas HTTP incluem `credentials: "include"` para o navegador enviar e receber o cookie de sessão `JSESSIONID`. Não há token JWT nem cabeçalho `Authorization`. Para chamadas cross-origin em produção, o backend deve aceitar credenciais e a origem exata do frontend. A API publicada foi observada respondendo `Access-Control-Allow-Origin: *` sem `Access-Control-Allow-Credentials`, configuração incompatível com cookies cross-origin; essa configuração precisa ser corrigida no backend ou resolvida por um proxy same-origin de produção.

### Login e sessão

Na tela inicial, três cards direcionam o acesso de **Aluno**, **Professor** e **Visitante**. O perfil escolhido seleciona o endpoint de login; as permissões continuam sendo verificadas pelo backend. O acesso administrativo permanece em um link separado.

| Perfil | Endpoint | Corpo JSON enviado |
| --- | --- | --- |
| Administrador | `POST /admin/login` | `{ "user": "admin", "senha": "..." }` |
| Aluno | `POST /aluno/login` | `{ "rmAluno": 2026001, "senha": "..." }` |
| Professor | `POST /professor/login` | `{ "rmProfessor": 12345, "senha": "..." }` |

Os RMs são enviados como números. Após login aceito, o backend deve criar a sessão e retornar o cookie `JSESSIONID`. O front-end não espera `accessToken`, não salva credenciais e não envia cabeçalho de autorização. Para carregar os vínculos do aluno, a resposta JSON de sucesso deve incluir um objeto de usuário seguro com `idCurso` (e, se disponível, `idGrupo`, `turma` e `displayName`); nenhuma senha ou hash deve ser retornado. O identificador do aluno/professor é preservado a partir do RM informado se não vier no corpo.

Visitantes não fazem login e não recebem sessão autenticada. As chamadas públicas também usam cookies e recebem somente os dados públicos permitidos pelo backend. Em resposta `401` às chamadas autenticadas, a interface limpa a sessão visual local e retorna à tela de login.

O backend deve disponibilizar um endpoint de logout que invalide a sessão para que o botão **Sair** também encerre a sessão no servidor. Esse endpoint não foi informado e, portanto, não é chamado pelo frontend atualmente.

### Dados do painel e escopo

O front-end não chama um endpoint agregado `/portal`; ele combina as rotas existentes:

| Dados | Endpoint(s) usados |
| --- | --- |
| ETECs | `GET /etec` |
| Cursos | `GET /cursos/{codEtec}` para cada ETEC |
| Alunos de um curso | `GET /aluno/curso/{idCurso}` |
| Professores de um curso | `GET /professor/curso/{idCurso}` |
| Orientações | `GET /orientacao` |
| Grupos | `GET /grupo` (o backend deve aplicar o escopo da sessão para perfis autenticados) |
| TCCs | `GET /tcc`; visitante vê apenas `APROVADO` ou `PUBLICADO` |
| Administradores | `GET /admin` (painel administrativo) |

As rotas de lista devem retornar arrays JSON (também são aceitos arrays sob `data`, `content` ou `items`). Para carregar associações, o cliente consulta alunos/professores pelos IDs de curso encontrados. A resposta é filtrada no frontend para mostrar ao aluno apenas seu próprio perfil/grupo/TCC e ao professor somente orientações, turmas, grupos e TCCs vinculados. O backend deve ainda proteger cada endpoint e filtrar sua resposta por sessão; os filtros do navegador não são uma barreira de segurança.

`GET /grupo` foi descrito como uma consulta administrativa, mas as telas de aluno/professor também precisam dos grupos vinculados. Para essas telas funcionarem, o backend deve permitir essa rota com resultado escopado pela sessão ou fornecer outra rota autenticada equivalente. Todas as respostas de entidades devem omitir `senha`, `senhaAdmin` e hashes.

### Operações das entidades

| Entidade | Rota base |
| --- | --- |
| Administradores | `/admin` |
| ETECs | `/etec` |
| Cursos | `/cursos` |
| Professores | `/professor` |
| Alunos | `/aluno` |
| Orientações | `/orientacao` |
| Grupos | `/grupo` |
| TCCs | `/tcc` |

Para criar, atualizar e excluir, o cliente usa respectivamente `POST {rota-base}`, `PUT {rota-base}/{chave}` e `DELETE {rota-base}/{chave}`. O corpo de criação de conta inclui `senha` (ou `senhaAdmin`) uma única vez. Após uma alteração, o cliente recarrega as listas pelos endpoints acima. Pode-se responder `200` ou `204` às operações de escrita. Erros devem usar status HTTP adequado e, quando possível, JSON com `message` ou `detail`. O servidor deve armazenar senhas somente com hash seguro e nunca devolvê-las.

O MER representado inclui: Administrador (`idAdmin`, `userAdmin`, `senhaAdmin`); ETEC (`codEtec`, `nome`); Curso (`idCurso`, `nome`, `quantAlunos`, `periodo`, `codEtec`); Aluno (`rmAluno`, `senha`, `email`, `linkFoto`, `descricao`, `turma`, `idGrupo`, `idCurso`); Professor (`rmProfessor`, `senha`, `email`, `linkFoto`, `descricao`); Orientação (`idOrientacao`, `idCurso`, `rmProfessor`, `turma`); Grupo (`idGrupo`, `nomeGrupo`, `idOrientacao`, `linkFoto`, `ano`, `capacidadeMaxima`); TCC (`codTCC`, `tema`, `linkSlide`, `linkArtigo`, `status`, `idGrupo`, `descricao`, `linkSite`, `dataCriacao`).

As regras de relação atualmente verificadas também na interface incluem referências existentes, correspondência entre o curso do aluno e o da orientação do grupo, capacidade máxima do grupo, um TCC por grupo e prevenção de exclusões com dependências. O backend permanece a autoridade final dessas validações.

## Acessos e funcionalidades

| Acesso | Escopo da interface |
| --- | --- |
| Visitante | Início público, cursos e TCCs aprovados/publicados, sem dados pessoais |
| Aluno | Próprio perfil, grupo, TCC e orientação relacionada; conversa ainda não integrada |
| Professor | Próprio perfil, orientações, grupos e TCCs sob sua orientação; conversa ainda não integrada |
| Administrador | Gestão das oito entidades do MER |

Não existe papel de coordenador. O chat não faz parte das entidades do MER: a rota contém somente mensagens estáticas de exemplo, o envio é desativado e a tela avisa **“Módulo previsto para a próxima etapa”**. A autenticação e os dados do painel não têm fallback local.

## Tema e organização

O tema claro/escuro está disponível na tela de login e no painel e a preferência fica salva neste navegador. Organização principal:

- `src/App.jsx`: rotas públicas, autenticação e painel.
- `src/containers/portal/index.jsx`: login, navegação por papel, painéis, formulários e chat futuro.
- `src/containers/portal/portal.css`: visual claro/escuro e layout responsivo.
- `src/context/AuthContext.jsx`: estado visual da sessão e acesso visitante; a autenticação real é mantida pelo cookie do backend.
- `src/context/ThemeContext.jsx`: preferência de tema.
- `src/services/httpClient.js`: chamadas HTTP com cookie de sessão e tratamento de erros.
- `src/services/authApi.js`: endpoints e corpos de login por perfil.
- `src/services/portalApi.js`: leitura por endpoints e operações do MER.
- `src/data/merModels.d.ts`: contratos de entidades e payloads da API.
- `src/assets/images/`: imagens de marca existentes e preservadas.

O frontend ainda precisa ser validado contra a API Java real; não há credenciais ou servidor Java incluídos nesta entrega.
