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
    this.definitions = fieldDefinitions;
    this.fields = createFields(fieldDefinitions);
  }

  extend (childDefinitions) {
    return new SchemaDefinition(Object.assign({},
      this.definitions,
      childDefinitions
    ));
  }

  validate (schema = {}) {
    return Object.keys(this.fields).every(fieldName => {
      let schemaValue = schema[fieldName],
          field       = this.fields[fieldName],
          //need to bind field in case it's a schema
          validator   = field.validate.bind(field),
          //note - should not error using our validators. Might want to try-catch though, e.g. if we allow custom validator functions
          isValid     = validator(schemaValue);

      return isValid;
    });
  }

  describe () {
    return mapValues(this.fields, field => (field.description || field.typeDescription || ''))
  }
}

function createFields (fieldDefinitions) {
  return mapValues(fieldDefinitions,
    (fieldDefinition, fieldName) => {

      //note - assign to field to maintain prototype, i.e. validate() function if instanceof SchemaDefinition
      return Object.assign(
        createSchemaField(...fieldDefinition),
        {name: fieldName}
      );
    }
  );
}