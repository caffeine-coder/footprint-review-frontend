import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";
import { getReviewHistory, type ReviewHistoryItem } from "../../api/footprintApi";
import type { ProductFootPrint } from "../../data/footPrintSlice";
import "./ReviewHistory.css";

interface ReviewHistoryProps {
    footprint: ProductFootPrint;
    opened: boolean;
}

function ReviewHistory({ footprint, opened }: ReviewHistoryProps) {
    const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!opened) return;

        let active = true;

        setLoading(true);
        setError(null);
        setHistory([]);

        getReviewHistory(footprint.id)
            .then(data => {
                if (active) setHistory(data);
            })
            .catch(error => {
                console.log(error);
                if (active) setError("Failed to load review history");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [opened, footprint.id, footprint.reviewedAt]);

    return (
        <div className="history-section">
            <h4>Review History</h4>

            {loading && <Loader size="sm" />}
            {error && <p className="history-error">{error}</p>}

            {!loading && !error && (
                <>
                    {history.map(event => (
                        <div className="history-entry" key={event.id}>
                            <strong>
                                {event.action === "APPROVED" ? "Approved" : "Rejected"} by {event.reviewerName}
                            </strong>
                            <span>{new Date(event.createdAt).toLocaleString()}</span>
                            {event.comment && <p>{event.comment}</p>}
                        </div>
                    ))}

                    {history.length === 0 && footprint.reviewedAt && (
                        <div className="history-entry">
                            <strong>
                                {footprint.status === "APPROVED" ? "Approved" : "Rejected"} (reviewer not recorded)
                            </strong>
                            <span>{new Date(footprint.reviewedAt).toLocaleString()}</span>
                            {footprint.reviewComment && <p>{footprint.reviewComment}</p>}
                        </div>
                    )}
                </>
            )}

            <div className="history-entry">
                <strong>Submission received</strong>
                <span>{new Date(footprint.submittedAt).toLocaleString()}</span>
            </div>
        </div>
    );
}

export default ReviewHistory;
