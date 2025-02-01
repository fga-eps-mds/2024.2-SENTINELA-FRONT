import { useState, useEffect } from "react";
import { useAuth } from "../../../Context/auth";
import { getUsers } from "../../../Services/userService";
import { getBenefitsForm} from "../../../Services/benefitsService";
import FieldSelect from "../../../Components/FieldSelect";
import "./index.css";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import SecondaryButton from "../../../Components/SecondaryButton";

// Registrar os elementos necessários no Chart.js
Chart.register(ArcElement, Tooltip);

const Home = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isSind, setIsSind] = useState("Sindicalizado");
  const [lotacao, setLotacao] = useState("");
  const [orgao, setOrgao] = useState("");
  const [beneficio, setBeneficio] = useState([]);

  // Opções de filtro
  const filiadosOptions = ["Sindicalizado", "Não Sindicalizado"];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Busca usuários e benefícios em paralelo
        const [usersResponse, benefitsResponse] = await Promise.all([
          getUsers(),
          getBenefitsForm()
        ]);
  
        // Processa usuários
        if (Array.isArray(usersResponse)) {
          setData(normalizeUserData(usersResponse));
        } else {
          console.error("Dados de usuários não são um array");
        }
  
        // Processa benefícios
        if (Array.isArray(benefitsResponse)) {
          setBeneficio(benefitsResponse);
        } else {
          console.error("Dados de benefícios não são um array");
        }
  
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
  
    fetchAllData();
  }, []);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await getUsers();
  //       if (Array.isArray(response)) {
  //         const normalizedUsers = normalizeUserData(response);
  //         setData(normalizedUsers);
  //       } else {
  //         console.error("Os dados recebidos não são um array.");
  //       }
  //     } catch (error) {
  //       console.error("Erro ao buscar usuários:", error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // carrega usuários
  //       const usersResponse = await getUsers();
  //       if (Array.isArray(usersResponse)) {
  //         setData(normalizeUserData(usersResponse));
  //       }

  //       // Carrega benefícios
  //       const benefitsResponse = await getBenefitsForm();
  //       if (Array.isArray(benefitsResponse)) {
  //         setBenefitsData(benefitsResponse);
  //       }
  //     } catch (error) {
  //       console.error("Erro ao carregar dados:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
    labels: beneficio.map(b => b.nome),
    datasets: [
      {
        label: "Benefícios Utilizados",
        data: beneficio.map(b => b.usuarios?.length || 0), // Usa optional chaining
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', 
          '#4BC0C0', '#9966FF'
        ],
        borderWidth: 4,
      }
    ]
  };
  
  const optionsBenefits = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1) + '%';
            
            return `${label}: ${value} usuários (${percentage})`;
          }
        }
      }
    }
  };

  // const getFilteredBenefits = () => {
  //   return beneficio.map(beneficio => ({
  //     ...beneficio,
  //     totalUsuarios: beneficio.usuarios.filter(usuario => 
  //       usuario.status === true && // Filtro por status
  //       (lotacao === "" || usuario.lotacao === lotacao)
  //     ).length
  //   }));
  // };
  
  // // atualiza o gráfico
  // data: getFilteredBenefits().map(b => b.totalUsuarios)

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setIsSind("Sindicalizado");
    setLotacao("");
    setOrgao("");
    setBeneficio([]);
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
            {beneficio.length > 0 ? (
              <Doughnut data={chartBenefits} options={optionsBenefits} />
            ) : (
              <div className="no-data">
                <p>Nenhum dado de benefícios disponível</p>
                <p>Verifique a conexão com o servidor</p>
              </div>
            )}
          </div>
        </div>

        <SecondaryButton text="Limpar Filtros" onClick={clearFilters} />
      </section>
    )
  );
};

export default Home;
