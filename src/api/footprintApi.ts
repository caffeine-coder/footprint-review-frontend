
import axios from "axios";
import type { ProductFootPrint } from "../data/footPrintSlice";

const url = "/api/footprints";

export interface FootprintPage {
    items: ProductFootPrint[];
    total: number;
    page: number;
    size: number;
}

export async function getFootprints(page: number, status: string, search: string) {
    const response = await axios.get<FootprintPage>(url, {
        params: { page: page - 1, size: 10, status, search }
    });
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
