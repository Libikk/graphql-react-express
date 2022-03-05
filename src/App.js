import './index.css';
import { gql, useQuery } from '@apollo/client';
const SEARCH_FOOD_QUERY = gql`
query {
  searchFoods(query: "pepsi" sortOrder:{
    field: id
    direction: ASC
  }) {
    totalPages
    foods {
      id
      dataType
      publishedDate
      description
      marketCountry
      brandName
      foodCategory
    }
    currentPage
  }
}
`;
const classNames = (...classes)  => classes.filter(Boolean).join(' ')
export default function App() {

  const { loading, error, data } = useQuery(SEARCH_FOOD_QUERY);
  console.log('🚀 ~ file: App.js ~ line 29 ~ App ~ error', error);
  console.log('🚀 ~ file: App.js ~ line 29 ~ App ~ data', data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  // return data.rates.map(({ currency, rate }) => (
  //   <div key={currency}>
  //     <p>
  //       {currency}: {rate}
  //     </p>
  //   </div>
  // ));
  return <div>{data && JSON.stringify(data)}</div>
}