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

        },

    },
})

export default config