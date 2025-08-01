import React, { useState } from 'react';
import { Box } from '@chakra-ui/react/box';
import { keyframes } from '@emotion/react';
import {
    HiOutlineSparkles as AddIcon,
    HiOutlineDocumentArrowUp as EditIcon,
    HiOutlineDocumentArrowDown as NavigationIcon,
    HiOutlineQuestionMarkCircle as FavoriteIcon,
} from 'react-icons/hi2';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px);}
  to { opacity: 1; transform: translateY(0);}
`;

export function AnimatedShape({ isCircle }: { isCircle: boolean }) {
    return (
        <Box>

            <Box>
                {isCircle ? '●' : '■'}
            </Box>
        </Box>
    );
}

export function LayoutFrames() {
    const [frame, setFrame] = useState(0);
    const [isCircle, setIsCircle] = useState(false);

    return (

        <Box>
            <Box>
                {isCircle ? '●' : '■'}
            </Box>
        </Box>

    );
};



export function ExperimentsPage() {
    return <LayoutFrames />;
}

export default ExperimentsPage;
