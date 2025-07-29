import { ChakraProvider, defaultSystem, createSystem, defaultConfig, defaultBaseConfig } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import config from "../../styles/themes"

export const system = createSystem(defaultConfig, config)
export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  )
}
