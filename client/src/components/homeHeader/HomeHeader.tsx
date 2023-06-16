import { useEffect, useState } from "react";
import styles from "./homeHeader.module.scss";
import IUser from "../../interfaces/userInterface";
import { Avatar } from "@chakra-ui/react";
import { MdLogout } from "react-icons/md";
import AvatarImage from "../../assets/OIG.jpeg";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const HomeHeader = () => {
  const [userData, setUserData] = useState<IUser>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const getUserFromStorage = () => {
      new Promise((resolve) => {
        resolve(localStorage.getItem("userData"));
      })
        .then((res: any) => {
          setUserData(JSON.parse(res));
        })
        .catch((error) => {
          console.error("error", error);
        });
    };

    getUserFromStorage();
  }, []);

  const handleLogout = () => {
    try{
      localStorage.clear();
      logout();
      navigate("/");
    } catch (error) {
      console.error("Erro ao deslogar", error);
    };
  };

  return (
    <header className={styles.homeContainerHeader}>
      <div className={styles.homeHeaderDiv}>
        <Avatar name={userData?.userName} src={AvatarImage} />
        <span onClick={handleLogout}>
          <MdLogout style={{ cursor: "pointer" }} size={24} />
          <p style={{ cursor: "pointer" }}>Logout</p>
        </span>
      </div>
      <p className={styles.homeHeaderP}>Olá, {userData?.userName}!</p>
    </header>
  );
};

export default HomeHeader;
