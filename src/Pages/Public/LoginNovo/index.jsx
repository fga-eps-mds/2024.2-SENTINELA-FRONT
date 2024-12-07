import "./index.css";
import { Link } from "react-router-dom";
import sentinela_logo from "../../../assets/sentinela-logo.png";


export default function loginNovo() {
  return (
    <>
      <div className="navBar">
          <div className="navRight">
            <img src={sentinela_logo} alt="Logo Sentinela" />
          </div>

          <div className="navLeft">
              <Link href="" className="navLink1">Vantagens</Link>
              <Link href="" className="navLink2">Filiar</Link>
          </div>
      </div>

      <div className="sideText">
        <h2>Bem-vindo ao SINDPOL-DF</h2>

        <h5>O Sindicato da Polícia Penal do Distrito Federal</h5>

        <p>Defendemos seus direitos, fortalecemos sua voz e construímos uma categoria unida e respeitada.
          Faça parte dessa força e contribua para um futuro melhor para todos os policiais penais do Distrito Federal.
        </p>
        <a href="#">Filiar-me ao sindicato</a>

        <a href="#">Ver vantagens</a>
      </div>

      <div className="sideLogin">

      </div>
        
        
    </>
  );
}