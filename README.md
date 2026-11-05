# STORYVERSE

## Relatório Final Consolidado — Versão 1 (V1)

Consolidado

V1

Arquivos 01–11

Documento principal de referência para o planeamento, desenvolvimento, testes e lançamento da primeira versão do StoryVerse.

## 1. Visão geral do projeto

O StoryVerse é uma plataforma web criativa que permite descobrir conteúdos, personalizar textos, criar composições visuais e transformar ideias em conteúdos que podem ser exportados e partilhados.

O objetivo da V1 é construir uma primeira versão funcional, simples, visualmente consistente e acessível, que permita validar a experiência com utilizadores reais antes de investir em funcionalidades mais complexas.

O StoryVerse não será, nesta fase, uma rede social completa. A prioridade é a criação de conteúdos, a leitura, a personalização, a exportação e a partilha.

## Identidade do StoryVerse

StoryVerse

Seu universo de histórias.

Toda história merece um lugar. — frase conceptual

Missão: oferecer um espaço criativo onde as pessoas possam explorar, personalizar e dar forma às suas ideias.

Princípio de desenvolvimento: começar com uma base simples e funcional, testar, corrigir e evoluir de forma gradual.

## 2. Objetivos da V1

A primeira versão deve permitir:

- Explorar cinco categorias de conteúdos.
- Consultar histórias e poemas.
- Pesquisar conteúdos através de uma pesquisa global.
- Criar versões personalizadas dos conteúdos existentes.
- Editar textos e elementos visuais.
- Utilizar templates reutilizáveis.
- Exportar os resultados para formatos compatíveis.
- Partilhar conteúdos através dos recursos disponíveis no dispositivo.
- Utilizar a interface em português ou inglês.
- Aceder à plataforma em computadores, tablets e telemóveis.
- Enviar feedback através do mecanismo previsto.
- Recolher métricas básicas de utilização para avaliar a versão lançada.

### O que a V1 não pretende ser

Não será uma rede social completa, uma plataforma de publicação pública de histórias dos utilizadores ou um sistema de armazenamento permanente de projetos.

Também não incluirá, nesta fase, contas, perfis completos, seguidores, comentários, mensagens privadas, feed social personalizado ou funcionalidades avançadas de inteligência artificial.

## 3. Público, proposta de valor e posicionamento

O StoryVerse destina-se a um público geral interessado em histórias, poemas, frases, pensamentos, memes e criação de conteúdos visuais.

A proposta de valor assenta em três pilares:

1. Descobrir: encontrar conteúdos prontos a consultar e utilizar como inspiração.
2. Personalizar: adaptar textos, fundos, tipografia e composição às preferências do utilizador.
3. Exportar: obter um ficheiro que possa ser guardado no dispositivo e partilhado fora da plataforma.

A identidade deve transmitir criatividade, imaginação, emoção, modernidade, acolhimento e elegância.

A referência a Angola faz parte da identidade e origem do projeto, sem limitar a plataforma a um público exclusivamente angolano.

## 4. Identidade visual e experiência de utilização

### 4.1. Paleta de cores

### Azul-escuro

\#111936

Estrutura e fundos principais.

### Roxo

\#6C3FC5

Elementos criativos e destaques.

### Dourado

\#D9A62E

Destaques e detalhes.

### Branco

\#FFFFFF

Leitura, contraste e espaços claros.

### 4.2. Tipografia

- Poppins: interface, menus, botões, títulos e elementos de navegação.
- Merriweather: histórias, poemas, frases, pensamentos e outros textos de leitura prolongada.

Nos editores, a escolha entre as fontes deve respeitar o tipo de conteúdo e as opções disponíveis.

### 4.3. Regras de design

- Interface simples, organizada e responsiva.
- Cartões consistentes e espaços adequados entre elementos.
- Ícones de interface através da biblioteca Lucide, mantendo um estilo uniforme.
- Símbolo e favicon próprios do StoryVerse.
- Contraste suficiente e textos legíveis em ecrãs pequenos.
- Elementos decorativos utilizados com moderação.
- Áreas de leitura confortáveis e apresentação visual coerente com a marca.

A implementação deve considerar acessibilidade, HTML semântico, desempenho e SEO desde o início.

## 5. Conteúdos oficiais da V1

O total oficial da biblioteca inicial é de 210 conteúdos.

Memes

30 gerais + 10 de Natal + 10 de Ano Novo

# 50

Frases e status

30 gerais + 10 de Natal + 10 de Ano Novo

# 50

Pensamentos

30 gerais + 10 de Natal + 10 de Ano Novo

# 50

Histórias

20 gerais + 5 de Natal + 5 de Ano Novo

# 30

Poemas

20 gerais + 5 de Natal + 5 de Ano Novo

# 30

Total oficial

# 210

### 5.1. Regras da biblioteca

- Os conteúdos originais serão definidos nos ficheiros do projeto.
- Cada conteúdo terá um identificador único.
- O mesmo conteúdo poderá ter versões em português e inglês.
- Os conteúdos sazonais ficam misturados nas categorias correspondentes, sem criar navegação independente para Natal ou Ano Novo.
- Não serão adicionados filtros avançados por temas ou etiquetas na V1.
- Os conteúdos originais não devem ser alterados quando alguém cria uma versão personalizada.
- Os textos e recursos visuais deverão ser originais ou utilizados de acordo com as respetivas licenças.

### 5.2. Modelo de conteúdo

Cada conteúdo deverá ter os campos necessários ao seu tipo, podendo incluir:

- `id`: identificador único.
- `type`: tipo de conteúdo.
- `title`: título, quando aplicável.
- `text`: conteúdo textual.
- `language`: idioma ou estrutura de versões linguísticas.
- `templateId`: identificador do template visual, quando aplicável.
- Dados adicionais adequados à categoria, como autor, capa ou capítulos.

O modelo definitivo deve ser implementado sem obrigar todos os tipos de conteúdo a utilizarem campos desnecessários.

## 6. Idiomas: português e inglês

O StoryVerse terá suporte oficial a duas línguas desde a V1.

O sistema deverá contemplar:

- Menus, botões, mensagens e interface em português e inglês.
- Conteúdos disponibilizados nas duas línguas.
- Pesquisa e resultados coerentes com o idioma selecionado.
- Navegação entre páginas sem perder a consistência linguística.
- Traduções preparadas e revistas antes da integração.

A arquitetura técnica prevê `language.js` para a lógica linguística e `languages.js` para os textos fixos da interface, além das versões linguísticas dos conteúdos.

