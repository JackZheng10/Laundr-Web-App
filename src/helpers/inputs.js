export const limitLength = (value, size) => {
  if (value.length > size) {
    value = value.substr(0, size);
  }

  return value;
};
