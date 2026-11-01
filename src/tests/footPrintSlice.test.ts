import { test, expect } from "@jest/globals";
import footprintReducer, {
    setFootprintData,
    updateFootprint,
    type ProductFootPrint
} from "../data/footPrintSlice";

const footprint: ProductFootPrint = {
    id: 1,
    productName: "Steel Frame",
    supplierName: "MetalWorks",
    emissionsKgCo2e: 5000,
    uncertaintyPercent: 15,
    status: "PENDING",
    reviewComment: null,
    submittedAt: "2026-11-01T10:00:00Z",
    reviewedAt: null
};

test("should store footprints", () => {
    const state = footprintReducer(
        undefined,
        setFootprintData([footprint])
    );

    expect(state.footprintData).toHaveLength(1);
    expect(state.footprintData[0].productName).toBe("Steel Frame");
});

test("should update footprint status", () => {
    const state = footprintReducer(
        undefined,
        setFootprintData([footprint])
    );

    const updated = {
        ...footprint,
        status: "APPROVED" as const
    };

    const newState = footprintReducer(
        state,
        updateFootprint(updated)
    );

    expect(newState.footprintData[0].status).toBe("APPROVED");
});
