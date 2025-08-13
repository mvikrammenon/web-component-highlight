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
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesBanner/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/banner--box-dark-blue',
            identifiers: {
                className: 'de-banner--box'
            },
        },
        {
            name: 'Banner Mini',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesBanner/fields',
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
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesExploreContainer/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/explorecontainer--default',
            identifiers: {
                className: 'sitesExploreContainer'
            },
        },
        {
            name: 'Explore Card Solid Color',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/exploreCardSolidColor/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/explorecontainer--stacked',
            identifiers: {
                className: 'explore-card-solid-color'
            },
        },
        {
            name: 'Explore Card Background Image',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/exploreCardBackgroundImage/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/explorecontainer--stacked',
            identifiers: {
                className: 'explore-card-background-image'
            },
        },
        {
            name: 'Solutions Cards Carousel',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesSolutionsCardsCarousel/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/solutionscardscarousel--default',
            identifiers: {
                className: 'sitesSolutionsCardsCarousel',
            },
        },
        {
            name: 'Sites News Carousel',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesNewsCarousel/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/sitesnewscarousel--default',
            identifiers: {
                className: 'sitesNewsCarousel',
            },
        },
        {
            name: 'News Carousel Card',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesNewsCarousel/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/sitesnewscarousel--default',
            identifiers: {
                className: 'de-news-carousel-card'
            },
        },
        {
            name: 'Hero',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesHero/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/hero--default',
            identifiers: {
                className: 'heroComponent'
            },
        },
        {
            name: 'Section Heading',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesSectionHeading/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/mock-up--section-heading',
            identifiers: {
                className: 'section-heading'
            },
        },
        {
            name: 'Cards Container',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesCardsContainer/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/cards-container--default',
            identifiers: {
                className: 'sitesCardsContainer'
            },
        },
        {
            name: 'Cards',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesCards/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/cards-container--default',
            identifiers: {
                classNames: ['siemens-cards', 'card-image-left']
            },
        },
        {
            name: '3 Col Tiles Container',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesThreeColTiles/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/threecoltiles--default',
            identifiers: {
                className: 'three-column-tile'
            },
        },
        {
            name: '3 Col Tiles',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesThreeColTiles/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/threecoltiles--default',
            identifiers: {
                className: 'tileHeightAdjust'
            },
        },
        {
            name: 'Promo Container',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesPromo/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/promo--default',
            identifiers: {
                className: 'de-promo-container'
            },
        },
        {
            name: 'Promo Item',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesSinglePromoItem/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/promo--default',
            identifiers: {
                className: 'de-promo-item'
            },
        },
        {
            name: 'Image List',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesImageList/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/imagelist--default',
            identifiers: {
                className: 'sitesImageList'
            },
        },
        {
            name: 'Article Container',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesArticleContainer/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/articlecontainer--default-one-column-white',
            identifiers: {
                className: ['sitesArticleContainer', 'columnArticleClass']
            },
        },
        {
            name: 'Solutions Carousel Card',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesSolutionsCarouselCard/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/solutionscardscarousel--default',
            identifiers: {
                className: 'de-solutions-carousel-card'
            },
        },
        {
            name: 'Featured Cards Carousel',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesFeaturedCardsCarousel/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/featuredcardscarousel--featured-cards-default',
            identifiers: {
                className: 'featured-cards-carousel'
            },
        },
        {
            name: 'Featured Card',
            contentTypeUrl: '{CONTENTFUL_DOMAIN}/environments/dev/content_types/sitesFeaturedCard/fields',
            uxDocsUrl: '{STORYBOOK_DOMAIN}/?path=/story/featuredcardscarousel--featured-cards-default',
            identifiers: {
                className: 'featured-card'
            },
        }
    ]
};
