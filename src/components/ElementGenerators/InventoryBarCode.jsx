import { TextField } from "@mui/material";
import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import useDebouncedWatch from "../../hooks/useDebouncedWatch";
import request from "../../utils/request";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/alert/alert.thunk";

const InventoryBarCode = ({
  control,
  name = "",
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  disabled,
  field,
  reset,
  ...props
}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { id } = useParams();
  const [elmValue, setElmValue] = useState("");
  const time = useRef();
  useDebouncedWatch(
    () => {
      if (elmValue.length > 6) {
        request
          .get(`/${field.attributes?.request_url}/${id}`, {
            params: { imeiOrBarcode: elmValue },
          })
          .then((res) => {
            if (res === "Updated successfully!") {
              dispatch(showAlert("Успешно Обновлено!", "success"));
              reset({[`${name}`]:""})
              queryClient.refetchQueries([
                "GET_OBJECT_LIST",
                field.attributes?.updated_table_slug,
              ]);
            }
          });
      }
    },
    [elmValue],
    300
  );

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
        <>
          <TextField
            size="medium"
            value={value}
            onChange={(e) => {
              const currentTime = new Date().getTime();

              if (currentTime - time.current > 50)
                onChange(
                  e.target.value.substring(value.length, e.target.value.length)
                );
              else {
                onChange(e.target.value);
              }
              setElmValue(e.target.value);
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
        </>
      )}
    ></Controller>
  );
};

export default InventoryBarCode;
