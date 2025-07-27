import { ChakraProvider, defaultSystem, createSystem, defaultConfig, defaultBaseConfig } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import config from "../../styles/themes"

const system = createSystem(defaultConfig, config)
export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
