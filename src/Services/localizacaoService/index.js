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

export const createlocalizacao = async (localizacaoData) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    const response = await APIBank.post(
      `/localizacao/create`,
      { localizacaoData },
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
      "Erro ao cadastrar localizacao:",
      error.response?.data || error.message
    );
    return true;
  }
};

export const getlocalizacao = async () => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    const response = await APIBank.get("/localizacao", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar localizacao:", error);
  }
};

export const getlocalizacaoById = async (id) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    const response = await APIBank.get(`/localizacao/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar localizacao com ID ${id}:`, error);
  }
};

export const updatelocalizacaoById = async (
  id,
  localizacaoData
) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    console.log("Enviando dados:", localizacaoData);

    const response = await APIBank.patch(
      `/localizacao/update/${id}`,
      { localizacaoData },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    console.log("Localizacao atualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao atualizar Localizacao com ID ${id}:`,
      error
    );
  }
};

export const deletelocalizacaoById = async (id) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    await APIBank.delete(`/localizacao/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    console.log(`Localizacao com ID ${id} deletado com sucesso.`);
  } catch (error) {
    console.error(`Erro ao deletar Localizacao com ID ${id}:`, error);
  }
};
