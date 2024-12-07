import { Route, Routes } from "react-router-dom";
import Login from "../Pages/Public/Login";
import MemberShip from "../Pages/Public/MemberShip";
import PasswordRecovery from "../Pages/Public/PasswordRecovery";
import ChangePasswordPage from "../Pages/Public/ChangePasswordPage";
import Advantages from "../Pages/Public/Advantages";
import LoginNovo from "../Pages/Public/LoginNovo";

const PublicRoutes = () => {

  
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/novo" element={<LoginNovo />} />
      <Route path="/filiacao" element={<MemberShip />} />
      <Route path="/vantagens" element={<Advantages />}/>
      <Route path="/recuperar-senha" element={<PasswordRecovery />} />
      <Route path="/trocar-senha/:token" element={<ChangePasswordPage />} />
    </Routes>
  );
};

export default PublicRoutes;
