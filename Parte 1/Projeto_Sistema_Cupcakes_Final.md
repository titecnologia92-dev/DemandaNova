# Projeto: Sistema de Pedidos de Cupcakes

**Aluno:** Vladimir André Rojas  
**RGM:** 26384892  

## 1. Introdução
Este documento apresenta o desenvolvimento do sistema de pedidos de cupcakes, abordando sua concepção, modelagem e funcionalidades. Inclui artefatos como backlog de produto, diagramas UML e protótipos de interface, detalhando as etapas do processo de desenvolvimento.

## 2. Objetivo
Criar um sistema eficiente de pedidos de cupcakes, permitindo que usuários escolham produtos, façam pedidos e realizem pagamentos de forma intuitiva. O objetivo é otimizar a experiência do cliente e melhorar a gestão de pedidos.

## 3. Backlog do Produto
| ID  | História de Usuário | Prioridade | Pontos |
|-----|----------------------|-------------|---------|
| 01 | Criar conta no app | Alta | 3 |
| 02 | Fazer login | Alta | 2 |
| 03 | Escolher um cupcake | Média | 5 |
| 04 | Adicionar cupcake ao carrinho | Média | 4 |
| 05 | Finalizar compra | Alta | 8 |
| 06 | Escolher método de entrega | Média | 3 |
| 07 | Rastrear pedido | Baixa | 3 |
| 08 | Cancelar pedido | Baixa | 6 |
| 09 | Avaliar compra | Baixa | 2 |
| 10 | Receber notificação de promoção | Baixa | 4 |

## 4. Diagramas UML
### 4.1. Diagrama de Casos de Uso
Representa as interações dos usuários com o sistema, incluindo ações como criar conta, fazer login, adicionar produtos ao carrinho e finalizar pedidos.

### 4.2. Diagrama de Classes
Estrutura a modelagem do sistema, destacando as principais classes e suas relações: `Usuário`, `Pedido`, `Produto`, `Pagamento` e `Entrega`.

### 4.3. Diagrama de Sequência
Demonstra o fluxo da finalização de uma compra, mostrando as interações entre usuário, sistema e provedores externos.

### 4.4. Diagrama de Atividades
Apresenta o fluxo do processo de compra, desde a seleção do produto até a confirmação do pedido.

### 4.5. Modelo de Domínio
Exibe as principais entidades do sistema e suas relações conceituais.

### 4.6. Diagrama de Pacotes
Organiza os módulos do sistema, segmentando as funcionalidades em Autenticação, Produtos, Carrinho, Pedidos, Pagamentos e Entrega.

## 5. Wireframes e Protótipos
Wireframes desenvolvidos para ilustrar a interface do usuário:
- Login
- Listagem de Produtos
- Detalhes do Produto
- Carrinho de Compras
- Checkout
- Confirmação de Pedido
- Telas de Erro

## 6. Metodologia
O projeto foi conduzido com metodologia **SCRUM**, utilizando backlog priorizado e **sprints iterativas**.  
Aplicaram-se princípios de **UX/UI** para criar interfaces intuitivas e acessíveis.

## 7. Conclusão
O sistema foi modelado de forma escalável e modular.  
Com os diagramas UML e os protótipos, é possível implementar o sistema com eficiência, garantindo uma experiência fluida ao usuário.  
**Próximos passos:** desenvolvimento da aplicação, implementação da API e testes de usabilidade.