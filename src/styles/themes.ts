import {
    defineConfig,
    createSystem,
    defaultBaseConfig
} from "@chakra-ui/react"
import { buttonRecipe, inputRecipe, textareaRecipe, headingRecipe, spinnerRecipe } from "@chakra-ui/react/theme"

const config = defineConfig({
    theme: {
        recipes: {
            button: buttonRecipe,
            input: inputRecipe,
            textarea: textareaRecipe,
            heading: headingRecipe,
            spinner: spinnerRecipe,




        },
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