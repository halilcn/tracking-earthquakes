import { Box, TextField } from '@mui/material'
import { useSelector } from 'react-redux'
import { FixedSizeList } from 'react-window'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BsListUl } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { TbChevronsLeft } from 'react-icons/tb'
import getEarthquakes from '../../hooks/getEarthquakes'
import EarthquakeItem from './earthquake-item'
import NewCustomPoint from './new-custom-point'
import { isMobile } from '../../utils'

import './index.scss'

const EarthquakeList = () => {
  const [textFilter, setTextFilter] = useState('')
  const [listHeight, setListHeight] = useState(0)
  const [earthquakeListEnable, setEarthquakeListEnable] = useState(false)

  const isActiveCustomPointSelection = useSelector(state => state.earthquake.isActiveCustomPointSelection)
  const earthquakes = getEarthquakes().filter(earthquake =>
    earthquake.properties.location_properties.epiCenter.name?.toLowerCase().includes(textFilter.toLowerCase())
  )

  const handleEarthquakeListEnable = status => setEarthquakeListEnable(status)

  useEffect(() => {
    const earthquakeListHeight = document.getElementsByClassName('earthquake-list__list-container')[0]?.offsetHeight
    setListHeight(earthquakeListHeight)
  }, [])

  const handleChangeTextFilter = e => setTextFilter(e.target.value)

  const boxProps = {
    sx: { width: '100%', height: '100%', bgcolor: 'transparent', color: 'white' },
  }

  const textFieldProps = {
    label: 'Şehir',
    variant: 'standard',
    sx: {
      input: {
        color: 'white',
      },
      label: {
        color: 'white',
      },
      width: '100%',
    },
    onChange: handleChangeTextFilter,
  }

  const fixedSizeListProps = {
    height: listHeight,
    width: '100%',
    itemSize: 85,
    itemCount: earthquakes.length,
    overscanCount: 5,
    className: 'earthquake-list__list',
  }

  const listActiveButtonProps = {
    className: 'earthquake-list-active-button',
    animate: earthquakeListEnable ? 'closed' : 'open',
    variants: {
      open: { opacity: 1, x: 0 },
      closed: { opacity: 0, x: '-100%' },
    },
    transition: { duration: 0.6 },
    onClick: () => handleEarthquakeListEnable(true),
  }

  const earthquakeListProps = {
    className: 'earthquake-list',
    animate: earthquakeListEnable ? 'open' : 'closed',
    variants: {
      open: { opacity: 1, left: 0 },
      closed: { opacity: 0, left: '-100%' },
    },
    transition: { duration: 0.6 },
  }

  /*
    <div onClick={() => handleEarthquakeListEnable(false)} className="earthquake-list__mobile-close-list-btn">
              <IoMdClose />
            </div>
  */

  //{...(!isMobile() && !earthquakeListEnable && { style: { right: '400' } })}

  return (
    <>
      <motion.div {...listActiveButtonProps} onClick={() => handleEarthquakeListEnable(true)}>
        <BsListUl size={30} />
      </motion.div>
      <motion.div {...earthquakeListProps}>
        {isActiveCustomPointSelection && <NewCustomPoint />}
        {!isActiveCustomPointSelection && (
          <>
            <div onClick={() => handleEarthquakeListEnable(true)} className="earthquake-list__mobile-icon">
              <BsListUl />
            </div>
            <div onClick={() => handleEarthquakeListEnable(false)} className="earthquake-list__hide-button">
              <TbChevronsLeft />
            </div>
            <div className="earthquake-list__container" {...(isMobile() && !earthquakeListEnable && { style: { visibility: 'hidden' } })}>
              <div className="earthquake-list__filter-text">
                <TextField {...textFieldProps} />
              </div>
              {earthquakes.length > 0 ? (
                <div className="earthquake-list__list-container">
                  <Box {...boxProps}>
                    <FixedSizeList {...fixedSizeListProps}>
                      {({ index, style }) => (
                        <EarthquakeItem
                          handleEarthquakeListEnable={handleEarthquakeListEnable}
                          earthquake={earthquakes[index]}
                          index={index}
                          style={style}
                        />
                      )}
                    </FixedSizeList>
                  </Box>
                </div>
              ) : (
                <div className="earthquake-list__no-earthquake-warning">Hiç deprem bulunamadı...</div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </>
  )
}

export default EarthquakeList
