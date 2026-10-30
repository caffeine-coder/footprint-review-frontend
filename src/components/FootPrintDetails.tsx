import { useEffect, useState } from "react";
import { Modal, Badge, Button, Textarea, Group, Center, Loader } from "@mantine/core";
import type { ProductFootPrint } from "../data/footPrintSlice";
import { getReviewHistory, type ReviewHistoryItem } from "../api/footprintApi";
import "./FootPrintDetails.css";

interface FootprintDetailsProps {
    opened: boolean;
    onClose: () => void;
    footprint: ProductFootPrint | null;
    loading: boolean;
    error: string | null;
    reviewLoading: boolean;
    reviewError: string | null;
    canReview: boolean;
    onReview: (status: "APPROVED" | "REJECTED", comment: string) => void;
}

function FootprintDetails({ opened, onClose, footprint, loading, error, reviewLoading, reviewError, canReview, onReview }: FootprintDetailsProps) {
    const [comment, setComment] = useState("");
    const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const footprintId = footprint?.id;
    const reviewedAt = footprint?.reviewedAt;

    useEffect(() => {
        if (!opened || footprintId == null) return;

        let active = true;
        setHistoryLoading(true);
        setHistoryError(null);
        setHistory([]);

        getReviewHistory(footprintId)
            .then(data => {
                if (active) setHistory(data);
            })
            .catch(error => {
                console.log(error);
                if (active) setHistoryError("Failed to load review history");
            })
            .finally(() => {
                if (active) setHistoryLoading(false);
            });

        return () => {
            active = false;
        };
    }, [opened, footprintId, reviewedAt]);

    function handleClose() {
        setComment("");
        onClose();
    }

    return (
        <Modal opened={opened} onClose={handleClose} title="Product Details" centered size="md" radius="md">
            {loading && <Center py={40}><Loader size="md" /></Center>}
            {error && <p>{error}</p>}

            {!loading && !error && footprint && (
                <div className="details-container">
                    <div className="details-heading">
                        <h3>{footprint.productName}</h3>
                        <Badge className={`badge ${footprint.status.toLowerCase()}`} variant="default" radius="sm">
                            {footprint.status}
                        </Badge>
                    </div>

                    <div className="details-row">
                        <span className="details-label">Supplier</span>
                        <span>{footprint.supplierName}</span>
                    </div>
                    <div className="details-row">
                        <span className="details-label">Emissions</span>
                        <span>{footprint.emissionsKgCo2e.toLocaleString()} kg CO₂e</span>
                    </div>
                    <div className="details-row">
                        <span className="details-label">Uncertainty</span>
                        <span>{footprint.uncertaintyPercent}%</span>
                    </div>

                    <div className="history-section">
                        <h4>Review History</h4>

                        {historyLoading && <Loader size="sm" />}
                        {historyError && <p className="review-error">{historyError}</p>}

                        {!historyLoading && !historyError && (
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

                    {footprint.status === "PENDING" && canReview && (
                        <div className="review-section">
                            <Textarea
                                label="Review Comment (Optional)"
                                placeholder="Add a comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                maxLength={1000}
                                minRows={3}
                                autosize
                                disabled={reviewLoading}
                            />

                            {reviewError && <p className="review-error">{reviewError}</p>}

                            <Group justify="flex-end" gap="md" mt="lg" mb="sm">
                                {reviewLoading && <Loader size="sm" />}
                                <Button color="red" variant="light" disabled={reviewLoading} onClick={() => onReview("REJECTED", comment)}>
                                    Reject
                                </Button>
                                <Button color="green" disabled={reviewLoading} onClick={() => onReview("APPROVED", comment)}>
                                    Approve
                                </Button>
                            </Group>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
}

export default FootprintDetails;
