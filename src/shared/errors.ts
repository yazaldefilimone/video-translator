const errorMessage = (service: string, error: string) => `${service}: ${error}`;

export const serverError = (error: Error, service: string): void => {
  const msg = errorMessage(service, error.message);
  throw new Error(msg);
};
