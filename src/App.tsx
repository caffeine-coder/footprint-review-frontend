import { useEffect, useState } from "react";
import { Center, Loader } from "@mantine/core";
import axios from "axios";

import { getCurrentUser, login, logout, type AuthUser } from "./api/authApi";
import { useAppDispatch } from "./data/hooks";
import { setFootprintData, setSelectedFootprint } from "./data/footPrintSlice";

import Login from "./components/Login/Login";
import FootprintDashboard from "./components/FootPrintDashboard/FootPrintDashboard";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then(data => {
        if (active) setUser(data);
      })
      .catch(error => {
        if (active && (!axios.isAxiosError(error) || error.response?.status !== 401)) {
          setAuthError("Unable to connect to the server");
        }
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(email: string, password: string) {
    const data = await login(email, password);
    setUser(data);
    setAuthError(null);
  }

  async function handleLogout() {
    setLogoutLoading(true);
    setAuthError(null);

    try {
      await logout();
      setUser(null);

      dispatch(setFootprintData([]));
      dispatch(setSelectedFootprint(null));
    } catch (error) {
      console.log(error);
      setAuthError("Failed to log out");
    } finally {
      setLogoutLoading(false);
    }
  }

  if (authLoading) {
    return <Center mih="75vh"><Loader size="md" /></Center>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} serverError={authError} />;
  }

  return (
    <FootprintDashboard
      user={user}
      onLogout={handleLogout}
      logoutLoading={logoutLoading}
      authError={authError}
    />
  );
}

export default App;
