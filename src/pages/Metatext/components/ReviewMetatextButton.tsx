// Small button component to navigate to the Metatext review page using route params
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiAcademicCap } from 'react-icons/hi2';
import { TooltipButton } from '@components/ui';

export function ReviewMetatextButton(): React.ReactElement | null {
    const { metatextId } = useParams<{ metatextId: string }>();
    // If route param is missing, don't render the button
    if (!metatextId) return null;

    const to = `/metatext/${metatextId}/review`;

    // Wrap the TooltipButton in a Link so it's a real anchor and works with keyboard navigation
    return (
        <Link to={to} data-testid="review-link">
            <TooltipButton
                label=""
                tooltip="Review this metatext"
                tone="default"
                // no onClick: link handles navigation
                icon={<HiAcademicCap />}
                data-testid="review-button"
            />
        </Link>
    );
}

export default ReviewMetatextButton;
