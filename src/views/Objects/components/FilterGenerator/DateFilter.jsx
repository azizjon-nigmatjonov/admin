import CRangePickerNew from "../../../../components/DatePickers/CRangePickerNew"

const DateFilter = ({ onChange, value, placeholder }) => {
  return (
    <>
      <CRangePickerNew value={value} onChange={onChange} placeholder={placeholder} />
    </>
  )
}

export default DateFilter
