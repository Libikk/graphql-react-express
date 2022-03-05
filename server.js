const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const express = require("express");
const cors = require("cors");
const fetch = require('node-fetch');
const app = express();
const API_KEY = 'yyrMO7Qv3IbCG81yxhMBin9L9DGue4B0iUGNjWPl'

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/test", (req, res, next) => {

});

const schema = buildSchema(`
type Food {
  id: Int!
  dataType: String!
  publishedDate: String!
  description: String!
  marketCountry: String!
  brandName: String
  foodCategory: String!
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

input SortOrder {
  field: SortFieldEnum
  direction: SortDirectionEnum
}

type Query {
  searchFoods(sortOrder: SortOrder, query: String): SearchFoods
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
      "sortBy": sortFieldEnumMapping[arg.sortOrder?.field] || 'fdcId',
      "sortOrder": sortDirectionEnumMapping[arg.sortOrder?.direction] || 'asc'
    }

    try {
      const body = {"query": arg.query, "dataType": ["Branded"], ...sortData }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
      }

      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}`, options);
      const data = await response.json();
      // console.log('data: ', data);
      return {
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        foods: data.foods.map(e => ({
          // add adapter
          id: e.fdcId,
          dataType: e.dataType,
          publishedDate: new Date(e.publishedDate).toISOString(),
          description: e.description,
          foodCategory: e.foodCategory,
          brandName: e.brandName,
          marketCountry: e.marketCountry
        }))
      }
    } catch (err) {
      console.log('🚀 ~ file: server.js ~ line 32 ~ hello: ~ err', err);
    }
    return 'Hello world!';
  },
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');