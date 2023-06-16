import React, { useEffect, useState } from "react";
import styles from "./editarAluno.module.scss";
import axios from "axios";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Container,
} from "@chakra-ui/react";
import { BiSearchAlt2 } from "react-icons/bi";
import PagesHeader from "../../components/pagesHeader/PagesHeader";

interface IAlunoData {
  _id: string;
  nome: string;
  dataDeNascimento: string;
}

const EditarAluno = () => {
  const [alunos, setAlunos] = useState<IAlunoData[]>([]);
  const [token, setToken] = useState("");
  const [nome, setNome] = useState<string>("");
  const [response, setResponse] = useState({});
  const [alunoId, setAlunoId] = useState("");
  const [dataDeNascimento, setDataDeNascimento] = useState("");
  const [dataDeNascimentoAtual, setDataDeNascimentoAtual] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const handleChange = (event: any) => {
    const formattedValue = formatInputValue(event.target.value);
    setDataDeNascimento(formattedValue);
  };

  const formatInputValue = (value: any) => {
    let formattedValue = value.replace(/\D/g, "").slice(0, 8);
    if (formattedValue.length >= 2) {
      formattedValue = formattedValue.replace(/^(\d{2})/, "$1/");
    }
    if (formattedValue.length >= 5) {
      formattedValue = formattedValue.replace(/^(\d{2})\/(\d{2})/, "$1/$2/");
    }
    return formattedValue;
  };

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

  const editarAluno = async (_id: string) => {
    await axios
      .put(
        `https://fullstack-test-g43a.onrender.com/editarAluno/${_id}`,
        {
          nome: nome,
          dataDeNascimento: dataDeNascimento
            ? dataDeNascimento
            : dataDeNascimentoAtual,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        toast({
          title: res?.data?.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setResponse(res?.data);
        setNome("");
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
    <div>
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
                <div className={styles.editarAlunoComponent} key={aluno?._id}>
                  <p className={styles.editarAlunoComponentNome}>
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
                    onClick={() => {
                      onOpen();
                      setNome(aluno?.nome);
                      setDataDeNascimentoAtual(aluno?.dataDeNascimento);
                      setAlunoId(aluno?._id);
                    }}
                  >
                    Editar
                  </Button>
                </div>
              ))}

          {!nome &&
            alunos.map((aluno) => (
              <div className={styles.editarAlunoComponent} key={aluno?._id}>
                <p className={styles.editarAlunoComponentNome}>{aluno?.nome}</p>
                <p>{aluno?.dataDeNascimento}</p>
                <Button
                  backgroundColor={"#ea4c89"}
                  size="xs"
                  padding={4}
                  color={"#ffffff"}
                  width={"25%"}
                  fontSize={"small"}
                  onClick={() => {
                    onOpen();
                    setNome(aluno?.nome);
                    setDataDeNascimentoAtual(aluno?.dataDeNascimento);
                    setAlunoId(aluno?._id);
                  }}
                >
                  Editar
                </Button>
              </div>
            ))}
        </div>
      </Container>

      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={() => {
          setNome("");
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar aluno</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do aluno"
                size="lg"
              />{" "}
              <Input
                value={dataDeNascimento}
                onChange={handleChange}
                required
                type="text"
                placeholder="dd/mm/yy"
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setNome("");
                onClose();
              }}
            >
              Fechar
            </Button>
            <Button
              onClick={() => {
                editarAluno(alunoId);
              }}
              variant="ghost"
            >
              Editar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditarAluno;
