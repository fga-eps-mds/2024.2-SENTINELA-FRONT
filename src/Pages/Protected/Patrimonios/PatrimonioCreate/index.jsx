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
import { APIBank } from "../../../../Services/BaseService";
import FieldTextCheckbox from "../../../../Components/FieldTextCheckbox";


export default function patrimonioCreate() {
  const [patrimonio, setpatrimonio] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [numerodeSerie, setNumerodeSerie] = useState("");
  const [numerodeEtiqueta, setNumerodeEtiqueta] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [doacao, setDoacao] = useState(false);
  const [datadeCadastro, setDatadeCadastro] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [localizacoes, setLocalizacoes] = useState([]);
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
 /*  Função para encontrar o próximo número de etiqueta disponível, levando em conta exclusões
  const findNextEtiqueta = () => {
    // Ordena o array de patrimônios pela etiqueta
    const etiquetas = patrimonio
      .map((item) => item.numerodeEtiqueta)
      .sort((a, b) => a - b);

    let nextEtiqueta = 1; // Começa verificando a partir do número 1

    // Encontra a menor etiqueta ausente
    for (let i = 0; i < etiquetas.length; i++) {
    
      if (etiquetas[i] !== nextEtiqueta) {
        return nextEtiqueta;
      }
      nextEtiqueta++;
    }
    return nextEtiqueta;
  }; 
*/
  // Atualiza o número de etiqueta
  useEffect(() => {
    if (Array.isArray(patrimonio) && patrimonio.length > 0) {
      setNumerodeEtiqueta(patrimonio[patrimonio.length - 1].numerodeEtiqueta + 1);
    } else {
      setNumerodeEtiqueta(1); // Ou qualquer número inicial desejado
    }
  }, [patrimonio]);

  useEffect(() =>{
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
    fetchlocalizacao();
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

  const handleChangeLocalizacao = (event) => {
    const { value } = event.target;
    setLocalizacao(value);
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
      setNumerodeEtiqueta(value);
    }
  };

  const handleChangeDooacao = (event) => {
      setDoacao(!doacao);
  }

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
      !datadeCadastro || 
      !descricao ||
      !numerodeEtiqueta ||
      !valor ||
      !localizacao
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

        <div className="descricao-fin">
          <FieldText
            label="Nome *"
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
            onChange={(newValue) => (patrimonio.numerodeEtiqueta[patrimonio.length - 1] + 1)}
            value={numerodeEtiqueta.toString().padStart(4, '0')}
          />
        </div>

        <div className="double-box-fin">
        <FieldSelect
            label="Localização *"
            onChange={handleChangeLocalizacao}
            value={localizacao}
            options={localizacoes.map((loc) => loc.localizacao)}
            />
          <DataSelect
            label="Data de cadastro"
            value={datadeCadastro}
            onChange={(newValue) => setDatadeCadastro(new Date())}
          />

        </div>
        <div className="descricao-fin">
        <FieldTextCheckbox
            label="Patrimonio Doado"
            checked={doacao}
            onCheckboxChange={(e) => setDoacao(e.target.checked)}
            disabled={true}
          />
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
