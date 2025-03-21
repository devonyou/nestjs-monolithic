import * as Joi from 'joi';

export default Joi.object({
    ENV: Joi.string().required(),
    HTTP_PORT: Joi.number().required(),
    HASH_ROUNDS: Joi.string().required(),
    DB_TYPE: Joi.string().valid('mysql').required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    DB_URL: Joi.string().required(),
    ACCESS_TOKEN_SECRET: Joi.string().required(),
    REFRESH_TOKEN_SECRET: Joi.string().required(),
});
