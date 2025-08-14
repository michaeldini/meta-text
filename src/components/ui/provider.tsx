/* eslint-disable react-refresh/only-export-components */
import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
// themes.ts now exports a fully-created system (merged with defaultConfig)
import system from "../../styles/themes"

export { system }
export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  )
}
