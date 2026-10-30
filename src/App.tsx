
import { useEffect, useState } from "react";
import { Select, TextInput } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "./data/hooks";
import { getFootprints, getFootprintById, reviewFootprint } from "./api/footprintApi";
import { setFootprintData, setSelectedFootprint, setLoading, setError, updateFootprint } from "./data/footPrintSlice";
import FootprintTable from "./components/FootprintTable";
import FootprintDetails from "./components/FootPrintDetails";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const { footprintData, selectedFootprint, loading, error } = useAppSelector(state => state.footprints);

  const [status, setStatus] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [opened, setOpened] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const data = await getFootprints();
        dispatch(setFootprintData(data));
      } catch (error) {
        console.log(error);
        dispatch(setError("Failed to fetch footprints"));
      } finally {
        dispatch(setLoading(false));
      }
    }

    fetchData();
  }, [dispatch]);

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
      dispatch(updateFootprint(data));
      dispatch(setSelectedFootprint(data));
    } catch (error) {
      console.log(error);
      setReviewError("Failed to update review");
    } finally {
      setReviewLoading(false);
    }
  }

  const filteredData = footprintData.filter((footprint) => {
    const statusMatch = status === "ALL" || footprint.status === status;
    const search = searchText.trim().toLowerCase();
    const nameMatch = footprint.productName.toLowerCase().includes(search);
    const supplierMatch = footprint.supplierName.toLowerCase().includes(search);

    return statusMatch && (nameMatch || supplierMatch);
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Product Footprint Review</h2>
      <div className="filter-container">
        <Select
          className="filter-field"
          label="Review Status"
          data={["ALL", "PENDING", "APPROVED", "REJECTED"]}
          value={status}
          onChange={(value) => setStatus(value ?? "ALL")}
        />
        <TextInput
          className="search-field"
          label="Search"
          placeholder="Search product or supplier"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <FootprintTable footprintData={filteredData} onView={handleView} />

      <FootprintDetails
        opened={opened}
        onClose={() => {
          setOpened(false);
          setReviewError(null);
        }}
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
