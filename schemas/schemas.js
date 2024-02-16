import Joi from 'joi';

const recordSchema = Joi.object({
  projectName: Joi.string().required(),
  moduleName: Joi.string().required(),
  question: Joi.object({
      title: Joi.string().required(),
      type: Joi.string().required(),
      context: Joi.string().required(),
      text: Joi.string().required(),
      isReal: Joi.boolean().required(),
      explanation: Joi.string()
    //   source: Joi.string().when('isReal', { is: true, then: Joi.required() })
  }).required(),
  answers: Joi.array().items(
      Joi.object({
          value: Joi.string().required(),
          isCorrect: Joi.boolean().required()
      })
  ).required()
}).required()

export {recordSchema};