import './index.css';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import Filters from './components/Filters';
const SEARCH_FOOD_QUERY = gql`
query searchFoods($query: String, $filters: Filters, $sortOrder: SortOrder) {
  searchFoods(query: $query filters: $filters, sortOrder: $sortOrder) {
    totalPages
    foods {
      id
      dataType
      publishedDate
      description
      marketCountry
      brandOwner
      foodCategory
    }
    currentPage
  }
}
`;

const tableColumnKeys = [
  { key: 'id', label: 'Id', isSortable: true },
  { key: 'description', label: 'Description', isSortable: true },
  { key: 'marketCountry', label: 'Market Country' },
  { key: 'brandOwner', label: 'Brand Owner' },
  { key: 'dataType', label: 'Data Type', isSortable: true },
  { key: 'publishedDate', label: 'Published Date', isSortable: true },
]
export default function App() {

  const [queryInput, setQueryInput] = useState('')
  const [filters, setFilters] = useState({})

  const [sortOrder, setSortOrder] = useState({ field: null, direction: 'ASC' });

  const { loading, error, data } = useQuery(SEARCH_FOOD_QUERY, { variables: { query: queryInput, filters, sortOrder } });

  const triggerColumnSort = (headerKey) => {
    const getOppositeSortDirection = (currentDirection) => currentDirection === 'ASC' ? 'DESC' : 'ASC';
    setSortOrder((prevState) => ({ field: headerKey, direction: getOppositeSortDirection(prevState.direction) }));
  }

  const onHeaderClick = (headerKey) => {
    triggerColumnSort(headerKey);
  }

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div className='bg-gray-200'>
          <div className='p-20 flex'>
            <Filters onFiltersChanged={setFilters} />
            <div className="flex flex-col px-10">
              <div className='bg-white py-5'>
                <div className="w-full sm:max-w-xs px-10 flex items-center">
                  <label htmlFor="query" className='font-medium mr-4'>
                    Query
                  </label>
                  <input
                    autoFocus
                    type="query"
                    name="query"
                    id="query"
                    value={queryInput}
                    onChange={({ target }) => setQueryInput(target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 border rounded-md  px-4 py-2"
                    placeholder="Type food query"
                    />
                </div>
              </div>
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {tableColumnKeys.map(colData =>
                          <th
                            key={colData.key}
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${colData.isSortable && 'cursor-pointer hover:opacity-75'}`}
                            onClick={() => colData.isSortable && onHeaderClick(colData.key)}
                            >
                              <div className='flex'>
                                <span>{colData.label}</span>
                                {colData.isSortable && <img alt='sort-icon' src="https://img.icons8.com/ios-glyphs/30/000000/sort.png" className='w-3 h-3' />}
                              </div>
                          </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data?.searchFoods.foods.map((food) => (
                          <tr key={food.id}>
                            {tableColumnKeys.map(colData => <td key={colData.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{food[colData.key]}</td>)}
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