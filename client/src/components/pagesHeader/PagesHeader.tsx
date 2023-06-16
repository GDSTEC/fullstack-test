import React, { useEffect, useState } from "react";
import { Avatar, Button, useDisclosure } from "@chakra-ui/react";
import AvatarImage from "../../assets/OIG.jpeg";
import styles from "./pagesHeader.module.scss";
import IUser from "../../interfaces/userInterface";
import { MdMenu, MdArrowBack } from "react-icons/md";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { PagesHeaderConst } from "../../const/PagesHeaderNav";
import useAuth from "../../hooks/useAuth";

const PagesHeader = () => {
  const [userData, setUserData] = useState<IUser>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef: any = React.useRef();
  const { logout } = useAuth();

  const navigate = useNavigate();

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
    <header className={styles.pagescontainerHeader}>
      <div className={styles.pagesHeaderDiv}>
        <MdArrowBack
          style={{ cursor: "pointer" }}
          size={24}
          onClick={() => navigate("/home")}
        />
        <Avatar name={userData?.userName} src={AvatarImage} />
        <MdMenu style={{ cursor: "pointer" }} size={24} onClick={onOpen} />
      </div>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            <nav className={styles.pagesHeaderNav}>
              <ul className={styles.pagesHeaderUl}>
                {PagesHeaderConst.map((item) => (
                  <li
                    onClick={() => navigate(`/${item.slug}`)}
                    key={item?.id}
                    className={styles.pagesHeaderLi}
                  >
                    {item?.label}
                  </li>
                ))}
              </ul>
            </nav>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme="red" mr={3} onClick={handleLogout}>
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </header>
  );
};

export default PagesHeader;
