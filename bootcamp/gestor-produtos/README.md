# Gestor de Produtos

Projecto educativo de **TypeScript avançado** que implementa uma aplicação de
gestão de produtos de uma loja, executada no **terminal** (sem interface gráfica).

O objectivo não é ter muitas funcionalidades, mas sim demonstrar os conceitos
avançados de TypeScript em situações reais: tipos, organização de tipos,
programação orientada a objectos, validação com Zod e consumo de uma API externa.

---

## 1. Descrição do projecto

A aplicação permite gerir o inventário de uma loja através de um menu interactivo:

1. Cadastrar produto
2. Listar produtos
3. Procurar produto pelo ID
4. Actualizar produto
5. Remover produto
6. Calcular o valor total do inventário
7. Sair
8. Consultar a meteorologia em Maputo (funcionalidade extra, independente)

Todos os dados são validados com **Zod** antes de serem guardados.
A meteorologia é obtida da API pública **Open-Meteo**.

---

## 2. Objectivos de aprendizagem

No final deste projecto o aluno deve saber:

- Criar e organizar **tipos** (interfaces, type aliases, unions, enums).
- Usar tipos avançados: `typeof`, `keyof`, Indexed Access Types, `as const`,
  Template Literal Types, Conditional Types, `infer`, `never`, Mapped Types.
- Usar os **Utility Types**: `Partial`, `Required`, `Pick`, `Omit`, `Record`,
  `Readonly` e `ReturnType`.
- Escrever **classes** com herança, interfaces, classes abstractas,
  modificadores de acesso, campos privados com `#`, `static`, getters/setters
  e Parameter Properties.
- Validar dados externos com **Zod** (`z.object`, `z.enum`, `z.infer`,
  `safeParse`) e lidar com `unknown` sem usar `any`.
- Consumir uma **API externa** com `fetch`, `async/await` e validação da resposta.
- Configurar o TypeScript para Node.js com módulos ES e correr
  `tsc --noEmit`, `tsc` e `tsx`.

---

## 3. Tecnologias utilizadas

| Tecnologia     | Para que serve                                            |
| -------------- | --------------------------------------------------------- |
| **TypeScript** | Linguagem principal (tipos + compilação)                  |
| **Node.js**    | Ambiente de execução (versão 20 ou superior)              |
| **Zod**        | Validação de dados recebidos do exterior                  |
| **tsx**        | Executar TypeScript directamente, sem compilar à mão      |
| **npm**        | Gestão de dependências e scripts                          |

---

## 4. Instalação

```bash
# 1. Entrar na pasta do projecto
cd gestor-produtos

# 2. Instalar as dependências
npm install
```

Requisitos: **Node.js 20+** e **npm**.

---

## 5. Estrutura de pastas

```
gestor-produtos/
├── src/
│   ├── types/
│   │   ├── produto.ts          # Tipos do domínio (Produto, Categoria, enum, utility types)
│   │   └── index.ts            # Ponto único de importação dos tipos + Resultado<T>
│   ├── schemas/
│   │   └── produto.schema.ts   # Schemas Zod (criar e actualizar produto)
│   ├── classes/
│   │   ├── Documento.ts        # Classe abstracta (base)
│   │   └── GestorProdutos.ts   # Classe principal (extends + implements)
│   ├── services/
│   │   ├── produto.service.ts  # Validação e apresentação de produtos
│   │   └── meteo.service.ts    # API Open-Meteo (fetch + async/await)
│   ├── utils/
│   │   └── validadores.ts      # Type Guards, validação genérica e formatação
│   ├── declarations/
│   │   └── exemplo.d.ts        # Declarações de tipos (.d.ts)
│   ├── testes.ts               # Testes das funcionalidades principais
│   └── main.ts                 # Menu interactivo (ponto de entrada)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 6. Como executar

| Comando             | O que faz                                              |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Executa a aplicação no terminal (com `tsx`)            |
| `npm test`          | Corre os testes das funcionalidades principais         |
| `npm run typecheck` | Verifica os tipos sem gerar JavaScript (`tsc --noEmit`)|
| `npm run build`     | Compila o projecto para a pasta `dist/`                |
| `npm start`         | Executa o JavaScript já compilado (`node dist/main.js`)|
| `npm run meteo`     | Consulta a meteorologia sem abrir o menu               |

Exemplo de sessão:

```
$ npm run dev

========================================
  Gestor de Produtos v1.0.0
========================================
  1. Cadastrar produto
  ...
Opção: 1

