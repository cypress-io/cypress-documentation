import Icon from '@cypress-design/react-icon'
import Badge from "@site/src/components/badge"
import s from './style.module.css'
import {useDoc} from '@docusaurus/theme-common/internal';
import E2EOnlyBadge from "@site/src/components/e2e-only-badge";
import ComponentOnlyBadge from "@site/src/components/component-only-badge";

import React from 'react';

// Define the types for the props
interface ProductHeadingProps {
    product: 'app' | 'cloud' | 'accessibility' | 'ui-coverage'
    plan?: 'team' | 'business' | 'enterprise'
    badge?: React.ReactNode
}

// Build the Button component with the specified props
const DocProductHeading: React.FC<ProductHeadingProps> = ({ 
    product, // The product to display
    plan, // The plan to display for Cloud product
    badge, // The badge to display
}) => {
    const productName = product === 'ui-coverage' ? 'UI Coverage' : product === 'accessibility' ? 'Cypress Accessibility' : product === 'cloud' ? 'Cypress Cloud' : 'Cypress App'
    const iconName = product === 'ui-coverage' ? 'technology-ui-coverage' : product === 'accessibility' ? 'cypress-accessibility-outline' : 'technology-cypress'
    const linkPath  = product === 'cloud' ? 'pricing' : product

    let badgeContent = product === 'cloud' ? 'Free Trial' : 'Premium Solution'

    if (product === 'cloud' && plan) {
        badgeContent = plan === 'team' ? 'Team Plan' : plan === 'business' ? 'Business Plan' : 'Enterprise Plan'
    }

    return (
    <div className={s.productHeading} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
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
        <span className={s.productHeadingBadge}>{badge}</span>
    </div>
    )
}

const ProductHeading: React.FC<Omit<ProductHeadingProps, 'badge'>> = (props) => {
  const { frontMatter } = useDoc();
  const e2eSpecific = (frontMatter as any).e2eSpecific;
  const componentSpecific = (frontMatter as any).componentSpecific;
  const testTypePill = (e2eSpecific && <E2EOnlyBadge />) || (componentSpecific && <ComponentOnlyBadge />);
  return <DocProductHeading {...props} badge={testTypePill} />;
};

export default ProductHeading;
export { ProductHeading, DocProductHeading };