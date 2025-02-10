import { useContext, useState, useEffect } from "react";
import AuthContext from "../Context/auth";
import { getRoleById } from "../Services/RoleService/roleService";

export const checkModule = (permissions, module) => {
  const modulePermissions = permissions.find(
    (permission) => permission.module === module
  );

  return modulePermissions ? modulePermissions.access.length > 0 : false;
};

// export const checkAction = (action) => {
//   const permissionsString = localStorage.getItem("@App:permissions");
//   const permissions = JSON.parse(permissionsString);

//   const modulePermissions = permissions.find(
//     (permission) => permission === action
//   );

//   return modulePermissions ? true : false;
// };

export const checkAction = (action) => {
  // Obtém o valor de permissões do localStorage
  const permissionsString = localStorage.getItem("@App:permissions");
<<<<<<< HEAD
<<<<<<< HEAD

  // Verifica se o valor existe no localStorage
  if (!permissionsString) {
    console.warn("Nenhuma permissão encontrada no localStorage.");
    return false; // Sem permissões, retorne falso
  }

  try {
    // Tenta converter o valor para JSON
    const permissions = JSON.parse(permissionsString);

    // Verifica se o JSON é um array válido
    if (!Array.isArray(permissions)) {
      console.error("O valor de permissões não é um array válido.");
      return false; // Valor inválido, retorne falso
    }

    // Procura pela permissão específica no array
    return permissions.includes(action);
  } catch (error) {
    // Captura qualquer erro na conversão JSON
    console.error("Erro ao analisar as permissões:", error);
    return false;
  }
=======
=======
>>>>>>> master
  if (!permissionsString) return false;

  const permissions = JSON.parse(permissionsString);

  return permissions.some(
    (permission) => permission.actions && permission.actions.includes(action)
  );
<<<<<<< HEAD
>>>>>>> e3585ed4ac65578a33c2797abd53001951274b04
=======
>>>>>>> master
};


export const usePermissions = () => {
  const { user } = useContext(AuthContext);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchRolePermissions = async () => {
      if (user?.role) {
        try {
          const role = await getRoleById(user.role);
          setPermissions(role?.permissions || []);
        } catch (error) {
          console.error("Erro ao buscar permissões do papel:", error);
          setPermissions([]);
        }
      }
    };

    fetchRolePermissions();
  }, [user]);

  return permissions;
};
