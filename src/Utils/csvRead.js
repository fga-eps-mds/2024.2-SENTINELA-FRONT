import Papa from "papaparse";
import { getMemberShip, updateMembership } from "../Services/memberShipService";

export const readcsv = async (file, delimiter = "") => {
  if (!file) {
    console.error("Nenhum arquivo selecionado.");
    throw new Error("Nenhum arquivo selecionado.");
  }

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const mascaraCPF = (cpf) => {
    let formattedCPF = cpf.replace(/\D/g, "");
    if (formattedCPF.length > 11) formattedCPF = formattedCPF.slice(0, 11);

    return formattedCPF
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleUpdateUser = async (user, formData) => {
    console.log("handleUpdateUser chamada");
    try {
      const message = await updateMembership(user._id, formData);
      if (message) {
        throw new Error(message);
      }
    } catch (error) {
      console.error(`Erro ao atualizar usuário com ID ${user._id}:`, error);
    }
  };

  try {
    const fileContent = await readFileContent(file);

    // Verifica se o delimitador é ponto e vírgula
    const firstLine = fileContent.split("\n")[0];
    if (!firstLine.includes(";")) {
      console.error(
        "O arquivo CSV deve utilizar o ponto e vírgula (;) como separador."
      );
      throw new Error(
        "O arquivo CSV deve utilizar o ponto e vírgula (;) como separador."
      );
    }
    // Buscar os usuários antes de continuar
    const users = await getMemberShip();
    if (!Array.isArray(users)) {
      console.error("Os dados recebidos não são um array.");
      throw new Error("Os dados recebidos não são um array.");
    }

    console.log("Usuários recebidos:", users);

    const updatedUsers = [];
    const missingUsers = [];

    // Analisar o arquivo CSV
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        delimiter: delimiter,
        header: true,
        complete: async (result) => {
          try {
            const headers = Object.keys(result.data[0] || {});

            if (!headers.includes("cpf_servidor")) {
              console.error(
                "O campo 'cpf_servidor' está ausente no arquivo CSV."
              );
              throw new Error(
                "O campo 'cpf_servidor' está ausente no arquivo CSV."
              );
            }

            if (!headers.includes("status_atual_parc")) {
              console.error(
                "O campo 'status_atual_parc' está ausente no arquivo CSV."
              );
              throw new Error(
                "O campo 'status_atual_parc' está ausente no arquivo CSV."
              );
            }

            if (!headers.includes("status_parc_holerite")) {
              console.error(
                "O campo 'status_parc_holerite' está ausente no arquivo CSV."
              );
              throw new Error(
                "O campo 'status_parc_holerite' está ausente no arquivo CSV."
              );
            }

            // Cria um mapa para acesso rápido aos usuários pelo CPF
            const userMap = new Map();

            for (const user of users) {
              userMap.set(user.cpf, user);
            }

            const processedCpfs = new Set();

            // Itera apenas sobre os dados do CSV
            for (const userCsv of result.data) {
              // Aplica a máscara ao CPF do servidor
              userCsv.cpf_servidor = mascaraCPF(userCsv.cpf_servidor);
              console.log(`cpf userCsv: ${userCsv.cpf_servidor}`);

              const user = userMap.get(userCsv.cpf_servidor);

              // Se não encontrar o usuário correspondente, ignora
              if (!user) {
                missingUsers.push(userCsv);
                continue;
              }

              processedCpfs.add(user.cpf);

              console.log(`  cpf user: ${user.cpf}`);

              // Verifica as condições e atualiza os dados conforme necessário
              if (user.situation === userCsv.status_parc_holerite) {
                console.log("  Usuário na mesma situação");
              } else {
                const newSituation = userCsv.status_parc_holerite;
                console.log(
                  `Atualizando usuário: ${userCsv.nome || userCsv.cpf_servidor} de ${user.situation} para ${newSituation}`
                );

                const formData = { situation: newSituation };
                handleUpdateUser(user, formData);
                updatedUsers.push({ ...user, newSituation });
              }
            }

            // Atualiza sindicalizados ausentes no CSV para "Pendente"
            for (const user of users) {
              if (
                !processedCpfs.has(user.cpf) &&
                user.situation !== "Pendente"
              ) {
                console.log(
                  `Atualizando usuário ausente no CSV: ${user.name} (${user.cpf}) para Pendente`
                );
                const formData = { situation: "Pendente" };
                await handleUpdateUser(user, formData);
                updatedUsers.push({ ...user, newSituation: "Pendente" });
              }
            }

            console.log(
              `usuários atualizados: ${updatedUsers} \n usuários faltando: ${updatedUsers}`
            );
            resolve({ updatedUsers, missingUsers }); // Resolva os dados analisados após o loop
          } catch (error) {
            console.error("Erro ao processar os dados do CSV:", error);
            reject(error); // Rejeite a promise em caso de erro
          }
        },
        error: (error) => {
          console.error("Erro ao analisar CSV: " + error.message);
          reject(error); // Rejeite em caso de erro no Papa.parse
        },
      });
    });
  } catch (error) {
    console.error("Erro ao buscar usuários ou analisar CSV:", error);
    throw error;
  }
};