Decisão operacional para a V1: as traduções serão preparadas nos dados do projeto. A tradução automática por API não faz parte da arquitetura atualmente consolidada para esta versão.

## 7. Páginas e navegação

A estrutura funcional prevista contempla:

| Página                   | Responsabilidade                                                                  |
| ------------------------ | --------------------------------------------------------------------------------- |
| `index.html`             | Página inicial, destaques, acesso às categorias e pesquisa                        |
| `pages/historias.html`   | Explorar histórias                                                                |
| `pages/poemas.html`      | Explorar poemas                                                                   |
| `pages/memes.html`       | Explorar memes                                                                    |
| `pages/status.html`      | Explorar frases e status                                                          |
| `pages/pensamentos.html` | Explorar pensamentos                                                              |
| `pages/pesquisa.html`    | Mostrar resultados da pesquisa global                                             |
| `pages/criar.html`       | Entrada para os diferentes tipos de criação, conforme a arquitetura técnica atual |

A última página apresenta uma divergência documental: o Arquivo 04 não previa um botão global “Criar”, enquanto o Arquivo 05 inclui `pages/criar.html` como ponto de entrada para os editores. Esta divergência deverá ser resolvida antes da implementação da navegação final.

### 7.1. Cabeçalho

O cabeçalho deverá conter:

- Logo e nome StoryVerse.
- Acesso às categorias de conteúdos.
- Pesquisa global.
- Seletor de idioma.

O logo permitirá regressar à página inicial. Não deverá existir uma página intermédia de categorias sem necessidade.

### 7.2. Página inicial

A página inicial deverá incluir:

- Cabeçalho comum.
- Apresentação e destaques.
- Um destaque de cada tipo de conteúdo.
- Acesso às cinco categorias.
- Rodapé institucional.
- Botão fixo de feedback no canto inferior direito.

### 7.3. Páginas de categorias

Cada página deverá apresentar os conteúdos do respetivo tipo, com cartões e ações adequadas.

Não haverá filtros avançados, etiquetas de navegação, duração de leitura, contadores de visualizações ou recomendações personalizadas na V1.

## 8. Pesquisa global

A pesquisa deverá permitir encontrar conteúdos em todas as cinco categorias.

### Comportamento previsto

- Pesquisa por título e texto.
- Correspondência parcial.
- Comparação sem distinção entre maiúsculas e minúsculas.
- Pesquisa tolerante a acentos.
- Resultados apresentados numa lista comum, identificando a categoria de cada conteúdo.
- Resultados no idioma selecionado.
- Mensagens claras quando não existirem resultados ou ocorrer um erro.

O parâmetro da pesquisa poderá ser transmitido no URL, por exemplo:

`pages/pesquisa.html?q=amor`

Ao selecionar um resultado:

- Memes, frases/status e pensamentos abrem o editor visual.
- Histórias e poemas abrem a página de leitura, onde existe a opção de editar.

A pesquisa não constitui uma rede social nem um sistema de recomendação personalizado.

## 9. Sistema de edição

O StoryVerse terá dois tipos de editor.

Editor visual

Memes, frases/status e pensamentos.

- Texto
- Fundo
- Tipografia
- Tamanho
- Imagem
- Pré-visualização
- Exportação

Editor textual

Histórias e poemas.

- Texto e título
- Formatação
- Elementos literários
- Pré-visualização
- Personalização
- Exportação

### 9.1. Regra de preservação

Quando o utilizador edita um conteúdo da biblioteca, o editor deve trabalhar sobre uma cópia independente.

O conteúdo original permanece intacto. As alterações não devem modificar os dados originais de `contents.js`.

As cópias criadas durante a sessão não são guardadas permanentemente. O utilizador deverá exportar o resultado para o conservar.

## 10. Motor de criação visual e templates

O motor visual deverá fornecer uma identidade consistente, permitindo diferentes composições sem criar um design completamente novo para cada conteúdo.

### 10.1. Elementos editáveis

O editor visual deverá permitir, dentro das opções definidas para cada template:

- Editar o texto.
- Alterar o fundo.
- Escolher uma fonte.
- Alterar o tamanho do texto.
- Selecionar ou substituir uma imagem.
- Pré-visualizar o resultado.
- Exportar a composição.
- Partilhar quando o dispositivo suportar essa funcionalidade.

Os controlos de edição não deverão aparecer na composição exportada.

### 10.2. Fundos e recursos visuais

Os fundos poderão incluir:

- Cores sólidas.
- Gradientes CSS.
- Fotografias selecionadas.
- Imagens carregadas pelo utilizador.
- Fundos predefinidos do StoryVerse.
- Fundos temáticos de Natal e Ano Novo.

Fotografias e ilustrações externas só devem ser incorporadas após verificação das licenças e condições de utilização. Os recursos deverão ser organizados no projeto e otimizados para não prejudicar o desempenho.

### 10.3. Quantidades iniciais propostas

Estas quantidades são referências de planeamento, não requisitos obrigatórios antes de iniciar a programação.

| Recurso              | Quantidade proposta |
| -------------------- | ------------------- |
| Cores sólidas        | 16                  |
| Gradientes           | 12                  |
| Imagens de fundo     | 30                  |
| Templates visuais    | 24                  |
| Ícones               | 24                  |
| Ilustrações          | 12                  |
| Capas para histórias | 10                  |
| Fundos de Natal      | 6                   |
| Fundos de Ano Novo   | 6                   |

Os recursos devem ser reutilizados entre conteúdos compatíveis. A biblioteca visual poderá ser ajustada após os primeiros testes.

### 10.4. Dimensões de referência

Publicação vertical

## 1080 × 1350 px

Proporção 4:5 — formato principal para conteúdos visuais.

Ecrã vertical

## 1080 × 1920 px

Proporção 9:16 — formato alternativo para conteúdos de ecrã inteiro.

O sistema deve preservar as proporções das imagens, evitar distorções e garantir que o texto continua legível. O recorte, o posicionamento e o zoom devem ser implementados sem transformar o editor num sistema de design excessivamente complexo.

### 10.5. Estratégia de implementação

A biblioteca visual será desenvolvida progressivamente:

1. Implementar a estrutura do site.
2. Preparar a ligação entre dados, editores e exportação.
3. Criar um primeiro template.
4. Aplicá-lo a um conteúdo real.
5. Testar a edição e a exportação.
6. Corrigir os problemas encontrados.
7. Só depois criar o template seguinte.

