import { useEffect, useState } from "react";
import { AsyncLocalStorage } from "../../util/AsyncLocalStorage";
import Login from "../../pages/login/Login";

interface IAuth {
  children: React.ReactElement;
}

export const AuthRoute: React.FC<IAuth> = ({ children }) => {
  const [userFromStorage, setUserFromStorage] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const getUser = await AsyncLocalStorage.getItem("userData");
        const parseUser = JSON.parse(getUser!);
        setUserFromStorage(parseUser);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getUserFromStorage();
  }, [loading]);

  if (!userFromStorage) {
    return <Login />;
  }
  return children;
};
