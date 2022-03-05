import { useEffect, useState } from "react";

const filters = [
  {

    // todo brandowner can only be singular value :<
    key: 'brandOwner',
    name: 'Brand Owner',
    options: [
      { value: 'nestle', label: 'Nestle' },
      { value: 'coca-cola', label: 'Coca-Cola' },
      { value: 'danone', label: 'Danone' },
      { value: 'pepsi', label: 'Pepsi' },
      { value: 'CHILI BEAK', label: 'CHILI BEAK' },
      { value: 'Kar Nut Products Company', label: `Kar Nut Products Company` },
    ],
  },
  {
    key: 'dataType',
    name: 'Data Type',
    options: [
      { value: 'Branded', label: 'Branded' },
      { value: 'Foundation', label: 'Foundation' },
      { value: 'Survey', label: 'Survey (FNDDS)' },
      { value: 'SRLegacy', label: 'SR Legacy' },
    ]
  }
]

const Filters = ({ onFiltersChanged }) => {
   const [activeFilters, setFilters] = useState([])

  const onChecked = (changedFilterValue) => {
    const isActive = activeFilters.some(filter => changedFilterValue === filter);
    if (isActive) setFilters(prevState => prevState.filter(filterVal => changedFilterValue !== filterVal))
    else setFilters(prevState => [...prevState, changedFilterValue])
  }

  useEffect(() => {
    const getKeyRelatedFilters = (filterKey) => {
      const filterKeyOptions = filters.find(filter => filter.key === filterKey);
      return filterKeyOptions.options.reduce((acc, filterOption) => activeFilters.includes(filterOption.value) ? [...acc, filterOption.value] : acc, [])
    }

    onFiltersChanged({
      dataType: getKeyRelatedFilters('dataType'),
      brandOwner: getKeyRelatedFilters('brandOwner')
    })
  },[activeFilters])

  return (
    <div className="bg-white">
      <h2 className="text-lg ml-10 mt-10">Filters</h2>
      <div>
        <div className="pt-12 px-10 flex">
          <aside>
            <div className="hidden lg:block">
              <form className="divide-y divide-gray-200 space-y-10">
                {filters.map((section, sectionIdx) => (
                  <div key={section.name} className={sectionIdx === 0 ? null : 'pt-10'}>
                    <fieldset>
                      <legend className="block text-sm font-medium text-gray-900">{section.name}</legend>
                      <div className="pt-6 space-y-3">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`${section.key}-${optionIdx}`}
                              name={`${section.key}`}
                              defaultValue={option.value}
                              type="checkbox"
                              checked={activeFilters.includes(option.value)}
                              onChange={() => onChecked(option.value)}
                              className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                ))}
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
export default Filters;
