import { useState, useEffect } from "react";
import { useAuth } from "../../../Context/auth";
import { getUsers } from "../../../Services/userService";
import FieldSelect from "../../../Components/FieldSelect";
import "./index.css";
import { Doughnut, Line } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, CategoryScale, LinearScale, PointElement, LineElement, Legend } from "chart.js";
import SecondaryButton from "../../../Components/SecondaryButton";

// Registrar os elementos necessários no Chart.js
Chart.register(ArcElement, Tooltip, CategoryScale, LinearScale, PointElement, LineElement, Legend);

const Home = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isSind, setIsSind] = useState("Sindicalizado");
  const [lotacao, setLotacao] = useState("");
  const [orgao, setOrgao] = useState("");

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
      if (user.orgao) {
        user.orgao = user.orgao.toLowerCase().trim();
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

  const uniqueOrg = (users) => {
    const orgaoSet = new Set();

    users.forEach((user) => {
      if (user.orgao) {
        orgaoSet.add(user.orgao.toLowerCase().trim());
      }
    });

    return Array.from(orgaoSet);
  };

  const orgaolist = uniqueOrg(data);

  // Função para obter dados filtrados por lotação
  const getFilteredDataByLotacao = () => {
    return data.filter((user) => {
      return (
          user.status === true && (lotacao === "" || user.lotacao === lotacao)
      );
    });
  };

  // Função para obter dados filtrados por órgão
  const getFilteredDataByOrgao = () => {
    return data.filter((user) => {
      return user.status === true && (orgao === "" || user.orgao === orgao);
    });
  };

  // Dados filtrados para cada gráfico
  const filteredDataByLotacao = getFilteredDataByLotacao();
  const filteredDataByOrgao = getFilteredDataByOrgao();

  // Contagem de gênero
  const genderCounts = {
    Male: filteredDataByLotacao.filter((user) => user.sex === "Masculino")
        .length,
    Female: filteredDataByLotacao.filter((user) => user.sex === "Feminino")
        .length,
  };

  const dataLotacao = {
    labels: ["Masculino", "Feminino"],
    datasets: [
      {
        label: "Divisão de sexo por lotação",
        data: [genderCounts.Male, genderCounts.Female],
        backgroundColor: ["#AE883C", "#F2D680"],
        borderWidth: 4,
      },
    ],
  };

  // Contagem de usuários por órgão com base nos filtros
  const orgaoCounts = orgaolist.reduce((acc, org) => {
    const filteredByOrgao = filteredDataByOrgao.filter(
        (user) => user.orgao === org
    );
    acc[org] = filteredByOrgao.length;
    return acc;
  }, {});

  const dataOrgao = {
    labels: Object.keys(orgaoCounts),
    datasets: [
      {
        label: "Órgãos por lotação",
        data: Object.values(orgaoCounts),
        backgroundColor: [
          "#FFF6D4",
          "#F0E7C7",
          "#D9D2B4",
          "#A6A18A",
          "#B3AC94",
        ],
        borderWidth: 4,
      },
    ],
  };

  //cria um estado para armazenar opcoes do filtro
  const [visualizationType, setVisualizationType] = useState("Mensal");

  // Dados para o gráfico de linhas
  const getLineChartData = () => {
    if (visualizationType === "Mensal") {
      return {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: [
          { label: "Filiações", data: [6, 1, 2, 5, 3, 0, 2, 8, 3, 9, 1, 2], borderColor: "#36A2EB", fill: false },
          { label: "Desfiliações", data: [1, 3, 1, 3, 2, 0, 0, 2, 0, 2, 1, 0], borderColor: "#FF6384", fill: false },
          { label: "Não filiados", data: [10, 2, 6, 3, 5, 3, 2, 2, 2, 2, 3, 5], borderColor: "#4BC0C0", fill: false },
        ],
      };
    } else if (visualizationType === "Semestral") {
      return {
        labels: ["1º Semestre", "2º Semestre"],
        datasets: [
          { label: "Filiações", data: [395, 330], borderColor: "#36A2EB", fill: false },
          { label: "Desfiliações", data: [248, 296], borderColor: "#FF6384", fill: false },
          { label: "Não filiados", data: [208, 195], borderColor: "#4BC0C0", fill: false },
        ],
      };
    } else {
      return {
        labels: ["2024"],
        datasets: [
          { label: "Filiações", data: [725], borderColor: "#36A2EB", fill: false },
          { label: "Desfiliações", data: [544], borderColor: "#FF6384", fill: false },
          { label: "Não filiados", data: [403], borderColor: "#4BC0C0", fill: false },
        ],
      };
    }
  };

  const lineChartData = getLineChartData();

  const optionsLotacao = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setIsSind("Sindicalizado");
    setLotacao("");
    setOrgao("");
  };

  const optionsLineChart = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Garante que a legenda apareça
        position: "right", // Coloca a legenda ao lado do gráfico
        labels: {
          font: {
            size: 14, // Ajusta o tamanho da fonte
          },
          color: "#333", // Cor do texto da legenda
          usePointStyle: true, // Usa pequenos ícones coloridos na legenda
          padding: 20, // Dá mais espaço entre os itens da legenda
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
      user && (
          <section className="dash-section">
            <div className="filiados-section">
              <h1 style={{ fontSize: 40 }}>Filiados</h1>

              <div className="filiados">
                <div className="filiados-box">
                  <h2>Total</h2>
                  <h1 style={{ color: "#E2B73D !important" }} id="box">
                    {data.length}
                  </h1>
                </div>

                <div className="filiados-box">
                  <h2>{isSind}</h2>
                  <h1 style={{ color: "#E2B73D !important" }} id="box">
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
              <div className="donut-box">
                <h1>Divisão de sexo por lotação</h1>
                <Doughnut data={dataLotacao} options={optionsLotacao} />

                <FieldSelect
                    label="Filtro de Lotação"
                    onChange={(e) => {
                      setLotacao(e.target.value);
                    }}
                    options={lotacoesOptions}
                    value={lotacao}
                />
              </div>

              <div className="donut-box">
                <h1>Divisão de lotação por órgão</h1>
                <Doughnut data={dataOrgao} options={optionsLotacao} />
                <FieldSelect
                    label="Filtro de Órgão"
                    onChange={(e) => {
                      setOrgao(e.target.value);
                    }}
                    options={orgaolist}
                    value={orgao}
                />
              </div>
            </div>

            <FieldSelect
                label="Tipo de Visualização"
                onChange={(e) => setVisualizationType(e.target.value)}
                options={["Mensal", "Semestral", "Anual"]}
                value={visualizationType}
            />

            <div className="line-chart">
              <h1>Filiações, Desfiliações e Não filiados ao longo do tempo</h1>
              <Line data={lineChartData} options={optionsLineChart} />
            </div>

            <SecondaryButton text="Limpar Filtros" onClick={clearFilters} />
          </section>
      )
  );
};

export default Home;