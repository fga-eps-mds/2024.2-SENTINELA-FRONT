/* eslint-disable no-unreachable */
// src/hooks/usePermissions.js

import { useContext, useState, useEffect } from "react";
import AuthContext from "../Context/auth";
import { getRoleById } from "../Services/RoleService/roleService";

export const checkAction = (action) => {
  const permissionsString = localStorage.getItem("@App:permissions");
  const permissions = JSON.parse(permissionsString);
  let modulePermissions = false;
  if (permissions) {
    modulePermissions = permissions.find((permission) => permission === action);
  }

  return modulePermissions ? true : false;
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
