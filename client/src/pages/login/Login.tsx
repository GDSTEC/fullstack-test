import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  Button,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.scss";
import { MdAlternateEmail } from "react-icons/md";
import LOGO from "../../assets/_aaccdb35-cc72-43a9-a296-92b111d540c5.jpeg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const signup = async () => {
    try {
      setIsLoading(true)
      const userLoginPost =  await axios
      .post("https://fullstack-test-g43a.onrender.com/login", {
        userEmail: email,
        userPassword: password,
      })
      localStorage.setItem("userData", JSON.stringify(userLoginPost?.data));
      setUserData(userLoginPost?.data)
      login(true);
      navigate("/home");
      window.location.reload()
    } catch (error) {
      const errorMessage = "Email ou senha incorretos!";
    toast({
      title: errorMessage,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    }
    finally {
      if(userData) {
        window.location.reload();
      } else {
        setIsLoading(false);
      }
        setIsLoading(false);
    }
  };
  
  const handleClick = () => setShow(!show);

  return (
    <div className={styles.loginContainer}>
      <Container>
        <main className={styles.loginContainerMain}>
          <img src={LOGO} alt="logo" className={styles.loginContainerLogoImg} />
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
          {isLoading ? (<Button
                          isLoading
                          loadingText='Logando...'
                          colorScheme='teal'
                          variant='outline'
                          padding={6}
                          width={"100%"}
                          size="xs"
                        >
                          Logando...
                        </Button>) : 
            (<Button
              backgroundColor={"#ea4c89"}
              size="xs"
              padding={6}
              color={"#ffffff"}
              width={"100%"}
              fontSize={"medium"}
              onClick={signup}
          >
            Login
          </Button>
          )};
          
          <div className={styles.loginContainerDivP}>
            <p
              onClick={() => navigate("/registrar")}
              className={styles.loginContainerP}
            >
              Registre-se
            </p>
          </div>
        </main>
      </Container>
    </div>
  );
};

export default Login;