Não é necessário produzir todos os templates antes de testar o motor visual.

## 11. Motor de histórias e poemas

### 11.1. Histórias

A experiência de criação de histórias poderá incluir:

- Título e subtítulo.
- Autor e ano, quando aplicável.
- Capa opcional.
- Sinopse opcional.
- Personagens opcionais.
- Texto principal.
- Capítulos.

O utilizador poderá começar do zero ou criar uma versão própria de um conteúdo existente.

### 11.2. Capítulos

O editor deverá permitir:

- Adicionar capítulos.
- Editar o título e o conteúdo de cada capítulo.
- Apagar capítulos.
- Alterar a ordem através dos controlos de subir e descer.
- Pré-visualizar a história.
- Exportar a história com os capítulos na ordem definida.

### 11.3. Formatação de histórias

As opções previstas incluem:

- Negrito, itálico e sublinhado.
- Tamanho do texto.
- Alinhamento.
- Listas numeradas ou com marcadores.
- Personalização da leitura e da apresentação final.

A experiência de leitura poderá disponibilizar tamanho do texto, espaçamento entre linhas, fonte serifada ou sem serifa e temas claro, escuro e sépia.

### 11.4. Poemas

O editor de poemas deverá permitir:

- Criar poemas do zero.
- Criar uma versão independente de um poema existente.
- Adicionar, editar e apagar versos.
- Personalizar a tipografia e a apresentação.
- Utilizar fundos decorativos compatíveis.
- Pré-visualizar e exportar o resultado.

Os fundos poderão abranger natureza, céu, estrelas, lua, pôr do sol, amor, amizade, sentimentos, estilos minimalistas, abstratos e temas festivos.

### 11.5. Planeador de histórias

O planeador de histórias completo fica adiado para uma versão posterior. Não deverá ser tratado como uma funcionalidade obrigatória da V1.

## 12. Dados, armazenamento e exportação

Esta área é uma das decisões mais importantes da V1.

### 12.1. Regras oficiais

| Elemento                             | Decisão da V1                   |
| ------------------------------------ | ------------------------------- |
| Backend próprio                      | Não                             |
| Base de dados                        | Não                             |
| Contas de utilizador                 | Não                             |
| Armazenamento online dos trabalhos   | Não                             |
| Gravação automática                  | Não                             |
| Recuperação automática               | Não                             |
| Conteúdos fixos                      | Ficheiros do projeto            |
| Trabalho em edição                   | Memória temporária do navegador |
| Conservação do trabalho              | Exportação manual               |
| Importação para continuar uma edição | Fora da V1                      |
| Impressão direta dentro do site      | Fora da V1                      |

Ao atualizar a página, fechar o navegador ou sair do editor, o trabalho não exportado poderá perder-se.

### 12.2. Aviso de armazenamento

Ao entrar no editor, deverá aparecer o seguinte aviso:

> O teu trabalho não é guardado automaticamente. Exporta o teu conteúdo para não o perderes.

O aviso será apresentado à entrada do editor, não como indicação fixa durante toda a edição. Não haverá um aviso adicional ao sair.

### 12.3. Formatos de exportação

A V1 terá três formatos principais: PNG, JPG e PDF.

| Formato | Utilização principal                                                              |
| ------- | --------------------------------------------------------------------------------- |
| PNG     | Composições gráficas, textos e imagens que beneficiam de nitidez ou transparência |
| JPG     | Composições fotográficas e conteúdos visuais comprimidos                          |
| PDF     | Histórias, poemas e documentos com apresentação organizada e várias páginas       |

A exportação deverá produzir o conteúdo final, sem menus, botões ou controlos do editor.

Os nomes dos ficheiros devem ser claros e simples, por exemplo, `storyverse-poema.png`.

### 12.4. Mensagens de exportação

Sucesso

> Exportação concluída. A exportação foi concluída! Verifica os downloads do teu dispositivo.

Erro

> Falha na exportação. Não foi possível exportar o teu conteúdo. Tenta novamente antes de fechares o editor.

A mensagem de sucesso só deve aparecer quando houver confirmação razoável da conclusão da operação. Não deve prometer armazenamento permanente.

### 12.5. Partilha

Quando suportada pelo dispositivo, a plataforma poderá utilizar a funcionalidade de partilha do navegador. Se não estiver disponível, deverá permitir ao utilizador recorrer ao ficheiro exportado e partilhá-lo manualmente.

A plataforma não deve afirmar que uma partilha externa foi concluída apenas porque o utilizador clicou num botão ou abriu outra aplicação.

### 12.6. APIs e webhooks

Uma API externa poderá ser utilizada na V1 quando existir uma necessidade funcional concreta, por exemplo, para abrir uma conversa de feedback no WhatsApp.

Os webhooks não são obrigatórios. Só deverão ser considerados quando existir um evento que os justifique e uma infraestrutura capaz de receber e validar esses eventos.

A utilização de APIs não altera a regra de que os trabalhos editados não serão armazenados permanentemente pelo StoryVerse.

### 12.7. Evolução do armazenamento

- V1: sem contas, base de dados ou armazenamento online dos trabalhos.
- V2: manter a ausência destas funcionalidades segundo o plano atual, salvo revisão explícita.
- V3: planeamento de contas, armazenamento online, base de dados e cópias de segurança, com PostgreSQL como possibilidade a avaliar.

A tecnologia definitiva da V3 será escolhida quando essa fase for planeada.

## 13. Arquitetura técnica e organização dos ficheiros

A V1 será construída com HTML, CSS e JavaScript, mantendo a estrutura simples e modular.

### 13.1. Estrutura prevista

A estrutura de referência era esta; a estrutura final da V1 está descrita na secção 22.1.

```
storyverse/
├── index.html
├── pages/        (criar, pesquisa, historias, poemas, memes, status, pensamentos)
├── css/          (style, components, responsive)
├── js/
│   ├── main.js
│   ├── modules/  (navigation, language, search, editor-visual, editor-textual, preview, sharing, export)
│   └── data/     (contents, templates, languages)
├── assets/       (logo, images, covers, icons)
└── README.md
```

Esta é uma estrutura de referência, não uma obrigação de criar ficheiros vazios sem necessidade. O módulo `export.js`, em particular, deverá ser integrado sem duplicar as responsabilidades de `preview.js` ou dos editores.

### 13.2. Responsabilidades principais

