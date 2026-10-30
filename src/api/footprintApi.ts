
import axios from "axios";
import type { ProductFootPrint } from "../data/footPrintSlice";

const url = "http://localhost:8080/api/footprints";

export async function getFootprints() {
    const response = await axios.get<ProductFootPrint[]>(url);
    return response.data;
}

export async function getFootprintById(id: number) {
    const response = await axios.get<ProductFootPrint>(`${url}/${id}`);
    return response.data;
}

export async function reviewFootprint(id: number, status: "APPROVED" | "REJECTED", comment: string) {
    const response = await axios.patch<ProductFootPrint>(`${url}/${id}/review`, {
        status: status,
        comment: comment
    });
    return response.data;
}
