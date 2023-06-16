import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import { BiSearchAlt2 } from "react-icons/bi";
import axios from "axios";
import styles from "./removerAluno.module.scss";
import { useToast } from "@chakra-ui/react";
import PagesHeader from "../../components/pagesHeader/PagesHeader";
interface IAlunoData {
  _id: string;
  nome: string;
  dataDeNascimento: string;
}

const RemoverAluno = () => {
  const [alunos, setAlunos] = useState<IAlunoData[]>([]);
  const [token, setToken] = useState("");
  const [nome, setNome] = useState<string>("");
  const [response, setResponse] = useState({});
  const toast = useToast();

  useEffect(() => {
    const getData = () => {
      new Promise((resolve) => {
        resolve(localStorage.getItem("userData"));
      })
        .then(async (response: any) => {
          const parsedInfoFromStorage = JSON.parse(response);
          setToken(parsedInfoFromStorage?.token);
          await axios
            .get("https://fullstack-test-g43a.onrender.com/alunos", {
              headers: {
                Authorization: "Bearer " + parsedInfoFromStorage?.token,
              },
            })
            .then((res) => {
              setAlunos(res?.data);
            })
            .catch((error) => {
              console.error("Erro ao buscar alunos", error?.response?.message);
            });
        })
        .catch((error) => {
          console.error("error", error);
        });
    };
    getData();
  }, [response]);

  useEffect(() => {
    const filtrarPorNome = () => {
      try {
        alunos.filter((aluno) => {
          return aluno.nome === nome;
        });
      } catch (error) {
        console.error("Erro ao filtrar pedido", error);
      }
    };
    filtrarPorNome();
  }, [nome]);

  const removerAluno = async (_id: string) => {
    await axios
      .delete(`https://fullstack-test-g43a.onrender.com/deletarAluno/${_id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        toast({
          title: res?.data?.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setResponse(res?.data);
      })
      .catch((error) => {
        toast({
          title: error?.response?.data?.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <div className={styles.removerAlunoMain}>
      <Container>
        <PagesHeader />
        <Stack p={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <BiSearchAlt2 color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Pesquisar aluno"
              onChange={(e) => setNome(e.target.value)}
            />
          </InputGroup>
        </Stack>
        <div>
          {nome &&
            alunos
              .filter(
                (aluno) =>
                  aluno.nome.startsWith(nome) ||
                  aluno.nome.toLowerCase().startsWith(nome.toLowerCase())
              )
              .map((aluno) => (
                <div className={styles.removerAlunoComponent} key={aluno?._id}>
                  <p className={styles.removerAlunoComponentNome}>
                    {aluno?.nome}
                  </p>
                  <p>{aluno?.dataDeNascimento}</p>
                  <Button
                    backgroundColor={"#ea4c89"}
                    size="xs"
                    padding={4}
                    color={"#ffffff"}
                    width={"25%"}
                    fontSize={"small"}
                    onClick={() => removerAluno(aluno?._id)}
                  >
                    Remover
                  </Button>
                </div>
              ))}

          {!nome &&
            alunos.map((aluno) => (
              <div className={styles.removerAlunoComponent} key={aluno?._id}>
                <p className={styles.removerAlunoComponentNome}>
                  {aluno?.nome}
                </p>
                <p>{aluno?.dataDeNascimento}</p>
                <Button
                  backgroundColor={"#ea4c89"}
                  size="xs"
                  padding={4}
                  color={"#ffffff"}
                  width={"25%"}
                  fontSize={"small"}
                  onClick={() => removerAluno(aluno?._id)}
                >
                  Remover
                </Button>
              </div>
            ))}
        </div>
      </Container>
    </div>
  );
};

export default RemoverAluno;
