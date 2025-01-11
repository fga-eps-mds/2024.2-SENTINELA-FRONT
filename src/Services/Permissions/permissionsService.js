import { APIUsers } from "../BaseService";

// Create a new permission
export const createPermission = async (permissionData) => {
  try {
    const token = localStorage.getItem("@App:token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await APIUsers.post("/permission", permissionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar permissão:", error);
    throw error;
  }
};

// Get all permissions
export const getAllPermissions = async () => {
  try {
    const token = localStorage.getItem("@App:token");
    console.log("Token enviado:", token); // Log do token
    if (!token) {
      throw new Error("No token found");
    }
    const response = await APIUsers.get("/permission", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar permissões:", error.response?.data || error);
    throw error;
  }
};


// Get a permission by ID
export const getPermissionById = async (id) => {
  try {
    const token = localStorage.getItem("@App:token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await APIUsers.get(`/permission/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar permissão:", error);
    throw error;
  }
};

// Update a permission by ID
export const updatePermissionById = async (id, permissionData) => {
  try {
    const token = localStorage.getItem("@App:token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await APIUsers.put(`/permission/${id}`, permissionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar permissão:", error);
    throw error;
  }
};

// Delete a permission by ID
export const deletePermissionById = async (id) => {
  try {
    const token = localStorage.getItem("@App:token");
    if (!token) {
      throw new Error("No token found");
    }
    await APIUsers.delete(`/permission/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Erro ao deletar permissão:", error);
    throw error;
  }
};

// Search permissions by name
export const searchPermissionByName = async (name) => {
  try {
    const token = localStorage.getItem("@App:token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await APIUsers.post(
      "/permission/search",
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar permissões por nome:", error);
    throw error;
  }
};
