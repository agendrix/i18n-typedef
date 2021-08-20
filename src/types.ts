export type TextsObject = {
  [index: string]: string | TextsObject;
};

export type Translation = {
  text: string;
  params: string[];
  isParent?: boolean;
};

export type TranslationGroups = {
  [index: string]: Translation[];
};
