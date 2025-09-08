import { CloseButton, Drawer, Portal } from "@chakra-ui/react"
export interface SimpleDrawerProps {
    triggerButton: React.ReactNode
    title: string
    children: React.ReactNode
    header?: React.ReactNode
    footer?: React.ReactNode
    placement?: 'start' | 'end' | 'top' | 'bottom'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function SimpleDrawer({ triggerButton, title, children, header, footer, placement = 'end', size = 'md' }: SimpleDrawerProps) {
    return (
        <Drawer.Root placement={placement} size={size}>
            <Drawer.Trigger>
                {triggerButton}
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content w="full" mb="10">
                        <Drawer.Header>
                            <Drawer.Title>{title}</Drawer.Title>
                            {header}
                        </Drawer.Header>
                        <Drawer.Body>
                            {children}
                        </Drawer.Body>
                        <Drawer.Footer>
                            {footer}
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}

export interface ControlledDrawerProps {
    open: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    header?: React.ReactNode
    footer?: React.ReactNode
    placement?: 'start' | 'end' | 'top' | 'bottom'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function ControlledDrawer({ open, onClose, title, children, header, footer, placement = 'end', size = 'md' }: ControlledDrawerProps) {
    return (
        <Drawer.Root open={open} onOpenChange={e => { if (!e.open) onClose(); }} placement={placement} size={size}>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content w="full" mb="10">
                        <Drawer.Header>
                            <Drawer.Title>{title}</Drawer.Title>
                            {header}
                        </Drawer.Header>
                        <Drawer.Body>
                            {children}
                        </Drawer.Body>
                        <Drawer.Footer>
                            {footer}
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}