- `main.js`: inicialização e ligação dos módulos.
- `navigation.js`: navegação entre páginas e componentes comuns.
- `language.js`: lógica de seleção de idioma.
- `search.js`: pesquisa e apresentação de resultados.
- `editor-visual.js`: edição de memes, status e pensamentos.
- `editor-textual.js`: edição de histórias e poemas.
- `preview.js`: pré-visualização.
- `sharing.js`: funcionalidades de partilha.
- `export.js`: exportação, caso a implementação modular escolhida justifique a sua separação.
- `contents.js`: biblioteca dos 210 conteúdos.
- `templates.js`: modelos visuais reutilizáveis.
- `languages.js`: textos fixos da interface em português e inglês.

### 13.3. Componentes comuns

Cabeçalho, rodapé, cartões, botões, pesquisa, seletor de idioma e mecanismo de feedback deverão ser reutilizados sempre que possível.

A implementação deve evitar duplicação desnecessária de HTML, CSS e JavaScript.

## 14. Feedback e análise de utilização

### 14.1. Feedback

A V1 terá um botão de feedback fixo no canto inferior direito das páginas principais.

Ao ser utilizado, deverá abrir um painel com opções como:

- Enviar uma sugestão.
- Comunicar um erro.
- Partilhar uma experiência de utilização.

O mecanismo poderá abrir o WhatsApp com uma mensagem previamente preenchida e editável. O utilizador deverá confirmar o envio.

Não haverá uma página `feedback.html` nem um backend próprio para receber mensagens.

Importante: abrir o WhatsApp não significa que o feedback foi enviado.

### 14.2. Google Analytics 4

Está prevista a utilização do Google Analytics 4 para acompanhar a utilização da plataforma.

Os eventos a acompanhar incluem:

- Pesquisa.
- Abertura dos editores.
- Exportações PNG.
- Exportações PDF.
- Clique no botão de feedback.
- Escolha de uma opção de feedback.
- Abertura do WhatsApp.
- Tentativas de partilha.

Os eventos devem representar ações observáveis. Uma tentativa de exportação ou partilha não deve ser confundida com a conclusão bem-sucedida da ação externa.

A V1 não terá um painel administrativo próprio de métricas. A consulta será feita nos relatórios do GA4.

## 15. SEO, acessibilidade, desempenho e responsividade

Estes requisitos devem ser considerados desde o início, não apenas depois de a interface estar concluída.

### SEO

- Títulos de página (`title`) adequados.
- Meta descriptions relevantes.
- Hierarquia correta de títulos.
- URLs organizados.
- Texto alternativo nas imagens relevantes.
- `sitemap.xml` e `robots.txt`, conforme a estrutura de publicação.
- Verificação das condições de indexação e publicação.

### Acessibilidade

- Contraste suficiente.
- Navegação utilizável em ecrãs pequenos.
- Botões e controlos identificáveis.
- HTML semântico.
- Estados claros de sucesso, erro e ausência de resultados.
- Alternativas textuais para imagens relevantes.

### Desempenho

- Imagens otimizadas.
- Recursos reutilizáveis.
- JavaScript organizado.
- Evitar bibliotecas desnecessárias.
- Reduzir o peso das páginas sem comprometer a experiência visual.

### Responsividade

A interface deve funcionar em computadores, tablets e telemóveis. O editor visual deve adaptar a posição das ferramentas e da composição ao espaço disponível.

A publicação inicial poderá utilizar GitHub e Vercel, seguindo o fluxo de implementação e testes definido para o projeto.

## 16. Testes obrigatórios antes do lançamento

O StoryVerse não deve ser considerado pronto apenas porque as páginas abrem. É necessário verificar o comportamento real dos componentes e dos fluxos principais.

## Lista de validação da V1

0 de 28 verificações assinaladas nesta lista

Limpar

Estrutura e navegação

Todas as páginas abrem corretamente

Cabeçalho, rodapé e ligações funcionam

A navegação entre categorias é consistente

O botão de feedback aparece nas páginas previstas

Conteúdos e idiomas

Os 210 conteúdos estão integrados

Os identificadores dos conteúdos são únicos

As versões em português e inglês são coerentes

A pesquisa encontra conteúdos em todas as categorias

Editores

O editor visual funciona para os três tipos previstos

O editor textual funciona para histórias e poemas

As alterações não modificam os originais

Textos longos e curtos são apresentados corretamente

Exportação e armazenamento

PNG funciona

JPG funciona

PDF funciona

Os controlos do editor não aparecem nos ficheiros

As mensagens de sucesso e erro são corretas

O aviso de armazenamento aparece ao entrar

Não existe gravação automática do trabalho

Design e qualidade

Templates funcionam com português e inglês

Imagens e fundos não ficam distorcidos

O texto mantém contraste suficiente

O site funciona em computador e telemóvel

Os recursos locais necessários carregam corretamente

Publicação e medição

SEO básico está preparado

Eventos do GA4 representam ações reais

O feedback abre o destino correto

Os erros importantes são corrigidos antes do lançamento

Esta lista é interativa apenas nesta conversa; não guarda o estado no projeto.

Os testes de templates devem começar por exemplos representativos, incluindo texto curto e longo, fundos claros e escuros, imagens e os dois idiomas. Depois, a validação deve ser ampliada para a coleção completa.

## 17. Estratégia de desenvolvimento

A ordem de trabalho deverá minimizar retrabalho e dependências desnecessárias.

1. Preparar a base do projeto

   Confirmar a estrutura dos ficheiros, a navegação, o CSS comum, os componentes e a configuração inicial.
2. Integrar os conteúdos

   Preparar os 210 conteúdos, identificadores, versões linguísticas e modelos de dados.
3. Implementar as páginas

   Construir a página inicial, as cinco categorias, a pesquisa e os pontos de entrada para os editores.
4. Implementar os editores

   Criar e testar os editores visual e textual, incluindo a preservação dos originais.
5. Implementar pré-visualização e exportação

   Confirmar os formatos previstos, as mensagens de resultado e a ausência de controlos nos ficheiros exportados.
6. Desenvolver templates progressivamente

   Criar um template, testar com conteúdos reais, corrigir e só depois avançar para o seguinte.
7. Concluir testes e preparação para publicação

   Verificar responsividade, idiomas, acessibilidade, SEO, desempenho, feedback e métricas.
8. Publicar e acompanhar

   Lançar a V1, observar o comportamento real e registar problemas e melhorias para as versões seguintes.

## 18. Roadmap de evolução

