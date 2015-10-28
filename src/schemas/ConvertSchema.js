import * as types from './validators';
import * as schema from './schema';

import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat
} from 'graphql/type';



var SchemaMap = {
	'final': { //final object to be returned
		graphql: (json) => new GraphQLObjectType(json),
		validator: (json) => new type.shape(json)
	},
	'version': {
		graphql: () => GraphQLString,
		validator: () => types.version().isRequired
	},
	'id': {
		graphql: () => GraphQLString,
		validator: () => types.id().isRequired
	},
	'string': {
		graphql: () => GraphQLString,
		validator: () => types.string()
	},
	'array' : {
		graphql: (typ) => new GraphQLList(typ),
		validator: (typ) => types.arrayOf(types.shape(typ))
	},
	'hashmap' : {
		graphql: () => new GraphQLObjectType({
								name: 'hash',
								fields: () => ({})
							}),
		validator: () => types.object()
	},
	'integer' : {
		graphql: () => GraphQLInt,
		validator: () => types.number()
	},
	'sequence' : {
		graphql: () => GraphQLString,
		validator: () => types.sequence()
	}
}

function ConvertSchema(genericSchema, specificType) {
	var convertedSchema = {};
	var val;
	var match, typ1, typ2;
	var arrayRegexp = new RegExp("(\\S+)<(\\S+)>");

	if (SchemaMap.hasOwnProperty(genericSchema)) {
		return SchemaMap[genericSchema][specificType].call();
	}

	for (var key in genericSchema) {
		val = genericSchema[key];
		if (typeof(val)==='object') { //recurse
			val = ConvertSchema(val, specificType);
		} else {
			if (SchemaMap.hasOwnProperty(val)) {
				val = SchemaMap[val][specificType].call();
			} else {
				match = arrayRegexp.exec(val);
				if (match && match.length > 2) {
		            typ1 = match[1];
		            typ2 = match[2];
		            if (SchemaMap.hasOwnProperty(typ1)) {
		            	var f = ConvertSchema(typ2,specificType);
		            	val = SchemaMap[typ1][specificType].call(SchemaMap, GraphQLString);
		            }
		          }
			}
		}
		convertedSchema[key] = val;	
	}
	var finalfunc = SchemaMap['final'][specificType];
	return finalfunc.call(SchemaMap, convertedSchema);
}

var m;
m = ConvertSchema(schema.Annotation,'graphql');
console.log(m);

m = ConvertSchema(schema.Annotation,'validator');
console.log(m);


export default ConvertSchema;
