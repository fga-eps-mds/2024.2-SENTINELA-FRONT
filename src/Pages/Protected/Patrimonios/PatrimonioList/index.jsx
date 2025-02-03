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
import FieldSelect from "../../../../Components/FieldSelect";
import { APIBank } from "../../../../Services/BaseService";
import { checkAction } from "../../../../Utils/permission";
import { getToken } from "../../../../Services/Functions/loader";

export default function patrimonioList() {
  const [patrimonio, setpatrimonio] = useState([]);
  const [search, setSearch] = useState("");
  const [searchEtiqueta, setSearchEtiqueta] = useState("");
  const navigate = useNavigate();
  const [loc, setLocalizacao] = useState(null)
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
    navigate(`/patrimonio/update/${patrimonio._id}`, {
      state: { patrimonioId: patrimonio._id },
    });
  };

  const filteredPatrimonio = patrimonio.filter((patrimonio) => {
    const isDocumentTypeMatch = patrimonio.nome
    .toLowerCase()
    .includes(search.toLowerCase());
      // Formata numerodeEtiqueta para 4 dígitos com zero à esquerda
    const formattedEtiqueta = patrimonio.numerodeEtiqueta
    .toString()
    .padStart(4, '0');  // Converte para string e adiciona zeros à esquerda
    const isEtiqueta = formattedEtiqueta.includes(searchEtiqueta);


    const movementDate = patrimonio.localizacao;
    const Loc = loc

    const isDateInRange =
      (!Loc || movementDate === Loc);

    return isDocumentTypeMatch && isEtiqueta && isDateInRange;
  });

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

        <div className="double-box-financialList">
        <div className="search-box-financialList">
          <FieldText
            label="Pesquisar patrimonio por nome"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="search-box-patrimonioList">
          <FieldText
            label="Pesquisar patrimonio por etiqueta"
            value={searchEtiqueta}
            onChange={(e) => setSearchEtiqueta(e.target.value)}
          />
        </div>
        </div>

        <div className="date-box-financialList">
    
          <FieldSelect
            label="Localização"
            onChange={(e) => setLocalizacao(e.target.value)}
            value={loc}
            options={[
              "",
              "SAlA DE COMUNICAÇÃO",
              "JURÍDICO",
              "PRESIDÊNCIA",
              "SALA DE REUNIÃO",
              "RECEPÇÃO",
              "COPA",
              "SALA DE PODCAST",
              "RECEPÇÃO DO PODCAST",
              "OUTROS",
            ]}
          />
        </div>

        <List>
          {filteredPatrimonio.map((patrimonio, index) => (
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
                    secondary={'Numero de Etiqueta: ' + patrimonio.numerodeEtiqueta.toString().padStart(4, '0')}
                  />
                  <ListItemText secondary={'Localização:' + patrimonio.localizacao} />
                </ListItemButton>
              </ListItem>
              {index < filteredPatrimonio.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </div>
    </section>
  );
}
