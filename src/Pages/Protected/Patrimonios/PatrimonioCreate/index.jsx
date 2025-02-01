import { useState, useEffect } from "react";
import FieldSelect from "../../../../Components/FieldSelect";
import FieldText from "../../../../Components/FieldText";
import Modal from "../../../../Components/Modal";
import PrimaryButton from "../../../../Components/PrimaryButton";
import SecondaryButton from "../../../../Components/SecondaryButton";
import "./index.css";
import DataSelect from "../../../../Components/DataSelect";
import { createpatrimonio } from "../../../../Services/patrimonioService";
import { getUsers } from "../../../../Services/userService";
import { getSupplierForm } from "../../../../Services/supplierService";
import { useNavigate } from "react-router-dom";
import { handleCpfCnpjInput } from "../../../../Utils/validators";
import { getToken } from "../../../../Services/Functions/loader";


export default function patrimonioCreate() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [numerodeSerie, setNumerodeSerie] = useState("");
  const [numerodeEtiqueta, setNumerodeEtiqueta] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [doacao, setDoacao] = useState(false);
  const [datadeCadastro, setDatadeCadastro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const maxDescricaoLength = 130;
  const maxNumerodeEtiqueta = 9999;

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
          setMovements(data);
        } else {
          console.error("Os dados recebidos não são um array.");
        }
      } catch (error) {
        console.error("Erro ao buscar patrimonio", error);
      }
    };

    fetchpatrimonio ();
  }, []);

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

  const handleChangeDescricao = (event) => {
    const { value } = event.target;
    if (value.length <= maxDescricaoLength) {
      setDescricao(value);
    }
  };

  const handleChangeNumerodeSerie = (event) => {
    const { value } = event.target;
    if (value.length <= maxDescricaoLength) {
      setNumerodeSerie(value);
    }
  };

  const handleChangeNumerodeEtiqueta = (event) => {
    const { value } = event.target;
    if (value.length <= maxNumerodeEtiqueta) {
      setNumerodeSerie(value);
    }
  };

  const navigate = useNavigate();

  const handleCloseDialog = () => {
    navigate("/patrimonio/list");
    setShowModal(false);
  };

  const handleSubmit = async () => {
    const patrimonioData = {
      nome,
      valor: parseFloat(valor),
      numerodeEtiqueta,
      numerodeSerie,
      localizacao,
      doacao,
      datadeCadastro: datadeCadastro,
      descricao,
    };

    console.log("Dados enviados ao backend:", patrimonioData);

    const error = await createpatrimonio(patrimonioData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (
      !nome ||
      !datadeCadastro 

    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    if (descricao.length > 130) {
      alert("limite de caracteres excedido!");
      return;
    }

    if (!error) {
      console.log("Cadastro realizado com sucesso.");
      setShowModal(true);
    } else {
      console.error("Erro ao cadastrar patrimonio:", error);
    }
  };

  return (
    <section className="container">
      <div className="forms-container">
        <h1> Cadastro de Patrimonio </h1>
        <h3>Dados do Patrimonio</h3>

        <div className="double-box-fin">
          <FieldText
            label="Nome *"
            value={nome}
            onChange={handleChangeNome}
            options={nome}
          />

          <FieldText
            label="Valor *"
            value={
              valor ? `R$ ${valor.replace(".", ",")}` : "R$ 0,00"
            }
            onChange={(e) => handleCurrencyInput(e.target.value, setValor)}
          />

          <DataSelect
            label="Data de cadastro"
            value={datadeCadastro}
            onChange={(newValue) => setDatadeCadastro(newValue)}
          />
        </div>
        <div className="descricao-fin">
          <FieldText
            label="Descrição"
            onChange={handleChangeDescricao}
            value={descricao}
          />
        </div>
        <div className="descricao-fin">
          <FieldText
            label="Numero de Serie"
            onChange={handleChangeNumerodeSerie}
            value={numerodeSerie}
          />
        </div>
        <div className="descricao-fin">
          <FieldText
            label="Numero de Etiqueta"
            onChange={handleChangeNumerodeEtiqueta}
            value={numerodeEtiqueta}
          />
        </div>

        <div>
          <small>
            {descricao.length}/{maxDescricaoLength} caracteres
          </small>
        </div>
        <PrimaryButton text="Cadastrar" onClick={handleSubmit} />
        <Modal
          width="338px"
          alertTitle="Cadastro de patrimonio"
          show={showModal}
        >
          <SecondaryButton
            key={"modalButtons"}
            text="OK"
            onClick={handleCloseDialog}
            width="338px"
          />
        </Modal>
      </div>
    </section>
  );
}
