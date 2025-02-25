import { APIUsers } from "./BaseService";
import { getToken } from "./Functions/loader";

export async function createOrgan(orgao, lotacao) {
  try {
    const storagedUser = localStorage.getItem("@App:user");
    let user = null;

    if (storagedUser) {
      try {
        user = JSON.parse(storagedUser);
      } catch (error) {
        console.error("Erro ao armazenar usuário: ", error);
      }
    }

    if (!user || !user._id) {
      throw new Error("Usuário não encontrado ou sem ID.");
    }

    const response = await APIUsers.post(
      "organ/create",
      { orgao, lotacao },
      {
        params: {
          userId: `${user._id}`, // Substitua user._id pela forma correta de obter o ID do usuário
          moduleName: "users",
          action: "create",
        },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.status;
  } catch (error) {
    console.error("Erro ao criar órgão:", error);
    throw error;
  }
}

export async function listOrgans() {
  try {
    const response = await APIUsers.get("organ/list", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data.error;
  }
}
export async function updateOrgan(id, updatedData) {
  try {
    const storagedUser = localStorage.getItem("@App:user");
    let user = null;

    if (storagedUser) {
      try {
        user = JSON.parse(storagedUser);
      } catch (error) {
        console.error("Erro ao armazenar usuário: ", error);
      }
    }

    if (!user || !user._id) {
      throw new Error("Usuário não encontrado ou sem ID.");
    }
    const response = await APIUsers.patch(
      `organ/update/${id}`,
      { updatedData },
      {
        params: {
          userId: `${user._id}`, // Substitua user._id pela forma correta de obter o ID do usuário
          moduleName: "users",
          action: "update",
        },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.status;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data.error;
    }
    throw error;
  }
}

export async function getOrganById(id) {
  try {
    const response = await APIUsers.get(`organ/get/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data.error;
  }
}

export async function deleteOrganById(id) {
  try {
    const storagedUser = localStorage.getItem("@App:user");
    let user = null;

    if (storagedUser) {
      try {
        user = JSON.parse(storagedUser);
      } catch (error) {
        console.error("Erro ao armazenar usuário: ", error);
      }
    }

    if (!user || !user._id) {
      throw new Error("Usuário não encontrado ou sem ID.");
    }
    const response = await APIUsers.delete(`organ/delete/${id}`, {
      params: {
        userId: `${user._id}`, // Substitua user._id pela forma correta de obter o ID do usuário
        moduleName: "users",
        action: "delete",
      },

      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.status;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data.error;
    }
    throw error;
  }
}
