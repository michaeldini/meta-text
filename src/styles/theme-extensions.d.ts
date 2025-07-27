// // This file extends the MUI theme to include custom properties and types. 

// import '@mui/material/styles';
// declare module '@mui/material/styles' {
//     interface Theme {

//         // adds multiple border radius values
//         shape: {
//             borderRadius: number;
//             borderRadiusSm: number;
//         };

//         // allows for Heroicons to have default styles
//         icons: {
//             default: React.CSSProperties;
//             className: string; // might not need this
//         }
//     };
//     interface ThemeOptions {
//         shape?: {
//             borderRadius?: number;
//             borderRadiusSm?: number;
//         };
//         icons?: {
//             default?: React.CSSProperties;
//             className?: string;
//         };
//     }
// }