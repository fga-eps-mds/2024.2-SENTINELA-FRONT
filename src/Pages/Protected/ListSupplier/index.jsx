import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import SideBar from "../../../Components/SideBar";
import PrimaryButton from "../../../Components/PrimaryButton";
//import LabeledTextField from "../../../Components/LabeledTextField";
import SideButton from "../../../Components/SideButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import SecondaryButton from "../../../Components/SecondaryButton";
import FieldText from "../../../Components/FieldText";
import { APIBank } from "../../../Services/BaseService";
import { AiOutlineUser } from "react-icons/ai";
import { RiLogoutCircleRLine } from "react-icons/ri";
//import { supplierForm } from "../../../2024.1-SENTINELA-BACK-FINANCEIRO/2024.1-SENTINELA-BACKEND-FINANCEIRO/src/Models/supplierFormSchema";

export default function ListSupplier() {

  const getUserName = () => {
    const tokenString = localStorage.getItem("@App:user");
    if (tokenString) {
      const user = JSON.parse(tokenString);
      return user?.user?.name || "Usuário";
    }
    return "Usuário";
  };

  const handleLogout = () => {
    context.Logout();
    navigate("/");
  };

  const buttons = [
    <SideButton key="home" text="Página inicial" />,
    <SideButton key="cadastros" text="Cadastros" />,
    <SideButton key="financeiro" text="Financeiro" />,
    <h2 key="profile-status" className="profile-status">
      Você está logado <br />
      como {getUserName()} <AiOutlineUser className="profile-icon" />
    </h2>,
    <button key="logout" className="btn-logout" onClick={handleLogout}>
      LOGOUT <RiLogoutCircleRLine className="logout-icon" />
    </button>,
  ];

  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const storagedUser = localStorage.getItem("@App:user");

  useEffect(() => {
    const fetchSupplierForm = async () => {
      try {
          const response = await APIBank.get(`/SupplierForm`, {
          headers: {
            Authorization: `Bearer ${storagedUser.token}`
          },
        });

        const data = response.data;
        if (Array.isArray(data)) {
          setSuppliers(data);
        } else {
          console.error("Os dados recebidos não são um array.");
        }
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
      }
    };

    fetchSupplierForm();
  }, []);

  const handleSubmit = () => {
    navigate("/supplier");
  };

  const handleItemClick = (supplier) => {
    navigate('/viewsupplier/${supplier.nome}', { state: { supplierForm: supplier._id } });
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="container">
        <SideBar className="side-menu" buttons={buttons} />

      <div className="forms-container">

        <div className="double-box">
        <h1>Lista de fornecedores</h1>
        <PrimaryButton
          text="Cadastrar fornecedor"
          onClick={handleSubmit} />
        </div>
        
        <div className="search-box">
          
          <FieldText
            label="Pesquisar fornecedor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SecondaryButton
            text="Pesquisar"
            onClick={() => filteredSuppliers(search)}
          />
        </div>

        <List>
          {filteredSuppliers.map((supplier, index) => (
            <div key={supplier._id}>
              <ListItem>
              <ListItemButton className="list-item"
                style={{
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => handleItemClick(supplier)}
              >
                  <ListItemText primary={supplier.nome} />
                </ListItemButton>
              </ListItem>

              {index < filteredSuppliers.length - 1 && <Divider />}
            </div>
          ))}                
        </List>
      </div>
    </section>
  );
}
