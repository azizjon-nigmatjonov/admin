import { makeStyles } from "@mui/styles"
import { Controller } from "react-hook-form"
import CTimePicker from "../DatePickers/CTimePicker"

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}))

const HFTimePicker = ({
  control,
  className,
  isBlackBg,
  name,
  label,
  isFormEdit = false,
  width,
  inputProps,
  disabledHelperText,
  placeholder,
  ...props
}) => {
  const classes = useStyles()
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={className}>
          <CTimePicker
            isFormEdit={isFormEdit}
            classes={classes}
            isBlackBg={isBlackBg}
            value={value}
            onChange={onChange}
          />
        </div>
      )}
    ></Controller>
  )
}

export default HFTimePicker
