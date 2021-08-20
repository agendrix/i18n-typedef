/// <reference path="./I18n.expected.d.ts" />

const test1 = I18n.t('arguments.withTime', { time: 231 });
const test2 = I18n.t('nested_children.second_child.object_two');
const test4 = I18n.t('nested_children.second_child', {});
const test3 = I18n.t('with_count', { count: 3 });
