import DatePicker from "react-multi-date-picker";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import { InputAdornment, TextField } from "@mui/material";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { Today } from "@mui/icons-material";
import { locale } from "./Plugins/locale";
import "./style2.scss";
import CustomNavButton from "./Plugins/CustomNavButton";

const CDatePicker = ({
  value,
  onChange,
  disabled,
  isBlackBg,
  isFormEdit,
  classes,
  placeholder,
}) => {
  return (
    <DatePicker
      disabled={disabled}
      render={(value, openCalendar, handleChange) => {
        return (
          <TextField
            placeholder={placeholder}
            value={value}
            onClick={openCalendar}
            onChange={handleChange}
            size="small"
            fullWidth
            autoComplete="off"
            InputProps={{
              readOnly: disabled,
              classes: {
                input: isBlackBg ? classes.input : "",
              },
              style: disabled
                ? {
                    background: "#c0c0c039",
                  }
                : {
                    background: isBlackBg ? "#2A2D34" : "",
                    color: isBlackBg ? "#fff" : "",
                  },
              endAdornment: (
                <InputAdornment position="end">
                  <Today style={{ color: isBlackBg ? "#fff" : "" }} />
                </InputAdornment>
              ),
            }}
            className={isFormEdit ? "custom_textfield" : ""}
          />
        );
      }}
      renderButton={<CustomNavButton />}
      // animations={[opacity()]}
      plugins={[weekends()]}
      weekStartDayIndex={1}
      portal
      locale={locale}
      className="datePicker"
      format="DD.MM.YYYY"
      value={new Date(value) || ""}
      onChange={(val) => onChange(val ? new Date(val) : "")}
    />
  );
};

export default CDatePicker;
