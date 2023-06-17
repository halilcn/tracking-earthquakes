import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/tr'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { getLanguage } from './localStorageActions'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.locale(getLanguage() || navigator.language || navigator.userLanguage)

export default dayjs
export const customDayjs = dayjs // TODO: it is necessary for jest test. we should find a better way to overcome this issue
