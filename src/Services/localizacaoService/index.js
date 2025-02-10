import { APIBank } from "../BaseService";
import { getToken } from "../Functions/loader";

export const createlocalizacao = async (localizacaoData) => {
  try {

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
