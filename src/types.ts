export type TextsObject = {
  [index: string]: string | TextsObject;
};

export type Translation = {
  text: string;
  params: string[];
};

export type TranslationGroups = {
  [index: string]: Translation[];
};
