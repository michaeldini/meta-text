import * as React from 'react';
import { BaseButton, IconWrapper } from '@styles';

interface ButtonProps extends React.ComponentProps<typeof BaseButton> {
    children?: React.ReactNode;
    icon?: React.ReactNode;

}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => (
    <BaseButton {...props} ref={forwardedRef}>
        {props.icon ? <IconWrapper>{props.icon}</IconWrapper> : null}
        {props.children}
    </BaseButton>
));

Button.displayName = 'Button';
export default Button;