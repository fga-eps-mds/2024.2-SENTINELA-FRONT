# Documento de Teste Funcional

## Projeto SENTINELA
## Vers�o: 0.0.1
## Atualizado em: 28/01/2025

### Sum�rio
1. [Introdu��o](#1-introdu��o)
2. [Casos de Teste](#2-casos-de-teste)
   2.1. [Caso de Teste CT-01](#21-ct-01)
   2.2. [Caso de Teste CT-02](#22-ct-02)
3. [Ambiente de Teste](#3-ambiente-de-teste)
4. [Conclus�o](#4-conclus�o)
5. [Changelog](#5-changelog)

### 1. Introdu��o
Este documento descreve os testes funcionais para o projeto SENTINELA.
O objetivo � garantir o bom funcionamento do sistema bem como auxiliar as equipes de desenvolvimento posteriores.

### 2. Casos de Teste

#### 2.1. CT-01: Criar Usu�rio
- **Descri��o**: 
Cria usu�rios no sistema

- **Procedimento**: 
1) Acessar o sistema como usu�rio sem login
2) Clicar em "Filiar", no canto superior direito da tela
3) Preencher os dados pessoais
4) Clicar em "Enviar solicita��o"
5) Clicar em "Solicitar Filia��o ao Sindpol-DF"

- **Entrada**: 
Ao preencher os dados pessoais
	Nome: Sicrana da Silva
	Religi�o: Cat�lica
	Tipo Sangu�neo: A+
	Matr�cula: 012345678
	Data de Nascimento: 01/01/2001
	Sexo: Feminino
	Naturalidade: Bras�lia
	UF: DF
	Estado Civil: Solteiro
	Escolaridade: Mestrado
	RG: 1100112223
	�rg�o expedidor: SSP
	UF: DF
	CPF: 00055544488
	Data de Expedi��o: 01/01/2016
	Nome do Pai: Pai de Sicrana
	Nome da m�e: M�e de Sicrana
	e-mail: [oculto]*
	Celular: (61) 99123-9123
	Telefone:
	Cep:
	Cidade:
	UF:
	Logradouro:
	Complemento:
	Cargo: Cargo da Sicrana
	Data de Contrata��o: 01/01/2023
	Lota��o: Setor de Alimenta��o
	�rg�o: Pol�cia Penal
	Posto de Trabalho: Posto de trabalho da Sicrana

- **Resultado Esperado**: 
Retorno � p�gina inicial do Sistema

- **Resultado Obtido:**:
Retorno � p�gina inicial do sistema

- **Observa��es:**
E-mail de recebimento de cadastro deve ser recebido no endere�o de email fornecido.

#### 2.2. CT-02 Realizar Login
- **Descri��o**: 
Realiza login no sistema

- **Procedimento**:
1) Acessar o sistema como usu�rio sem login
2) Preencher dados de login
3) Clicar em "Entrar"

- **Entrada**:
Ao preencher dados de login:
email: [oculto]
senha [oculto]

- **Resultado Esperado**:
Visualiza a p�gina de usu�rio do sistema, que possui:
Um menu na esquerda com:
	- o bras�o do Sindpol;
	- o logotipo do SENTINELA;
	- links para navega��o do site;
	- a mensagem "Voc� est� logado como [usu�rio]";
		onde [usu�rio] � o nome do usu�rio logado;
	- op��o de realizar o logout.
Um quadro no centro e direita com informa��es a respeito do sistema.

- **Resultado Obtido**:
Visualiza��o da p�gina de usu�rio do sistema, que possui:
Um menu na esquerda com:
	- o bras�o do Sindpol;
	- o logotipo do SENTINELA;
	- links para navega��o do site incluindo o link "p�gina inicial";
	- a mensagem "Voc� est� logado como [usu�rio]";
		onde [usu�rio] � o nome do usu�rio logado;
	- op��o de realizar o logout.
Um quadro no centro e direita com informa��es a respeito do sistema.

- *Observa��es**:
sem observa��es

#### 2.3. CT-03 Aceitar usu�rio.
- **Descri��o**: 
Aceita um usu�rio pendente, dando a ele acesso ao sistema.

- **Procedimento**:
1) Acessar o sistema como usu�rio Administrador
2) No menu lateral, selecionar a op��o "Cadastros"
3) Selecionar "Filia��es Pendentes"
4) Selecionar usu�rios da lista
5) Selecionar "Aprovar"

- **Entrada**:
Ao selecionar usu�rios da lista
	Marcar a checkbox referente � Sicrana da Silva

- **Resultado Esperado**:
Uma mensagem confirmando a aprova��o da senha deve aparecer na tela.

- **Resultado Obtido**:
Uma mensagem apareceu na tela confirmando a aprova��o da solicita��o.

- *Observa��es**:
Um email � enviado ao e-mail cadastrado do usuario que foi aceito, para que ele gere a senha de acesso ao sistema.

### 3. Ambiente de Teste
Descri��o do ambiente de teste:
- Software: Windows 11 Home Single Language
	Vers�o: 24H2
	Compila��o do SO: 26100.2894
- Navegador: Opera GX
	Fluxo de atualiza��o:Early Access
	Core:115.0.5322.152
	Sistema:Windows 11 64-bit
	Vers�o do Chromium:130.0.6723.170

### 4. Conclus�o
[WIP]

### 5. Changelog
#### Vers�o 0.0.1 - 29/01/2025
- Primeira vers�o do documento criada.
