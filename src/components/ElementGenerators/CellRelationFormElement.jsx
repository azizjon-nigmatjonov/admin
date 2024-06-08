import { Autocomplete, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { get } from "@ngard/tiny-get";
import { useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel";
import IconGenerator from "../IconPicker/IconGenerator";
import styles from "./style.module.scss";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const CellRelationFormElement = ({
  isBlackBg,
  isFormEdit,
  control,
  name,
  disabled,
  placeholder,
  field,
  isLayout,
  disabledHelperText = false,
  setFormValue,
  index,
  defaultValue = null,
  required = false,
}) => {
  const classes = useStyles();

  if (!isLayout)
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{
          required: required ? "This is required field" : false,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <AutoCompleteElement
              disabled={disabled}
              isFormEdit={isFormEdit}
              placeholder={placeholder}
              isBlackBg={isBlackBg}
              value={value}
              classes={classes}
              name={name}
              setValue={onChange}
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              setFormValue={setFormValue}
              control={control}
              index={index}
            />
          );
        }}
      />
    );
};

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({
  field,
  value,
  isFormEdit,
  placeholder,
  tableSlug,
  name,
  disabled,
  classes,
  isBlackBg,
  setValue,
  index,
  control,
  error,
  disabledHelperText,
  setFormValue = () => {},
}) => {
  const { navigateToForm } = useTabRouter();

  const getOptionLabel = (option) => {
    return getRelationFieldTabsLabel(field, option);
  };

  const autoFilters = field?.attributes?.auto_filters;

  const autoFiltersFieldFroms = useMemo(() => {
    return autoFilters?.map((el) => `multi.${index}.${el.field_from}`) ?? [];
  }, [autoFilters, index]);

  const filtersHandler = useWatch({
    control,
    name: autoFiltersFieldFroms,
  });

  const autoFiltersValue = useMemo(() => {
    const result = {};
    filtersHandler?.forEach((value, index) => {
      const key = autoFilters?.[index]?.field_to;
      if (key) result[key] = value;
    });
    return result;
  }, [autoFilters, filtersHandler]);

  const { data: options } = useQuery(
    [
      "GET_OBJECT_LIST",
      tableSlug.includes("doctors_") ? "doctors" : tableSlug,
      autoFiltersValue,
    ],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: autoFiltersValue,
      });
    },
    {
      select: (res) => {
        return res?.data?.response ?? [];
      },
    }
  );

  const computedValue = useMemo(() => {
    const findedOption = options?.find((el) => el?.guid === value);
    return findedOption ? [findedOption] : [];
  }, [options, value]);

  const changeHandler = (value) => {
    const val = value?.[value?.length - 1];

    setValue(val?.guid ?? null);

    // if (!field?.attributes?.autofill) return;

    // field.attributes.autofill.forEach(({ field_from, field_to }) => {
    //   const setName = name.split(".");
    //   setName.pop();
    //   setName.push(field_to);
    //   setFormValue(setName.join("."), get(val, field_from));
    // });
  };

  useEffect(() => {
    const val = computedValue[computedValue.length - 1];
    if (!field?.attributes?.autofill || !val) return;

    field.attributes.autofill.forEach(({ field_from, field_to }) => {
      const setName = name.split(".");
      setName.pop();
      setName.push(field_to);
      setTimeout(() => {
        setFormValue(setName.join("."), get(val, field_from));
      }, []);
    });
  }, [computedValue]);

  return (
    <div className={styles.autocompleteWrapper}>
      <Autocomplete
        disabled={disabled}
        options={options ?? []}
        value={computedValue}
        popupIcon={
          isBlackBg ? (
            <ArrowDropDownIcon style={{ color: "#fff" }} />
          ) : (
            <ArrowDropDownIcon />
          )
        }
        onChange={(event, newValue) => {
          changeHandler(newValue);
        }}
        noOptionsText={
          <span
            onClick={() => navigateToForm(tableSlug)}
            style={{ color: "#007AFF", cursor: "pointer", fontWeight: 500 }}
          >
            Создать новый
          </span>
        }
        blurOnSelect
        openOnFocus
        getOptionLabel={(option) => getRelationFieldTabsLabel(field, option)}
        multiple
        isOptionEqualToValue={(option, value) => option.guid === value.guid}
        renderInput={(params) => (
          <TextField
            className={`${
              !error?.message
                ? isFormEdit
                  ? "custom_textfield"
                  : ""
                : "textfield_border"
            }`}
            placeholder={!computedValue.length ? placeholder : ""}
            {...params}
            InputProps={{
              ...params.InputProps,
              classes: {
                input: isBlackBg ? classes.input : "",
              },
              style: {
                background: isBlackBg ? "#2A2D34" : "",
                color: isBlackBg ? "#fff" : "",
              },
            }}
            error={error}
            helperText={!disabledHelperText && error?.message}
            size="small"
          />
        )}
        renderTags={(value, index) => (
          <>
            {getOptionLabel(value[0])}
            <IconGenerator
              icon="arrow-up-right-from-square.svg"
              style={{ marginLeft: "10px", cursor: "pointer" }}
              size={15}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                navigateToForm(tableSlug, "EDIT", value[0]);
              }}
            />
          </>
        )}
      />
    </div>
  );
};

export default CellRelationFormElement;
