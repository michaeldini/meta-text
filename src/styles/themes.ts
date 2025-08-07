
/**
 * Chakra UI v3 theme configuration for meta-text app.
 *
 * This file sets up a robust, extensible theme using Chakra's best practices.
 * - Uses semantic tokens for colors, backgrounds, borders, etc.
 * - Organizes tokens for easy customization and future extension.
 * - Includes recipes for core components.
 * - Designed for maintainability and clarity.
 */

import {
    defineConfig,
} from "@chakra-ui/react"
// import {
//     inputRecipe,
//     textareaRecipe,
//     headingRecipe,
//     spinnerRecipe,
//     buttonRecipe,
//     iconRecipe,
//     containerRecipe,
//     drawerSlotRecipe,
//     tagSlotRecipe,
//     cardSlotRecipe,
//     listSlotRecipe,
//     fileUploadSlotRecipe,



// } from "@chakra-ui/react/theme"
import { defineRecipe } from "@chakra-ui/react"

const config = defineConfig({
    theme: {
        // slotRecipes: {
        //     drawer: drawerSlotRecipe,
        //     tag: tagSlotRecipe,
        //     card: cardSlotRecipe,
        //     list: listSlotRecipe,
        //     fileUPload: fileUploadSlotRecipe,


        // },
        // Component recipes for Chakra UI core components
        recipes: {
            tabsContent: defineRecipe({
                base: {
                    _open: {
                        animationName: "fade-in, scale-in",
                        animationDuration: "120ms, 120ms",
                        animationTimingFunction: "ease-out, ease-out",
                    },
                    _closed: {
                        animationName: "fade-out, scale-out",
                        animationDuration: "120ms",
                        animationTimingFunction: "ease-in, ease-in",
                    },
                },
            }),

            button: defineRecipe({
                base: {
                    color: "fg",
                },
                defaultVariants: {
                    variant: "ghost",
                },
                variants: {
                    variant: {
                        ghost: {
                            color: 'fg',
                            _hover: {
                                bg: { base: "bg.subtle", _dark: "bg.muted" },
                            },
                        },
                    },
                },
            }),

            heading: defineRecipe({
                base: {
                    color: "fg",

                },
                defaultVariants: {
                    // variant: "main",
                },
                variants: {
                    size: {
                        main: {
                            color: 'fg',
                            fontSize: { base: "2xl", lg: "5xl" },
                            fontWeight: "bold",
                            lineHeight: "short",
                            textAlign: "center",

                        },
                        sub: {
                            color: 'fg.subtle',
                            fontSize: { base: "2xl", lg: "4xl" },
                            fontWeight: "bold",
                            lineHeight: "short",
                            textAlign: "center",

                        },
                    },
                },
            }),
            //     // You can add variants here if needed
            // }),
            // button: buttonRecipe,
            // input: inputRecipe,
            // container: containerRecipe,
            // icon: iconRecipe,
            // textarea: textareaRecipe,
            // heading: headingRecipe,
            // spinner: spinnerRecipe,
        },
        // Design tokens for easy customization
        tokens: {
            colors: {
                // Use semantic tokens for robust theming and dark mode support
                // primary: { value: "gray" },
                primary: { value: "#0f8dee" },
                // secondary: { value: "#212020" },
                // accent: { value: "#3b82f6" }, // Example accent color
                emphasized: { value: "primary" }, // Light gray for emphasis
                // Extend with Chakra's built-in color tokens as needed
                // headings: {
                //     value: "#212020", // Dark gray for headings
                // },
            },
            fonts: {
                body: { value: "system-ui, sans-serif" },
                heading: { value: "inherit" },
                mono: { value: "Menlo, monospace" },
            },
            fontSizes: {
                xs: { value: "0.75rem" },
                sm: { value: "0.875rem" },
                md: { value: "1rem" },
                lg: { value: "1.125rem" },
                xl: { value: "1.25rem" },
                "2xl": { value: "1.5rem" },
            },
            radii: {
                none: { value: "0" },
                sm: { value: "4px" },
                md: { value: "6px" },
                lg: { value: "8px" },
                xl: { value: "12px" },
                full: { value: "9999px" },
            },
            breakpoints: {
                sm: { value: "320px" },
                md: { value: "768px" },
                lg: { value: "960px" },
                xl: { value: "1200px" },
                "2xl": { value: "1536px" },
            },
        },
        // Semantic tokens for backgrounds, text, borders, etc.
        semanticTokens: {
            colors: {
                // Backgrounds
                bg: { value: { base: "{colors.gray.50}", _dark: "linear-gradient(to right, {colors.gray.700}, {colors.gray.800})" } },
                "bg.subtle": { value: { base: "{colors.gray.100}", _dark: "{colors.gray.700}" } },
                "bg.muted": { value: { base: "{colors.gray.200}", _dark: "{colors.gray.700}" } },
                "bg.emphasized": { value: { base: "{colors.emphasized}" } },
                "bg.inverted": { value: { base: "{colors.gray.900}", _dark: "{colors.gray.50}" } },
                "bg.panel": { value: { base: "{colors.white}", _dark: "{colors.gray.800}" } },
                "bg.error": { value: { base: "{colors.red.50}", _dark: "{colors.red.900}" } },
                "bg.warning": { value: { base: "{colors.yellow.50}", _dark: "{colors.yellow.900}" } },
                "bg.success": { value: { base: "{colors.green.50}", _dark: "{colors.green.900}" } },
                "bg.info": { value: { base: "{colors.blue.50}", _dark: "{colors.blue.900}" } },

                // Text
                fg: { value: { base: "{colors.gray.900}", _dark: "{colors.gray.50}" } },
                "fg.muted": { value: { base: "{colors.gray.600}", _dark: "{colors.gray.400}" } },
                "fg.subtle": { value: { base: "{colors.gray.500}", _dark: "{colors.gray.300}" } },
                "fg.inverted": { value: { base: "{colors.gray.50}", _dark: "{colors.gray.900}" } },
                "fg.error": { value: { base: "{colors.red.600}", _dark: "{colors.red.200}" } },
                "fg.warning": { value: { base: "{colors.yellow.700}", _dark: "{colors.yellow.200}" } },
                "fg.success": { value: { base: "{colors.green.700}", _dark: "{colors.green.200}" } },
                "fg.info": { value: { base: "{colors.blue.700}", _dark: "{colors.blue.200}" } },

                // Borders
                border: { value: { base: "{colors.gray.200}", _dark: "{colors.gray.700}" } },
                "border.muted": { value: { base: "{colors.gray.100}", _dark: "{colors.gray.800}" } },
                "border.subtle": { value: { base: "{colors.gray.300}", _dark: "{colors.gray.600}" } },
                "border.emphasized": { value: { base: "{colors.gray.400}", _dark: "{colors.gray.500}" } },
                "border.inverted": { value: { base: "{colors.gray.900}", _dark: "{colors.gray.50}" } },
                "border.error": { value: { base: "{colors.red.200}", _dark: "{colors.red.700}" } },
                "border.warning": { value: { base: "{colors.yellow.200}", _dark: "{colors.yellow.700}" } },
                "border.success": { value: { base: "{colors.green.200}", _dark: "{colors.green.700}" } },
                "border.info": { value: { base: "{colors.blue.200}", _dark: "{colors.blue.700}" } },
            },
        },
        // Add reusable text styles for typography
        textStyles: {
            heading: {
                fontFamily: "heading",
                fontWeight: "bold",
                fontSize: ["2xl", "xl", "lg"], // Responsive: mobile, tablet, desktop
                lineHeight: "short",
                color: "primary",
            },
            subheading: {
                fontFamily: "heading",
                fontWeight: "semibold",
                fontSize: ["xl", "lg", "md"],
                lineHeight: "short",
            },
            body: {
                fontFamily: "body",
                fontWeight: "normal",
                fontSize: ["md", "md", "lg"],
                lineHeight: "base",
            },
            caption: {
                fontFamily: "body",
                fontWeight: "medium",
                fontSize: "sm",
                lineHeight: "shorter",
            },
        },
    },
})

export default config