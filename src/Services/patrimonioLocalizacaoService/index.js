import { APIBank } from "../BaseService";
import { getToken } from "../Functions/loader";

const storagedToken = localStorage.getItem("@App:token");
let token = null;

if (storagedToken) {
  try {
    token = JSON.parse(storagedToken);
  } catch (error) {
    console.error("O token armazenado não é um JSON válido:", error);
  }
}

export const createpatrimonioLocalizacao = async (
  patrimonioLocalizacaoData
) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    const response = await APIBank.post(
      `/patrimonioLocalizacao/create`,
      { patrimonioLocalizacaoData },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("Requisição bem-sucedida:", response.data);
    return false;
  } catch (error) {
    console.error(
      "Erro ao cadastrar patrimonio:",
      error.response?.data || error.message
    );
    return true;
  }
};

export const getpatrimonioLocalizacao = async () => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    const response = await APIBank.get("/patrimonioLocalizacao", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar patrimoniosLocalizacao:", error);
  }
};

export const getpatrimonioLocalizacaoById = async (id) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    const response = await APIBank.get(`/patrimonioLocalizacao/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar patrimonioLocalizacao com ID ${id}:`, error);
  }
};

export const updatepatrimonioLocalizacaoById = async (
  id,
  patrimonioLocalizacaoData
) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    console.log("Enviando dados:", patrimonioLocalizacaoData);

    const response = await APIBank.patch(
      `/patrimonioLocalizacao/update/${id}`,
      { patrimonioLocalizacaoData },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    console.log("PatrimonioLocalizacao atualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao atualizar patrimonioLocalizacao com ID ${id}:`,
      error
    );
  }
};

export const deletepatrimonioLocalizacaoById = async (id) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    await APIBank.delete(`/patrimonioLocalizacao/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    console.log(`PatrimonioLocalizacao com ID ${id} deletado com sucesso.`);
  } catch (error) {
    console.error(`Erro ao deletar patrimonioLocalizacao com ID ${id}:`, error);
  }
};
