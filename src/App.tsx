import { useEffect, useState } from "react";
import { Select, TextInput, Center, Loader, Group, Button, Text } from "@mantine/core";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "./data/hooks";
import { getFootprints, getFootprintById, reviewFootprint } from "./api/footprintApi";
import { getCurrentUser, login, logout, type AuthUser } from "./api/authApi";
import { setFootprintData, setSelectedFootprint, setLoading, setError } from "./data/footPrintSlice";
import FootprintTable from "./components/FootprintTable";
import FootprintDetails from "./components/FootPrintDetails";
import Login from "./components/Login";
import useDebouncedSearch from "./hooks/useDebouncedSearch";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const { footprintData, selectedFootprint, loading, error } = useAppSelector(state => state.footprints);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [status, setStatus] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebouncedSearch(searchText);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const [opened, setOpened] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const canReview = user?.role === "ADMIN" || user?.role === "EDITOR";

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

  useEffect(() => {
    if (!user || searchText.trim() !== debouncedSearch) return;

    let active = true;

    async function fetchData() {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const data = await getFootprints(page, status, debouncedSearch);

        if (active) {
          dispatch(setFootprintData(data.items));
          setTotal(data.total);

          if (page > 1 && data.items.length === 0) {
            setPage(page - 1);
          }
        }
      } catch (error) {
        console.log(error);
        if (active) dispatch(setError("Failed to fetch footprints"));
      } finally {
        if (active) dispatch(setLoading(false));
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [dispatch, user, page, status, searchText, debouncedSearch, refresh]);

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
      setOpened(false);
      setPage(1);
      dispatch(setFootprintData([]));
      dispatch(setSelectedFootprint(null));
    } catch (error) {
      console.log(error);
      setAuthError("Failed to log out");
    } finally {
      setLogoutLoading(false);
    }
  }

  async function handleView(id: number) {
    setOpened(true);
    setDetailLoading(true);
    setDetailError(null);
    setReviewError(null);
    dispatch(setSelectedFootprint(null));

    try {
      const data = await getFootprintById(id);
      dispatch(setSelectedFootprint(data));
    } catch (error) {
      console.log(error);
      setDetailError("Failed to fetch product details");
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleReview(status: "APPROVED" | "REJECTED", comment: string) {
    if (!selectedFootprint || reviewLoading || !canReview) return;

    setReviewLoading(true);
    setReviewError(null);

    try {
      const data = await reviewFootprint(selectedFootprint.id, status, comment);
      dispatch(setSelectedFootprint(data));
      setRefresh(value => value + 1);
    } catch (error) {
      console.log(error);
      setReviewError("Failed to update review");
    } finally {
      setReviewLoading(false);
    }
  }

  if (authLoading) {
    return <Center mih="75vh"><Loader size="md" /></Center>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} serverError={authError} />;
  }

  return (
    <div>
      <Group justify="space-between" align="center" mb="lg">
        <h2>Product Footprint Review</h2>
        <Group gap="md">
          <Text size="sm">{user.name} ({user.role})</Text>
          <Button variant="default" size="sm" loading={logoutLoading} onClick={handleLogout}>
            Logout
          </Button>
        </Group>
      </Group>

      {authError && <Text c="red" size="sm" mb="md">{authError}</Text>}

      <div className="filter-container">
        <Select
          className="filter-field"
          label="Review Status"
          data={["ALL", "PENDING", "APPROVED", "REJECTED"]}
          value={status}
          onChange={(value) => {
            setStatus(value ?? "ALL");
            setPage(1);
          }}
        />
        <TextInput
          className="search-field"
          label="Search"
          placeholder="Search product or supplier"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {error && <p>{error}</p>}
      {loading ? (
        <Center py={60}><Loader size="md" /></Center>
      ) : !error && (
        <FootprintTable
          footprintData={footprintData}
          onView={handleView}
          page={page}
          total={total}
          onPageChange={setPage}
        />
      )}

      <FootprintDetails
        opened={opened}
        onClose={() => setOpened(false)}
        footprint={selectedFootprint}
        loading={detailLoading}
        error={detailError}
        reviewLoading={reviewLoading}
        reviewError={reviewError}
        canReview={canReview}
        onReview={handleReview}
      />
    </div>
  );
}

export default App;
