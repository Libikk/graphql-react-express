import './index.css';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
const SEARCH_FOOD_QUERY = gql`
query searchFoods($query: String) {
  searchFoods(query: $query sortOrder:{
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

  const [queryInput, setQueryInput] = useState('')
  const { loading, error, data } = useQuery(SEARCH_FOOD_QUERY, { variables: { query: queryInput } });


  // if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <div className='bg-gray-200'>
          <div className='p-20'>
            <form className="mt-5 sm:flex sm:items-center px-10" onSubmit={(event) => event.preventDefault()}>
              <div className="w-full sm:max-w-xs">
                <label htmlFor="query" className="sr-only">
                  Query
                </label>
                <input
                  autoFocus
                  type="query"
                  name="query"
                  id="query"
                  value={queryInput}
                  onChange={({ target }) => setQueryInput(target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md  px-4 py-2"
                  placeholder="Type query"
                  />
              </div>
              <button
                type="submit"
                className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                Save
              </button>
            </form>
            <div className="flex flex-col p-10">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                            Id
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                            Market Country
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                            Brand
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                            Published Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data?.searchFoods.foods.map((food) => (
                          <tr key={food.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{food.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{food.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{food.marketCountry}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{food.brandName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{food.publishedDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
}