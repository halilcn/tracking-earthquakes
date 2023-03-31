import { BsCalendarDate } from 'react-icons/bs'
import { BiFilterAlt } from 'react-icons/bi'
import FilterArchive from './filter-archive'
import LoadingData from './loading-data'

import './index.scss'

const FilterList = () => {
  return (
    <div className="filter">
      <div className="filter__list">
        <div className="filter__item">
          <LoadingData />
        </div>
        <div className="filter__item filter__item--icon">
          <BsCalendarDate className="filter__icon" />
        </div>
        <div className="filter__item filter__item--icon">
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
