
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./data/hooks";
import { getFootprints } from "./api/footprintApi";
import {
  setFootprintData,
  setLoading,
  setError
} from "./data/footPrintSlice";

import FootprintTable from "./components/FootprintTable";

import "./App.css";

function App() {

  const dispatch = useAppDispatch();

  const { footprintData, loading, error } = useAppSelector(
    state => state.footprints
  );

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Product Footprint Review</h2>

      <FootprintTable footprintData={footprintData} />
    </div>
  );
}

export default App;
