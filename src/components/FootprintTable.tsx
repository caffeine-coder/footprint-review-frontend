
import { Table, Badge, Button, Group } from "@mantine/core";
import type { ProductFootPrint } from "../data/footPrintSlice";
import "./FootprintTable.css";

interface FootprintTableProps {
    footprintData: ProductFootPrint[];
    onView: (id: number) => void;
}

function FootprintTable({ footprintData, onView }: FootprintTableProps) {
    const reviewRows = footprintData.map((footprint) => {
        const highEmissions = footprint.emissionsKgCo2e >= 5000;
        const highUncertainty = footprint.uncertaintyPercent >= 30;

        return (
            <Table.Tr key={footprint.id}>
                <Table.Td className="product-name">{footprint.productName}</Table.Td>
                <Table.Td>{footprint.supplierName}</Table.Td>
                <Table.Td>{footprint.emissionsKgCo2e.toLocaleString()} kg CO₂e</Table.Td>
                <Table.Td>{footprint.uncertaintyPercent}%</Table.Td>
                <Table.Td>
                    <Badge
                        color={footprint.status === "APPROVED" ? "green" : footprint.status === "REJECTED" ? "red" : "yellow"}
                        variant="light"
                        radius="sm"
                    >
                        {footprint.status}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Group gap={6}>
                        {highEmissions && <Badge color="red" variant="light">High Emissions</Badge>}
                        {highUncertainty && <Badge color="orange" variant="light">High Uncertainty</Badge>}
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
                <span>{footprintData.length} submissions</span>
            </div>
            <div className="table-scroll">
                <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Product</Table.Th>
                            <Table.Th>Supplier</Table.Th>
                            <Table.Th>Emissions</Table.Th>
                            <Table.Th>Uncertainty</Table.Th>
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
        </div>
    );
}

export default FootprintTable;
