import {
  createArrayPropertyDefinition,
  createMethodDefinition,
  createQueryDefinition,
  createScalarDefinition,
  createScalarPropertyDefinition,
  createArrayDefinition,
  createObjectPropertyDefinition,
  createObjectDefinition,
  TypeInfo,
  createEnumPropertyDefinition,
  createImportedQueryDefinition,
  createImportedObjectDefinition,
  createImportedEnumDefinition
} from "@web3api/schema-parse";

export const typeInfo: TypeInfo = {
  environment: {
    query: {
      sanitized: {
        ...createObjectDefinition({ type: "QueryEnv" }),
        properties: [
          createScalarPropertyDefinition({ name: "bar", type: "Bytes", required: false }),
          createScalarPropertyDefinition({ name: "foo", type: "String", required: true }),
        ],
      }
    },
    mutation: {},
  },
  objectTypes: [
    {
      ...createObjectDefinition({ type: "CustomQueryType" }),
      properties: [
        createScalarPropertyDefinition({ name: "str", type: "String", required: true }),
        createScalarPropertyDefinition({ name: "optStr", type: "String", required: false }),
        createScalarPropertyDefinition({ name: "u", type: "UInt", required: true }),
        createScalarPropertyDefinition({ name: "optU", type: "UInt", required: false }),
        createScalarPropertyDefinition({ name: "u8", type: "UInt8", required: true }),
        createScalarPropertyDefinition({ name: "u64", type: "UInt64", required: true }),
        createScalarPropertyDefinition({ name: "i", type: "Int", required: true }),
        createScalarPropertyDefinition({ name: "i8", type: "Int8", required: true }),
        createScalarPropertyDefinition({ name: "i64", type: "Int64", required: true }),
        createScalarPropertyDefinition({ name: "bytes", type: "Bytes", required: true }),
        createArrayPropertyDefinition({
          name: "uArray",
          type: "[UInt]",
          required: true,
          item: createScalarDefinition({ name: "uArray", type: "UInt", required: true })
        }),
        createArrayPropertyDefinition({
          name: "uOptArray",
          type: "[UInt]",
          required: false,
          item: createScalarDefinition({ name: "uOptArray", type: "UInt", required: true })
        }),
        createArrayPropertyDefinition({
          name: "optStrOptArray",
          type: "[String]",
          required: false,
          item: createScalarDefinition({ name: "optStrOptArray", type: "String", required: false })
        }),
        createArrayPropertyDefinition({
          name: "crazyArray",
          type: "[[[[UInt64]]]]",
          required: false,
          item: createArrayDefinition({
            name: "crazyArray",
            type: "[[[UInt64]]]",
            required: false,
            item: createArrayDefinition({
              name: "crazyArray",
              type: "[[UInt64]]",
              required: true,
              item: createArrayDefinition({
                name: "crazyArray",
                type: "[UInt64]",
                required: false,
                item: createScalarDefinition({ name: "crazyArray", type: "UInt64", required: true })
              })
            })
          })
        }),
        createObjectPropertyDefinition({
          name: "commonType",
          type: "CommonType",
          required: true
        }),
        createObjectPropertyDefinition({
          name: "customType",
          type: "Namespace_CustomType",
          required: true,
        })
      ],
    },
    {
      ...createObjectDefinition({ type: "AnotherQueryType" }),
      properties: [createScalarPropertyDefinition({ name: "prop", type: "String" })],
    },
    {
      ...createObjectDefinition({ type: "CommonType" }),
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "UInt8", required: true }),
        createObjectPropertyDefinition({ name: "nestedObject", type: "NestedType", required: true }),
        createArrayPropertyDefinition({
          name: "objectArray",
          type: "[[ArrayObject]]",
          required: true,
          item: createArrayDefinition({
            name: "objectArray",
            type: "[ArrayObject]",
            required: false,
            item: createObjectDefinition({
              name: "objectArray",
              type: "ArrayObject",
              required: false
            })
          })
        })
      ],
    },
    {
      ...createObjectDefinition({
        type: "NestedType"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "String", required: true }),
      ],
    },
    {
      ...createObjectDefinition({
        type: "ArrayObject"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "prop", type: "String", required: true }),
      ],
    },
    {
      ...createObjectDefinition({ type: "QueryEnv" }),
      properties: [
        createScalarPropertyDefinition({ name: "bar", type: "Bytes", required: false }),
        createScalarPropertyDefinition({ name: "foo", type: "String", required: true }),
      ],
    }
  ],
  queryTypes: [
    {
      ...createQueryDefinition({ type: "Query" }),
      imports: [
        { type: "Namespace_Query" },
        { type: "Namespace_CustomType" },
        { type: "Namespace_ObjectType" },
        { type: "Namespace_NestedObjectType" },
        { type: "Namespace_Imported_NestedObjectType" },
        { type: "Namespace_Imported_ObjectType" },
        { type: "Namespace_CustomEnum" },
        { type: "Namespace_Imported_Enum" },
      ],
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
            name: "method1",
            return: createScalarPropertyDefinition({
              name: "method1",
              type: "String",
              required: true
            })
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "str",
              required: true,
              type: "String"
            }),
            createScalarPropertyDefinition({
              name: "optStr",
              required: false,
              type: "String"
            }),
            createScalarPropertyDefinition({
              name: "u",
              required: true,
              type: "UInt"
            }),
            createArrayPropertyDefinition({
              name: "uArrayArray",
              required: true,
              type: "[[UInt]]",
              item: createArrayDefinition({
                name: "uArrayArray",
                required: false,
                type: "[UInt]",
                item: createScalarDefinition({
                  name: "uArrayArray",
                  required: false,
                  type: "UInt"
                })
              })
            })
          ]
        },
        {
          ...createMethodDefinition({
            type: "query",
            name: "method2",
            return: createArrayPropertyDefinition({
              name: "method2",
              type: "[Int64]",
              required: true,
              item: createScalarDefinition({
                name: "method2",
                required: true,
                type: "Int64"
              })
            })
          }),
          arguments: [
            createArrayPropertyDefinition({
              name: "arg",
              required: true,
              type: "[String]",
              item: createScalarDefinition({
                name: "arg",
                required: true,
                type: "String"
              })
            })
          ]
        }
      ]
    }
  ],
  enumTypes: [],
  importedObjectTypes: [
    {
      ...createImportedObjectDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "CustomType",
        type: "Namespace_CustomType"
      }),
      properties: [
        createScalarPropertyDefinition({ name: "str", type: "String", required: true }),
        createScalarPropertyDefinition({ name: "optStr", type: "String", required: false }),
        createScalarPropertyDefinition({ name: "u", type: "UInt", required: true }),
        createScalarPropertyDefinition({ name: "optU", type: "UInt", required: false }),
        createScalarPropertyDefinition({ name: "u8", type: "UInt8", required: true }),
        createScalarPropertyDefinition({ name: "u16", type: "UInt16", required: true }),
        createScalarPropertyDefinition({ name: "u32", type: "UInt32", required: true }),
        createScalarPropertyDefinition({ name: "u64", type: "UInt64", required: true }),
        createScalarPropertyDefinition({ name: "i", type: "Int", required: true }),
        createScalarPropertyDefinition({ name: "i8", type: "Int8", required: true }),
        createScalarPropertyDefinition({ name: "i16", type: "Int16", required: true }),
        createScalarPropertyDefinition({ name: "i32", type: "Int32", required: true }),
        createScalarPropertyDefinition({ name: "i64", type: "Int64", required: true }),
        createScalarPropertyDefinition({ name: "bytes", type: "Bytes", required: true }),
        createArrayPropertyDefinition({
          name: "uArray",
          type: "[UInt]",
          required: true,
          item: createScalarDefinition({ name: "uArray", type: "UInt", required: true })
        }),
        createArrayPropertyDefinition({
          name: "uOptArray",
          type: "[UInt]",
          required: false,
          item: createScalarDefinition({ name: "uOptArray", type: "UInt", required: true })
        }),
        createArrayPropertyDefinition({
          name: "optUOptArray",
          type: "[UInt]",
          required: false,
          item: createScalarDefinition({ name: "optUOptArray", type: "UInt", required: false })
        }),
        createArrayPropertyDefinition({
          name: "optStrOptArray",
          type: "[String]",
          required: false,
          item: createScalarDefinition({ name: "optStrOptArray", type: "String", required: false })
        }),
        createArrayPropertyDefinition({
          name: "uArrayArray",
          type: "[[UInt]]",
          required: true,
          item: createArrayDefinition({
            name: "uArrayArray",
            type: "[UInt]",
            required: true,
            item: createScalarDefinition({ name: "uArrayArray", type: "UInt", required: true })
          })
        }),
        createArrayPropertyDefinition({
          name: "uOptArrayOptArray",
          type: "[[UInt64]]",
          required: true,
          item: createArrayDefinition({
            name: "uOptArrayOptArray",
            type: "[UInt64]",
            required: false,
            item: createScalarDefinition({ name: "uOptArrayOptArray", type: "UInt64", required: false })
          })
        }),
        createArrayPropertyDefinition({
          name: "uArrayOptArrayArray",
          type: "[[[UInt64]]]",
          required: true,
          item: createArrayDefinition({
            name: "uArrayOptArrayArray",
            type: "[[UInt64]]",
            required: false,
            item: createArrayDefinition({
              name: "uArrayOptArrayArray",
              type: "[UInt64]",
              required: true,
              item: createScalarDefinition({ name: "uArrayOptArrayArray", type: "UInt64", required: true })
            })
          })
        }),
        createArrayPropertyDefinition({
          name: "crazyArray",
          type: "[[[[UInt64]]]]",
          required: false,
          item: createArrayDefinition({
            name: "crazyArray",
            type: "[[[UInt64]]]",
            required: false,
            item: createArrayDefinition({
              name: "crazyArray",
              type: "[[UInt64]]",
              required: true,
              item: createArrayDefinition({
                name: "crazyArray",
                type: "[UInt64]",
                required: false,
                item: createScalarDefinition({ name: "crazyArray", type: "UInt64", required: true })
              })
            })
          })
        }),
        createObjectPropertyDefinition({
          name: "object",
          type: "Namespace_ObjectType",
          required: true
        }),
        createObjectPropertyDefinition({
          name: "optObject",
          type: "Namespace_ObjectType",
          required: false
        }),
        createObjectPropertyDefinition({
          name: "nestedObject",
          type: "Namespace_NestedObjectType",
          required: true
        }),
        createObjectPropertyDefinition({
          name: "optNestedObject",
          type: "Namespace_NestedObjectType",
          required: false
        }),
        createArrayPropertyDefinition({
          name: "optNestedObjectArray",
          type: "[Namespace_NestedObjectType]",
          required: true,
          item: createObjectDefinition({
            name: "optNestedObjectArray",
            type: "Namespace_NestedObjectType",
            required: false
          }),
        }),
        createObjectPropertyDefinition({
          name: "importedNestedObject",
          type: "Namespace_Imported_NestedObjectType",
          required: true
        }),
        createArrayPropertyDefinition({
          name: "optImportedNestedObjectArray",
          type: "[Namespace_Imported_NestedObjectType]",
          required: true,
          item: createObjectDefinition({
            name: "optImportedNestedObjectArray",
            type: "Namespace_Imported_NestedObjectType",
            required: false
          }),
        }),
        createEnumPropertyDefinition({
          name: "enum",
          type: "Namespace_CustomEnum",
          required: true
        }),
        createEnumPropertyDefinition({
          name: "optEnum",
          type: "Namespace_CustomEnum",
          required: false
        }),
        createEnumPropertyDefinition({
          name: "importedEnum",
          type: "Namespace_Imported_Enum",
          required: true
        }),
        createEnumPropertyDefinition({
          name: "optImportedEnum",
          type: "Namespace_Imported_Enum",
          required: false
        }),
      ]
    },
    {
      ...createImportedObjectDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "ObjectType",
        type: "Namespace_ObjectType"
      }),
      properties: [createScalarPropertyDefinition({ name: "prop", type: "String", required: true })],
    },
    {
      ...createImportedObjectDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "NestedObjectType",
        type: "Namespace_NestedObjectType"
      }),
      properties: [createObjectPropertyDefinition({ name: "nestedObject", type: "Namespace_ObjectType", required: true })],
    },
    {
      ...createImportedObjectDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "Imported_NestedObjectType",
        type: "Namespace_Imported_NestedObjectType"
      }),
      properties: [createObjectPropertyDefinition({ name: "nestedObject", type: "Namespace_Imported_ObjectType", required: true })],
    },
    {
      ...createImportedObjectDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "Imported_ObjectType",
        type: "Namespace_Imported_ObjectType"
      }),
      properties: [createScalarPropertyDefinition({ name: "prop", type: "String", required: true })],
    },
  ],
  importedQueryTypes: [
    {
      ...createImportedQueryDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "Query",
        type: "Namespace_Query"
      }),
      methods: [
        {
          ...createMethodDefinition({
            type: "query",
            name: "method1",
            return: createScalarPropertyDefinition({
              name: "method1",
              type: "String",
              required: true
            })
          }),
          arguments: [
            createScalarPropertyDefinition({
              name: "str",
              required: true,
              type: "String"
            }),
            createScalarPropertyDefinition({
              name: "optStr",
              required: false,
              type: "String"
            }),
            createScalarPropertyDefinition({
              name: "u",
              required: true,
              type: "UInt"
            }),
            createScalarPropertyDefinition({
              name: "optU",
              required: false,
              type: "UInt"
            }),
            createArrayPropertyDefinition({
              name: "uArrayArray",
              required: true,
              type: "[[UInt]]",
              item: createArrayDefinition({
                name: "uArrayArray",
                required: false,
                type: "[UInt]",
                item: createScalarDefinition({
                  name: "uArrayArray",
                  required: false,
                  type: "UInt"
                })
              })
            })
          ]
        },
        {
          ...createMethodDefinition({
            type: "query",
            name: "method2",
            return: createArrayPropertyDefinition({
              name: "method2",
              type: "[Int64]",
              required: true,
              item: createScalarDefinition({
                name: "method2",
                required: true,
                type: "Int64"
              })
            })
          }),
          arguments: [
            createArrayPropertyDefinition({
              name: "arg",
              required: true,
              type: "[String]",
              item: createScalarDefinition({
                name: "arg",
                required: true,
                type: "String"
              })
            })
          ]
        }
      ]
    }
  ],
  importedEnumTypes: [
    {
      ...createImportedEnumDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "CustomEnum",
        type: "Namespace_CustomEnum",
        constants: [
          "STRING",
          "BYTES"
        ]
      })
    },
    {
      ...createImportedEnumDefinition({
        uri: "test.eth",
        namespace: "Namespace",
        nativeType: "Imported_Enum",
        type: "Namespace_Imported_Enum",
        constants: [
          "STRING",
          "BYTES"
        ]
      })
    }
  ],
}
