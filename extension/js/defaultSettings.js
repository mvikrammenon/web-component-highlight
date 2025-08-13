// Default settings for UI Component Highlighter
const defaultSettings = {
    isHighlightEnabled: false,
    storageKeyName: 'component-highlight-settings',
    elHighlightName: 'data-component-highlight',
    componentsConfig: [
        {
            name: 'Banner Box',
            contentTypeUrl: 'https://docs.example.com/FooterComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/banner--box-dark-blue',
            identifiers: {
                className: 'de-banner--box'
            },
        },
        {
            name: 'Banner Mini',
            contentTypeUrl: 'https://docs.example.com/FooterComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/banner--mini-gray',
            identifiers: {
                className: 'de-banner--mini'
            },

        },
        {
            name: 'Bento Layout',
            contentTypeUrl: 'https://docs.example.com/FooterComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/tabcontainer--bento-layout-light',
            identifiers: {
                className: 'bento-layout'
            },
        },
        {
            name: 'Explore Container',
            contentTypeUrl: '',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/explorecontainer--default',
            identifiers: {
                className: 'sitesExploreContainer'
            },
        },
        {
            name: 'Explore Card Solid Color',
            contentTypeUrl: '',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/explorecontainer--stacked',
            identifiers: {
                className: 'explore-card-solid-color'
            },
        },
        {
            name: 'Solutions Cards Carousel',
            contentTypeUrl: '',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/solutionscardscarousel--default',
            identifiers: {
                className: 'sitesSolutionsCardsCarousel',
            },
        },
        {
            name: 'Sites News Carousel',
            contentTypeUrl: '',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/sitesnewscarousel--default',
            identifiers: {
                className: 'sitesNewsCarousel',
            },
        },
        {
            name: 'Hero',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/hero--default',
            identifiers: {
                className: 'heroComponent'
            },
        },
        {
            name: 'Cards Container',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/cards-container--default',
            identifiers: {
                className: 'sitesCardsContainer'
            },
        },
        {
            name: 'Cards',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/cards-container--default',
            identifiers: {
                className: 'siemens-cards'
            },
        },
        {
            name: '3 Col Tiles',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://zeroheight.com/',
            identifiers: {
                className: 'sitesThreeColTiles'
            },
        },
        {
            name: 'Promo',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/promo--default',
            identifiers: {
                className: 'promo-section'
            },
        },
        {
            name: 'Sites Image List',
            contentTypeUrl: '',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/imagelist--default',
            identifiers: {
                className: 'sitesImageList'
            },
            
        },
        {
            name: 'Sites Article Container',
            contentTypeUrl: '',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/articlecontainer--default-one-column-white',
            identifiers: {
                className: 'sitesArticleContainer'
            },
        },
        {
            name: 'Solutions Carousel Card',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/solutionscardscarousel--default',
            identifiers: {
                className: 'de-solutions-carousel-card'
            },
        },
        {
            name: 'Featured Cards Carousel',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/featuredcardscarousel--featured-cards-default',
            identifiers: {
                className: 'featured-cards-carousel'
            },
        },
        {
            name: 'Featured Card',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/featuredcardscarousel--featured-cards-default',
            identifiers: {
                className: 'featured-card'
            },
        }
    ]
};
