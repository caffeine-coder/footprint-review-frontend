import { useEffect, useState } from "react";

// I could ahve used usedeferredvalue hook for this, but
// wanted to do it on own.
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
