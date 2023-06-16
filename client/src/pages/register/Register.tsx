import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import styles from "./register.module.scss";
import { MdAccountCircle, MdAlternateEmail } from "react-icons/md";
import LOGO from "../../assets/_aaccdb35-cc72-43a9-a296-92b111d540c5.jpeg";

const Register = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const userRegister = async () => {
    await axios
      .post("https://fullstack-test-g43a.onrender.com/register", {
        userEmail: email,
        userName: userName,
        userPassword: password,
      })
      .then((res) => {
        toast({
          title: res?.data?.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      setEmail("");
      setUserName("");
      setPassword("");
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
  const handleClick = () => setShow(!show);
  return (
    <div className={styles.loginContainer}>
      <Container>
        <main className={styles.loginContainerMain}>
          <img src={LOGO} alt="logo" className={styles.loginContainerLogoImg} />

          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <MdAccountCircle color="gray.300" />
            </InputLeftElement>
            <Input
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              placeholder="Seu nome"
            />
          </InputGroup>

          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <MdAlternateEmail color="gray.300" />
            </InputLeftElement>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
          </InputGroup>

          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Button
            backgroundColor={"#ea4c89"}
            size="xs"
            padding={6}
            color={"#ffffff"}
            width={"100%"}
            fontSize={"medium"}
            onClick={userRegister}
          >
            Registrar
          </Button>
          <div
            onClick={() => navigate("/")}
            className={styles.loginContainerDivP}
          >
            <p className={styles.loginContainerP}>
              Já possui conta? Faça login!
            </p>
          </div>
        </main>
      </Container>
    </div>
  );
};

export default Register;
