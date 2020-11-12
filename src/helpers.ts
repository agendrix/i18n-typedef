export const toPascalCase = (str: string): string => {
  return (str.match(/[a-z]+/gi) || [])
    .map((word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .join('');
};

export const matchParams = /%\{([a-zA-Z_0-9]*)\}/g;

export const onlyUnique = <T>(value: T, index: number, self: T[]): boolean => {
  return self.indexOf(value) === index;
};

export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
