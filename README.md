# BeeHub

Protótipo responsivo em React para organizar cursos, alunos, professores, grupos, orientações e trabalhos de conclusão conforme o MER fornecido. A aplicação reutiliza as imagens de marca existentes em `src/assets/images`.

## Executar

```sh
npm install
npm run dev
```

Para validar a compilação e as regras estáticas:

```sh
npm run build
npm run lint
```

## Entidades e relacionamentos do MER

Os contratos iniciais estão em `src/data/merModels.d.ts`; os registros de exemplo, em `src/data/demoData.js`.

| Entidade | Atributos representados |
| --- | --- |
| Administrador | `idAdmin`, `userAdmin`, `senhaAdmin` |
| ETEC | `codEtec`, `nome` |
| Curso | `idCurso`, `nome`, `quantAlunos`, `periodo`, `codEtec` |
| Aluno | `rmAluno`, `senha`, `email`, `linkFoto`, `descricao`, `turma`, `idGrupo`, `idCurso` |
| Professor | `rmProfessor`, `senha`, `email`, `linkFoto`, `descricao` |
| Orientação | `idOrientacao`, `idCurso`, `rmProfessor`, `turma` |
| Grupo | `idGrupo`, `nomeGrupo`, `idOrientacao`, `linkFoto`, `ano`, `capacidadeMaxima` |
| TCC | `codTCC`, `tema`, `linkSlide`, `linkArtigo`, `status`, `idGrupo`, `descricao`, `linkSite`, `dataCriacao` |

As referências entre entidades são mantidas pelos atributos do modelo: curso → ETEC; aluno → curso e grupo; orientação → curso e professor; grupo → orientação; TCC → grupo. As validações do protótipo verificam as referências, a correspondência de curso do aluno com a orientação de seu grupo, a capacidade do grupo e a regra de um TCC por grupo.

Os status de TCC usam os valores do MER: `EM_ANDAMENTO`, `ENTREGUE`, `APROVADO`, `REPROVADO` e `PUBLICADO`. Visitantes veem cursos e somente trabalhos aprovados ou publicados; integrantes, grupos e registros privados não são expostos nessa navegação.

## Rotas e permissões demonstrativas

| Perfil | Rotas e escopo |
| --- | --- |
| Visitante | `/`, `/cursos`, `/tccs` e detalhe público `/tcc/:codTCC`; sem dados pessoais ou trabalhos não aprovados |
| Aluno | `/`, `/grupos`, `/tccs`, `/conversas`, `/perfil`; apenas o próprio curso, grupo, TCC e perfil |
| Professor | `/`, `/grupos`, `/orientacoes`, `/tccs`, `/conversas`, `/perfil`; apenas orientações, grupos, TCCs e alunos vinculados |
| Administrador | `/`, `/etecs`, `/cursos`, `/alunos`, `/professores`, `/orientacoes`, `/grupos`, `/tccs`, `/administradores`; cadastros disponíveis para administração |

Não há papel de coordenador no protótipo. A tela de entrada permite escolher os quatro perfis sem autenticação real. A autorização demonstrativa limita tanto as opções da navegação quanto os dados listados em cada perfil.

## Organização do front-end

- `src/App.jsx`: rotas e seleção de perfil.
- `src/containers/portal/index.jsx`: painel, permissões, listas, detalhes, formulários e conversa demonstrativa.
- `src/containers/portal/portal.css`: identidade visual clara, layout lateral e comportamento responsivo.
- `src/context/AuthContext.jsx`: perfil demonstrativo selecionado.
- `src/data/merModels.d.ts`: interfaces e valores de domínio alinhados aos atributos do MER.
- `src/data/demoData.js`: dados relacionais para a demonstração.
- `src/services/demoApi.js`: leitura, gravação e restauração dos dados locais.
- `src/assets/images/`: imagens de marca reutilizadas.

Os dados editados são armazenados em `localStorage` neste navegador. A tela de conversas exibe mensagens estáticas associadas aos vínculos de orientação, com o aviso **“Módulo previsto para a próxima etapa”**. O envio de mensagens está desativado: o MER não define entidade de conversa ou mensagem, e a integração real fica para uma etapa futura.

Este protótipo não implementa autenticação real, API de servidor ou validação de segurança. Senhas não são exibidas nem incluídas nos formulários de demonstração. O contrato final de serialização deve ser conferido com o backend e o esquema físico do banco quando estiverem disponíveis.
