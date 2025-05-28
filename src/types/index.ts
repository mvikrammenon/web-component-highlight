export interface ComponentIdentifiers {
  className: string;
  id?: string;
}

export interface ComponentConfig {
  name: string;
  contentTypeUrl: string;
  uxDocsUrl: string;
  identifiers: ComponentIdentifiers;
  borderHighlightStyle: string;
}

export interface ExtensionSettings {
  isHighlightEnabled: boolean;
  storageKeyName: string;
  elHighlightName: string;
  componentsConfig: ComponentConfig[];
}

export interface StorageMessage {
  action: 'save' | 'get';
  key: string;
  value?: any;
  from?: string;
}

export interface StorageResponse {
  status?: 'success' | 'error';
  data?: any;
  error?: string;
}

export interface HighlightMessage {
  action: 'toggleHighlight';
  isEnabled?: boolean;
}