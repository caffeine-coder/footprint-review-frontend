import axios from "axios";
import type { ProductFootPrint } from "../data/footPrintSlice";

const url = "http://localhost:8080/api/footprints";

export async function getFootprints() {
    const response = await axios.get<ProductFootPrint[]>(url);
    return response.data;
}