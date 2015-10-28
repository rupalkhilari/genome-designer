import mapValues from '../utils/mapValues';

function createSchemaField (field, description = '', additional) {

  delete field.required; //in case still here, created by createField()

  return Object.assign({},
    {description},
    additional,
    field
  );
}

export default class SchemaDefinition {
  constructor (fieldDefinitions) {

    this.fields = mapValues(fieldDefinitions,
      (fieldDescription, fieldName) => {
        return Object.assign({
          name : fieldName
        }, createSchemaField(...fieldDescription));
      }
    );
  }

  validate (schema) {
    //todo - check if schemaDefinition, validate it if so

    console.log(schema, this.fields);

    return Object.keys(this.fields).every(fieldName => {
      let schemaValue = schema[fieldName],
          validator = this.fields[fieldName].validate,
          isValid = validator(schemaValue);

      return isValid;
    });
  }
}