import styles from "./home.module.scss";
import HomeHeader from "../../components/homeHeader/HomeHeader";
import HomeBoxsComponent from "../../components/homeBoxs/HomeBoxsComponent";
import { Container } from "@chakra-ui/react";

const Home = () => {
  return (
    <main className={styles.homeContainerMain}>
      <Container>
        <HomeHeader />
        <HomeBoxsComponent />
      </Container>
    </main>
  );
};

export default Home;
