import { useEffect, useState } from "react";
import Chart from "../../components/chart/Chart";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Stack,
  Container,
} from "@chakra-ui/react";
import axios from "axios";
import PagesHeader from "../../components/pagesHeader/PagesHeader";
import styles from "./metricas.module.scss";
interface IAlunoData {
  faixa: string;
  quantidade: number;
  porcentagem: number;
}

const Metricas = () => {
  const [alunos, setAlunos] = useState<IAlunoData[]>([]);

  useEffect(() => {
    const getFilteredData = () => {
      new Promise((resolve) => {
        resolve(localStorage.getItem("userData"));
      })
        .then(async (response: any) => {
          const parsedInfoFromStorage = JSON.parse(response);

          await axios
            .get("https://fullstack-test-g43a.onrender.com/alunosFiltrados", {
              headers: {
                Authorization: "Bearer " + parsedInfoFromStorage?.token,
              },
            })
            .then((res) => {
              setAlunos(res?.data);
            })
            .catch((error) => {
              console.error(
                "Erro ao buscar alunos filtrados",
                error?.response?.message
              );
            });
        })
        .catch((error) => {
          console.error("error", error);
        });
    };

    getFilteredData();
  }, []);
  return (
    <div className={styles.metricasContainer}>
      <Container>
        <PagesHeader />
        <Chart alunos={alunos} />
        <Stack>
          <TableContainer>
            <Table variant="simple">
              <TableCaption>Informações sobre os alunos</TableCaption>
              <Thead>
                <Tr>
                  <Th>Label</Th>
                  <Th>Quantidade</Th>
                  <Th>Porcentagem</Th>
                </Tr>
              </Thead>
              {alunos?.map((aluno, key) => (
                <Tbody key={key}>
                  <Tr>
                    {aluno?.faixa === "55+" ? (
                      <Td>{aluno?.faixa} anos</Td>
                    ) : (
                      <Td>Entre {aluno?.faixa} anos</Td>
                    )}
                    <Td>{aluno?.quantidade}</Td>
                    {aluno?.porcentagem ? (
                      <Td>{aluno?.porcentagem.toFixed(2)} %</Td>
                    ) : (
                      <Td>{aluno?.porcentagem}</Td>
                    )}
                  </Tr>
                </Tbody>
              ))}
            </Table>
          </TableContainer>
        </Stack>
      </Container>
    </div>
  );
};

export default Metricas;
