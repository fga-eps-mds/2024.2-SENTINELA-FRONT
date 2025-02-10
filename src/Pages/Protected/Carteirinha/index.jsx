import { useRef, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import "./index.css";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import badgeLogo from "../../../assets/sindpol-logo.png";
import penalLogo from "../../../assets/penal_df-min.png.png";
//import qrCode from "../../../assets/qr-code.png";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { getToken } from "../../../Services/Functions/loader";

const Carteirinha = () => {
  const cardRef = useRef(null);
  const [membershipData, setMembershipData] = useState(null);

  // Fetch Membership data
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/logged-membership",
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        const data = await response.json();
        setMembershipData(data);
      } catch (error) {
        console.error("Erro ao buscar os dados do membership:", error);
      }
    };

    fetchMembership();
  }, []);

  const downloadPDF = async () => {
    const element = cardRef.current;

    if (!element) {
      console.error("Elemento não encontrado!");
      return;
    }

    const button = element.querySelector(".download-button");
    if (button) {
      button.style.display = "none"; // Oculta o botão
    }

    const scale = 3;
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const cardWidth = 210;
    const cardHeight = (canvas.height * cardWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, cardWidth, cardHeight);
    pdf.save("carteirinha.pdf");

    button.style.display = ""; // Mostra o botão novamente
  };

  // Render loading state
  if (!membershipData) {
    return <div>Carregando dados...</div>;
  }

  const { name, birthDate, cpf, expeditionDate, hiringDate, phone } = membershipData;

  return (
    <div className="carteirinha-container" ref={cardRef}>
      <div className="carteirinha">
        <header className="carteirinha-header">
          <h1>SINDPOL-DF</h1>
          <p>SINDICATO DOS POLICIAIS PENAIS DO DISTRITO FEDERAL</p>
        </header>

        {/* Informações e Badge */}
        <div className="info-and-badge">
          <div className="carteirinha-info">
            <div className="info-line">
              <div className="info-block">
                <strong>TITULAR:</strong>
                <br />
                <p className="info-color-titular">
                  <span>{name}</span>
                </p>
              </div>
            </div>
            <div className="info-line">
              <div className="info-block">
                <strong>TELEFONE:</strong>
                <br />
                <p className="info-color-titular">
                  <span>{phone}</span>
                </p>
              </div>
            </div>
            <div className="info-line">
              <div className="info-block">
                <strong>DATA DE NASCIMENTO:</strong>
                <br />

                <p className="info-color">
                  <span>{new Date(birthDate).toLocaleDateString()}</span>
                </p>
              </div>
              <div className="info-block">
                <strong>DATA DE EXPEDIÇÃO:</strong>
                <br />
                <p className="info-color">
                  <span>{new Date(expeditionDate).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
            <div className="info-line">
              <div className="info-block">
                <strong>CPF:</strong>
                <br />
                <p className="info-color">
                  <span>{cpf}</span>
                </p>
              </div>
              <div className="info-block">
                <strong>CONTRATAÇÃO:</strong>
                <br />
                <p className="info-color">
                  <span>{new Date(hiringDate).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Badge Section */}
          <div className="badge-section">
            <img
              src={badgeLogo}
              alt="Sindicalizado Badge"
              className="badge-logo"
            />
            <p className="Sind">SINDICALIZADO</p>
          </div>
        </div>
      </div>

      {/* Segunda Parte da Carteirinha */}
      <div className="carteirinha">
        <footer className="carteirinha-footer">
          <p>
            Setor de Diversões Sul (SDS), Conjunto Baracat, Bloco F, 27, Salas
            313/315, Asa Sul, Brasília/DF, CEP 70392-900
          </p>
        </footer>
        <div className="qr-section">
          <div className="qr-code">
            <QRCode value="http://localhost/verificar-membro" size={170} />{" "}
            {/* endereço que será passado no qrCode */}
          </div>
          <p className="qr-code-numero">(61) 3321-1949</p>
        </div>

        <footer className="carteirinha-footer">
          <p>sindpol.org.br / contato@sindpol.org.br</p>
          <div className="social-media">
            <FaInstagram className="social-icon" />
            <FaYoutube className="social-icon" />
            <FaFacebook className="social-icon" />
            <FaXTwitter className="social-icon" />
          </div>
          <span>@sindpoldf</span>
          <div className="footer-logos">
            <img src={badgeLogo} alt="Logo 1" className="footer-logo" />
            <img src={penalLogo} alt="Logo 2" className="footer-logo" />
          </div>
        </footer>
      </div>

      {/* Botão */}
      <button onClick={downloadPDF} className="download-button">
        BAIXAR CARTEIRINHA
      </button>
    </div>
  );
};

export default Carteirinha;
