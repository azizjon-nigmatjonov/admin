import { Switch } from "@mui/material"
import { useId } from "react"
import { Controller } from "react-hook-form"

const HFSwitch = ({
  control,
  name,
  label,
  disabledHelperText,
  isBlackBg,
  onChange = () => {},
  labelProps,
  ...props
}) => {
  const id = useId()

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={false}
      render={({
        field: { onChange: formOnChange, value },
        fieldState: { error },
      }) => {
        return (
          <div
            className={!disabledHelperText ? "mb-1" : ""}
            style={{
              background: isBlackBg ? "#2A2D34" : "",
              color: isBlackBg ? "#fff" : "",
            }}
          >
            <Switch
              id={`switch-${id}`}
              {...props}
              checked={value ?? false}
              onChange={(e, val) => {
                formOnChange(val)
                onChange(val)
              }}
            />
            <label htmlFor={`switch-${id}`} {...labelProps}>
              {label}
            </label>
          </div>
        )
      }}
    ></Controller>
  )
}

export default HFSwitch
