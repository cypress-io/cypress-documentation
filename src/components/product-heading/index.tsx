import Icon from '@cypress-design/react-icon'
import Badge from "@site/src/components/badge"
import s from './style.module.css'

import React from 'react';

// Define the types for the props
interface ProductHeadingProps {
    product: 'cloud' | 'accessibility' | 'ui-coverage'
    plan?: 'team' | 'business' | 'enterprise'
}

// Build the Button component with the specified props
const ProductHeading: React.FC<ProductHeadingProps> = ({ 
    product, // The product to display
    plan, // The plan to display for Cloud product
}) => {
    const iconName = product === 'ui-coverage' ? 'technology-ui-coverage' : product === 'accessibility' ? 'cypress-accessibility-outline' : 'technology-cypress'
    const linkPath  = product === 'ui-coverage' ? 'ui-coverage' : product === 'accessibility' ? 'accessibility' : 'pricing'
    
    let badgeContent = product === 'cloud' ? 'Free Trial' : '+ Add-on'

    if (product === 'cloud' && plan) {
        badgeContent = plan === 'team' ? 'Team Plan' : plan === 'business' ? 'Business Plan' : 'Enterprise Plan'
    }

    return (
    <div className={s.productHeading}>
        <Icon 
            name={iconName} 
            className={s.productHeadingIcon}
        />
        <span className={s.productHeadingText}>
          {product === 'ui-coverage' && 'UI Coverage'}
          {product === 'accessibility' && 'Cypress Accessibility'}
          {product === 'cloud' && 'Cypress Cloud'}
        </span>

        <a 
          href={`https://www.cypress.io/${linkPath}?utm_source=docs&utm_medium=product-heading-${product}&utm_content=${badgeContent}`}
          target="_blank"
          title="Learn more"
          className={s.productHeadingLink}
          >
          <Badge type="success">{badgeContent}</Badge>
        </a>

    </div>
    )
}

export default ProductHeading