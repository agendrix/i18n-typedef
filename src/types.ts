type TextsObject = {
  [index: string]: string | TextsObject
}

type Translation = {
  text: string
  params: string[]
}

type TranslationGroups = {
  [index: string]: Translation[]
}
