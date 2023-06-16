import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from "./chart.module.scss";
ChartJS.register(ArcElement, Tooltip, Legend);
interface IAlunoData {
  alunos: { faixa: string; quantidade: number; porcentagem: number }[];
}

const Chart = ({ alunos }: IAlunoData) => {
  const data = {
    labels: [
      "Entre 18 a 25 anos ",
      "Entre 26 a 35 anos ",
      "Entre 36 a 45 anos",
      "Entre 46 anos a 55 anos",
      "Maiores que 55 anos",
    ],

    datasets: [
      {
        label: "Quantidade",
        data: alunos.map((aluno) => aluno?.quantidade),
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  return (
    <div className={styles.chartContainer}>
      <Doughnut options={{ maintainAspectRatio: false }} data={data} />
    </div>
  );
};

export default Chart;
