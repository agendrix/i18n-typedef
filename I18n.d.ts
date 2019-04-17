
type OptionalArgTuple<T> = T extends undefined ? [] : [T]

type I18n = {
  t: <Text extends keyof I18n.Translation>(
    text: Text,
    ...params: OptionalArgTuple<I18n.Translation[Text]>
  ) => string
}

declare var I18n: I18n

declare namespace I18n {


  export type Translation = 
}
    