/**
 * International SEO Utilities
 * Handles international SEO optimizations for global reach
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  locale: string;
  alternateLocales?: string[];
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  image?: string;
  brand?: {
    '@type': string;
    name: string;
  };
  offers?: {
    '@type': string;
    availability: string;
    priceCurrency: string;
    price: string;
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
  };
}

export class InternationalSEO {
  private static instance: InternationalSEO;
  private currentLocale: string = 'pt-BR';
  private supportedLocales: string[] = ['pt-BR', 'en-US', 'es-ES'];

  static getInstance(): InternationalSEO {
    if (!this.instance) {
      this.instance = new InternationalSEO();
    }
    return this.instance;
  }

  /**
   * Update document head with SEO meta tags
   */
  updateSEOTags(config: SEOConfig): void {
    // Basic meta tags
    this.updateMetaTag('title', config.title);
    this.updateMetaTag('description', config.description);
    this.updateMetaTag('keywords', config.keywords.join(', '));
    
    // Open Graph
    this.updateMetaTag('og:title', config.title, 'property');
    this.updateMetaTag('og:description', config.description, 'property');
    this.updateMetaTag('og:type', config.type || 'website', 'property');
    this.updateMetaTag('og:locale', config.locale, 'property');
    
    if (config.image) {
      this.updateMetaTag('og:image', config.image, 'property');
      this.updateMetaTag('og:image:alt', config.title, 'property');
    }
    
    if (config.canonicalUrl) {
      this.updateMetaTag('og:url', config.canonicalUrl, 'property');
      this.updateCanonicalLink(config.canonicalUrl);
    }

    // Twitter Cards
    this.updateMetaTag('twitter:card', 'summary_large_image', 'name');
    this.updateMetaTag('twitter:title', config.title, 'name');
    this.updateMetaTag('twitter:description', config.description, 'name');
    
    if (config.image) {
      this.updateMetaTag('twitter:image', config.image, 'name');
    }

    // Article specific
    if (config.type === 'article') {
      if (config.author) {
        this.updateMetaTag('article:author', config.author, 'property');
      }
      if (config.publishedTime) {
        this.updateMetaTag('article:published_time', config.publishedTime, 'property');
      }
      if (config.modifiedTime) {
        this.updateMetaTag('article:modified_time', config.modifiedTime, 'property');
      }
    }

    // Alternate locales
    if (config.alternateLocales) {
      this.updateAlternateLinks(config.alternateLocales, config.canonicalUrl);
    }

    // Language and locale
    document.documentElement.lang = config.locale.split('-')[0];
  }

  /**
   * Add structured data to page
   */
  addStructuredData(data: StructuredData): void {
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Generate product structured data
   */
  generateProductStructuredData(product: {
    name: string;
    description: string;
    brand: string;
    image?: string;
    url?: string;
    price?: string;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    rating?: { value: number; count: number };
  }): StructuredData {
    const data: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      url: product.url || window.location.href,
      brand: {
        '@type': 'Brand',
        name: product.brand
      }
    };

    if (product.image) {
      data.image = product.image;
    }

    if (product.price && product.currency) {
      data.offers = {
        '@type': 'Offer',
        availability: `https://schema.org/${product.availability || 'InStock'}`,
        priceCurrency: product.currency,
        price: product.price
      };
    }

    if (product.rating) {
      data.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.rating.value.toString(),
        reviewCount: product.rating.count.toString()
      };
    }

    return data;
  }

  /**
   * Generate organization structured data
   */
  generateOrganizationStructuredData(org: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
    contactPoint?: {
      telephone: string;
      contactType: string;
    };
    sameAs?: string[];
  }): StructuredData {
    const data: any = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: org.name,
      url: org.url
    };

    if (org.logo) {
      data.logo = org.logo;
    }

    if (org.description) {
      data.description = org.description;
    }

    if (org.contactPoint) {
      data.contactPoint = {
        '@type': 'ContactPoint',
        telephone: org.contactPoint.telephone,
        contactType: org.contactPoint.contactType
      };
    }

    if (org.sameAs) {
      data.sameAs = org.sameAs;
    }

    return data;
  }

  /**
   * Set current locale
   */
  setLocale(locale: string): void {
    if (this.supportedLocales.includes(locale)) {
      this.currentLocale = locale;
      document.documentElement.lang = locale.split('-')[0];
    }
  }

  /**
   * Get current locale
   */
  getLocale(): string {
    return this.currentLocale;
  }

  /**
   * Get supported locales
   */
  getSupportedLocales(): string[] {
    return [...this.supportedLocales];
  }

  private updateMetaTag(
    name: string, 
    content: string, 
    attribute: 'name' | 'property' = 'name'
  ): void {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    
    meta.content = content;
  }

  private updateCanonicalLink(url: string): void {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    
    link.href = url;
  }

  private updateAlternateLinks(locales: string[], baseUrl?: string): void {
    // Remove existing alternate links
    const existingLinks = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingLinks.forEach(link => link.remove());

    if (!baseUrl) return;

    // Add new alternate links
    locales.forEach(locale => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = locale;
      link.href = `${baseUrl}?lang=${locale}`;
      document.head.appendChild(link);
    });

    // Add x-default for international targeting
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = baseUrl;
    document.head.appendChild(defaultLink);
  }
}

// Export singleton instance
export const internationalSEO = InternationalSEO.getInstance();