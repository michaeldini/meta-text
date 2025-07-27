import React from 'react';
import { Button } from '@chakra-ui/react';
import { Tooltip } from 'components';
import { HiAcademicCap } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom';

export interface ReviewButtonProps {
    metatextId: number;
    label?: string;
    toolTip?: string;
    disabled?: boolean;
}

export function ReviewButton(props: ReviewButtonProps): React.ReactElement {
    const { metatextId, label = "Review", toolTip = "Review this metatext", disabled = false } = props;
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/metatext/${metatextId}/review`);
    };
    return (
        <Tooltip content={toolTip || ''}>
            <Button
                variant="ghost"
                color="primary"
                onClick={handleClick}
                disabled={disabled}
                aria-label={toolTip || 'Review Button'}
            >
                <HiAcademicCap />
                {label}
            </Button>
        </Tooltip>
    );
}

export default ReviewButton;
