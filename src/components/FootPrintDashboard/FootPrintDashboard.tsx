import { useEffect, useState } from "react";
import { Center, Loader, Group, Button, Text } from "@mantine/core";

import type { AuthUser } from "../../api/authApi";
import { getFootprints, getFootprintById, reviewFootprint } from "../../api/footprintApi";
import { useAppDispatch, useAppSelector } from "../../data/hooks";
import {
    setFootprintData,
    setSelectedFootprint,
    setLoading,
    setError
} from "../../data/footPrintSlice";

import FootprintTable from "../FootPrintTable/FootprintTable";
import FootprintDetails from "../FootPrintDetails/FootPrintDetails";
import FootprintFilters from "../FootPrintFilters/FootPrintFilters";
import useDebouncedSearch from "../../hooks/useDebouncedSearch";

interface FootprintDashboardProps {
    user: AuthUser;
    onLogout: () => Promise<void>;
    logoutLoading: boolean;
    authError: string | null;
}

function FootprintDashboard({
    user,
    onLogout,
    logoutLoading,
    authError
}: FootprintDashboardProps) {
    const dispatch = useAppDispatch();

    const { footprintData, selectedFootprint, loading, error } = useAppSelector(
        state => state.footprints
    );

    const [status, setStatus] = useState("ALL");
    const [searchText, setSearchText] = useState("");
    const debouncedSearch = useDebouncedSearch(searchText);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [refresh, setRefresh] = useState(0);

    const [opened, setOpened] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);

    const canReview = user.role === "ADMIN" || user.role === "EDITOR";

    useEffect(() => {
        if (searchText.trim() !== debouncedSearch) return;

        let active = true;

        async function fetchData() {
            dispatch(setLoading(true));
            dispatch(setError(null));

            try {
                const data = await getFootprints(page, status, debouncedSearch);

                if (active) {
                    dispatch(setFootprintData(data.items));
                    setTotal(data.total);

                    if (page > 1 && data.items.length === 0) {
                        setPage(page - 1);
                    }
                }
            } catch (error) {
                console.log(error);

                if (active) {
                    dispatch(setError("Failed to fetch footprints"));
                }
            } finally {
                if (active) {
                    dispatch(setLoading(false));
                }
            }
        }

        fetchData();

        return () => {
            active = false;
        };
    }, [dispatch, page, status, searchText, debouncedSearch, refresh]);

    function handleStatusChange(value: string) {
        setStatus(value);
        setPage(1);
    }

    function handleSearchChange(value: string) {
        setSearchText(value);
        setPage(1);
    }

    async function handleView(id: number) {
        setOpened(true);
        setDetailLoading(true);
        setDetailError(null);
        setReviewError(null);
        dispatch(setSelectedFootprint(null));

        try {
            const data = await getFootprintById(id);
            dispatch(setSelectedFootprint(data));
        } catch (error) {
            console.log(error);
            setDetailError("Failed to fetch product details");
        } finally {
            setDetailLoading(false);
        }
    }

    async function handleReview(
        status: "APPROVED" | "REJECTED",
        comment: string
    ) {
        if (!selectedFootprint || reviewLoading || !canReview) return;

        setReviewLoading(true);
        setReviewError(null);

        try {
            const data = await reviewFootprint(
                selectedFootprint.id,
                status,
                comment
            );

            dispatch(setSelectedFootprint(data));
            setRefresh(value => value + 1);
        } catch (error) {
            console.log(error);
            setReviewError("Failed to update review");
        } finally {
            setReviewLoading(false);
        }
    }

    return (
        <div>
            <Group justify="space-between" align="center" mb="lg">
                <h2>Product Footprint Review</h2>

                <Group gap="md">
                    <Text size="sm">{user.name} ({user.role})</Text>

                    <Button
                        variant="default"
                        size="sm"
                        loading={logoutLoading}
                        onClick={onLogout}
                    >
                        Logout
                    </Button>
                </Group>
            </Group>

            {authError && (
                <Text c="red" size="sm" mb="md">
                    {authError}
                </Text>
            )}

            <FootprintFilters
                status={status}
                searchText={searchText}
                onStatusChange={handleStatusChange}
                onSearchChange={handleSearchChange}
            />

            {error && <p>{error}</p>}

            {loading ? (
                <Center py={60}>
                    <Loader size="md" />
                </Center>
            ) : !error && (
                <FootprintTable
                    footprintData={footprintData}
                    onView={handleView}
                    page={page}
                    total={total}
                    onPageChange={setPage}
                />
            )}

            <FootprintDetails
                opened={opened}
                onClose={() => setOpened(false)}
                footprint={selectedFootprint}
                loading={detailLoading}
                error={detailError}
                reviewLoading={reviewLoading}
                reviewError={reviewError}
                canReview={canReview}
                onReview={handleReview}
            />
        </div>
    );
}

export default FootprintDashboard;
