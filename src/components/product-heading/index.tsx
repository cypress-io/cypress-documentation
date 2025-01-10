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
          href="https://www.cypress.io/pricing"
          target="_blank"
          title="See our pricing"
          className={s.productHeadingLink}
          >
          <Badge type="success">
              {product === 'cloud' && !plan && '➜ Free Trial'}
              {product === 'cloud' && plan && plan === 'team' && '➜ Team Plan'}
              {product === 'cloud' && plan && plan === 'business' && '➜ Business Plan'}
              {product === 'cloud' && plan && plan === 'enterprise' && '➜ Enterprise Plan'}
              {product === 'ui-coverage' && '+ Add-on' }
              {product === 'accessibility' && '+ Add-on'}
          </Badge>
        </a>

    </div>
    )
}

export default ProductHeading