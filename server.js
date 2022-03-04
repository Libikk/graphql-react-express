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
  foodCategory: String!
}

type SearchFoods {
  foods: [Food]
  totalPages: Int!
  currentPage: Int!
}

type Query {
  searchFoods: SearchFoods
}
`);

// The root provides a resolver function for each API endpoint
const root = {
  searchFoods: async () => {
    try {
      const body = {"query": "Cheddar cheese", "dataType": ["Branded"], "sortBy": "fdcId", "sortOrder": "desc"}
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