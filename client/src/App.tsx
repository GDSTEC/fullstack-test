import "./App.scss";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import { AuthContextProvider } from "./context/Auth";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./pages/home/Home";
import CadastrarAluno from "./pages/cadastrarAluno/CadastrarAluno";
import RemoverAluno from "./pages/removerAluno/RemoverAluno";
import EditarAluno from "./pages/editarAluno/EditarAluno";
import Metricas from "./pages/metricas/Metricas";
import { AuthRoute } from "./components/authRoute/AuthRoute";
import NotFound from "./pages/notFound/NotFound";
import { useEffect, useState } from "react";
import { AsyncLocalStorage } from "./util/AsyncLocalStorage";

function App() {
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

  return (
    <ChakraProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={userFromStorage ? <Navigate to={"/home"} /> : <Login />}
            />
            <Route path="/registrar" element={<Register />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/home"
              element={
                <AuthRoute>
                  <Home />
                </AuthRoute>
              }
            />

            <Route
              path="/cadastrarAluno"
              element={
                <AuthRoute>
                  <CadastrarAluno />
                </AuthRoute>
              }
            />

            <Route
              path="/removerAluno"
              element={
                <AuthRoute>
                  <RemoverAluno />
                </AuthRoute>
              }
            />

            <Route
              path="/editarAluno"
              element={
                <AuthRoute>
                  <EditarAluno />
                </AuthRoute>
              }
            />

            <Route
              path="/minhasMetricas"
              element={
                <AuthRoute>
                  <Metricas />
                </AuthRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default App;
