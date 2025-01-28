import { APIUsers } from "./BaseService";
import { getToken } from "./Functions/loader";

// const storagedToken = localStorage.getItem("@App:token");
// const token = JSON.parse(storagedToken);

export async function createMemberShip(formData) {
  try {
    const response = await APIUsers.post("membership/create", {
      formData,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  
  );
    return response.status;
  } catch (error) {
    return error.response.data.erro;
  }
}

export async function getMemberShip(status) {
  try {
    const response = await APIUsers.get("membership", {
      params: { status: status },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data.erro;
  }
}

export async function getMemberShipById(id) {
  try {
    const response = await APIUsers.get(`membership/${id}`,{
      headers: {
        Authorization: `Bearer ${getToken()}`,
      }});
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data.erro;
  }
}

export const updateMemberStatus = async (memberId, formData) => {
  try {
    const response = await APIUsers.patch(
      `membership/updateStatus/${memberId}`,
      {
        formData,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    return error.response ? error.response.data.error : "An error occurred";
  }
};

export const updateMembership = async (memberId, formData) => {
  try {
    await APIUsers.patch(`membership/update/${memberId}`, {
      formData,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      }
    });

    return false;
  } catch (error) {
    return error.response.data.erro;
  }
};

export async function deleteMember(memberId) {
  try {
    await APIUsers.delete(`membership/delete/${memberId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        }
      });
    return false;
  } catch (error) {
    return error.response.data.erro;
  }
}
