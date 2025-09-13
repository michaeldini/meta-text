// import { HiBars3, HiQuestionMarkCircle } from 'react-icons/hi2';
// // Back of a flashcard component that displays the definition and context of a word


// import React from 'react';
// import { styled, Box, Heading, Button, Text } from '@styles';
// import { SimpleDrawer, TooltipButton } from '@components/ui';

// export interface FlashcardBackProps {
//     word: string;
//     definition: string;
//     definition_in_context: string;
//     context: string;
//     setFlipped: (flipped: boolean) => void;
// }

// const Footer = styled('div', {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     gap: 12,
//     padding: '12px 16px',
//     borderTop: '1px solid #eee',
// });

// export function FlashcardBack(props: FlashcardBackProps) {
//     const {
//         word,
//         definition,
//         definition_in_context,
//         context,
//         setFlipped
//     } = props;

//     return (
//         <>
//             <Box>
//                 <Heading
//                     onClick={() => setFlipped(false)}
//                     css={{ cursor: 'pointer' }}
//                 >{word}</Heading>
//                 <Text>{definition}</Text>
//             </Box>

//             <Footer>
//                 {/* Definition In Context */}
//                 <SimpleDrawer
//                     triggerButton={
//                         <TooltipButton
//                             label=""
//                             tooltip="View the definition of the word in its original context"
//                             onClick={() => { }}
//                             icon={<HiBars3 />}
//                         />
//                     }
//                     title="Definition In Context"
//                 >
//                     <Box>
//                         <Text css={{ fontWeight: 'bold' }}>Word: {word}</Text>
//                         <Text css={{ marginTop: 8 }}>{definition_in_context}</Text>
//                     </Box>
//                 </SimpleDrawer>

//                 {/* Context */}
//                 <SimpleDrawer
//                     triggerButton={
//                         <TooltipButton
//                             label=""
//                             tooltip="View more context around the word"
//                             onClick={() => { }}
//                             icon={<HiQuestionMarkCircle />}
//                         />
//                     }
//                     title="Context"
//                 >
//                     <Text>{context}</Text>
//                 </SimpleDrawer>
//             </Footer>
//         </>
//     );
// }

// export default FlashcardBack;
