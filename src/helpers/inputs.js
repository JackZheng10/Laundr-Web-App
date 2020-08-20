//todo: add to where whitespaces are checked

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
