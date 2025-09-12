/**
 * EmptyState component from Chakra CLI.
 */
import * as React from "react"
import { Box, Text, Stack } from '@styles';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (props, ref) => {
    const { title, description, icon, children, ...rest } = props;
    return (
      <Box ref={ref} css={{ width: '100%', textAlign: 'center', paddingTop: 32, paddingBottom: 32, paddingLeft: 16, paddingRight: 16 }} {...rest}>
        <Stack css={{ alignItems: 'center', gap: 12 }}>
          {icon && (
            <Box>{icon}</Box>
          )}
          <Text as="h2" css={{ fontWeight: 600, fontSize: 20, marginBottom: description ? 4 : 0 }}>{title}</Text>
          {description && (
            <Text as="p" css={{ color: '$gray11', fontSize: 16, marginBottom: 8 }}>{description}</Text>
          )}
          {children}
        </Stack>
      </Box>
    );
  }
);
