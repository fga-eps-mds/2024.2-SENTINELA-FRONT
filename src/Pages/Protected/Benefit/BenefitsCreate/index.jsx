import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import FieldText from "../../../../Components/FieldText";
import FieldSelect from "../../../../Components/FieldSelect";
import DataSelect from "../../../../Components/DataSelect";
import FieldTextCheckbox from "../../../../Components/FieldTextCheckbox";
import PrimaryButton from "../../../../Components/PrimaryButton";
import Modal from "../../../../Components/Modal";
import SecondaryButton from "../../../../Components/SecondaryButton";
import FieldFile from "../../../../Components/FieldFile";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import { createBenefitsForm } from "../../../../Services/benefitsService";
import {
  isValidEmail,
  isValidCelular,
  isValidSite,
} from "../../../../Utils/validators";
import { checkAction } from "../../../../Utils/permission";

export default function BenefitsCreate() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [ans, setAns] = useState("");
  const [categoria, setCategoria] = useState("");
  const [statusConvenio, setStatusConvenio] = useState("");
  const [dataCadastro, setDataCadastro] = useState(null);
  const [considerarIr, setConsiderarIr] = useState("");
  const [descontoAut, setDescontoAut] = useState("");
  const [logotipo, setLogotipo] = useState("");
  const [site, setSite] = useState("");
  const [email, setEmail] = useState("");
  const [telefCelular, setTelefCelular] = useState("");
  const [dataAssinatura, setDataAssinatura] = useState(null);
  const [dataInicio, setDataInicio] = useState(null);
  const [sitContrato, setSitContrato] = useState("");
  const [dataFinal, setDataFinal] = useState(null);
  const [contratoSit, setContratoSit] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [openError, setOpenError] = useState(false);
  // const permissions = usePermissions();

  const tipoPessoaList = ["Jurídica", "Física"];
  const categoriaList = [
    "Alimentação",
    "Artes",
    "Escolas",
    "Academias",
    "Outros",
  ];
  const statusConvenioList = ["Ativo", "Inativo"];
  const considerarIrList = ["Sim", "Não"];
  const descontoAutList = ["Sim", "Não"];
  const sitContratoList = ["Concluído", "Pendência", "Cancelado"];

  const handleChangeTipoPessoa = (event) => {
    setTipoPessoa(event.target.value);
  };

  const handleChangeCategoria = (event) => {
    setCategoria(event.target.value);
  };

  const handleChangeStatusConvenio = (event) => {
    setStatusConvenio(event.target.value);
  };

  const handleChangeConsiderarIr = (event) => {
    setConsiderarIr(event.target.value);
  };

  const handleChangeDescontoAut = (event) => {
    setDescontoAut(event.target.value);
  };

  const handleChangeSitContrato = (event) => {
    setSitContrato(event.target.value);
  };

  const handleCloseDialog = () => {
    setShowModal(false);
    navigate("/beneficios/lista");
  };

  const handleFileChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogotipo(reader.result); // Atualiza o estado com o URL base64
    };
    reader.readAsDataURL(file); // Converte o arquivo para base64
  };

  const mascaraCpfCnpj = (cpfCnpj) => {
    let formattedValue = cpfCnpj.replace(/\D/g, "");
    if (formattedValue.length > 14) {
      formattedValue = formattedValue.slice(0, 14);
    }
    if (formattedValue.length <= 11) {
      return formattedValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      return formattedValue
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
  };

  const mascaraTelefCelular = (telefCelular) => {
    let formattedNumero = telefCelular.replace(/\D/g, "");
    if (formattedNumero.length > 11) {
      formattedNumero = formattedNumero.slice(0, 11);
    }
    if (formattedNumero.length === 11) {
      return formattedNumero
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d{4})$/, "$1-$2");
    } else {
      return formattedNumero
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{4})(\d{4})$/, "$1-$2");
    }
  };

  const handleCheck = async () => {
    if (
      !nome ||
      !razaoSocial ||
      !statusConvenio ||
      !considerarIr ||
      !descontoAut
    ) {
      setOpenError("Preencha todos os campos obrigatórios.");
      return;
    }

    const emailValidation = isValidEmail(email);
    if (!emailValidation.isValid) {
      setOpenError(emailValidation.message);
      return;
    }

    const celularValidation = isValidCelular(telefCelular);
    if (!celularValidation.isValid) {
      setOpenError(celularValidation.message);
      return;
    }

    const siteValidation = isValidSite(site);
    if (!siteValidation.isValid) {
      setOpenError(siteValidation.message);
      return;
    }

    const benefitsData = {
      nome,
      razaoSocial,
      descricao,
      tipoPessoa,
      cpfCnpj,
      ans,
      categoria,
      statusConvenio,
      dataCadastro,
      considerarIr,
      descontoAut,
      logotipo,
      site,
      email,
      telefCelular,
      dataAssinatura,
      dataInicio,
      sitContrato,
      dataFinal,
      contratoSit: isChecked,
    };

    try {
      const erro = await createBenefitsForm(benefitsData);
      if (!erro) {
        setShowModal(true);
      } else {
        console.error("Erro ao criar benefício");
      }
    } catch (error) {
      console.error("Erro ao criar benefício:", error);
    }
  };

  return (
    checkAction("beneficios_criar") && (
      <div className="container-benefits">
        <div className="forms-container-benefits">
          <h1>Cadastro de benefícios</h1>
          <h3>Dados do benefício</h3>
          <div className="section-form-benefits">
            <FieldText
              label="Nome fantasia *"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <FieldText
              label="Razão social *"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              required
            />
          </div>

          <FieldText
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <div className="section-form-benefits">
            <FieldSelect
              label="Classificação de pessoa"
              value={tipoPessoa}
              onChange={handleChangeTipoPessoa}
              options={tipoPessoaList}
            />

            <FieldText
              label="CPF/CNPJ"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(mascaraCpfCnpj(e.target.value))}
            />

            <FieldText
              label="ANS"
              value={ans}
              onChange={(e) => setAns(e.target.value)}
            />

            <FieldSelect
              label="Categoria"
              value={categoria}
              onChange={handleChangeCategoria}
              options={categoriaList}
            />

            <FieldSelect
              label="Status *"
              value={statusConvenio}
              onChange={handleChangeStatusConvenio}
              options={statusConvenioList}
            />

            <DataSelect
              label="Data de cadastro"
              value={dataCadastro}
              onChange={(newValue) => setDataCadastro(newValue)}
            />

            <FieldSelect
              label="Considerado no IR *"
              value={considerarIr}
              onChange={handleChangeConsiderarIr}
              options={considerarIrList}
            />

            <FieldSelect
              label="Desconto automático *"
              value={descontoAut}
              onChange={handleChangeDescontoAut}
              options={descontoAutList}
            />

            <FieldFile label="Logotipo" onChange={handleFileChange} />

            <FieldText
              label="Site"
              value={site}
              onChange={(e) => setSite(e.target.value)}
            />

            <FieldText
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FieldText
              label="Telefone/Celular"
              value={telefCelular}
              onChange={(e) =>
                setTelefCelular(mascaraTelefCelular(e.target.value))
              }
            />
          </div>

          <h3>Dados do contrato de benefício</h3>

          <div className="section-form-benefits">
            <DataSelect
              label="Data de assinatura"
              value={dataAssinatura}
              onChange={(newValue) => setDataAssinatura(newValue)}
            />

            <DataSelect
              label="Data de início"
              value={dataInicio}
              onChange={(newValue) => setDataInicio(newValue)}
            />

            <FieldSelect
              label="Situação"
              value={sitContrato}
              onChange={handleChangeSitContrato}
              options={sitContratoList}
            />

            <DataSelect
              label="Data final"
              value={dataFinal}
              onChange={(newValue) => setDataFinal(newValue)}
            />
          </div>

          <FieldTextCheckbox
            label="Contrato entregue"
            value={contratoSit}
            onChange={(e) => setContratoSit(e.target.value)}
            checked={isChecked}
            onCheckboxChange={(e) => setIsChecked(e.target.checked)}
            disabled={true}
          />

          <div id="envio">
            <PrimaryButton text="CADASTRAR" onClick={handleCheck} />
          </div>

          <Snackbar
            open={openError}
            autoHideDuration={6000}
            onClose={() => setOpenError(false)}
          >
            <Alert onClose={() => setOpenError(false)} severity="error">
              {openError}
            </Alert>
          </Snackbar>

          <Modal width="338px" alertTitle="Cadastro concluído" show={showModal}>
            <SecondaryButton
              key={"modalButtons"}
              text="OK"
              onClick={handleCloseDialog}
              width="338px"
            />
          </Modal>
        </div>
      </div>
    )
  );
}
