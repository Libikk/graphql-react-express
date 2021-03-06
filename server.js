const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const express = require("express");
const cors = require("cors");
const fetch = require('node-fetch');
const app = express();
const API_KEY = process.env.API_KEY || 'yyrMO7Qv3IbCG81yxhMBin9L9DGue4B0iUGNjWPl';
const { searchFoodAdapterData } = require('./src/adapters/searchFoodApiAdapter');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const schema = buildSchema(`
  type Food {
    id: Int!
    dataType: String
    publishedDate: String
    description: String
    marketCountry: String
    brandOwner: String
    foodCategory: String
  }

  type SearchFoods {
    foods: [Food]
    totalPages: Int!
    currentPage: Int!
  }

  enum SortDirectionEnum {
    ASC
    DESC
  }

  enum SortFieldEnum {
    dataType
    description
    publishedDate
    id
  }

  enum DataTypeFilterEnum {
    Branded
    Foundation
    Survey
    SRLegacy
  }

  input SortOrder {
    field: SortFieldEnum
    direction: SortDirectionEnum
  }

  input Filters {
    dataType: [DataTypeFilterEnum]
    brandOwner: String
  }

  type Query {
    searchFoods(sortOrder: SortOrder, query: String, filters: Filters): SearchFoods
  }
`);

const root = {
  searchFoods: async (arg) => {

    const sortFieldEnumMapping = {
      dataType: 'dataType.keyword',
      description: 'lowercaseDescription.keyword',
      publishedDate: 'publishedDate',
      id: 'fdcId',
    }

    const sortDirectionEnumMapping = {
      'ASC': 'asc',
      'DESC': 'desc'
    }

    const sortData = {
      "sortBy": sortFieldEnumMapping[arg.sortOrder?.field] || sortFieldEnumMapping.id,
      "sortOrder": sortDirectionEnumMapping[arg.sortOrder?.direction] || sortDirectionEnumMapping.ASC
    }

    const dataTypeEnumMapping = {
      Branded: 'Branded',
      Foundation: 'Foundation',
      Survey: 'Survey (FNDDS)',
      SRLegacy: 'SR Legacy',
    }

    const filters = {
      dataType: arg.filters?.dataType?.map(filterValue => dataTypeEnumMapping[filterValue]) || [],
      brandOwner: arg.filters.brandOwner
    }

    try {
      const body = {
        "query": arg.query,
        ...filters,
        ...sortData,
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
      }

      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}`, options);
      const data = await response.json();
      return searchFoodAdapterData(data);

    } catch (err) {
      console.error(err);
    }
  },
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');