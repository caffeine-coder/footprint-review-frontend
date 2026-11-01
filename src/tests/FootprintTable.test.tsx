import { test, expect, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";

import FootprintTable from "../components/FootPrintTable/FootprintTable";
import type { ProductFootPrint } from "../data/footPrintSlice";

jest.mock("../components/FootPrintTable/FootPrintTable.css", () => ({}));

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { }
    })
});

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

test("should display footprint data", () => {
    render(
        <MantineProvider env="test">
            <FootprintTable
                footprintData={[footprint]}
                onView={() => { }}
                page={1}
                total={1}
                onPageChange={() => { }}
            />
        </MantineProvider>
    );

    expect(screen.getByText("Steel Frame")).toBeTruthy();
    expect(screen.getByText("MetalWorks")).toBeTruthy();
    expect(screen.getByText("High Emissions")).toBeTruthy();
});

test("should call onView when clicking details", () => {
    const onView = jest.fn();

    render(
        <MantineProvider env="test">
            <FootprintTable
                footprintData={[footprint]}
                onView={onView}
                page={1}
                total={1}
                onPageChange={() => { }}
            />
        </MantineProvider>
    );

    fireEvent.click(screen.getByText("View Details"));

    expect(onView).toHaveBeenCalledWith(1);
});
