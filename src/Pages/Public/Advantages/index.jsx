import React from "react";
import { Link } from "react-router-dom";
import AdvantagesModal from "../../../Components/AdvantagesModal";
import AdvantagesCard from "../../../Components/AdvantagesCard";

import "./index.css";
export default function Advantages() {
  return (
    <>

      <h1>Porque se filiar?</h1>
      <h2>
        Venha conhecer os benefícios que os filiados ao SINDPOL-DF possuem
      </h2>

      <div className="containerCards">
        {<AdvantagesCard />}
        {<AdvantagesCard />}
        {<AdvantagesCard />}
        {<AdvantagesCard />}
        {<AdvantagesCard />}
        {<AdvantagesCard />}
      </div>
      {/*<AdvantagesModal />*/}

      <Link to="/filiacao" className="button">
        Quero me Filiar
      </Link>


    </>
  );
}
