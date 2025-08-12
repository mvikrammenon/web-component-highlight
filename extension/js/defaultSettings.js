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
            borderHighlightStyle: '1px dotted red'
        },
        {
            name: 'Banner Mini',
            contentTypeUrl: 'https://docs.example.com/FooterComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/banner--mini-gray',
            identifiers: {
                className: 'de-banner--mini'
            },
            borderHighlightStyle: '1px dotted red'
        },
        {
            name: 'Bento Layout',
            contentTypeUrl: 'https://docs.example.com/FooterComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/tabcontainer--bento-layout-light',
            identifiers: {
                className: 'bento-layout'
            },
            borderHighlightStyle: '1px dotted red'
        },
        {
            name: 'Explore Container',
            contentTypeUrl: '',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/explorecontainer--default',
            identifiers: {
                className: 'sitesExploreContainer'
            },
            borderHighlightStyle: '1px dotted red'
        },
        {
            name: 'Explore Card Solid Color',
            contentTypeUrl: '',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/explorecontainer--stacked',
            identifiers: {
                className: 'explore-card-solid-color'
            },
            borderHighlightStyle: '1px dotted red'
        },
        {
            name: 'Solutions Cards Carousel',
            contentTypeUrl: '',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/solutionscardscarousel--default',
            identifiers: {
                className: 'sitesSolutionsCardsCarousel',
            },
            borderHighlightStyle: '1px dotted red'
        },
        {
            name: 'Sites News Carousel',
            contentTypeUrl: '',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/sitesnewscarousel--default',
            identifiers: {
                className: 'sitesNewsCarousel',
            },
            borderHighlightStyle: '1px dotted red'
        },
        {
            name: 'Hero',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/hero--default',
            identifiers: {
                className: 'heroComponent'
            },
            borderHighlightStyle: '1px solid red'
        },
        {
            name: 'Cards Container',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/cards-container--default',
            identifiers: {
                className: 'sitesCardsContainer'
            },
            borderHighlightStyle: '1px dotted green'
        },
        {
            name: 'Cards',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/cards-container--default',
            identifiers: {
                className: 'siemens-cards'
            },
            borderHighlightStyle: '1px dotted blue'
        },
        {
            name: '3 Col Tiles',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://zeroheight.com/',
            identifiers: {
                className: 'sitesThreeColTiles'
            },
            borderHighlightStyle: '1px dotted blue'
        },
        {
            name: 'Promo',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/promo--default',
            identifiers: {
                className: 'promo-section'
            },
            borderHighlightStyle: '1px dotted blue'
        },
        {
            name: 'Sites Image List',
            contentTypeUrl: '',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/imagelist--default',
            identifiers: {
                className: 'sitesImageList'
            },
            borderHighlightStyle: '1px dotted blue'
        },
        {
            name: 'Sites Article Container',
            contentTypeUrl: '',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/articlecontainer--default-one-column-white',
            identifiers: {
                className: 'sitesArticleContainer'
            },
            borderHighlightStyle: '1px dotted blue'
        },
        {
            name: 'Solutions Carousel Card',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/solutionscardscarousel--default',
            identifiers: {
                className: 'de-solutions-carousel-card'
            },
            borderHighlightStyle: '1px dotted blue'
        },
        {
            name: 'Featured Cards Carousel',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/featuredcardscarousel--featured-cards-default',
            identifiers: {
                className: 'featured-cards-carousel'
            },
            borderHighlightStyle: '1px dotted blue'
        },
        {
            name: 'Featured Card',
            contentTypeUrl: 'https://docs.example.com/HeroComponent',
            uxDocsUrl: 'https://sharelib-storybook-dev.stage.sw.siemens.com/?path=/story/featuredcardscarousel--featured-cards-default',
            identifiers: {
                className: 'featured-card'
            },
            borderHighlightStyle: '1px dotted blue'
        }
    ]
};