--- Novo produto ---
Nome: Arroz
Preço (MT): 450
Categorias: mercearia | bebidas | limpeza
Categoria: mercearia
Descrição (opcional): Arroz agulha 5kg
  OK Produto cadastrado: #  1  Arroz   450,00 MTn  [Mercearia]  (categoria:mercearia)  Arroz agulha 5kg
```

---

## 7. Como testar as funcionalidades

### 7.1. Testes automáticos

```bash
npm test
```

O ficheiro `src/testes.ts` verifica 40 casos: Type Guards, validação com Zod,
todas as operações do gestor, os utilitários e a API externa.
No final mostra um resumo, por exemplo `Testes: 40 | Falhas: 0`.

### 7.2. Verificar os tipos e compilar

```bash
npm run typecheck   # tem de terminar sem erros
npm run build       # gera a pasta dist/
npm start           # corre o resultado compilado
```

### 7.3. Testar à mão no terminal

| Funcionalidade      | Como testar                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| Cadastrar           | Opção `1` → nome `Arroz`, preço `450`, categoria `mercearia`                |
| Validação           | Opção `1` → nome `A` (curto), preço `-5`, categoria `peixe` → mensagem de erro |
| Listar              | Opção `2` → mostra todos os produtos com o preço formatado                  |
| Procurar            | Opção `3` → id `1` (existe) e id `999` (não existe)                         |
| Actualizar          | Opção `4` → id `1`, preencher só o nome e deixar o resto vazio              |
| Remover             | Opção `5` → id `1`; repetir → mensagem de erro                              |
| Inventário          | Opção `6` → soma dos preços                                                 |
| Opção inválida      | Escrever `99` → mensagem "Opção inválida"                                   |
| Meteorologia        | Opção `8` → temperatura e vento em Maputo                                   |

> A entrada também funciona por *pipe*, o que permite automatizar testes:
> `Get-Content respostas.txt | npm run dev`

---

## 8. Conceitos TypeScript demonstrados

### 8.1. Tipos avançados

| Conceito                  | Onde aparece                                                                   |
| ------------------------- | ------------------------------------------------------------------------------ |
| `typeof`                  | `types/produto.ts` (`Categoria`), `utils/validadores.ts` (`ReturnType<typeof …>`) |
| `keyof`                   | `types/produto.ts` (`ChaveDoProduto`), `utils/validadores.ts` (`obterCampo`), `classes/GestorProdutos.ts` (`buscarPorCampo`) |
| Indexed Access Types      | `types/produto.ts` (`Produto["precoMT"]`), `utils/validadores.ts` (`Produto[K]`) |
| `as const`                | `types/produto.ts` (`CATEGORIAS`), `services/meteo.service.ts` (`COORDENADAS_MAPUTO`) |
| Template Literal Types    | `types/produto.ts` (`ChaveDeCategoria`, `CodigoProduto`), `main.ts` (`OpcaoMenu`) |
| Conditional Types         | `types/produto.ts` (`ElementoDoArray`), `types/index.ts` (`Resultado`, `Iguais`) |
| `infer`                   | `types/produto.ts` (`ElementoDoArray<T>`)                                      |
| `never`                   | `types/produto.ts`, `utils/validadores.ts` (`verificarExaustividade`), `main.ts` (switch) |
| Type Guards               | `utils/validadores.ts` (`isCategoria`, `isProduto`), `main.ts` (`isOpcaoMenu`) |
| Type Predicates           | `utils/validadores.ts` (retorno `valor is Categoria` / `valor is Produto`)      |
| Mapped Types              | `types/produto.ts` (`ProdutoEmTexto`), usado em `services/produto.service.ts`   |
| `Partial`                 | `types/produto.ts` (`ActualizacaoProduto`)                                     |
| `Required`                | `types/produto.ts` (`ProdutoCompleto`)                                         |
| `Pick`                    | `types/produto.ts` (`IdentificacaoProduto`)                                    |
| `Omit`                    | `types/produto.ts` (`NovoProduto`)                                             |
| `Record`                  | `types/produto.ts` (`EtiquetaPorCategoria`), `utils/validadores.ts` (`ETIQUETAS`) |
| `Readonly`                | `types/produto.ts` (`ProdutoImutavel`), `classes/Documento.ts`                  |
| `ReturnType`              | `utils/validadores.ts`, `services/produto.service.ts` (`ResultadoDaBusca`)      |

### 8.2. Organização de tipos

| Conceito                  | Onde aparece                                                        |
| ------------------------- | ------------------------------------------------------------------- |
| Interfaces                | `types/produto.ts`, `classes/GestorProdutos.ts` (`ColeccaoDeProdutos`), `declarations/exemplo.d.ts` |
| Type Aliases              | `types/produto.ts`, `types/index.ts`                                 |
| Union Types               | `types/produto.ts` (`Categoria`, `Estado`), `types/index.ts` (`Resultado<T>`) |
| Enum vs Union Type        | `types/produto.ts` (`EstadoProduto` vs `Estado`)                     |
| `import` / `export`       | em todos os módulos                                                  |
| `import type`             | `main.ts`, `classes/Documento.ts`, `services/*.ts`                    |
| Ficheiros `.d.ts`         | `declarations/exemplo.d.ts` (módulo externo + namespace global)       |

### 8.3. Programação Orientada a Objectos

| Conceito                  | Onde aparece                                                       |
| ------------------------- | ------------------------------------------------------------------ |
| Classes                   | `classes/Documento.ts`, `classes/GestorProdutos.ts`                 |
| Interfaces (contrato)     | `classes/GestorProdutos.ts` (`ColeccaoDeProdutos`)                  |
| `extends` e `implements`  | `class GestorProdutos extends Documento implements ColeccaoDeProdutos` |
| Classes abstractas        | `classes/Documento.ts` (`abstract class` + `abstract resumo()`)     |
| `public`, `private`, `protected` | `classes/Documento.ts`, `classes/GestorProdutos.ts`          |
| `readonly`                | `types/produto.ts` (`id`), `classes/Documento.ts`                   |
| `static`                  | `classes/Documento.ts` (`versao`), `classes/GestorProdutos.ts` (`instanciasCriadas`) |
| Campos privados com `#`   | `classes/Documento.ts` (`#criadoEm`, `#historico`), `classes/GestorProdutos.ts` (`#produtos`, `#proximoId`) |
| Getters e setters         | `classes/Documento.ts` (`criadoEm`, `historico`), `classes/GestorProdutos.ts` (`nomeDaLoja`, `quantidade`) |
| Parameter Properties      | `classes/Documento.ts` (`constructor(public readonly titulo: string, …)`) |
| Métodos e propriedades    | `classes/GestorProdutos.ts` (`adicionar`, `listar`, `buscar`, `actualizar`, `remover`, `calcularInventario`) |

### 8.4. Validação e execução

| Conceito                          | Onde aparece                                                       |
| --------------------------------- | ------------------------------------------------------------------ |
| Zod                               | `schemas/produto.schema.ts`, `services/meteo.service.ts`            |
| `z.object()`                      | `schemas/produto.schema.ts`, `services/meteo.service.ts`            |
| `z.infer`                         | `schemas/produto.schema.ts`, `services/meteo.service.ts` (`Previsao`) |
| `safeParse()`                     | `utils/validadores.ts` (`validarComSchema`)                         |
| `z.enum()`                        | `schemas/produto.schema.ts` (`categoriaSchema`)                     |
| Campos opcionais                  | `schemas/produto.schema.ts` (`descricao`)                           |
| Validação de dados externos       | `main.ts` (dados do teclado), `services/meteo.service.ts` (resposta da API) |
| `unknown`                         | `utils/validadores.ts`, `main.ts`, `services/meteo.service.ts`      |
| `async` / `await`                 | `main.ts`, `services/meteo.service.ts`                              |
| `fetch`                           | `services/meteo.service.ts`                                         |
| `Promise`                         | `services/meteo.service.ts` (`Promise<Resultado<Previsao>>`)        |
| `typecheck` com `tsc --noEmit`    | `npm run typecheck`                                                 |

---

## 9. Notas de implementação

- **Nunca usamos `any`.** Os dados que vêm de fora são tratados como `unknown`
  e só são usados depois de validados (Type Guard ou Zod).
- Em vez de lançar excepções para tudo, as operações devolvem `Resultado<T>`:
  uma união discriminada com `sucesso: true | false`. Assim o TypeScript
  obriga-nos a tratar o erro antes de usar os dados.
- O `tsconfig.json` está em modo `strict` e ainda activa
  `noUncheckedIndexedAccess` e `exactOptionalPropertyTypes`, o que obriga a
  escrever código mais seguro (por exemplo, nunca guardar `undefined` numa
  propriedade opcional).
- Os imports usam a extensão `.ts`; com `rewriteRelativeImportExtensions` o
  TypeScript converte automaticamente para `.js` ao compilar, por isso o mesmo
  código corre com `tsx` e com `node dist/main.js`.
- O valor do inventário é a soma dos preços de todos os produtos em stock.

---

## 10. Licença

Projecto educativo — MIT.
