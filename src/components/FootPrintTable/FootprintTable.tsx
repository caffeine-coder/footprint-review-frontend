
import { useMemo, useState } from "react";
import { Table, Badge, Button, Group, Pagination, UnstyledButton } from "@mantine/core";
import type { ProductFootPrint } from "../../data/footPrintSlice";
import "./FootPrintTable.css";

interface FootprintTableProps {
    footprintData: ProductFootPrint[];
    onView: (id: number) => void;
    page: number;
    total: number;
    onPageChange: (page: number) => void;
}

type SortField = "productName" | "supplierName" | "emissionsKgCo2e" | "uncertaintyPercent";
type SortDirection = "asc" | "desc";

function FootprintTable({ footprintData, onView, page, total, onPageChange }: FootprintTableProps) {
    const [sortBy, setSortBy] = useState<SortField | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    function handleSort(field: SortField) {
        if (sortBy === field) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortDirection("asc");
        }
    }

    const sortedData = useMemo(() => {
        if (!sortBy) return footprintData;

        const data = [...footprintData];

        if (sortBy === "productName") {
            data.sort((a, b) => a.productName.localeCompare(b.productName));
        } else if (sortBy === "supplierName") {
            data.sort((a, b) => a.supplierName.localeCompare(b.supplierName));
        } else if (sortBy === "emissionsKgCo2e") {
            data.sort((a, b) => a.emissionsKgCo2e - b.emissionsKgCo2e);
        } else if (sortBy === "uncertaintyPercent") {
            data.sort((a, b) => a.uncertaintyPercent - b.uncertaintyPercent);
        }

        if (sortDirection === "desc") {
            data.reverse();
        }

        return data;
    }, [footprintData, sortBy, sortDirection]);

    function sortHeader(label: string, field: SortField) {
        return (
            <Table.Th
                aria-sort={sortBy === field ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
            >
                <UnstyledButton
                    className="sort-button"
                    type="button"
                    onClick={() => handleSort(field)}
                    title="Sort current page"
                >
                    {label} {sortBy === field ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
                </UnstyledButton>
            </Table.Th>
        );
    }

    const reviewRows = sortedData.map((footprint) => {
        const highEmissions = footprint.emissionsKgCo2e >= 5000;
        const highUncertainty = footprint.uncertaintyPercent >= 30;

        return (
            <Table.Tr key={footprint.id}>
                <Table.Td className="product-name">{footprint.productName}</Table.Td>
                <Table.Td>{footprint.supplierName}</Table.Td>
                <Table.Td>{footprint.emissionsKgCo2e.toLocaleString()} kg CO₂e</Table.Td>
                <Table.Td>{footprint.uncertaintyPercent}%</Table.Td>
                <Table.Td>
                    <Badge className={`badge ${footprint.status.toLowerCase()}`} variant="default" radius="sm">
                        {footprint.status}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Group gap={6}>
                        {highEmissions && <Badge className="badge emissions" variant="default" radius="sm">High Emissions</Badge>}
                        {highUncertainty && <Badge className="badge uncertainty" variant="default" radius="sm">High Uncertainty</Badge>}
                        {!highEmissions && !highUncertainty && "—"}
                    </Group>
                </Table.Td>
                <Table.Td>
                    <Button variant="light" size="xs" onClick={() => onView(footprint.id)}>
                        View Details
                    </Button>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <div className="footprint-table-container">
            <div className="table-header">
                <h3>Product Submissions</h3>
                <span>
                    {footprintData.length} submissions
                    {sortBy && " · Sorting current page only"}
                </span>
            </div>
            <div className="table-scroll">
                <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                    <Table.Thead>
                        <Table.Tr>
                            {sortHeader("Product", "productName")}
                            {sortHeader("Supplier", "supplierName")}
                            {sortHeader("Emissions", "emissionsKgCo2e")}
                            {sortHeader("Uncertainty", "uncertaintyPercent")}
                            <Table.Th>Review Status</Table.Th>
                            <Table.Th>Risk Flags</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {footprintData.length > 0 ? reviewRows : (
                            <Table.Tr>
                                <Table.Td colSpan={7} className="empty-message">No footprints found</Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </div>
            <div className="table-pagination">
                <span>Showing {footprintData.length} of {total} submissions</span>
                <Pagination
                    total={Math.max(1, Math.ceil(total / 10))}
                    value={page}
                    onChange={onPageChange}
                    size="sm"
                    withEdges
                />
            </div>
        </div>
    );
}

export default FootprintTable;
