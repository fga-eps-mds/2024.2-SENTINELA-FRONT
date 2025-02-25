import { APIUsers } from "./BaseService";
import { getToken, getUser } from "./Functions/loader";

export async function userLogin(email, password) {
  try {
    const response = await APIUsers.post("/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const getUsers = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found");
    }
    const response = await APIUsers.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
  }
};

export const getLoggedUser = async () => {
  try {
    const token = getToken();
    const response = await APIUsers.get(`/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar usuário:`, error);
  }
};

export const getUserById = async (id) => {
  try {
    const token = getToken();
    const response = await APIUsers.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar usuário com ID ${id}:`, error);
  }
};

export const createUser = async (userData) => {
  try {
    const token = getToken();
    const storagedUser = getUser();

    if (!storagedUser || !storagedUser._id) {
      throw new Error("Usuário não encontrado ou sem ID.");
    }

    await APIUsers.post(
      "/signup",
      {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        status: userData.status,
        role: userData.role,
        params: {
          userId: `${storagedUser._id}`,
          moduleName: "users",
          action: "create",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
  }
};

export const getRoles = async () => {
  try {
    const response = await APIUsers.get("/role");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await APIUsers.post("/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
  }
};

export const patchUserById = async (id, updatedUser) => {
  try {
    const token = getToken();
    const user = getUser();

    if (!user || !user._id) {
      throw new Error("Usuário não encontrado ou sem ID.");
    }

    const response = await APIUsers.patch(
      `/users/patch/${id}`,
      { updatedUser },
      {
        params: {
          userId: `${user._id}`,
          moduleName: "users",
          action: "update",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
    throw error;
  }
};

export const updateLogged = async (updatedUser) => {
  try {
    const token = getToken();
    const response = await APIUsers.put(
      `/user`,
      { updatedUser },
      {
        params: {
          moduleName: "users",
          action: "update",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar usuário`, error);
    throw error;
  }
};

export const sendRecoveryPassword = async (email) => {
  try {
    const message = APIUsers.post(`/users/recover-password`, {
      data: {
        email,
      },
    });

    return message;
  } catch (error) {
    console.error(error);
  }
};

export const deleteUserById = async (id) => {
  try {
    const token = getToken();
    const storagedUser = getUser();

    if (!storagedUser || !storagedUser._id) {
      throw new Error("Usuário não encontrado ou sem ID.");
    }
    await APIUsers.delete(`/users/delete/${id}`, {
      params: {
        userId: `${storagedUser._id}`,
        moduleName: "users",
        action: "delete",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Erro ao deletar usuário com ID ${id}:`, error);
    throw error;
  }
};

export const changePasswordById = async (newPassword, id) => {
  try {
    await APIUsers.patch(`/users/change-password/${id}`, {
      newPassword,
    });
  } catch (error) {
    return error;
  }
};

// const response = await APIUsers.patch(
//   `/users/patch/${id}`,
//   { updatedUser },
//   {
//     params: {
//       userId: `${user._id}`,
//       moduleName: "users",
//       action: "update",
//     },
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }
// );
export const changePasswordInProfile = async (passwords) => {
  try {
    await APIUsers.patch(
      `/users/renew-password`,
      { ...passwords },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
  } catch (error) {
    return error;
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await APIUsers.post(`/verify-token`, {
      token,
    });
    return response.data;
  } catch (error) {
    console.error(`Token inválido`, error);
    throw error;
  }
};
