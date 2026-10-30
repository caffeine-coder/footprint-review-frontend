
import { useEffect, useState } from "react";
import { Select, TextInput, Center, Loader } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "./data/hooks";
import { getFootprints, getFootprintById, reviewFootprint } from "./api/footprintApi";
import { setFootprintData, setSelectedFootprint, setLoading, setError } from "./data/footPrintSlice";
import FootprintTable from "./components/FootprintTable";
import FootprintDetails from "./components/FootPrintDetails";
import "./App.css";
import useDebouncedSearch from "./hooks/useDebouncedSearch";

function App() {
  const dispatch = useAppDispatch();
  const { footprintData, selectedFootprint, loading, error } = useAppSelector(state => state.footprints);

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

  useEffect(() => {
    if (searchText.trim() !== debouncedSearch) return;
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
  }, [dispatch, page, status, searchText, debouncedSearch, refresh]);

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
    if (!selectedFootprint || reviewLoading) return;

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

  return (
    <div>
      <h2>Product Footprint Review</h2>
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
        onReview={handleReview}
      />
    </div>
  );
}

export default App;
