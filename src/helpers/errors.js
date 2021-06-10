export const caughtError = (task, error, code) => {
  return `Client: error with ${task}: ${error}. Please contact us or try again later. Error code: ${code}`;
};

export const showConsoleError = (task, error) => {
  console.error(`Client: Error with ${task}: ${error}`);
};
