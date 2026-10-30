
import { useState } from "react";
import { Modal, Badge, Button, Textarea, Group, Center, Loader } from "@mantine/core";
import type { ProductFootPrint } from "../data/footPrintSlice";
import "./FootPrintDetails.css";

interface FootprintDetailsProps {
    opened: boolean;
    onClose: () => void;
    footprint: ProductFootPrint | null;
    loading: boolean;
    error: string | null;
    reviewLoading: boolean;
    reviewError: string | null;
    onReview: (status: "APPROVED" | "REJECTED", comment: string) => void;
}

function FootprintDetails({ opened, onClose, footprint, loading, error, reviewLoading, reviewError, onReview }: FootprintDetailsProps) {
    const [comment, setComment] = useState("");
    let statusColor = "yellow";

    if (footprint?.status === "APPROVED") {
        statusColor = "green";
    } else if (footprint?.status === "REJECTED") {
        statusColor = "red";
    }

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
                        <Badge color={statusColor} variant="light" radius="sm">{footprint.status}</Badge>
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
                    <div className="details-row">
                        <span className="details-label">Submitted</span>
                        <span>{new Date(footprint.submittedAt).toLocaleString()}</span>
                    </div>
                    {footprint.reviewedAt && (
                        <div className="details-row">
                            <span className="details-label">Reviewed</span>
                            <span>{new Date(footprint.reviewedAt).toLocaleString()}</span>
                        </div>
                    )}
                    {footprint.reviewComment && (
                        <div className="details-row">
                            <span className="details-label">Comment</span>
                            <span>{footprint.reviewComment}</span>
                        </div>
                    )}

                    {footprint.status === "PENDING" && (
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