O roadmap distingue o que é necessário para lançar a primeira versão do que poderá ser desenvolvido mais tarde.

| Etapa | Direção                                                                                    |
| ----- | ------------------------------------------------------------------------------------------ |
| V1    | Conteúdos iniciais, pesquisa, editores, personalização, exportação, partilha básica, PT/EN |
| V1.x  | Correções, melhorias de usabilidade, qualidade de exportação e expansão visual progressiva |
| V2    | Evolução funcional após avaliar a utilização da V1                                         |
| V3    | Planeamento de contas, base de dados, armazenamento online e cópias de segurança           |

O planeador de histórias completo, a publicação pública de conteúdos, os perfis sociais, os sistemas de interação social e as funcionalidades avançadas de IA não devem ser introduzidos automaticamente na V1.

A ordem concreta das funcionalidades futuras deverá ser confirmada no respetivo planeamento, sem antecipar decisões de versões posteriores.

## 19. Divergências documentais que precisam de ser respeitadas

Durante a consolidação dos arquivos, surgiram alguns pontos em que documentos diferentes apresentam decisões incompatíveis. Para evitar erros durante a programação, estes pontos ficam registados explicitamente.

1\. Quantidade de conteúdos

Decisão atual: 210

Um documento anterior menciona 260 conteúdos. A distribuição oficial consolidada nos arquivos mais recentes é de 210. A implementação deve utilizar 210, salvo decisão posterior expressa.

2\. `LocalStorage`

Regra estrita da V1: não utilizar

A arquitetura técnica menciona guardar a preferência de idioma no navegador. O Arquivo 08 proíbe o uso de `LocalStorage`. Até existir uma alteração formal, deve prevalecer a regra de não utilizar `LocalStorage`, inclusive para guardar preferências.

3\. Tradução automática

V1: traduções preparadas

Existe a intenção de automatizar traduções no futuro, mas a arquitetura da V1 define versões em português e inglês preparadas nos dados do projeto. A tradução automática deve ficar fora da V1.

4\. Página “Criar”

Confirmar antes da navegação final

O Arquivo 04 não previa um botão global “Criar”, mas a arquitetura do Arquivo 05 inclui `pages/criar.html`. A existência da página e a sua ligação ao menu devem ser confirmadas antes de finalizar a navegação.

5\. Formatos de exportação

Definir por categoria

O Arquivo 08 estabelece PNG, JPG e PDF como formatos da V1. Outros documentos mencionam TXT para histórias e poemas. Para evitar acrescentar uma funcionalidade não consolidada, PNG, JPG e PDF são os formatos oficiais gerais; TXT só deverá ser incluído após confirmação expressa.

6\. Planeador de histórias

Adiado

Uma proposta inicial incluía um planeador, mas uma decisão posterior adiou o planeador completo para uma versão futura. Não faz parte dos requisitos obrigatórios da V1.

7\. Partilha e confirmação

Regra de implementação

Abrir WhatsApp, iniciar uma partilha ou clicar num botão não prova que a ação externa foi concluída. A interface deverá comunicar apenas aquilo que consegue verificar.

Estas divergências não devem ser resolvidas por suposição durante a programação. A equipa deverá confirmar os pontos em aberto antes de implementar comportamentos que alterem o escopo da V1.

## 20. Critérios de conclusão da V1

A primeira versão poderá ser considerada pronta para lançamento quando:

- As páginas previstas estiverem implementadas e ligadas.
- Os 210 conteúdos estiverem integrados.
- A interface funcionar em português e inglês.
- A pesquisa global apresentar resultados coerentes.
- Os editores visual e textual funcionarem.
- As alterações não modificarem os conteúdos originais.
- Os templates essenciais estiverem testados.
- A exportação PNG, JPG e PDF funcionar conforme os requisitos.
- O aviso de armazenamento aparecer ao entrar nos editores.
- Não existir gravação automática dos trabalhos.
- Os erros relevantes de apresentação e exportação tiverem sido corrigidos.
- A plataforma estiver testada em computador e telemóvel.
- O feedback e as métricas estiverem configurados conforme o escopo.
- SEO, acessibilidade e desempenho tiverem sido verificados.
- As divergências de navegação e de funcionalidades ainda abertas tiverem sido resolvidas.

## 21. Conclusão final

O StoryVerse V1 deverá ser uma plataforma web criativa, bilingue, responsiva e organizada, construída com HTML, CSS e JavaScript.

A sua biblioteca inicial terá 210 conteúdos distribuídos por cinco categorias. A pesquisa permitirá explorar esses conteúdos, enquanto os editores visual e textual permitirão criar versões independentes e personalizadas.

A plataforma não guardará automaticamente os trabalhos editados. A exportação manual será o mecanismo de conservação, com PNG, JPG e PDF como formatos oficiais. O sistema visual será desenvolvido progressivamente, testando cada template antes de avançar para os seguintes.

O projeto deverá manter a identidade visual estabelecida, uma arquitetura modular, recursos devidamente licenciados e testes de qualidade desde o início. Funcionalidades mais complexas — como contas, armazenamento online, cópias de segurança, publicação social e planeamento avançado de histórias — ficarão para fases futuras.

A regra central do projeto é simples: construir uma V1 funcional, testar com utilizadores reais, corrigir os problemas encontrados e só depois expandir.

O presente relatório consolida a visão, o escopo, os conteúdos, a experiência de utilização, os editores, os templates, a arquitetura, o armazenamento, a exportação e os critérios de qualidade do StoryVerse V1. Os pontos explicitamente assinalados como divergências deverão ser confirmados antes da implementação correspondente.

Documento consolidado a partir dos arquivos do projeto e das decisões partilhadas nas conversas. As funcionalidades futuras não são compromissos de implementação na V1.

---

# Parte II — Estado atual da implementação da V1

Esta segunda parte descreve o que está realmente construído no projeto, como funciona e o que ainda falta. A Parte I (secções 1 a 21) continua a ser a referência de escopo e regras; sempre que a Parte II e a Parte I parecerem diferir, a diferença é explicada aqui.

## 22. O que está construído

### 22.1. Estrutura final de ficheiros

