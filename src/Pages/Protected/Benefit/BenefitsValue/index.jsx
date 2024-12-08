import { useState, useEffect } from "react";
import { getBenefitsForm } from "../../../../Services/benefitsService";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import "./index.css";

export default function BenefitsValue() {
  const [benefits, setBenefits] = useState([]);

  useEffect(() => {
    const getBenefits = async () => {
      const response = await getBenefitsForm();
      setBenefits(response);
    };

    getBenefits();
  }, []);

  return (
    <section className="container-list-benefits">
      <div className="forms-container-list-benefits">
        <div className="double-box-list-benefits">
          <h1> Valores dos benefícios</h1>
          <p>Benefícios disponíveis</p>
        </div>
        <div className="search-box-benefits">
          <List>
            {benefits?.map((benefit) => (
              <div key={benefit._id}>
                <ListItem>
                  <ListItemText primary={benefit.nome} />
                  <ListItemText primary={benefit.descricao} />
                  <div>
                    <ListItemText
                      primary="Valor"
                      secondary="Incluso na filiação"
                    />
                  </div>
                </ListItem>

                <Divider />
              </div>
            ))}
          </List>
        </div>
      </div>
    </section>
  );
}
