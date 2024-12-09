import sindpol_logo from "../../assets/sindpol-logo.png";

import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

import "./index.css";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <img
          className="logoFooter"
          style={{
            height: "4.25rem",
            width: "4.25rem",
            marginTop: "0",
          }}
          src={sindpol_logo}
          alt="Sindpol Logo"
        />
        <div className="copyright">
          <p>Copyright © 2024 • Sindpol-DF • CNPJ 11.236.674/0001-06</p>
          <p>
            Setor de Diversões Sul (SDS), Conjunto Baracat Bloco F 27, Salas
            313/315 • Asa Sul
          </p>
          <p>Brasília/DF • CEP 70392-900</p>
        </div>
        <div
          className="icons"
          style={{
            display: "flex",
            fontSize: "1.875rem",
            gap: "2.188rem",
          }}
        >
          <a
            href="https://www.facebook.com/sindpoldf"
            style={{
              textDecoration: "none",
              color: "#3D160D",
            }}
          >
            <FaFacebookF />
          </a>
          <a
            href="https://x.com/sindpoldf"
            style={{
              textDecoration: "none",
              color: "#3D160D",
            }}
          >
            {" "}
            <FaXTwitter />
          </a>
          <a
            href="https://www.youtube.com/@sindpoldf/videos"
            style={{
              textDecoration: "none",
              color: "#3D160D",
            }}
          >
            <FaYoutube />
          </a>
          <a
            href="https://api.whatsapp.com/send/?phone=556133211949"
            style={{
              textDecoration: "none",
              color: "#3D160D",
            }}
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://www.instagram.com/sindpoldf/"
            style={{
              textDecoration: "none",
              color: "#3D160D",
            }}
          >
            <FaInstagram />
          </a>
        </div>
      </footer>
    </>
  );
}
