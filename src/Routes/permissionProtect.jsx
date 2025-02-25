import { useContext, useState, useEffect } from "react";
import AuthContext from "../Context/auth";
import PropTypes from "prop-types";
import { checkAction } from "../Utils/permission";
import { Navigate } from "react-router-dom";

const PermissionProtect = ({ element, actions }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRolePermissions = async () => {
      setLoading(false);
    };

    fetchRolePermissions();
  }, [user]);

  if (loading) {
    // Exibe um carregando enquanto as permissões estão sendo buscadas
    return <div>Loading...</div>;
  }
  const hasPermission = actions.some((action) => checkAction(action));

  if (hasPermission) {
    return element;
  } else {
    return <Navigate to="/unauthorized" />;
  }
};

PermissionProtect.propTypes = {
  element: PropTypes.element.isRequired,
  moduleName: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.string).isRequired, // Alterado para um array de strings
};

export default PermissionProtect;
