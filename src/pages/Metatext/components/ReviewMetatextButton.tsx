// Small button component to navigate to the Metatext review page using route params
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@styles';
import { HiAcademicCap } from 'react-icons/hi2';

export function ReviewMetatextButton(): React.ReactElement | null {
    const navigate = useNavigate();
    const { metatextId } = useParams<{ metatextId: string }>();

    const onClick = React.useCallback(() => {
        navigate(`/metatext/${metatextId}/review`);
    }, [navigate, metatextId]);

    // If route param is missing, don't render the button
    if (!metatextId) return null;

    return (
        <Button
            size="sm"
            tone="default"
            title="Review this metatext"
            onClick={onClick}
            data-testid="review-button"
            css={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
            <HiAcademicCap />
            <span>Review</span>
        </Button>
    );
}

export default ReviewMetatextButton;
