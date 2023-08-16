import i18n from '../i18n'

const getQuerySelector = id => document.querySelector(`#${id}`)

export default [
  {
    title: i18n.t('Welcome'),
    intro: i18n.t('Interactive earthquake map you can see live/past earthquakes. '),
  },
  {
    title: i18n.t('Animation'),
    element: getQuerySelector('animation-button'),
    intro: i18n.t('You can see the earthquakes between the dates you selected as animations piece by piece'),
  },
  {
    title: i18n.t('Past Earthquake'),
    element: getQuerySelector('past-earthquake-button'),
    intro: i18n.t('You can see earthquakes that are in between the dates you want'),
  },
  {
    title: i18n.t('Filters'),
    element: getQuerySelector('filters-button'),
    intro: i18n.t('You can filter the earthquakes with your needs such as mag, depth'),
  },
  {
    title: i18n.t('Settings'),
    element: getQuerySelector('settings-button'),
    intro: i18n.t('You can change settings such as the type of map, notification and the status of features'),
  },
  {
    title: i18n.t('Search'),
    element: getQuerySelector('search-button'),
    intro: i18n.t('You can focus anywhere you want'),
  },
  {
    title: i18n.t('Earthquake List'),
    element: getQuerySelector('earthquake-list-button'),
    intro: i18n.t('You can see all earthquakes as a list'),
  },
  {
    title: i18n.t('Info'),
    element: getQuerySelector('info-popup-button'),
    intro: i18n.t('You can understand some colors/shapes by using this button'),
  },
]
