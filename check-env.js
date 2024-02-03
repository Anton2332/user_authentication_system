/* eslint-disable @typescript-eslint/no-var-requires */
const Joi = require('joi');
require('dotenv').config({ path: `.env` });

const envSchema = {
  DATABASE_URL: Joi.string().required(),
};

const envVariables = process.env;

async function handleValidation() {
  try {
    // eslint-disable-next-line guard-for-in
    for (const key in envSchema) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await envSchema[key].validateAsync(envVariables[key]);
      } catch (e) {
        Error(`⛔️ Validation of : ${key} is undefined! ⛔️`);
      }
    }
    // eslint-disable-next-line no-console
    console.log('✅ Success! Env validation was successfully passed! ✅');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(
      'Environment variables validation failed. Check your dotenv variables:',
    );
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  }
}

handleValidation();
