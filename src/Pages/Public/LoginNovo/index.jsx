import "./index.css";
import { Link } from "react-router-dom";
import sentinela_logo from "../../../assets/sentinela-logo.png";
import sindpol_logo from "../../../assets/sindpol-logo.png";
import AdvantagesCard from "../../../Components/AdvantagesCard";
import LabeledTextField from "../../../Components/LabeledTextField";
import PrimaryButton from "../../../Components/PrimaryButton";
import SecondaryButton from "../../../Components/SecondaryButton";
import UnderlinedTextButton from "../../../Components/UnderlinedTextButton";
import { useState, useContext, useEffect } from "react";
import AuthContext, { useAuth } from "../../../Context/auth";
import { useNavigate } from "react-router-dom";


export default function loginNovo() {
  return (
    <>
      <div className="navBar">
        <div className="navRight">
          <img src={sentinela_logo} alt="Logo Sentinela" />
        </div>

        <div className="navLeft">
          <Link href="" className="navLink1">Vantagens</Link>
          <Link to="/filiacao" className="navLink2">Filiar</Link>
        </div>
      </div>

      <div className="sideText">
        <h1 className="tittle">
          Bem-vindo ao SINDPOL-DF
        </h1>

        <h5 className="subTittle">
          O Sindicato da Polícia Penal do Distrito Federal
        </h5>

        <p className="lead">
          Defendemos seus direitos, fortalecemos sua voz e construímos uma categoria unida e respeitada.
          Faça parte dessa força e contribua para um futuro melhor para todos os policiais penais do Distrito Federal.
        </p>

        <div className="links">

          <Link href="#" className="links-link">Filiar-me ao sindicato</Link>
          <Link href="#" className="links-link">Ver vantagens</Link>

        </div>
      </div>

      <div className="sideLogin">

        <div className="sideLoginImage">
          <img src={sindpol_logo} alt="Logo SindPol" />
        </div>

        <div className="sideLoginElements">
          <h2>Já é filiado? Entre na sua conta</h2>
          <LabeledTextField
            label="EMAIL"
            placeholder="Digite seu email"
            type="email"
          />
          <LabeledTextField
            label="SENHA"
            placeholder="Digite sua senha"
            type="password"
          />
          <PrimaryButton
            text="Entrar"
            onClick={() => handleLogin()}
            maxWidth="400px"
          />
          <div className="recupera-senha">
            <UnderlinedTextButton
              key="recupera-senha"
              text="Esqueci a senha"
              onClick={() => handlePasswordRecovery()}
            />
          </div>
        </div>
      </div >

        
    </>
  );
}