import axios from "axios";
import type { ProductFootPrint } from "../data/footPrintSlice";
import { getCsrfHeaders } from "./authApi";

const url = "/api/footprints";

export interface FootprintPage {
    items: ProductFootPrint[];
    total: number;
    page: number;
    size: number;
}

export interface ReviewHistoryItem {
    id: number;
    action: "APPROVED" | "REJECTED";
    comment: string | null;
    reviewerName: string;
    createdAt: string;
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

export async function getReviewHistory(id: number) {
    const response = await axios.get<ReviewHistoryItem[]>(`${url}/${id}/history`);
    return response.data;
}

export async function reviewFootprint(id: number, status: "APPROVED" | "REJECTED", comment: string) {
    const response = await axios.patch<ProductFootPrint>(`${url}/${id}/review`, {
        status: status,
        comment: comment
    }, {
        headers: getCsrfHeaders()
    });
    return response.data;
}
