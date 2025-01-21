import Papa from "papaparse";
import { getUsers, patchUserById } from "../Services/userService";

export const readcsv = async (file, delimiter = "") => {
  if (!file) {
    console.error("Nenhum arquivo selecionado.");
    throw new Error("Nenhum arquivo selecionado.");
  }

  try {
    // Buscar os usuários antes de continuar
    const users = await getUsers();
    if (!Array.isArray(users)) {
      console.error("Os dados recebidos não são um array.");
      throw new Error("Os dados recebidos não são um array.");
    }

    console.log("Usuários recebidos:", users);

    // Analisar o arquivo CSV
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        delimiter: delimiter,
        header: true,
        complete: async (result) => {
          console.log(
            "Usuários antes: " +
              result.data[0].nome +
              ", " +
              result.data[0].status_atual_parc +
              ", " +
              result.data[0].status_parc_holerite
          );
          try {
            // Iterar sobre os dados do CSV e verificar os usuários
            for (const userCsv of result.data) {
              for (const user of users) {
                if (user.situation === userCsv.status_parc_holerite) {
                  console.log("Usuário na mesma situação");
                } else if (
                  userCsv.nome === user.name &&
                  userCsv.status_parc_holerite === "Quitado"
                ) {
                  console.log(
                    "Atualizando usuário: " +
                      userCsv.nome +
                      " de " +
                      user.situation +
                      " para " +
                      userCsv.status_parc_holerite
                  );

                  const updatedUser = {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    status: user.status,
                    role: user.role,
                    situation: "Quitado",
                  };

                  try {
                    await patchUserById(user._id, updatedUser);
                    console.log(`Usuário ${user.name} atualizado com sucesso.`);
                  } catch (error) {
                    console.error(
                      `Erro ao atualizar usuário com ID ${user._id}:`,
                      error
                    );
                  }
                } else if (
                  userCsv.nome === user.name &&
                  userCsv.status_parc_holerite === "Pendente"
                ) {
                  console.log(
                    "Atualizando usuário: " +
                      userCsv.nome +
                      " de " +
                      user.situation +
                      " para " +
                      userCsv.status_parc_holerite
                  );

                  const updatedUser = {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    status: user.status,
                    role: user.role,
                    situation: "Pendente",
                  };

                  try {
                    await patchUserById(user._id, updatedUser);
                    console.log(`Usuário ${user.name} atualizado com sucesso.`);
                  } catch (error) {
                    console.error(
                      `Erro ao atualizar usuário com ID ${user._id}:`,
                      error
                    );
                  }
                }
              }
            }

            console.log(
              "Usuários antes: " +
                result.data[0].nome +
                ", " +
                result.data[0].status_atual_parc +
                ", " +
                result.data[0].status_parc_holerite
            );

            resolve(result.data); // Resolva os dados analisados após o loop
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
