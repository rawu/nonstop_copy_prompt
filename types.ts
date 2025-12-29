export enum PromptType {
  DEFAULT = 'default',
  CUSTOM = 'custom',
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  type: PromptType;
}

export interface ToastMessage {
  show: boolean;
  message: string;
}