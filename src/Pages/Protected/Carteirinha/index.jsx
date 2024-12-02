import React, { useRef }from "react";
import "./index.css";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import badgeLogo from "../../../assets/sindpol-logo.png";
import penalLogo from "../../../assets/penal_df-min.png.png";
import qrCode from "../../../assets/qr-code.png";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Carteirinha = () => {
  const cardRef = useRef(null);

  const downloadPDF = async () => {
    const element = cardRef.current;
    const scale = 3; 
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true, 
    });
    const imgData = canvas.toDataURL("image/png");
  
    // Criação do PDF
    const pdf = new jsPDF("p", "mm", "a4");
  
    
    const cardWidth = 100; 
    const cardHeight = (canvas.height * cardWidth) / canvas.width; 
    const xOffset = (pdf.internal.pageSize.getWidth() - cardWidth) / 2; 
    const yOffset = 50; 
  
    pdf.addImage(imgData, "PNG", xOffset, yOffset, cardWidth, cardHeight);
    pdf.save("carteirinha.pdf");
  };
  
    const list = {
        titular: "Dannyeclisson",
        dataDeNascimento: "24/11/2001",
        dataExpedicao: "21/06/2019",
        CPF: "074.885.581-54",
        validade: "30/11/2024",
    };

    return (
        <div className="carteirinha-container">
            {/* Primeira Parte da Carteirinha */}
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
                                <strong>TITULAR:</strong><br/>
                                <p className="info-color"><span>{list.titular}</span></p>
                            </div>
                        </div>
                        <div className="info-line">
                            <div className="info-block">
                                <strong>DATA DE NASCIMENTO:</strong><br/>
                                <p className="info-color"><span>{list.dataDeNascimento}</span></p>
                            </div>
                            <div className="info-block">
                                <strong>DATA DE EXPEDIÇÃO:</strong><br/>
                                <p className="info-color"><span>{list.dataExpedicao}</span></p>
                            </div>
                        </div>
                        <div className="info-line">
                            <div className="info-block">
                                <strong>CPF:</strong><br/>
                                <p className="info-color"><span>{list.CPF}</span></p>
                            </div>
                            <div className="info-block">
                                <strong>VALIDADE:</strong><br/>
                                <p className="info-color"><span>{list.validade}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Badge Section */}
                    <div className="badge-section">
                        <img src={badgeLogo} alt="Sindicalizado Badge" className="badge-logo" />
                        <p className="Sind">SINDICALIZADO</p>
                    </div>
                </div>
            </div>

            {/* Segunda Parte da Carteirinha */}
            <div className="carteirinha">
            <footer className="carteirinha-footer">
                    <p>
                        Setor de Diversões Sul (SDS), Conjunto Baracat, Bloco F, 27, Salas 313/315,
                        Asa Sul, Brasília/DF, CEP 70392-900
                    </p>
                    </footer>
                <div className="qr-section">
                    <img src={qrCode} alt="QR Code" className="qr-code" />
                    <p className="qr-code-numero">0000</p>
                </div>

                <footer className="carteirinha-footer">
                    <p>sindpol.org.br / contato@sindpol.org.br</p>
                    <div className="social-media">
                        <FaInstagram className="social-icon" />
                        <FaYoutube className="social-icon" />
                        <FaFacebook className="social-icon" />
                        <FaTwitter className="social-icon" />
                    </div>
                    <span>@sindpoldf</span>
                    <div className="footer-logos">
                    <img src={badgeLogo} alt="Logo 1" className="footer-logo" />
                    <img src={penalLogo} alt="Logo 2" className="footer-logo" />
                    </div>
                </footer>
            </div>

            {/* Botão */}
            <button onClick={downloadPDF} className="download-button">BAIXAR CARTEIRINHA</button>
        </div>
    );
};

export default Carteirinha;
