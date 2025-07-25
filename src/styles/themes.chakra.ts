import { defineConfig } from "@chakra-ui/react"

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                primary: { value: "#0f8deeff" },
                secondary: { value: "#212020ff" },
            },
            fonts: {
                body: { value: "system-ui, sans-serif" },
            },
            fontSizes: {
                sm: { value: "0.875rem" },
                md: { value: "1rem" },
                lg: { value: "1.125rem" },
                xl: { value: "1.25rem" },
            },

        }
    },
})

export default config