import * as Joi from "joi";

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),

  PORT: Joi.number().port().default(3001),

  API_PREFIX: Joi.string().trim().default("api"),

  API_VERSION: Joi.string().default("1"),
});
