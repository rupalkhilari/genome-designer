import mapValues from '../utils/mapValues';

function createSchemaField (field, description = '', additional) {

  delete field.required; //in case still here, created by createField()

  //note - assign to field to maintain prototype, i.e. validate() function if instanceof SchemaDefinition
  return Object.assign(field,
    {description},
    additional
  );
}

export default class SchemaDefinition {
  constructor (fieldDefinitions) {

    this.fields = mapValues(fieldDefinitions,
      (fieldDefinition, fieldName) => {

        //note - assign to field to maintain prototype, i.e. validate() function if instanceof SchemaDefinition
        return Object.assign(
          createSchemaField(...fieldDefinition),
          {name: fieldName}
        );
      }
    );
  }

  validate (schema = {}) {
    return Object.keys(this.fields).every(fieldName => {
      let schemaValue = schema[fieldName],
          field       = this.fields[fieldName],
          //need to bind field in case it's a schema
          validator   = field.validate.bind(field),
          isValid     = validator(schemaValue);

      console.log(field.name, schemaValue, isValid, field);

      return isValid;
    });
  }
}