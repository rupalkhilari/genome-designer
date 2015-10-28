export function schemaField (field, description = '', additional) {

  delete field.required; //in case still here, created by createField()

  console.log(field);

  return Object.assign({},
    { description },
    additional,
    field
  );
}

export class schemaDefinition {
  constructor(fieldDefinitions) {

  }

  validate () {
    //todo - check if schemaDefinition, validate it if so
  }
}