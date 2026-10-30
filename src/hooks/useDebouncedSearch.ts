import { useEffect, useState } from "react";

function useDebouncedSearch(searchText: string) {
    const [debouncedSearch, setDebouncedSearch] = useState(searchText);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText.trim());
        }, 700);

        return () => clearTimeout(timer);
    }, [searchText]);

    return debouncedSearch;
}

export default useDebouncedSearch;
