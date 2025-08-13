// Default settings for UI Component Highlighter
const defaultSettings = {
    isHighlightEnabled: false,
    storageKeyName: 'component-highlight-settings',
    elHighlightName: 'data-component-highlight',
    // Domain configuration - will be set during first-time setup
    domains: {
        contentfulDomain: '', // Will be configured by user
        storybookDomain: '', // Will be configured by user
        setupCompleted: false
    },
    componentsConfig: [
        {
            name: 'Banner Box',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/docs/FooterComponent',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/banner--box-dark-blue',
            identifiers: {
                className: 'de-banner--box'
            },
        },
        {
            name: 'Banner Mini',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/docs/FooterComponent',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/banner--mini-gray',
            identifiers: {
                className: 'de-banner--mini'
            },

        },
        {
            name: 'Bento Layout',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesBentoLayout/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/tabcontainer--bento-layout-light',
            identifiers: {
                className: 'bento-layout'
            },
        },
        {
            name: 'Explore Container',
            contentTypeUrl: '',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/explorecontainer--default',
            identifiers: {
                className: 'sitesExploreContainer'
            },
        },
        {
            name: 'Explore Card Solid Color',
            contentTypeUrl: '',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/explorecontainer--stacked',
            identifiers: {
                className: 'explore-card-solid-color'
            },
        },
        {
            name: 'Solutions Cards Carousel',
            contentTypeUrl: '',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/solutionscardscarousel--default',
            identifiers: {
                className: 'sitesSolutionsCardsCarousel',
            },
        },
        {
            name: 'Sites News Carousel',
            contentTypeUrl: '',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/sitesnewscarousel--default',
            identifiers: {
                className: 'sitesNewsCarousel',
            },
        },
        {
            name: 'Hero',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/docs/HeroComponent',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/hero--default',
            identifiers: {
                className: 'heroComponent'
            },
        },
        {
            name: 'Cards Container',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/docs/HeroComponent',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/cards-container--default',
            identifiers: {
                className: 'sitesCardsContainer'
            },
        },
        {
            name: 'Cards',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/docs/HeroComponent',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/cards-container--default',
            identifiers: {
                className: 'siemens-cards'
            },
        },
        {
            name: '3 Col Tiles',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/docs/HeroComponent',
            uxDocsUrl: 'https://zeroheight.com/',
            identifiers: {
                className: 'sitesThreeColTiles'
            },
        },
        {
            name: 'Promo',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/docs/HeroComponent',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/promo--default',
            identifiers: {
                className: 'promo-section'
            },
        },
        {
            name: 'Sites Image List',
            contentTypeUrl: '',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/imagelist--default',
            identifiers: {
                className: 'sitesImageList'
            },
        },
        {
            name: 'Sites Article Container',
            contentTypeUrl: '',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/articlecontainer--default-one-column-white',
            identifiers: {
                className: 'sitesArticleContainer'
            },
        },
        {
            name: 'Solutions Carousel Card',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/docs/HeroComponent',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/solutionscardscarousel--default',
            identifiers: {
                className: 'de-solutions-carousel-card'
            },
        },
        {
            name: 'Featured Cards Carousel',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/docs/HeroComponent',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/featuredcardscarousel--featured-cards-default',
            identifiers: {
                className: 'featured-cards-carousel'
            },
        },
        {
            name: 'Featured Card',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/docs/HeroComponent',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/featuredcardscarousel--featured-cards-default',
            identifiers: {
                className: 'featured-card'
            },
        }
    ]
};
