import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FieldSelect from "../../../../Components/FieldSelect";
import FieldText from "../../../../Components/FieldText";
import Modal from "../../../../Components/Modal";
import PrimaryButton from "../../../../Components/PrimaryButton";
import SecondaryButton from "../../../../Components/SecondaryButton";
import "./index.css";
import DataSelect from "../../../../Components/DataSelect";
import {
  getpatrimonioById,
  updatepatrimonioById,
  deletepatrimonioById,
} from "../../../../Services/patrimonioService";
import { getUsers } from "../../../../Services/userService";
import { getSupplierForm } from "../../../../Services/supplierService";
import dayjs from "dayjs";
import { handleCpfCnpjInput } from "../../../../Utils/validators";
import { checkAction } from "../../../../Utils/permission";
import { getToken } from "../../../../Services/Functions/loader";
import FieldTextCheckbox from "../../../../Components/FieldTextCheckbox";

export default function FinancialUpdate() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [numerodeSerie, setNumerodeSerie] = useState("");
  const [numerodeEtiqueta, setNumerodeEtiqueta] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [doacao, setDoacao] = useState(false);
  const [datadeCadastro, setDatadeCadastro] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const maxDescricaoLength = 130;
  const canUpdate = checkAction("update");
  const canDelete = checkAction("delete");

  const navigate = useNavigate();
  const location = useLocation();
  const patrimonioId = location.state?.patrimonioId;

  useEffect(() => {
    const fetchpatrimonio = async () => {
      if (patrimonioId) {
        try {
          const data = await getpatrimonioById(patrimonioId, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          });
          setNome(data.nome || "");
          setDescricao(data.descricao || "");
          setDatadeCadastro(data.datadeCadastro || "");
          setDoacao(data.doacao || (false));
          setLocalizacao(data.localizacao || "");
          setNumerodeEtiqueta(data.numerodeEtiqueta || "");
          setValor(data.valor ? data.valor.toString() : "0.00");
          setNumerodeSerie(data.numerodeSerie) || "";
        } catch (error) {
          console.error("Erro ao buscar dados do patrimonio:", error);
        }
      }
    };

    fetchpatrimonio();
  }, [patrimonioId]);

  const handleSave = async () => {
    setShowSaveModal(false);
    try {
      const updatedData = {
        nome,
        valor: parseFloat(valor),
        numerodeEtiqueta,
        numerodeSerie,
        localizacao,
        doacao,
        datadeCadastro,
        descricao,
    };
      await updatepatrimonioById(patrimonioId, updatedData,  {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setShowSaveModal(true);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletepatrimonioById(patrimonioId);
      setShowDeletedModal(true);
    } catch (error) {
      console.error("Erro ao deletar patrimonio:", error);
    }
  };

  const handleCurrencyInput = (value, setValue) => {
    // Remove qualquer caractere que não seja número
    const numericValue = value.replace(/\D/g, "");
    // Converte para número com duas casas decimais
    const parsedValue = numericValue
      ? (parseFloat(numericValue) / 100).toFixed(2)
      : "0.00";

    // Atualiza o estado com o valor numérico real
    setValue(parsedValue);

    // Retorna o valor formatado para exibição
    return numericValue
      ? `R$ ${parseFloat(parsedValue).toFixed(2).replace(".", ",")}` // Formatação com vírgula
      : "R$ 0,00";
  };

  const handleChangeNome = (event) => {
    console.log("Nome:", event.target.value);
    setNome(event.target.value);
  };

  const handleChangeNumerodeEtiqueta = (event) => {
  };

  const handleChangeLocalizacao = (event) => {
    const { value } = event.target;
    setLocalizacao(value);
  };

  const handleChangeNumerodeSerie = (event) => {
    console.log("Numero de Serie:", event.target.value);
    setNumerodeSerie(event.target.value);
  };

  const handleChangePagamento = (event) => {
    console.log("Forma de Pagamento:", event.target.value);
    setPagamento(event.target.value);
  };

  const handleChangeDescricao = (event) => {
    const { value } = event.target;
    if (value.length <= maxDescricaoLength) {
      setDescricao(value);
    }
  };

  return (
    <section className="container">
      <div className="forms-container">
        <h1> Visualização de Patrimônios </h1>
        <h3>Dados do Patrimônio</h3>

        
        <div className="descricao-fin">
          <FieldText
            label="Nome"
            onChange={handleChangeNome}
            value={nome}
          />
        </div>

        <div className="double-box-fin">
          <FieldText
            label="Descrição *"
            value={descricao}
            onChange={handleChangeDescricao}
          />

          <FieldText
            label="Valor *"
            value={
              valor ? `R$ ${valor.replace(".", ",")}` : "R$ 0,00"
            }
            onChange={(e) => handleCurrencyInput(e.target.value, setValor)}
          />

        </div>

        <div className="double-box-fin">
          <FieldText
            label="Numero de Serie"
            onChange={handleChangeNumerodeSerie}
            value={numerodeSerie}
          />

          <FieldText
            label="Etiqueta de Patrimônio"
            onChange={handleChangeNumerodeEtiqueta}
            value={numerodeEtiqueta.toString().padStart(4, '0')}
          />
        </div>

        <div className="double-box-fin">
        <FieldSelect
            label="Localização"
            onChange={handleChangeLocalizacao}
            value={localizacao}
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
          <DataSelect
            label="Data de cadastro"
            value={datadeCadastro}
            onChange={handleChangeNumerodeEtiqueta}
          />

        </div>
        <div className="descricao-fin">
        <FieldTextCheckbox
            label="Patrimonio Doado"
            checked={doacao}
            onCheckboxChange={(e) => setDoacao(e.target.checked)}
            disabled={false}
          />
        </div><div>
          <small>
            {descricao.length}/{maxDescricaoLength} caracteres
          </small>
        </div>
        <div className="double-buttons-mov">
          {canDelete && (
            <SecondaryButton
              text="Deletar"
              onClick={() => setShowDeleteModal(true)}
            />
          )}

          {canUpdate && <PrimaryButton text="Salvar" onClick={handleSave} />}
        </div>

        <Modal alertTitle="Alterações Salvas" show={showSaveModal}>
          <SecondaryButton
            key={"saveButtons"}
            text="OK"
            onClick={() => {
              setShowSaveModal(false);
              navigate("/patrimonio/list");
            }}
            width="338px"
          />
        </Modal>

        <Modal
          alertTitle="Deseja deletar patrimonio do sistema?"
          show={showDeleteModal}
        >
          <SecondaryButton
            key={"deleteButtons"}
            text="EXCLUIR PATRIMONIO"
            onClick={handleDelete}
            width="338px"
          />
          <SecondaryButton
            key={"modalButtons"}
            text="CANCELAR E MANTER PATRIMONIO"
            onClick={() => setShowDeleteModal(false)}
            width="338px"
          />
        </Modal>

        <Modal alertTitle="Patrimonio Deletado" show={showDeletedModal}>
          <SecondaryButton
            key={"okButtons"}
            text="OK"
            onClick={() => {
              setShowDeletedModal(false);
              navigate("/patrimonio/list");
            }}
            width="338px"
          />
        </Modal>
      </div>
    </section>
  );
}
