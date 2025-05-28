import { ExtensionSettings } from '../types';

export const defaultSettings: ExtensionSettings = {
  isHighlightEnabled: false,
  storageKeyName: 'component-highlight-settings',
  elHighlightName: 'data-component-highlight',
  componentsConfig: [
    {
      name: 'Banner',
      contentTypeUrl: 'https://docs.example.com/FooterComponent',
      uxDocsUrl: 'https://zeroheight.com/',
      identifiers: {
        dataTestId: 'banner-dtid'
      },
      borderHighlightStyle: '1px dotted red'
    },
    {
      name: 'Hero',
      contentTypeUrl: 'https://docs.example.com/HeroComponent',
      uxDocsUrl: 'https://zeroheight.com/',
      identifiers: {
        dataTestId: 'hero-dtid'
      },
      borderHighlightStyle: '1px solid red'
    },
    {
      name: 'Cards Container',
      contentTypeUrl: 'https://docs.example.com/HeroComponent',
      uxDocsUrl: 'https://zeroheight.com/',
      identifiers: {
        dataTestId: 'cards-container-dtid'
      },
      borderHighlightStyle: '1px dotted green'
    },
    {
      name: 'Cards',
      contentTypeUrl: 'https://docs.example.com/HeroComponent',
      uxDocsUrl: 'https://zeroheight.com/',
      identifiers: {
        dataTestId: 'cards-dtid'
      },
      borderHighlightStyle: '1px dotted blue'
    },
    {
      name: '3 Col Tiles',
      contentTypeUrl: 'https://docs.example.com/HeroComponent',
      uxDocsUrl: 'https://zeroheight.com/',
      identifiers: {
        dataTestId: 'tiles-dtid'
      },
      borderHighlightStyle: '1px dotted blue'
    },
    {
      name: 'Promo',
      contentTypeUrl: 'https://docs.example.com/HeroComponent',
      uxDocsUrl: 'https://zeroheight.com/',
      identifiers: {
        dataTestId: 'promo-dtid'
      },
      borderHighlightStyle: '1px dotted blue'
    }
  ]
};