```
StoryVerse/
├── index.html                    Página inicial
├── sitemap.xml · robots.txt      SEO (trocar o endereço antes de publicar)
├── README.md                     Este documento
├── pages/
│   ├── criar.html                Escolha do tipo de criação
│   ├── modelos.html              Escolha do modelo visual
│   ├── historias.html            Biblioteca de histórias
│   ├── historia-leitura.html     Leitura de uma história
│   ├── editor-historia.html      Editor de histórias (capítulos, capa, PDF)
│   ├── poemas.html               Biblioteca de poemas
│   ├── poema-leitura.html        Leitura de um poema
│   ├── editor-poema.html         Editor de poemas
│   ├── memes.html · status.html · pensamentos.html   Bibliotecas visuais
│   ├── editor-meme.html          Editor visual único (memes, status e pensamentos)
│   ├── pesquisa.html             Pesquisa global
│   └── sobre · contactos · privacidade · termos      Páginas institucionais
├── css/
│   ├── style.css · components.css · responsive.css   Base comum
│   ├── status-page.css · memes-page.css              Páginas de biblioteca
│   ├── editor-visual.css · editor-poema.css          Editores
│   └── stories.css · search-page.css · legal.css     Histórias, leitura, pesquisa e páginas institucionais
├── js/
│   ├── main.js                   Inicialização, métricas
│   ├── data/                     config, contents, templates, languages, visual-library, embedded-svgs
│   └── modules/                  layout, navigation, language, feedback, search, search-page,
│                                 memes/status/thoughts/poems/stories-page, story-core, story-reader,
│                                 poem-reader, editor-category, editor-visual, editor-poema,
│                                 editor-textual, visual-library-ui, template-picker, preview,
│                                 export, file-pick, sharing
├── assets/                       logo, icons (inclui a bandeira de Angola), images, backgrounds,
│                                 illustrations, covers
└── tools/gerar-svgs-embutidos.py Gera js/data/embedded-svgs.js (só para desenvolvimento)
```

A V1 usa apenas HTML, CSS e JavaScript no site. O script em `tools/` é uma ferramenta de apoio que não faz parte do que corre no navegador.

### 22.2. Páginas

| Página | O que faz |
| --- | --- |
| `index.html` | Apresentação, destaques das cinco categorias, pesquisa e acesso aos editores |
| `criar.html` → `modelos.html` → editor | Fluxo de criação: tipo de conteúdo, modelo visual e edição |
| `historias.html` | 30 histórias com pesquisa; botões "Ler" e "Personalizar" |
| `historia-leitura.html` | Leitura com tamanho, espaçamento, fonte e tema (claro, escuro, sépia) e botão para editar |
| `poemas.html` | 30 poemas com pesquisa; "Ler", "Editar poema" e exportação rápida PNG/JPG/PDF |
| `poema-leitura.html` | Leitura do poema com as mesmas definições de leitura e botão para editar |
| `memes.html`, `status.html`, `pensamentos.html` | 50 conteúdos cada, grelha única, "Personalizar" |
| `pesquisa.html` | Resultados da pesquisa global nas cinco categorias |
| `sobre.html`, `contactos.html`, `privacidade.html`, `termos.html` | Páginas institucionais em português e inglês (texto base da V1, a rever antes do lançamento) |

O cabeçalho e o rodapé vêm de um único ficheiro (`js/modules/layout.js`), por isso são exatamente iguais em todas as páginas, incluindo a bandeira de Angola no rodapé.

### 22.3. Biblioteca de conteúdos (`js/data/contents.js`)

Os 210 conteúdos estão no ficheiro de dados, todos com identificador único e versões em português e inglês:

| Tipo | Prefixo do ID | Quantidade |
| --- | --- | --- |
| Memes | `MEM-` | 50 |
| Frases e status | `STA-` | 50 |
| Pensamentos | `PEN-` | 50 |
| Poemas | `POE-` | 30 |
| Histórias | `STO-` | 30 (20 gerais, 5 de Natal, 5 de Ano Novo) |

Memes, status, pensamentos e poemas têm `title`, `text` (com `pt` e `en`), `season` (`general`, `christmas` ou `newyear`) e `templateId`. As histórias têm o seguinte modelo:

```
{ id: "STO-004", type: "story",
  title: { pt: "...", en: "..." },
  author: "StoryVerse",
  cover: "cover-04",              // cover-01 a cover-10, ou um ficheiro .jpg/.png/.webp em assets/covers/
  season: "general",
  synopsis: { pt: "", en: "" },
  chapters: [ { title: { pt: "", en: "" }, text: { pt: "...", en: "..." } } ],
  templateId: "story-template-01" }
```

O texto das histórias e dos poemas é texto simples: uma linha em branco separa parágrafos (ou estrofes) e uma quebra de linha simples separa versos. As histórias atuais têm um só capítulo, sem título, por isso a leitura não mostra cabeçalho de capítulo. As capas de Messi e Ronaldo (`messi.jpg`, `ronaldo.jpg`) são fotografias.

### 22.4. Idiomas, tema e navegação

- Todos os textos fixos da interface estão em `js/data/languages.js`, em português e inglês, com as mesmas chaves nos dois idiomas. Uma chave em falta aparece como o próprio nome da chave, por isso cada texto novo tem de existir nas duas línguas.
- O idioma e o tema (claro ou escuro) não são guardados no navegador. Passam de página para página pelos parâmetros `?lang=` e `?theme=` do endereço, incluindo quando se vai da página inicial para a pesquisa.
- Cada página tem o seu próprio título e a sua descrição, traduzidos nas duas línguas.

### 22.5. Editor visual (memes, status e pensamentos)

Um único editor (`editor-meme.html`) serve as três categorias. Muda apenas o conteúdo, o nome do modelo e os textos de apoio.

- 16 cores sólidas e 12 gradientes.
- 30 fundos predefinidos, 6 fundos de Natal e 6 de Ano Novo, nas cores de cada época.
- 6 texturas, 8 formas decorativas, 24 ícones e 12 ilustrações.
- Os ícones e as ilustrações arrastam-se na pré-visualização, têm cor e tamanho ajustáveis e apagam-se com a tecla Delete.
- Imagem de fundo carregada do dispositivo, com botão "Escolher imagem" e botão para remover; a imagem não sai do dispositivo.
- 8 modelos para cada categoria visual (memes, status e pensamentos), em 4:5 (1080×1350).
- Texto, fonte, tamanho, alinhamento, etiqueta "MEME 01" opcional e botão de partilha nos dispositivos que o suportam.
- A categoria define o nome do modelo, o título e os textos do editor, mas o comportamento é igual nas três.

### 22.6. Editor de poemas

Construído sobre o mesmo motor visual, com os controlos de edição de texto próprios:

