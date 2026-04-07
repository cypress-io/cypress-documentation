import Icon from '@cypress-design/react-icon'
import Badge from "@site/src/components/badge"
import s from './style.module.css'
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import E2EOnlyBadge from "@site/src/components/e2e-only-badge";
import ComponentOnlyBadge from "@site/src/components/component-only-badge";

import React from 'react';

interface ProductBadgeProps {
    productLink: string
    badgeContent: string
    plan?: 'team' | 'business' | 'enterprise' | 'premium solution'
}

const ProductBadge: React.FC<ProductBadgeProps> = ({ 
    productLink, // The plan to display for Cloud product
    badgeContent, // The badge title to display
    plan,
}) => (
    <a 
    href={productLink}
    target="_blank"
    title="Learn more"
    className={s.productHeadingLink}
    >
      <Badge type={plan || "success"}>{badgeContent}</Badge>
  </a>
)

interface ProductHeadingProps {
    product: 'app' | 'cloud' | 'accessibility' | 'ui-coverage'
    plan?: 'starter' | 'team' | 'business' | 'enterprise'
    badge?: React.ReactNode
    productPrefix?: boolean
    badgeOnly?: boolean
}

// Build the Button component with the specified props
const DocProductHeading: React.FC<ProductHeadingProps> = ({ 
    product, // The product to display
    plan, // The plan to display for Cloud product
    badge, // The badge to display
    productPrefix =  false,
    badgeOnly = false
}) => {
    const productName = product === 'ui-coverage' ? 'UI Coverage' : product === 'accessibility' ? 'Cypress Accessibility' : product === 'cloud' ? 'Cypress Cloud' : 'Cypress App'
    const iconName = product === 'ui-coverage' ? 'technology-ui-coverage' : product === 'accessibility' ? 'cypress-accessibility-outline' : 'technology-cypress'
    const linkPath  = product === 'cloud' ? 'pricing' : product

    let badgeContent = product === 'cloud' ? 'Free Trial' : 'Premium Solution'

    if (product === 'cloud' && plan) {
        badgeContent = plan === 'starter' ? 'Free Trial' : plan === 'team' ? 'Team Plan' : plan === 'business' ? 'Business Plan' : 'Enterprise Plan'
    }

    const productLink = `https://www.cypress.io/${linkPath}?utm_source=docs&utm_medium=product-heading-${product}&utm_content=${badgeContent}`

    if (productPrefix) {
        const shortProductName = product === 'ui-coverage' ? 'UI Coverage' : product === 'accessibility' ? 'Accessibility' : product === 'cloud' ? 'Cloud' : 'App'
        badgeContent = `${shortProductName} ${badgeContent}`
    }

    if (badgeOnly) {
        if (product === 'app') return null
        return (
          <ProductBadge
            productLink={productLink}
            badgeContent={badgeContent}
            plan={plan}
          />
        )
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
        {product !== 'app' && (
            <ProductBadge
                productLink={productLink}
                badgeContent={badgeContent}
            />
        )}
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