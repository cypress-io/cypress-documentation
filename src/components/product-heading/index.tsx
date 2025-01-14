import Icon from '@cypress-design/react-icon'
import Badge from "@site/src/components/badge"
import s from './style.module.css'

import React from 'react';

// Define the types for the props
interface ProductHeadingProps {
    product: 'app' | 'cloud' | 'accessibility' | 'ui-coverage'
    plan?: 'team' | 'business' | 'enterprise'
}

// Build the Button component with the specified props
const ProductHeading: React.FC<ProductHeadingProps> = ({ 
    product, // The product to display
    plan, // The plan to display for Cloud product
}) => {
    const productName = product === 'ui-coverage' ? 'UI Coverage' : product === 'accessibility' ? 'Cypress Accessibility' : product === 'cloud' ? 'Cypress Cloud' : 'Cypress App'
    const iconName = product === 'ui-coverage' ? 'technology-ui-coverage' : product === 'accessibility' ? 'cypress-accessibility-outline' : 'technology-cypress'
    const linkPath  = product === 'cloud' ? 'pricing' : product

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
          {productName}
        </span>

        <a 
          href={`https://www.cypress.io/${linkPath}?utm_source=docs&utm_medium=product-heading-${product}&utm_content=${badgeContent}`}
          target="_blank"
          title="Learn more"
          className={s.productHeadingLink}
          >
            { product !== 'app' &&  <Badge type="success">{badgeContent}</Badge>}
        </a>

    </div>
    )
}

export default ProductHeading