- Título, subtítulo e autor (o autor aparece no fim do poema).
- Estrofes e versos: adicionar, editar, apagar, subir e descer; Enter cria um verso novo.
- Negrito, itálico e sublinhado, tamanho, espaçamento entre linhas e entre estrofes, ornamentos e formato 4:5 ou 9:16.
- O tamanho ajusta-se sozinho até caber; se o poema continuar a não caber, passa para 9:16 e, em último caso, a pré-visualização mostra o poema por páginas (botões ‹ e ›), tal como sairá no PDF.
- Exportação PNG e JPG (apenas quando o poema cabe numa imagem) e PDF com várias páginas.
- Fundos, texturas, ícones e ilustrações como nos restantes editores.

### 22.7. Editor de histórias e leitura

- Título, subtítulo, autor, ano, sinopse e personagens (opcionais).
- Capa: uma das 10 capas, nenhuma, ou uma fotografia da galeria do dispositivo (fica só em memória e vai também para o PDF).
- Capítulos: adicionar, editar título e texto, apagar, subir e descer.
- Formatação do capítulo ativo: negrito, itálico, sublinhado, listas com marcadores ou numeradas e alinhamento à esquerda, ao centro e à direita. Sem texto selecionado, negrito, itálico e sublinhado aplicam-se ao capítulo inteiro.
- Apresentação: tipo de letra (com ou sem serifa), tamanho, espaçamento entre linhas e tema claro, escuro ou sépia.
- O editor trabalha sobre uma cópia da história; o original em `contents.js` nunca é alterado.
- Exportação em PDF de várias páginas A4 (capa, sinopse e personagens, capítulos numerados, cada capítulo numa página nova) e partilha do PDF quando o dispositivo o permite.
- A leitura (`historia-leitura.html` e `poema-leitura.html`) permite ajustar tamanho, espaçamento, fonte e tema. Essas definições ficam só na memória da página.

### 22.8. Pesquisa global

- Procura em memes, status, pensamentos, poemas e histórias (nas histórias também no autor, sinopse e capítulos).
- Pesquisa parcial, sem diferenciar maiúsculas nem acentos; com várias palavras, todas têm de existir no conteúdo.
- Os resultados aparecem numa lista comum, com a etiqueta da categoria, um trecho com as palavras destacadas e ordenados por relevância (o título primeiro; a expressão completa antes das palavras soltas).
- Mensagens claras quando não há texto escrito ou quando não há resultados.
- Ao abrir um resultado: memes, status e pensamentos vão para a escolha de modelo e o editor visual; histórias e poemas abrem a página de leitura, onde existe a opção de editar.
- Funciona com a caixa do cabeçalho e com a da própria página, e o parâmetro `q` pode ser partilhado no endereço (`pesquisa.html?q=amor`).

### 22.9. Exportação e partilha

Formatos: PNG, JPG e PDF, com as mensagens oficiais da secção 12.4. Depois de uma exportação bem-sucedida, os três editores mostram os próximos passos (escolher outro estilo, voltar às categorias, ir para o início). A exportação nunca inclui menus, botões ou controlos do editor, e a mensagem de sucesso só aparece depois de a operação terminar sem erro. A partilha usa a função do dispositivo quando existe; o botão só aparece quando é suportado e a mensagem diz apenas que a janela de partilha foi aberta, nunca que o conteúdo foi partilhado.

**Fundos em SVG e exportação.** Os fundos, ilustrações e capas são ficheiros SVG. Ao exportar, desenhá-los num canvas pelo seu endereço pode falhar quando o site é aberto diretamente como ficheiro (`file://`) ou quando o servidor bloqueia o pedido, porque o navegador marca o canvas como "contaminado" e recusa gerar a imagem. Para evitar isso, cada tipo de fundo segue o seu caminho:

| Fundo | Caminho |
| --- | --- |
| Cor sólida ou gradiente | Captura normal (html2canvas) |
| Imagem da galeria do utilizador | Captura normal (a imagem já é um `blob:`) |
| Fundo predefinido ou temático | Desenhado num canvas limpo, por baixo da captura do texto |

Para os fundos da biblioteca tenta-se, por esta ordem: carregar o ficheiro pelo endereço, ler-se com `fetch()` e converter para data URL e, por fim, usar a cópia embutida em `js/data/embedded-svgs.js`, que não depende de rede e funciona também com `file://`. As ilustrações e as capas usam a mesma cópia embutida.

**Sempre que se acrescentarem ou alterarem fundos, ilustrações ou capas em SVG**, é preciso voltar a gerar o ficheiro embutido, a partir da pasta `StoryVerse`:

```
python3 tools/gerar-svgs-embutidos.py
```

Se isto for esquecido, os servidores http/https continuam a funcionar; só o modo `file://` fica sem o recurso novo. Imagens de outros domínios dependem das permissões CORS do servidor de origem.

**Bibliotecas externas** (carregadas por CDN até à V2): Lucide (ícones), html2canvas (captura) e jsPDF (PDF).

### 22.10. Feedback e métricas

- O botão de feedback fica fixo no canto inferior direito e abre um painel com três opções (sugestão, erro, experiência de utilização). O número do WhatsApp está em `js/data/config.js` (`whatsappNumber`). Abrir o WhatsApp não significa que o feedback foi enviado.
- O Google Analytics 4 só carrega se `gaMeasurementId` em `js/data/config.js` tiver um ID válido (`G-XXXXXXXXXX`). Sem ID, não há métricas.
- Eventos registados: pesquisa, abertura de cada editor (`editor_open`), exportações, escolha de opção de feedback, abertura do WhatsApp, mudança de idioma e de tema, e tentativas de partilha. Representam ações observáveis, não a conclusão de uma ação externa.

### 22.11. SEO, acessibilidade e responsividade

- Título e descrição próprios em cada página, nos dois idiomas, hierarquia de títulos, texto alternativo nas imagens relevantes e ligação "Saltar para o conteúdo".
- `sitemap.xml` e `robots.txt` na raiz do projeto, ambos com endereços de exemplo que têm de ser trocados (ver 22.13).
- Layout testado em largura de telemóvel, tablet e computador; os editores reorganizam os controlos e a pré-visualização conforme o espaço.
- Respeito pelo tema claro e escuro do dispositivo quando o utilizador não escolheu um.

### 22.12. Como testar no computador

O site é estático. Para o ver, basta abrir a pasta `StoryVerse` num servidor local simples, por exemplo:

```
cd StoryVerse
python3 -m http.server 8000
```

