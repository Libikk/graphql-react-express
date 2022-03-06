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

  const hasNoResults = (!loading && data) && !data.searchFoods.foods.length;

  const triggerColumnSort = (headerKey) => {
    const getOppositeSortDirection = (currentDirection) => currentDirection === 'ASC' ? 'DESC' : 'ASC';
    setSortOrder((prevState) => ({ field: headerKey, direction: getOppositeSortDirection(prevState.direction) }));
  }

  const onHeaderClick = (headerKey) => {
    triggerColumnSort(headerKey);
  }

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
                              <div className='flex items-center'>
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
                        {(loading || hasNoResults) &&
                          <tr>
                            <td colSpan={tableColumnKeys.length} className="w-full h-96">
                              <div className="flex justify-center items-center">

                                {hasNoResults && <div className='font-medium text-xl'>No results found</div>}

                                {loading && <svg role="status" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>}

                              </div>
                            </td>
                        </tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
}