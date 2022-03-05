import { useEffect, useState } from "react";

const brandOwnerFilterConfig = {
  key: 'brandOwner',
  name: 'Brand Owner',
  options: [
    { value: 'nestle', label: 'Nestle' },
    { value: 'Whole Foods Market', label: 'Whole Foods Market' },
    { value: 'danone', label: 'Danone' },
    { value: 'pepsi', label: 'Pepsi' },
    { value: 'Riviana Foods', label: 'Riviana Foods' },
    { value: 'FRESH & EASY', label: `FRESH & EASY` },
  ],
}
const dataTypeFilterConfig = {
  key: 'dataType',
  name: 'Data Type',
  options: [
    { value: 'Branded', label: 'Branded' },
    { value: 'Foundation', label: 'Foundation' },
    { value: 'Survey', label: 'Survey (FNDDS)' },
    { value: 'SRLegacy', label: 'SR Legacy' },
  ]
}
const filters = [brandOwnerFilterConfig, dataTypeFilterConfig]

const Filters = ({ onFiltersChanged }) => {
   const [dataTypeFilters, setDataTypeFilter] = useState([]);
   const [brandOwnerFilter, setBrandOwnerFilter] = useState(null);

  const onFilterChange = ({ filterKey, filterValue }) => {
    switch(filterKey) {
      case 'dataType':
        const isActive = dataTypeFilters.includes(filterValue);
        if (isActive) setDataTypeFilter(prevState => prevState.filter(filterVal => filterValue !== filterVal))
        else setDataTypeFilter(prevState => [...prevState, filterValue])
        break;

        case 'brandOwner':
          const isAlreadySet = brandOwnerFilter === filterValue;
          if (isAlreadySet)  return setBrandOwnerFilter(null)
          setBrandOwnerFilter(filterValue)
        break;
      default:
        throw new Error('Invalid error')
    }
  }

  const isChecked = ({ filterValue, filterKey }) => {
    if (filterKey === 'dataType') return dataTypeFilters.includes(filterValue);
    if (filterKey === 'brandOwner') return brandOwnerFilter === filterValue;
  }

  useEffect(() => {
    onFiltersChanged({
      dataType: dataTypeFilterConfig.options.reduce((acc, filterOption) => dataTypeFilters.includes(filterOption.value) ? [...acc, filterOption.value] : acc, []),
      brandOwner: brandOwnerFilter
    })
  }, [brandOwnerFilter, dataTypeFilters])

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
                              checked={isChecked({ filterKey: section.key, filterValue: option.value })}
                              onChange={() => onFilterChange({ filterKey: section.key, filterValue: option.value })}
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
