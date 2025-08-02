// ./testing/render.tsx


import { Provider } from "@components/ui/provider"
import { render as rtlRender } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export function render(ui: React.ReactNode) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                // cacheTime removed for compatibility
            },
        },
    });
    return rtlRender(<>{ui}</>, {
        wrapper: (props: React.PropsWithChildren) => (
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <Provider>{props.children}</Provider>
                </QueryClientProvider>
            </MemoryRouter>
        ),
    });
}


