import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import PrimaryButton from "../../../../Components/PrimaryButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import DataSelect from "../../../../Components/DataSelect";
import FieldText from "../../../../Components/FieldText";
import { APIBank } from "../../../../Services/BaseService";
import { checkAction } from "../../../../Utils/permission";
import { getToken } from "../../../../Services/Functions/loader";

export default function patrimonioList() {
  const [patrimonio, setpatrimonio] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFinal, setDataFinal] = useState(null);
  // const permissions = usePermissions();
  const canCreate = checkAction("create");

  const storagedUser = JSON.parse(localStorage.getItem("@App:user"));

  useEffect(() => {
    const fetchpatrimonio = async () => {
      try {
        const response = await APIBank.get(`/patrimonio`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = response.data;
        if (Array.isArray(data)) {
          setpatrimonio(data);
        } else {
          console.error("Os dados recebidos não são um array.");
        }
      } catch (error) {
        console.error("Erro ao buscar patrimonios:", error);
      }
    };

    fetchpatrimonio();
  }, []);

  const handleSubmit = () => {
    navigate("/patrimonio/create");
  };

  const handleItemClick = (patrimonio) => {
    navigate(`/patrimonio/visualizar/${patrimonio._id}`, {
      state: { patrimonioId: patrimonio._id },
    });
  };

  return (
    <section className="container-financialist">
      <div className="forms-container-financialList">
        <div className="double-box-financialList">
          <h1>Lista de patrimônios</h1>
          {canCreate && (
            <PrimaryButton
              text="Cadastrar patrimonio"
              onClick={handleSubmit}
            />
          )}
        </div>

        <div className="search-box-financialList">
          <FieldText
            label="Pesquisar patrimonio"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="date-box-financialList">
          <DataSelect
            label="Data inicial"
            value={dataInicio}
            onChange={(newValue) => setDataInicio(newValue)}
          />
          <DataSelect
            label="Data final"
            value={dataFinal}
            onChange={(newValue) => setDataFinal(newValue)}
          />
        </div>

        <List>
          {patrimonio.map((patrimonio, index) => (
            <div key={patrimonio._id}>
              <ListItem>
                <ListItemButton
                  className="list-item-financialList"
                  style={{
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                  onClick={() => handleItemClick(patrimonio)}
                >
                  <ListItemText
                    primary={patrimonio.nome}
                    secondary={`Data de vencimento: ${new Date(
                      patrimonio.etiqueta
                    ).toLocaleDateString()}`}
                  />
                  <ListItemText secondary={patrimonio.localizacao} />
                </ListItemButton>
              </ListItem>

            </div>
          ))}
        </List>
      </div>
    </section>
  );
}
