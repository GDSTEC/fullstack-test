import { useState } from "react";
import { Button, Container, Input, Stack, useToast } from "@chakra-ui/react";
import axios from "axios";
import styles from "./cadastrarAluno.module.scss";
import PagesHeader from "../../components/pagesHeader/PagesHeader";

const CadastrarAluno = () => {
  const [nome, setNome] = useState("");
  const [dataDeNascimento, setDataDeNascimento] = useState("");
  const toast = useToast();

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

  const cadastrarAluno = async () => {
    try {
       new Promise((resolve) => {
      resolve(localStorage.getItem("userData"));
    })
      .then(async (response: any) => {
        const parsedInfoFromStorage = JSON.parse(response);
        await axios
          .post(
            "https://fullstack-test-g43a.onrender.com/registrarAluno",
            { nome: nome, dataDeNascimento: dataDeNascimento },
            {
              headers: {
                Authorization: "Bearer " + parsedInfoFromStorage?.token,
              },
            }
          )
          .then((res) => {
            setNome("");
            setDataDeNascimento("");
            toast({
              title: res?.data?.message,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          })
          .catch((error) => {
            toast({
              title: error?.response?.data?.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
      })
      .catch((error) => {
        console.error("error", error);
      });
    } catch(error) {
      console.error('erro ao cadastrar aluno', error);
    }
  };

  return (
    <div className={styles.cadastrarAlunoMain}>
      <Container>
        <PagesHeader />

        <Stack spacing={3} p={4}>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do aluno"
            size="lg"
          />
          <Input
            value={dataDeNascimento}
            onChange={handleChange}
            required
            type="text"
            placeholder="dd/mm/yyyy"
          />
          <Button
            backgroundColor={"#ea4c89"}
            size="xs"
            padding={6}
            color={"#ffffff"}
            width={"100%"}
            fontSize={"medium"}
            onClick={cadastrarAluno}
          >
            Cadastrar
          </Button>
        </Stack>
      </Container>
    </div>
  );
};

export default CadastrarAluno;
