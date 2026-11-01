import { Select, TextInput } from "@mantine/core";

interface FootprintFiltersProps {
    status: string;
    searchText: string;
    onStatusChange: (value: string) => void;
    onSearchChange: (value: string) => void;
}

function FootprintFilters({
    status,
    searchText,
    onStatusChange,
    onSearchChange
}: FootprintFiltersProps) {
    return (
        <div className="filter-container">
            <Select
                className="filter-field"
                label="Review Status"
                data={["ALL", "PENDING", "APPROVED", "REJECTED"]}
                value={status}
                onChange={value => onStatusChange(value ?? "ALL")}
            />

            <TextInput
                className="search-field"
                label="Search"
                placeholder="Search product or supplier"
                value={searchText}
                onChange={event => onSearchChange(event.target.value)}
            />
        </div>
    );
}

export default FootprintFilters;
