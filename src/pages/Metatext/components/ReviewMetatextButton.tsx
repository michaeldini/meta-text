// Small button component to navigate to the Metatext review page using route params
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiAcademicCap } from 'react-icons/hi2';
import { Button, Tooltip } from '@components/ui';

export function ReviewMetatextButton(): React.ReactElement | null {
    const { metatextId } = useParams<{ metatextId: string }>();
    // If route param is missing, don't render the button
    if (!metatextId) return null;

    const to = `/metatext/${metatextId}/review`;

    // Wrap the button in a Link so it's a real anchor and works with keyboard navigation
    return (
        <Link to={to} data-testid="review-link">
            <Tooltip content="Review this metatext">
                <Button
                    icon={<HiAcademicCap />}
                    aria-label="Review this metatext"
                />
            </Tooltip>
        </Link>
    );
}

export default ReviewMetatextButton;
