import { useState, useEffect } from "react";
import { getBenefitsForm } from "../../../../Services/benefitsService";

import { FaWhatsapp } from "react-icons/fa";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import "./index.css";

export default function BenefitsValue() {
  const [benefits, setBenefits] = useState([]);
  const [expandedBenefit, setExpandedBenefit] = useState(null);

  const handleExpand = (id) => {
    // Alterna entre expandir e recolher o benefício clicado
    setExpandedBenefit((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const getBenefits = async () => {
      const response = await getBenefitsForm();
      setBenefits(response);
    };

    getBenefits();
  }, []);

  return (
    <section className="benefits-container">
      <div className="benefits-list">
        <div className="benefits-header">
          <h1> Valores dos benefícios</h1>
          <p>Benefícios disponíveis</p>
        </div>
        <div className="box-benefits">
          <List>
            {benefits?.map(
              (benefit, index) => (
                console.log(benefit),
                (
                  <div key={benefit._id}>
                    <ListItem className="benefit-item">
                      <ListItemText primary={benefit.nome} />
                      <ListItemText
                        className="benefit-datails"
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        primary="Mais Detalhes"
                        onClick={() => handleExpand(benefit._id)}
                      />
                      <div className="benefit-value">
                        <ListItemText
                          primary="Valor"
                          secondary={
                            index % 2
                              ? "Incluso na filiação"
                              : "Disconto de 15%"
                          }
                        />
                      </div>
                    </ListItem>

                    {expandedBenefit === benefit._id && (
                      <div className="benefit-details-expanded">
                        <ListItemText primary={benefit.descricao} />
                        <a
                          href="https://api.whatsapp.com/send/?phone=556133211949"
                          style={{
                            fontSize: "2rem",
                            textDecoration: "none",
                            color: "#3D160D",
                          }}
                        >
                          <FaWhatsapp />
                        </a>
                      </div>
                    )}

                    <Divider
                      style={{
                        padding: "1rem 0 0 0"
                      }}
                    />
                  </div>
                )
              )
            )}
          </List>
        </div>
      </div>
    </section>
  );
}
