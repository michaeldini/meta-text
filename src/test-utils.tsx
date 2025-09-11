// Test utilities: common render wrapper and tiny factory helpers for tests.
// - render: wraps components with Router, React Query, and Chakra Provider
// - makeDoc/makeDocs: quick item factories to reduce repetition in tests
// - makeSourceDoc(s): same but with optional author for source docs

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
                    {props.children}
                </QueryClientProvider>
            </MemoryRouter>
        ),
    });
}

export type AnyDoc = { id: string; title: string; author?: string }

export function makeDoc(id: string | number, title?: string): AnyDoc {
    return { id: String(id), title: title ?? `Doc ${String(id)}` }
}

export function makeDocs(count: number, prefix = 'Doc'): AnyDoc[] {
    return Array.from({ length: count }, (_, i) => makeDoc(i, `${prefix} ${i}`))
}

export function makeSourceDoc(id: string | number, title?: string, author?: string): AnyDoc {
    return { id: String(id), title: title ?? `Source ${String(id)}`, author }
}

export function makeSourceDocs(count: number, prefix = 'Source', withAuthors = false): AnyDoc[] {
    return Array.from({ length: count }, (_, i) => makeSourceDoc(i, `${prefix} ${i}`, withAuthors ? `Author ${i}` : undefined))
}


