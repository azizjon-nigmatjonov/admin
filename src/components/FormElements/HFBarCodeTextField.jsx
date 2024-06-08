import { TextField } from "@mui/material";
import { useRef } from "react";
import { Controller } from "react-hook-form";

const HFBarCodeTextField = ({
  control,
  name = "",
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  disabled,
  ...props
}) => {
  const time = useRef();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          size="small"
          value={value}
          onChange={(e) => {
            const currentTime = new Date().getTime();

            if (currentTime - time.current > 50)
              onChange(
                e.target.value.substring(value.length, e.target.value.length)
              );
            else onChange(e.target.value);

            time.current = currentTime;
          }}
          name={name}
          error={error}
          fullWidth={fullWidth}
          InputProps={{
            readOnly: disabled,
            style: disabled
              ? {
                  background: "#c0c0c039",
                }
              : {},
          }}
          helperText={!disabledHelperText && error?.message}
          {...props}
        />
      )}
    ></Controller>
  );
};

export default HFBarCodeTextField;
