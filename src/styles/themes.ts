
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
    defaultBaseConfig,
} from "@chakra-ui/react"
import {
    buttonRecipe,
    inputRecipe,
    textareaRecipe,
    headingRecipe,
    spinnerRecipe,
} from "@chakra-ui/react/theme"

const config = defineConfig({
    theme: {
        // Component recipes for Chakra UI core components
        recipes: {
            button: buttonRecipe,
            input: inputRecipe,
            textarea: textareaRecipe,
            heading: headingRecipe,
            spinner: spinnerRecipe,
        },
        // Design tokens for easy customization
        tokens: {
            colors: {
                // Use semantic tokens for robust theming and dark mode support
                primary: { value: "#0f8dee" },
                secondary: { value: "#212020" },
                accent: { value: "#3b82f6" }, // Example accent color
                // Extend with Chakra's built-in color tokens as needed
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

                // Add more semantic tokens as needed
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