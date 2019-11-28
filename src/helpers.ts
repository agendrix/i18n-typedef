export function toPascalCase(str: string) {
  return (str.match(/[a-z]+/gi) || [])
    .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .join('')
}

export const matchParams = /%\{([a-zA-Z_0-9]*)\}/g

export const onlyUnique = <T>(value: T, index: number, self: any) => {
  return self.indexOf(value) === index
}
