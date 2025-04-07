import { 
    default as Button, 
    VariantClassesTable, 
} from '@cypress-design/react-button'
import Icon from '@cypress-design/react-icon'

import React from 'react';

// Define the types for the props
interface BtnProps {
    size?: 20 | 24 | 32 | 40 | 48
    variant?: keyof typeof VariantClassesTable
    block?: boolean;
    disabled?: boolean;
    target?: string;
    className?: string;
    href?: string;
    label?: string;
    icon?: string;
}

// Build the Button component with the specified props
const Btn: React.FC<BtnProps> = ({ 
    size = 32, // The size of the button
    variant = 'outline-indigo', // The variant of the button
    disabled = false, // Whether the button should be disabled
    target = '_self', // The target of the button link
    className, // Custom classes for the button
    href, // The URL the button should link to
    label, // The text of the button
    icon, // The icon in the button
}) => {
    return (
    <Button
        variant={variant}
        href={href}
        size={size}
        className={className}
        target={target}
        disabled={disabled}
    >
        {icon && 
            <Icon 
                className={'mr-1'}
                name={icon} 
            />
        }
        {label}
    </Button>
    )
}

export default Btn