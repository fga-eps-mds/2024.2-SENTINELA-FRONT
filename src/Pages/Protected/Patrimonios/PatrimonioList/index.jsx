import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import PrimaryButton from "../../../../Components/PrimaryButton";
import SecondaryButton from "../../../../Components/SecondaryButton";
import Modal from "../../../../Components/Modal";
import BigModal from "../../../../Components/BigModal";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import FieldText from "../../../../Components/FieldText";
import FieldSelect from "../../../../Components/FieldSelect";
import { APIBank } from "../../../../Services/BaseService";
import { checkAction } from "../../../../Utils/permission";
import { getToken } from "../../../../Services/Functions/loader";
import {
  createlocalizacao,
  deletelocalizacaoById,
} from "../../../../Services/localizacaoService";

export default function PatrimonioList() {
  const [patrimonio, setpatrimonio] = useState([]);
  const [search, setSearch] = useState("");
  const [searchEtiqueta, setSearchEtiqueta] = useState("");
  const navigate = useNavigate();
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [loc, setLocalizacao] = useState(null);
  const [localizacoes, setLocalizacoes] = useState([]);
  const [newLocalizacao, setnewLocalizacao] = useState("");
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localizacaoADeletar, setLocalizacaoADeletar] = useState([]);
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

  const fetchlocalizacao = async () => {
    try {
      const response = await APIBank.get(`/localizacao`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = response.data;
      if (Array.isArray(data)) {
        setLocalizacoes(data);
      } else {
        console.error("Os dados recebidos não são um array.");
      }
    } catch (error) {
      console.error("Erro ao buscar localizacoes:", error);
    }
  };

  useEffect(() => {
    fetchlocalizacao();
  }, []);

  const handleSubmit = async () => {
    navigate("/patrimonio/create");
  };

  const handleCriarLocalizacao = async () => {
    if (
      localizacoes.some(
        (loc) => loc.localizacao.toLowerCase() === newLocalizacao.toLowerCase()
      )
    ) {
      alert("Essa localização já existe!");
      return;
    }
    try {
      await createlocalizacao(
        { localizacao: newLocalizacao },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      fetchlocalizacao();
    } catch (error) {
      console.error("Erro ao criar localização:", error);
    }
  };

  const handleItemClick = (patrimonio) => {
    navigate(`/patrimonio/update/${patrimonio._id}`, {
      state: { patrimonioId: patrimonio._id },
    });
  };

  const handleLocalizacaoDelete = async (localizacao) => {
    try {
      // Verifica se existe algum patrimônio com essa localização
      const patrimonioRelacionado = patrimonio.some(
        (item) => item.localizacao === localizacao.localizacao
      );

      if (patrimonioRelacionado) {
        alert(
          "Não é possível excluir essa localização, pois existem patrimônios associados a ela."
        );
        return;
      }

      // Se não houver patrimônios, prossegue com a exclusão
      await deletelocalizacaoById(localizacao._id);
      setShowDeletedModal(true);

      // Atualiza a lista de localizações após a exclusão
      fetchlocalizacao();
    } catch (error) {
      console.error("Erro ao deletar localização:", error);
    }
  };

  const filteredPatrimonio = patrimonio.filter((patrimonio) => {
    const isDocumentTypeMatch = patrimonio.nome
      .toLowerCase()
      .includes(search.toLowerCase());
    // Formata numerodeEtiqueta para 4 dígitos com zero à esquerda
    const formattedEtiqueta = patrimonio.numerodeEtiqueta
      .toString()
      .padStart(4, "0"); // Converte para string e adiciona zeros à esquerda
    const isEtiqueta = formattedEtiqueta.includes(searchEtiqueta);

    const movementDate = patrimonio.localizacao;
    const Loc = loc;

    const isDateInRange = !Loc || movementDate === Loc;

    return isDocumentTypeMatch && isEtiqueta && isDateInRange;
  });

  return (
    <section className="container-financialist">
      <div className="forms-container-financialList">
        <div className="double-box-financialList">
          <h1>Lista de patrimônios</h1>
          {canCreate && (
            <PrimaryButton text="Cadastrar patrimonio" onClick={handleSubmit} />
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

        <div className="double-box-financialList">
          <div className="search-localizacao-patrimonioList">
            <FieldSelect
              label="Localização"
              onChange={(e) => setLocalizacao(e.target.value)}
              value={loc}
              options={["", ...localizacoes.map((loc) => loc.localizacao)]}
            />
          </div>
          <SecondaryButton
            text="Gerenciar Localizações"
            onClick={() => setmodalIsOpen(true)}
          />
          <BigModal show={modalIsOpen} width="600px">
            <ListItem>
              <FieldText
                label="Nova Localização"
                value={newLocalizacao}
                onChange={(e) => setnewLocalizacao(e.target.value)}
              />
              <PrimaryButton
                text="Criar Localização"
                onClick={() => handleCriarLocalizacao(newLocalizacao)}
                maxWidth="200px"
                marginTop="10px"
              />
            </ListItem>

            <div>*clique no nome da localização para deletar*</div>
            <div>LISTA DE LOCALIZAÇÕES:</div>

            {/* Mapeando todas as localizações */}
            {localizacoes.map((localizacoes) => (
              <ListItem key={localizacoes._id}>
                <ListItemButton
                  className=""
                  style={{
                    transition: "background-color 0.3s ease",
                    color: "#332117",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                  onClick={() => {
                    setLocalizacaoADeletar(localizacoes);
                    setShowDeleteModal(true);
                  }}
                >
                  <ListItemText primary={localizacoes.localizacao} />
                </ListItemButton>
              </ListItem>
            ))}

            <SecondaryButton
              text="Fechar"
              onClick={() => setmodalIsOpen(false)}
              maxWidth="150px"
              marginTop="10px"
            />
            <Modal
              alertTitle={
                "Deseja deletar localização '" +
                localizacaoADeletar.localizacao +
                "' do sistema?"
              }
              show={showDeleteModal}
            >
              <SecondaryButton
                key={"deleteButtons"}
                text="EXCLUIR LOCALIZAÇÃO"
                onClick={() => handleLocalizacaoDelete(localizacaoADeletar)}
                width="338px"
              />
              <SecondaryButton
                key={"modalButtons"}
                text="CANCELAR E MANTER LOCALIZAÇÃO"
                onClick={() => setShowDeleteModal(false)}
                width="338px"
              />
            </Modal>

            <Modal alertTitle="Localização Deletada" show={showDeletedModal}>
              <SecondaryButton
                key={"okButtons"}
                text="OK"
                onClick={() => {
                  setShowDeletedModal(false);
                  setShowDeleteModal(false);
                }}
                width="338px"
              />
            </Modal>
          </BigModal>
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
                    secondary={
                      "Numero de Etiqueta: " +
                      patrimonio.numerodeEtiqueta.toString().padStart(4, "0")
                    }
                  />
                  <ListItemText
                    secondary={"Localização:" + patrimonio.localizacao}
                  />
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
