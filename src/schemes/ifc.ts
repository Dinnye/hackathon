import joi from "joi";

export const ifcTestSchema = joi.object({
  params: joi.object().unknown(true),
}).unknown(true);
