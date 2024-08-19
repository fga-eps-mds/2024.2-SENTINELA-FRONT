import { useState, useEffect } from "react";
import { useAuth } from "../../../Context/auth";
import { getUsers } from "../../../Services/userService";
import FieldSelect from "../../../Components/FieldSelect";
import "./index.css";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";
import DataSelect from "../../../Components/DataSelect";

// Registrar os elementos necessários no Chart.js
Chart.register(
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale
);

const Home = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isSind, setIsSind] = useState("Sindicalizado");
  const [lotacao, setLotacao] = useState("");
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);

  // Opções de filtro
  const filiadosOptions = ["Sindicalizado", "Não Sindicalizado"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        if (Array.isArray(response)) {
          const normalizedUsers = normalizeUserData(response);
          setData(normalizedUsers);
        } else {
          console.error("Os dados recebidos não são um array.");
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  function normalizeUserData(users) {
    return users.map((user) => {
      if (user.lotacao) {
        user.lotacao = user.lotacao.toLowerCase().trim();
      }
      return user;
    });
  }

  const uniqueLotacoes = (users) => {
    const lotacoesSet = new Set();

    users.forEach((user) => {
      if (user.lotacao) {
        lotacoesSet.add(user.lotacao.toLowerCase().trim());
      }
    });

    return Array.from(lotacoesSet);
  };

  const lotacoesOptions = uniqueLotacoes(data);

  const filteredData = data.filter((user) => {
    return user.status === true && (lotacao === "" || user.lotacao === lotacao);
  });

  const genderCounts = {
    Male: filteredData.filter((user) => user.sex === "Masculino").length,
    Female: filteredData.filter((user) => user.sex === "Feminino").length,
    Empty: filteredData.filter((user) => user.sex === "").length,
  };

  const dataLotacao = {
    labels: ["Masculino", "Feminino", "Outro"],
    datasets: [
      {
        label: "Divisão de sexo por lotação",
        data: [genderCounts.Male, genderCounts.Female, genderCounts.Empty],
        backgroundColor: ["blue", "red", "grey"],
        borderColor: ["blue", "red", "grey"],
        borderWidth: 1,
      },
    ],
  };

  const optionsLotacao = {
    responsive: true,
  };

  // Dados e opções para o gráfico de linhas
  const filiacoesData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"], // Exemplo de labels
    datasets: [
      {
        label: "Filiações e Desfiliações",
        data: [65, 59, 80, 81, 56, 55, 40], // Exemplo de dados
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    user && (
      <section className="dash-section">
        <div className="filiados-section">
          <h1>Filiados</h1>

          <div className="filiados">
            <div className="filiados-box">
              <h2>Total</h2>
              <h1 id="box">{data.length}</h1>
            </div>

            <div className="filiados-box">
              <h2>{isSind}</h2>
              <h1 id="box">
                {isSind === "Sindicalizado"
                  ? data.filter((item) => item.status === true).length
                  : data.filter((item) => item.status === false).length}
              </h1>
            </div>

            <FieldSelect
              label="Filtro"
              onChange={(e) => {
                setIsSind(e.target.value);
              }}
              options={filiadosOptions}
              value={isSind}
            />
          </div>
        </div>

        <div className="lotation">
          <div className="lotation-box">
            <h1>Divisão de sexo por lotação</h1>
            <Doughnut data={dataLotacao} options={optionsLotacao} />
          </div>

          <FieldSelect
            label="Filtro"
            onChange={(e) => {
              setLotacao(e.target.value);
            }}
            options={lotacoesOptions}
            value={lotacao}
          />
        </div>

        <div className="filiacoes">
          <div className="filicacoes-box">
            <h1>Filiações e Desfiliações</h1>
            <Line data={filiacoesData} />
          </div>
          <DataSelect
            label="Data Inicial"
            value={initialDate}
            onChange={(newValue) => setInitialDate(newValue)}
          />
          <DataSelect
            label="Data Final"
            value={finalDate}
            onChange={(newValue) => setFinalDate(newValue)}
          />
        </div>
      </section>
    )
  );
};

export default Home;
