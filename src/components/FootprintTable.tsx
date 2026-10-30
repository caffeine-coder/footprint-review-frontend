
import { Table } from "@mantine/core";
import type { ProductFootPrint } from "../data/footPrintSlice";

interface FootprintTableProps {
    footprintData: ProductFootPrint[];
}

function FootprintTable({ footprintData }: FootprintTableProps) {

    const reviewRows = footprintData.map((footprint) => (
        <Table.Tr key={footprint.id}>
            <Table.Td>{footprint.productName}</Table.Td>
            <Table.Td>{footprint.supplierName}</Table.Td>
            <Table.Td>{footprint.emissionsKgCo2e}</Table.Td>
            <Table.Td>{footprint.uncertaintyPercent}</Table.Td>
            <Table.Td>{footprint.status}</Table.Td>
        </Table.Tr>
    ));

    return (
        <div>
            <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Product</Table.Th>
                        <Table.Th>Supplier</Table.Th>
                        <Table.Th>Emissions (kg CO₂e)</Table.Th>
                        <Table.Th>Uncertainty (%)</Table.Th>
                        <Table.Th>Status</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>{reviewRows}</Table.Tbody>
            </Table>

            {footprintData.length === 0 && (
                <p>No footprints found</p>
            )}
        </div>
    );
}

export default FootprintTable;
