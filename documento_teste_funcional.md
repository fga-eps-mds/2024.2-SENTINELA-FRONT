# Documento de Teste Funcional

## Projeto SENTINELA
## Versão: 0.0.1
## Atualizado em: 28/01/2025

### Sumário
1. [Introdução](#1-introdução)
2. [Casos de Teste](#2-casos-de-teste)
   1. [CT-01 Criar Usuario](#21-ct-01-criar-usuario)
   2. [CT-02 Realizar Login](#22-ct-02-realizar-login)
   3. [CT-03 Aceitar Usuario](#23-ct-03-aceitar-usuario) 
3. [Ambiente de Teste](#3-ambiente-de-teste)
4. [Conclusão](#4-conclusão)
5. [Changelog](#5-changelog)

### 1. Introdução
Este documento descreve os testes funcionais para o projeto SENTINELA.  
O objetivo é garantir o bom funcionamento do sistema bem como auxiliar as equipes de desenvolvimento posteriores.

### 2. Casos de Teste

#### 2.1. CT-01 Criar Usuário  
- **Descrição**:  
Cria usuários no sistema

- **Procedimento**:   
1) Acessar o sistema como usuário sem login  
2) Clicar em "Filiar", no canto superior direito da tela  
3) Preencher os dados pessoais  
4) Clicar em "Enviar solicitação"  
5) Clicar em "Solicitar Filiação ao Sindpol-DF"  

- **Entrada**: 
Ao preencher os dados pessoais  						
	Nome: Sicrana da Silva  
	Religião: Católica  
	Tipo Sanguíneo: A+  
	Matrícula: 012345678  
	Data de Nascimento: 01/01/2001  
	Sexo: Feminino  
	Naturalidade: Brasília  
	UF: DF  
	Estado Civil: Solteiro  
	Escolaridade: Mestrado  
	RG: 1100112223  
	Órgão expedidor: SSP  
	UF: DF  
	CPF: 00055544488  
	Data de Expedição: 01/01/2016  
	Nome do Pai: Pai de Sicrana  
	Nome da mãe: Mãe de Sicrana  
	e-mail: [oculto]*  
	Celular: (61) 99123-9123  
	Telefone:  
	Cep:  
	Cidade:  
	UF:  
	Logradouro:  
	Complemento:  
	Cargo: Cargo da Sicrana  
	Data de Contratação: 01/01/2023  
	Lotação: Setor de Alimentação  
	Órgão: Polícia Penal  
	Posto de Trabalho: Posto de trabalho da Sicrana  

- **Resultado Esperado**:  
Retorno à página inicial do Sistema

- **Resultado Obtido:**:  
Retorno à página inicial do sistema

- **Observações**:  
E-mail de recebimento de cadastro deve ser recebido no endereço de email fornecido.

***

#### 2.2. CT-02 Realizar Login
- **Descrição**: 
Realiza login no sistema

- **Procedimento**:  
1) Acessar o sistema como usuário sem login  
2) Preencher dados de login  
3) Clicar em "Entrar"  

- **Entrada**:  
*Ao preencher dados de login:  
  *email: [oculto]   
  *senha [oculto]  

- **Resultado Esperado**:
Visualiza a página de usuário do sistema, que possui:
Um menu na esquerda com:
	* o brasão do Sindpol;
	* o logotipo do SENTINELA;
	* links para navegação do site;
	* a mensagem "Você está logado como [usuário]";
		- onde [usuário] é o nome do usuário logado;
	* opção de realizar o logout.
Um quadro no centro e direita com informações a respeito do sistema.

- **Resultado Obtido**:  
Visualização da página de usuário do sistema, que possui:
Um menu na esquerda com:
	* o brasão do Sindpol;
	* o logotipo do SENTINELA;
	* links para navegação do site incluindo o link "página inicial";
	* a mensagem "Você está logado como [usuário]";
		- onde [usuário] é o nome do usuário logado;
	* opção de realizar o logout.
Um quadro no centro e direita com informações a respeito do sistema.

- **Observações**:  
sem observações

***

#### 2.3. CT-03 Aceitar Usuário
- **Descrição**: 
Aceita um usuário pendente, dando a ele acesso ao sistema.

- **Procedimento**:
1) Acessar o sistema como usuário Administrador
2) No menu lateral, selecionar a opção "Cadastros"
3) Selecionar "Filiações Pendentes"
4) Selecionar usuários da lista
5) Selecionar "Aprovar"

- **Entrada**:
Ao selecionar usuários da lista
	Marcar a checkbox referente à Sicrana da Silva

- **Resultado Esperado**:
Uma mensagem confirmando a aprovação da senha deve aparecer na tela.

- **Resultado Obtido**:
Uma mensagem apareceu na tela confirmando a aprovação da solicitação.

- **Observações**:
Um email é enviado ao e-mail cadastrado do usuario que foi aceito, para que ele gere a senha de acesso ao sistema.

***

### 3. Ambiente de Teste
Descrição do ambiente de teste:  
- Software: Windows 11 Home Single Language  
  *Versão: 24H2  
  *Compilação do SO: 26100.2894  
- Navegador: Opera GX  
  *Fluxo de atualização:Early Access  	
  *Core:115.0.5322.152  
  *Sistema:Windows 11 64-bit  
  *Versão do Chromium:130.0.6723.170  

### 4. Conclusão
[WIP]

### 5. Changelog
#### Versão 0.0.1 - 29/01/2025
- Primeira versão do documento criada.
