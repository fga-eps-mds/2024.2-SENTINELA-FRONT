import { APIBank } from "../BaseService";

const storagedToken = localStorage.getItem("@App:token");
let token = null;

if (storagedToken) {
  try {
    token = JSON.parse(storagedToken);
  } catch (error) {
    console.error("O token armazenado não é um JSON válido:", error);
  }
}

export const createpatrimonio = async (patrimonioData) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    const response = await APIBank.post(
      `/patrimonio/create`,
      { patrimonioData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
    if (!token) {
      throw new Error("No token found");
    }

    const response = await APIBank.get("/patrimonio", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar patrimonios:", error);
  }
};

export const getpatrimonioById = async (id) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    const response = await APIBank.get(`/patrimonio/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar patrimonio com ID ${id}:`, error);
  }
};

export const updatepatrimonioById = async (
  id,
  patrimonioData
) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    const response = await APIBank.patch(
      `/patrimonio/update/${id}`,
      { patrimonioData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Patrimonio atualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Erro ao atualizar patrimonio com ID ${id}:`,
      error
    );
  }
};

export const deletepatrimonioById = async (id) => {
  try {
    if (!token) {
      throw new Error("No token found");
    }

    await APIBank.delete(`/patrimonio/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`Patrimonio com ID ${id} deletado com sucesso.`);
  } catch (error) {
    console.error(`Erro ao deletar patrimonio com ID ${id}:`, error);
  }
};
