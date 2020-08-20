//todo: move this to a dialog, maybe in layout, for components that dont use their own error dialog (such as new order)
export const caughtError = (task, error, code) => {
  return `Error with ${task}: ${error}. Please contact us or try again later. Error code: ${code}`;
};

export const showConsoleError = (task, error) => {
  console.warn(`Client: Error with ${task}: ${error}`);
};
