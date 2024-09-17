
declare namespace I18n {
  export type Root = {
    "simple": [undefined, any];
    "other": [undefined, any];
    "root_translation": [undefined, string];
    "text_on_root": [undefined, string];
    "nested_children": [undefined, any];
    "arguments": [undefined, any];
    "with_count": [undefined, any];
  };

  export type Simple = {
    "simple.other": [undefined, string];
    "simple.ok": [undefined, string];
    "simple._yes": [undefined, string];
    "simple._no": [undefined, string];
  };

  export type Other = {
    "other.title": [undefined, string];
    "other.text": [undefined, string];
  };

  export type NestedChildren = {
    "nested_children.first_child": [undefined, any];
    "nested_children.first_child.level_two": [undefined, string];
    "nested_children.first_child.nested": [undefined, any];
    "nested_children.first_child.nested.level_three": [undefined, string];
    "nested_children.second_child": [undefined, any];
    "nested_children.second_child.object_one": [undefined, string];
    "nested_children.second_child.object_two": [undefined, string];
  };

  export type Arguments = {
    "arguments.withTime": [{ time: string | number }, string];
    "arguments.multiple": [undefined, any];
    "arguments.multiple.withIdAndDate": [{ id: string | number; date: string | number }, string];
    "arguments.multiple.withNameTimeAndDate": [{ name: string | number; time: string | number; date: string | number }, string];
    "arguments.multiple.withNumbersInName": [{ brand_4_first_digits: string | number; last4: string | number }, string];
    "arguments.none": [undefined, string];
  };

  export type WithCount = {
    "with_count.one": [undefined, string];
    "with_count.other": [{ count: string | number }, string];
    "with_count.title": [undefined, string];
  };


  export type Translation = Root & Simple & Other & NestedChildren & Arguments & WithCount;

  type NumberOptions = Partial<{
    unit: string; // "$"
    precision: number; // 2
    format: string; // "%u%n"
    delimiter: string; // ","
    separator: string; // "."
    strip_insignificant_zeros: boolean; // false
  }>;

  type OptionalArgTuple<P, O> = O extends string ? (P extends undefined ? [] : [P]) : any;

  type Translator = <Text extends keyof Translation>(
    text: Text,
    ...params: OptionalArgTuple<Translation[Text][0], Translation[Text][1]>
  ) => Translation[Text][1];
}

type I18n = {
  // Note: Not all options have been defined here yet
  locale: string;

  /** Translate the given scope with the provided options. */
  t: I18n.Translator;
  translate: I18n.Translator;

  /** Format currency with localization rules. */
  toCurrency(number: number, options?: I18n.NumberOptions): string;

  /** Format number using localization rules. */
  toNumber(number: number, options?: I18n.NumberOptions): string;

  /** Convert a number into a formatted percentage value. */
  toPercentage(number: number, options?: I18n.NumberOptions): string;

  /** Convert a number into a readable size representation. */
  toHumanSize(number: number, options?: I18n.NumberOptions): string;

  /** Find and process the translation using the provided scope and options. */
  lookup(scope: string): string | string[] | Record<string, unknown> | undefined;
};

declare var I18n: I18n;
    