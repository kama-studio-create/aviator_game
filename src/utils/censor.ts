export const censor = (name: string): string => {
  if (name.length <= 2) {
    return name;
  } else {
    return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`;
  }
}