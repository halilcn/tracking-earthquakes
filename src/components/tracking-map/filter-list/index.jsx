import { BsCalendarDate } from 'react-icons/bs'
import { BiFilterAlt } from 'react-icons/bi'
import FilterArchive from './filter-archive'

import './index.scss'

const FilterList = () => {
  return (
    <div className="filter">
      <div className="filter__list">
        <div className="filter__item">
          <BsCalendarDate className="filter__icon" />
        </div>
        <div className="filter__item">
          <BiFilterAlt className="filter__icon" />
        </div>
      </div>
      <div className="filter__content">
        <div className="filter__title">Geçmiş Depremler</div>
        <div className="filter__content-container">
          <FilterArchive />
        </div>
      </div>
    </div>
  )
}

export default FilterList
