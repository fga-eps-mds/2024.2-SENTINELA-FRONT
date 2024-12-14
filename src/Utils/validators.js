export const isValidEmail = (email) => {
  if (!email) {
    return { isValid: true };
  }

  const allowedDomains = [
    "com",
    "net",
    "org",
    "com.br",
    "org.br",
    "edu",
    "gov",
  ];
  console.log[allowedDomains];

  const domainPattern = allowedDomains
    .map((domain) => {
      const escapedDomain = domain.replace(/\./g, "\\.");
      return `(?:[a-zA-Z0-9.-]+\\.)?${escapedDomain}`;
    })
    .join("|");

  const emailRegex = new RegExp(
    `^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9.-]+\\.)?(${domainPattern})$`,
    "i"
  );

  const isValid = emailRegex.test(email);

  return isValid
    ? { isValid: true }
    : { isValid: false, message: "O e-mail fornecido não é válido." };
};

export const isValidCelular = (celular) => {
  const cleanedNumber = celular.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (!cleanedNumber) {
    return { isValid: true };
  }

  if (cleanedNumber.length < 10 || cleanedNumber.length > 11) {
    return { isValid: false, message: "O telefone fornecido não é válido." };
  }

  return { isValid: true };
};

export const isValidSite = (site) => {
  if (!site) {
    return { isValid: true };
  }

  const urlPattern =
    /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

  // Verifica se a URL corresponde ao padrão
  const isValid = urlPattern.test(site);

  return isValid
    ? { isValid: true }
    : { isValid: false, message: "O site fornecido não é válido." };
};

export const mascaraTelefone = (telefone) => {
  let formattedTelefone = telefone.replace(/\D/g, "");
  if (formattedTelefone.length > 11) {
    formattedTelefone = formattedTelefone.slice(0, 11);
  }
  return formattedTelefone
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
};

export const mascaraCEP = (cep) => {
  let formattedCEP = cep.replace(/\D/g, "");
  if (formattedCEP.length > 8) {
    formattedCEP = formattedCEP.slice(0, 8);
  }
  return formattedCEP.replace(/(\d{5})(\d)/, "$1-$2");
};

export const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11) {
      console.error("Erro: CPF deve conter 11 d�gitos");
      return false;
  }

  if (/^(\d)\1+$/.test(cpf)) {
      console.error("Erro: CPF n�o pode conter todos d�gitos iguais");
      return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
      resto = 0;
  }
  if (resto !== parseInt(cpf.charAt(9))) {
      console.error("Erro: Primeiro d�gito verificador do CPF � inv�lido");
      return false;
  }

  soma = 0;
  for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
      resto = 0;
  }
  if (resto !== parseInt(cpf.charAt(10))) {
      console.error("Erro: Segundo d�gito verificador do CPF � inv�lido");
      return false;
  }

  return true;
};

export const handleCpfCnpjInput = (value) => {
  const numericValue = value.replace(/\D/g, "");
  if (numericValue.length <= 11) {
    return numericValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14); // CPF formatado
  } else {
    return numericValue
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d{1,3})$/, "$1-$2")
      .slice(0, 18);
  }
};

export const isValidTelefone = (telefone) => {
  const cleanedNumber = telefone.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (!cleanedNumber) {
    return { isValid: true };
  }

  if (cleanedNumber.length != 10) {
    return { isValid: false, message: "O telefone fornecido não é válido." };
  }

  return { isValid: true };
};

export const mascaraCelular = (celular) => {
  let formattedCelular = celular.replace(/\D/g, "");
  if (formattedCelular.length > 11) {
    formattedCelular = formattedCelular.slice(0, 11);
  }
  return formattedCelular
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2");
};

export const validaSenha = (novaSenha) => {
  const comprimentoMinimo = 8;
  const temMaiuscula = /[A-Z]/.test(novaSenha);
  const temMinuscula = /[a-z]/.test(novaSenha);
  const temNumero = /\d/.test(novaSenha);

  if (novaSenha.length < comprimentoMinimo) {
      return {
          status: false,
          message: `A senha deve ter pelo menos ${comprimentoMinimo} caracteres`,
      };
  }

  if (!temMaiuscula) {
      return {
        status: false,
        message: "A senha deve ter pelo menos uma letra maiuscula",
      };
  }

  if (!temMinuscula) {
    return{
      status: false,
      message: "A senha deve ter pelo menos uma letra minuscula",
    };
  }

  if (!temNumero) {
    return{
      status: false,
      message: "A senha deve ter pelo menos um numero",
    };
  }

  return{
    status: true,
    message: "Senha válida",
  };
};