e abrir `http://localhost:8000`. Abrir o ficheiro `index.html` diretamente também funciona, mas algumas funções (como carregar ficheiros pelo endereço) dependem do servidor. Os ícones (Lucide), o html2canvas e o jsPDF vêm de CDNs, por isso é preciso ligação à internet.

### 22.13. Publicação

**V1 — GitHub Pages**

1. Criar um repositório no GitHub e enviar o conteúdo da pasta `StoryVerse` para a raiz do repositório.
2. Em *Settings → Pages*, escolher o ramo principal e a pasta raiz.
3. O endereço fica `https://UTILIZADOR.github.io/REPOSITORIO/`. Todas as ligações do projeto são relativas, por isso funcionam nesse sub-caminho.
4. O endereço real (`https://zmtechnexorastudio-spec.github.io/storyverse/`) já está em `sitemap.xml` e `robots.txt`. Num repositório normal o Google só lê o `robots.txt` da raiz de `utilizador.github.io`, por isso o importante é enviar o `sitemap.xml` no Google Search Console.
5. O ID do Google Analytics (`G-KBDBSCF925`) já está em `gaMeasurementId`, em `js/data/config.js`. Depois de publicar, confirmar em Relatórios → Tempo real.

**V1.5 — Vercel ou Cloudflare Pages.** A passagem para um domínio próprio fica para a V1.5. Quando acontecer, atualizar o endereço no `sitemap.xml` e no `robots.txt` (e, se o site ficar na raiz do domínio, o `robots.txt` passa a ser lido normalmente).

### 22.14. Divergências da Parte I já resolvidas

- **Quantidade de conteúdos:** implementados os 210 oficiais.
- **LocalStorage:** não é utilizado em nenhum ponto; idioma e tema passam pelo endereço.
- **Página "Criar":** existe e faz parte da navegação (`criar.html` seleciona a categoria e leva ao modelo e ao editor).
- **Formatos:** PNG, JPG e PDF; sem TXT.
- **Planeador de histórias:** não implementado, como previsto.
- **Templates visuais:** a proposta inicial era de 24; foram feitos 32 (8 para cada categoria visual, mais 4 de poemas e 4 de histórias).

### 22.15. Pendências antes do lançamento

1. **Google Analytics:** preencher o ID em `js/data/config.js`.
2. **Endereço do site:** trocar os endereços de exemplo em `sitemap.xml` e `robots.txt`.
3. **Exportação em dispositivos reais:** confirmar PNG, JPG e PDF num telemóvel e num computador, porque as verificações automáticas usaram versões simuladas das bibliotecas de exportação.
4. **Revisão de conteúdo:** rever os títulos em inglês das histórias HIS-001 a HIS-020; confirmar os direitos de utilização das fotografias das capas de Messi e Ronaldo (a de Messi é pequena e pode ficar menos nítida na capa do PDF); rever os textos base de Privacidade e Termos.
5. **Depois de publicar:** verificar a indexação (Search Console) e as métricas no GA4.

### 22.15.1. Auditoria final (resultados)

Verificado de forma automática sobre o projeto completo:

- Todas as ligações e ficheiros referenciados nas páginas existem; não há identificadores repetidos nem erros de sintaxe nos ficheiros JavaScript.
- As chaves de tradução existem nos dois idiomas, sem textos vazios.
- Os 210 conteúdos têm identificador único e texto e título em português e inglês, com a distribuição oficial (geral, Natal e Ano Novo) em cada categoria.
- 22 páginas e estados abertos em português e inglês, tema claro e escuro, computador e telemóvel (176 combinações por formato): sem erros de JavaScript, sem pedidos falhados, com cabeçalho e rodapé em todas e sem barra de deslocação horizontal nos telemóveis.
- Corrigidos nesta fase: o ícone do site pesava 3,7 MB (agora cerca de 70 KB); as páginas institucionais tinham ligações partidas; o editor de poemas alargava a página em telemóveis; a mensagem de sucesso da exportação de memes, status e pensamentos passou a ser a mensagem oficial; o fluxo de regresso depois de exportar passou a existir nos três editores.
- Pesos: HTML cerca de 120 KB, CSS cerca de 95 KB, JavaScript cerca de 790 KB (dos quais 344 KB são a cópia embutida dos SVG e 228 KB os conteúdos), SVG cerca de 1,3 MB no total, fotografias cerca de 300 KB.

### 22.16. Regras para continuar o desenvolvimento

- Cada texto novo da interface precisa de chave nos dois idiomas em `languages.js`.
- Cada conteúdo novo precisa de `id` único e de versões `pt` e `en`.
- Depois de mexer em SVGs, voltar a gerar `embedded-svgs.js` (ver 22.9).
- Entregar sempre o projeto completo, só com ficheiros `.html`, `.css` e `.js` no site.
- Nada de gravação automática, contas, base de dados ou LocalStorage na V1.


### 22.16. Favicon (ícone do separador)

O ícone do separador existe em vários formatos para funcionar em qualquer navegador e no GitHub Pages: `assets/logo/favicon.ico` (e uma cópia `favicon.ico` na raiz), `favicon-32.png`, `favicon-192.png` e `apple-touch-icon.png` (ecrã inicial do iPhone). Todas as páginas apontam para estes ficheiros com `?v=2`; quando trocares o ícone, sobe esse número para forçar os navegadores a descarregá-lo de novo. Se o ícone antigo ainda aparecer depois de publicar, é a cache do navegador: abre o site numa janela privada ou limpa os dados do site.

### 22.17. Redes sociais

A página de Contactos mostra, a seguir ao botão do WhatsApp, cinco botões para as redes da Nexora: Instagram, Facebook, TikTok, X e YouTube. Os endereços estão escritos diretamente em `pages/contactos.html` (versão portuguesa e inglesa). Abrem num separador novo.

### 22.18. Links dos editores abrem a página inicial

Se alguém abrir o link de um editor vindo de fora (WhatsApp, redes sociais, endereço escrito à mão), é levado para a página inicial, porque um editor aberto assim é só uma página vazia. Isto é feito por `js/modules/entry-guard.js`, incluído no início de `editor-meme.html`, `editor-poema.html`, `editor-historia.html` e `editor-conteudo.html`. O script só deixa o editor abrir quando a visita vem de outra página do próprio site, ou quando a página é recarregada, ou quando se volta atrás. O idioma e o tema do link são mantidos. Para desativar, basta retirar a linha do script dessas quatro páginas.
