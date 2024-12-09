import { Route, Routes } from "react-router-dom";
import Login from "../Pages/Public/Login";
import MemberShip from "../Pages/Public/MemberShip";
import PasswordRecovery from "../Pages/Public/PasswordRecovery";
import ChangePasswordPage from "../Pages/Public/ChangePasswordPage";
import VerifyMemberForm from "../Pages/Public/VerifyMember/VerifyMemberForm";
import VerifyMemberActiveStatus from "../Pages/Public/VerifyMember/VerifyMemberActiveStatus";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/filiacao" element={<MemberShip />} />
      <Route path="/recuperar-senha" element={<PasswordRecovery />} />
      <Route path="/trocar-senha/:token" element={<ChangePasswordPage />} />
      <Route path="/verificar-membro" element={<VerifyMemberForm />} />
      <Route path="/verificar-membro/ativo" element={<VerifyMemberActiveStatus />} />
    </Routes>
  );
};

export default PublicRoutes;
