import {DATE_FORMAT} from '../types'
export default (date, date_format: DATE_FORMAT): string =>{
  if(date_format === DATE_FORMAT.DATE_HOUR) return new Date(date).toLocaleString()
  else if(date_format === DATE_FORMAT.DATE) return new Date(date).toLocaleString().split(",")[0]
  else{
    let dateMonth = new Date(date).toLocaleString('default', { month: 'short' })
    let dateYear = new Date(date).getFullYear()
    let dateDay = new Date(date).getDate()
    let formatDateWord = `${dateMonth} ${dateDay}, ${dateYear}`
    return formatDateWord
  }
}