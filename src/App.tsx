
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./data/hooks";
import { getFootprints } from "./api/footprintApi";
import {
  setFootprintData,
  setLoading,
  setError
} from "./data/footPrintSlice";

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

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Supplier</th>
            <th>Emissions</th>
            <th>Uncertainty</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {footprintData.map((footprint) => (
            <tr key={footprint.id}>
              <td>{footprint.productName}</td>
              <td>{footprint.supplierName}</td>
              <td>{footprint.emissionsKgCo2e} kg CO₂e</td>
              <td>{footprint.uncertaintyPercent}%</td>
              <td>{footprint.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {footprintData.length === 0 && (
        <p>No footprints found</p>
      )}
    </div>
  );
}

export default App;
