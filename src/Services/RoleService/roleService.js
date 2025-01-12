import { APIUsers } from "../BaseService";

export const createRole = async (roleData) => {
  try {
    const token = localStorage.getItem("@App:token");
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

    if (!token) {
      throw new Error("No token found");
    }
    const response = await APIUsers.post("/role/create", roleData, {
      params: {
        userId: `${user._id}`,
        moduleName: "users",
        action: "create",
      },
      
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar role:", error);
    throw error;
  }
};

export const getAllRoles = async () => {
  try {
    const token = localStorage.getItem("@App:token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await APIUsers.get("/role", {
      
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar roles:", error);
    throw error;
  }
};

export const getRoleById = async (id) => {
  try {
    const token = localStorage.getItem("@App:token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await APIUsers.get(`/role/${id}`, );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar role:", error);
    throw error;
  }
};
export const assignPermissionsToRole = async (roleId, permissions) => {
  try {
    const token = localStorage.getItem("@App:token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await APIUsers.put(`/roles/${roleId}/permissions`, {
      permissions,
    }, {
      
    });

    return response.data; 
  } catch (error) {
    console.error("Erro ao vincular permissões à role:", error);
    throw error;
  }
};
export const updateRole = async (id, roleData) => {
  try {
    const token = localStorage.getItem("@App:token");
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

    if (!token) {
      throw new Error("No token found");
    }
    const response = await APIUsers.patch(`/role/patch/${id}`, roleData, {
      params: {
        userId: `${user._id}`,
        moduleName: "users",
        action: "update",
      },
      
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar role:", error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const token = localStorage.getItem("@App:token");
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
    if (!token) {
      throw new Error("No token found");
    }
    const response = await APIUsers.delete(`/role/delete/${id}`, {
      params: {
        userId: `${user._id}`,
        moduleName: "users",
        action: "delete",
      },
      
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar role:", error);
    throw error;
  }
};
