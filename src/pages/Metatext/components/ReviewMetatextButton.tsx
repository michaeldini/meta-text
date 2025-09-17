// Small button component to navigate to the Metatext review page using route params
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiAcademicCap } from 'react-icons/hi2';
import { TooltipButton } from '@components/ui';

export function ReviewMetatextButton(): React.ReactElement | null {
    const navigate = useNavigate();
    const { metatextId } = useParams<{ metatextId: string }>();

    const onClick = React.useCallback(() => {
        navigate(`/metatext/${metatextId}/review`);
    }, [navigate, metatextId]);

    // If route param is missing, don't render the button
    if (!metatextId) return null;

    return (
        <TooltipButton
            label=""
            tooltip="Review this metatext"
            tone="default"
            onClick={onClick}
            icon={<HiAcademicCap />}
            data-testid="review-button"
        />
    );
}

export default ReviewMetatextButton;
