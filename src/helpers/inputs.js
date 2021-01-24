export const evaluateWhitespaceBool = (text) => {
  if (!text.replace(/\s/g, "").length) {
    return true;
  }

  return false;
};

export const evaluateWhitespaceText = (text) => {
  if (!text.replace(/\s/g, "").length) {
    return "N/A";
  }

  return text;
};

export const limitLength = (value, size) => {
  if (value.length > size) {
    value = value.substr(0, size);
  }

  return value;
};
