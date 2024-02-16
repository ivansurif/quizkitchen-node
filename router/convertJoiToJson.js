import Joi from 'joi';
import { recordSchema } from '../schemas/schemas.js';

// function serializeJoiSchema(joiSchema) {
//     const jsonSchema = {};

//     // Iterate over each key in the Joi schema
//     for (const key of Object.keys(joiSchema.describe().keys)) {
//         const field = joiSchema.describe().keys[key];
//         jsonSchema[key] = {
//             type: field.type,
//             required: field.flags?.presence === 'required',
//         };
//     }

//     return jsonSchema;
// }

function serializeJoiSchema(joiSchema) {
    const schemaDescription = joiSchema.describe();

    function serialize(description) {
        // Base case for non-object types
        if (description.type !== 'object') {
            return {
                type: description.type,
                required: description.flags?.presence === 'required',
                // Include additional properties based on your needs
            };
        }

        // Recursive case for objects
        const jsonSchema = {};
        if (description.type === 'object' && description.keys) {
            for (const key in description.keys) {
                jsonSchema[key] = serialize(description.keys[key]);
            }
        }

        return jsonSchema;
    }

    return serialize(schemaDescription);
}


export { serializeJoiSchema };