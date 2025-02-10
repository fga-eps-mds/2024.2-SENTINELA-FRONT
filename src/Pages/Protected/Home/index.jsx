import { useState, useEffect } from "react";
import { useAuth } from "../../../Context/auth";
import { getUsers } from "../../../Services/userService";
import { getBenefitsForm } from "../../../Services/benefitsService";
import FieldSelect from "../../../Components/FieldSelect";
import "./index.css";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
} from "chart.js";
import SecondaryButton from "../../../Components/SecondaryButton";

// Registrar os elementos necessários no Chart.js
Chart.register(
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend
);

const Home = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isSind, setIsSind] = useState("Sindicalizado");
  const [lotacao, setLotacao] = useState("");
  const [orgao, setOrgao] = useState("");
  //const [beneficio, setBeneficio] = useState([]);
  const [beneficioList, setBeneficioList] = useState([]); 
  const [benefitCounts, setBenefitCounts] = useState({});
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Opções de filtro
  const filiadosOptions = ["Sindicalizado", "Não Sindicalizado"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        if (Array.isArray(response)) {
          const normalizedUsers = normalizeUserData(response);
          console.log("Usuários normalizados:", normalizedUsers); // Log para verificação
          setData(normalizedUsers);

          const processedData = processUserData(response);
          console.log("Usuarios: ", processedData);
          setLineChartData(processedData);
        } else {
          console.error("Os dados recebidos não são um array.");
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
  
    fetchUsers(); // Chama a função após a definição
  
  }, []); 

  useEffect(() => {
    const getBenefits = async () => {
      try {
        const response = await getBenefitsForm();
    
        if (Array.isArray(response)) {
          const beneficiosComId = response.map((beneficio) => ({
            nome: beneficio.nome ? beneficio.nome.toLowerCase().trim() : "",
          }));
          setBeneficioList(beneficiosComId); // Usando o setter correto
        }
      } catch (error) {
        console.error("Erro ao buscar os benefícios:", error);
      }
    };
    
    getBenefits();
  }, []);

  function normalizeUserData(users) {
    return users.map((user) => {
      if (user.lotacao) {
        user.lotacao = user.lotacao.toLowerCase().trim();
      }
      if (user.orgao) {
        user.orgao = user.orgao.toLowerCase().trim();
      }
      if(user.beneficio){
        user.beneficio = user.beneficio.toLowerCase().trim();
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

  //função para obter dados filtrados por benefícios

  useEffect(() => {
    const countUsersByBenefit = () => {
      const counts = {};

      data.forEach((user) => {
        let beneficiosUsuario = user.beneficio;

        if (!beneficiosUsuario) return;

        if (!Array.isArray(beneficiosUsuario)) {
          beneficiosUsuario = [beneficiosUsuario]; // Garante que seja um array
        }

        beneficiosUsuario.forEach((benefit) => {
          const beneficioNormalizado = benefit.toLowerCase().trim();
          const beneficioExiste = beneficioList.some(b => b.nome === beneficioNormalizado);

          if (beneficioExiste) {
            counts[beneficioNormalizado] = (counts[beneficioNormalizado] || 0) + 1;
          }
        });
      });

      setBenefitCounts(counts);
    };

    if (data.length > 0 && beneficioList.length > 0) {
      countUsersByBenefit();
    }
}, [data, beneficioList]);


  // const benefitCounts = {};
  // data.forEach((user) => {
  //   if (user.beneficio && user.beneficio.nome) {
  //     const beneficioNome = user.beneficio.nome.toLowerCase().trim();
  //     if (!benefitCounts[beneficioNome]) {
  //       benefitCounts[beneficioNome] = 0;
  //     }
  //     benefitCounts[beneficioNome]++;
  //   }
  // });
  


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

  const [visualizationType, setVisualizationType] = useState("Mensal");

  const processUserData = (users) => {
    const monthNames = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    // Estrutura inicial para armazenar os dados mensais
    const monthlyData = monthNames.reduce((acc, month) => {
      acc[month] = { filiados: 0, desfiliados: 0, naoFiliados: 0 };
      return acc;
    }, {});

    users.forEach((user) => {
      // Processar filiações
      if (user.role.name === "sindicalizado" && user.status == true) {
        const date = new Date(user.hiringDate);
        let month = "Dez"; // Assumindo Dezembro como padrão caso não haja uma data
        if (date && !isNaN(date)) {
          month = monthNames[date.getMonth()];
        }
        monthlyData[month].filiados += 1;
      }

      // Processar não filiados
      else if (user.role.name !== "sindicalizado") {
        const date = new Date(user.updatedAt);
        let month = "Dez"; // Assumindo Dezembro como padrão caso não haja uma data
        if (date && !isNaN(date)) {
          month = monthNames[date.getMonth()];
        }
        monthlyData[month].naoFiliados += 1;
      }

      // Processar desfiliações
      else {
        const date = new Date(user.updatedAt);
        if (!isNaN(date)) {
          const month = monthNames[date.getMonth()];
          monthlyData[month].desfiliados += 1;
        }
      }
    });

    return {
      labels: Object.keys(monthlyData),
      datasets: [
        {
          label: "Filiações",
          data: Object.values(monthlyData).map((d) => d.filiados),
          borderColor: "#FA0E0C",
          fill: false,
        },
        {
          label: "Desfiliações",
          data: Object.values(monthlyData).map((d) => d.desfiliados),
          borderColor: "#1B9D77",
          fill: false,
        },
        {
          label: "Não filiados",
          data: Object.values(monthlyData).map((d) => d.naoFiliados),
          borderColor: "#3245CC",
          fill: false,
        },
      ],
    };
  };

  // Dados para o gráfico de linhas
  const getLineChartData = (lineChartData, visualizationType) => {
    if (!lineChartData) return { labels: [], datasets: [] };

    const calculateSemesterData = (data) => [
      data.slice(0, 6).reduce((sum, value) => sum + value, 0), // Soma dos primeiros 6 meses
      data.slice(6, 12).reduce((sum, value) => sum + value, 0), // Soma dos últimos 6 meses
    ];

    const calculateAnnualData = (data) => [
      data.reduce((sum, value) => sum + value, 0), // Soma de todos os meses
    ];

    const config = {
      Mensal: {
        labels: [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ],
        data: lineChartData,
      },
      Semestral: {
        labels: ["1º Semestre", "2º Semestre"],
        data: {
          datasets: [
            {
              data: calculateSemesterData(
                lineChartData.datasets[0]?.data || []
              ),
            },
            {
              data: calculateSemesterData(
                lineChartData.datasets[1]?.data || []
              ),
            },
            {
              data: calculateSemesterData(
                lineChartData.datasets[2]?.data || []
              ),
            },
          ],
        },
      },
      Anual: {
        labels: ["2025"],
        data: {
          datasets: [
            {
              data: calculateAnnualData(lineChartData.datasets[0]?.data || []),
            },
            {
              data: calculateAnnualData(lineChartData.datasets[1]?.data || []),
            },
            {
              data: calculateAnnualData(lineChartData.datasets[2]?.data || []),
            },
          ],
        },
      },
    };

    const selectedData = config[visualizationType] || config["Mensal"];
    console.log("linechardata: ", lineChartData);
    return {
      labels: selectedData.labels,
      datasets: [
        {
          label: "Filiações",
          data: selectedData.data.datasets[0]?.data || [],
          borderColor: "#FA0E0C",
          fill: false,
        },
        {
          label: "Desfiliações",
          data: selectedData.data.datasets[1]?.data || [],
          borderColor: "#1B9D77",
          fill: false,
        },
        {
          label: "Não filiados",
          data: selectedData.data.datasets[2]?.data || [],
          borderColor: "#3245CC",
          fill: false,
        },
      ],
    };
  };

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

  const chartBenefits = {
    labels: Object.keys(benefitCounts),
    datasets: [
      {
        label: "Benefícios utilizados por filiados",
        data: Object.values(benefitCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderWidth: 4,
      },
    ],
  };
  console.log("ainnn tira", Object.keys(benefitCounts));

  const optionsBenefits = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      Legend: {
        display: true,
        position: "left",
        labels: {
          boxWidth: 15,
          padding: 10,
          font: {
            size: 14,
          },
          color: "#333", 
          usePointStyle: true, 
        },
      },
    },
    animation: {
      onComplete: function (event) {
        const chart = event.chart;
        const ctx = chart.ctx;
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
  
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((element, index) => {
            const data = dataset.data[index];
            const total = dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((data / total) * 100).toFixed(1) + "%";
  
            const position = element.tooltipPosition();
            ctx.fillText(percentage, position.x, position.y);
          });
        });
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
    scales: {
      y: {
        beginAtZero: false, // Faz o eixo Y começar do zero
        suggestedMax: Math.max(
          ...lineChartData.datasets.flatMap((dataset) => dataset.data)
        ), // Define o máximo como o maior valor dos dados
        ticks: {
          stepSize: Math.ceil(
            Math.max(
              ...lineChartData.datasets.flatMap((dataset) => dataset.data)
            ) / 10
          ), // Define o intervalo dos ticks no eixo Y (ajuste conforme necessário)
        },
      },
    },
  };

  // Dados mockados para ativo e aposentado
  const dataMock = {
    Ativo: 100, // Exemplo: 120 usuários ativos
    Aposentado: 54, // Exemplo: 80 usuários aposentados
  };

  const dataStatus = {
    labels: ["Ativo", "Aposentado"],
    datasets: [
      {
        label: "Distribuição de Ativos e Aposentados",
        data: [dataMock.Ativo, dataMock.Aposentado],
        backgroundColor: ["#DA5F02", "#1B9D77"], // Cores do gráfico
        borderWidth: 4,
      },
    ],
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

          <div className="donut-box2">
            <h1>Distribuição de Benefícios</h1>
            {Object.keys(benefitCounts).length > 0 ? (
              <div style={{ position: 'relative', height: '400px', width: '100%' }}>
                <Doughnut
                  data={chartBenefits}
                  options={optionsBenefits}
                  redraw
                />
              </div>
          ) : (
            <div className="no-data">
              <p>Carregando dados de benefícios...</p>
            </div>
          )}
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
          <Line
            data={getLineChartData(lineChartData, visualizationType)}
            options={optionsLineChart}
          />
        </div>

        <div className="donut-box">
          <h1>Distribuição de Ativos e Aposentados</h1>
          <Doughnut data={dataStatus} options={optionsLotacao} />
        </div>

        <SecondaryButton text="Limpar Filtros" onClick={clearFilters} />
      </section>
    )
  );
};

export default Home;
