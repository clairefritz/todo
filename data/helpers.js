import {
  GraphQLInputObjectType,
  GraphQLScalarType,
  GraphQLEnumType
} from 'graphql';


// To use existing types as input types for variations, we need to convert them to GraphQL input Types
// https://github.com/graphql/graphql-js/issues/312

function createInputObject(type) {
  return new GraphQLInputObjectType({
    name: type.name + 'Input',
    fields: ()=> {
      let todoTypeFields = type.getFields();
      let inputObjectFields = {};
      Object.keys(todoTypeFields).forEach((key, index)=> inputObjectFields[key] = convertInputObjectField(todoTypeFields[key]));
      return inputObjectFields;
    }
  });
}

function convertInputObjectField(field) {
  let fieldType = field.type;
  const wrappers = [];

  while (fieldType.ofType) {
    wrappers.unshift(fieldType.constructor);
    fieldType = fieldType.ofType;
  }

  if (!(fieldType instanceof GraphQLInputObjectType ||
    fieldType instanceof GraphQLScalarType ||
    fieldType instanceof GraphQLEnumType)) {
    fieldType = fieldType.getInterfaces().includes(NodeInterface) ? ID : createInputObject(fieldType)
  }

  fieldType = wrappers.reduce((type, Wrapper) => new Wrapper(type), fieldType);
  return { type: fieldType };
}

module.exports = {
  createInputObject: createInputObject
};
