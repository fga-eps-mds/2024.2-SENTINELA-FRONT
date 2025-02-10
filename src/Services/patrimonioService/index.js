import { APIBank } from "../BaseService";
import { getToken } from "../Functions/loader";

export const createpatrimonio = async (patrimonioData) => {
  try {
    const response = await APIBank.post(
      `/patrimonio/create`,
      { patrimonioData },
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

export const getpatrimonio = async () => {
  try {
    const response = await APIBank.get("/patrimonio", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar patrimonios:", error);
  }
};

export const getpatrimonioById = async (id) => {
  try {
    const response = await APIBank.get(`/patrimonio/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar patrimonio com ID ${id}:`, error);
  }
};

export const updatepatrimonioById = async (id, patrimonioData) => {
  try {
    console.log("Enviando dados:", patrimonioData);

    const response = await APIBank.patch(
      `/patrimonio/update/${id}`,
      { patrimonioData },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    console.log("Patrimonio atualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar patrimonio com ID ${id}:`, error);
  }
};

export const deletepatrimonioById = async (id) => {
  try {
    await APIBank.delete(`/patrimonio/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    console.log(`Patrimonio com ID ${id} deletado com sucesso.`);
  } catch (error) {
    console.error(`Erro ao deletar patrimonio com ID ${id}:`, error);
  }
};
