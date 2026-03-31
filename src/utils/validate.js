import { ValidationError } from "./errors.js";

export const validate = (schema, data) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const messages = result.error.issues
      .map((err) => {
        const field = err.path.join(".");
        return field ? `${field}: ${err.message}` : err.message;
      })
      .join(", ");

    throw new ValidationError(messages);
  }

  return result.data;
};
