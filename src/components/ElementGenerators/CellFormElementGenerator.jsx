import { Parser } from "hot-formula-parser";
import { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";
import CHFFormulaField from "../FormElements/CHFFormulaField";
import HFAutocomplete from "../FormElements/HFAutocomplete";
import HFBarCodeTextField from "../FormElements/HFBarCodeTextField";
import HFCheckbox from "../FormElements/HFCheckbox";
import HFDatePicker from "../FormElements/HFDatePicker";
import HFDateTimePicker from "../FormElements/HFDateTimePicker";
import HFIconPicker from "../FormElements/HFIconPicker";
import HFMultipleAutocomplete from "../FormElements/HFMultipleAutocomplete";
import HFNumberField from "../FormElements/HFNumberField";
import HFSwitch from "../FormElements/HFSwitch";
import HFTextField from "../FormElements/HFTextField";
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask";
import HFTimePicker from "../FormElements/HFTimePicker";
import CellElementGenerator from "./CellElementGenerator";
import CellRelationFormElement from "./CellRelationFormElement";
const parser = new Parser();

const CellFormElementGenerator = ({
  field,
  fields,
  isBlackBg = false,
  watch,
  columns = [],
  selected,
  row,
  control,
  setFormValue,
  shouldWork = false,
  index,
  ...props
}) => {
  const computedSlug = useMemo(() => {
    return `multi.${index}.${field.slug}`;
  }, [field.slug, index]);

  const changedValue = useWatch({
    control,
    name: computedSlug,
  });
  const defaultValue = useMemo(() => {
    const defaultValue =
      field.attributes?.defaultValue ?? field.attributes?.default_values;
    if (!defaultValue) return undefined;
    if (field.relation_type === "Many2One") return defaultValue[0];
    if (field.type === "MULTISELECT" || field.id?.includes("#"))
      return defaultValue;
    const { error, result } = parser.parse(defaultValue);
    return error ? undefined : result;
  }, [field.attributes, field.type, field.id, field.relation_type]);

  const isDisabled = useMemo(() => {
    return (
      field.attributes?.disabled ||
      !field.attributes?.field_permission?.edit_permission
    );
  }, [field]);

  useEffect(() => {
    if (!row?.[field.slug]) {
      setFormValue(computedSlug, row?.[field.table_slug]?.guid || defaultValue);
    }
  }, [field, row, setFormValue, computedSlug]);

  useEffect(() => {
    if (columns.length && changedValue) {
      columns.forEach(
        (i, index) =>
          selected.includes(i.guid) &&
          setFormValue(`multi.${index}.${field.slug}`, changedValue)
      );
    }
  }, [changedValue, setFormValue, columns, field, selected]);

  switch (field.type) {
    case "LOOKUP":
      return (
        <CellRelationFormElement
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          field={field}
          row={row}
          placeholder={field.attributes?.placeholder}
          setFormValue={setFormValue}
          index={index}
          required={field.required}
          defaultValue={defaultValue}
        />
      );

    case "SINGLE_LINE":
      return (
        <HFTextField
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          defaultValue={defaultValue}
          {...props}
        />
      );

    case "PHONE":
      return (
        <HFTextFieldWithMask
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          mask={"(99) 999-99-99"}
          {...props}
        />
      );

    case "PICK_LIST":
      return (
        <HFAutocomplete
          disabled={isDisabled}
          isBlackBg={isBlackBg}
          isFormEdit
          control={control}
          name={computedSlug}
          width="100%"
          options={field?.attributes?.options}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          {...props}
        />
      );
    case "BARCODE":
      return (
        <HFBarCodeTextField
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          disabled={isDisabled}
          {...props}
          defaultValue={defaultValue}
        />
      );
    case "MULTISELECT":
      return (
        <HFMultipleAutocomplete
          disabled={isDisabled}
          isFormEdit
          control={control}
          name={computedSlug}
          width="100%"
          required={field.required}
          field={field}
          placeholder={field.attributes?.placeholder}
          isBlackBg={isBlackBg}
          {...props}
        />
      );

    case "DATE":
      return (
        <HFDatePicker
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          fullWidth
          width={"100%"}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          {...props}
        />
      );
    // case "FORMULA":
    //   return (
    //     <HFFormulaField
    //       setFormValue={setFormValue}
    //       control={control}
    //       required={field.required}
    //       placeholder={field.attributes?.placeholder}
    //       name={computedSlug}
    //       fieldsList={fields}
    //       disabled={isDisabled}
    //       field={field}
    //       {...props}
    //       defaultValue={defaultValue}
    //     />
    //   );
    case "FORMULA_FRONTEND":
      return (
        <CHFFormulaField
          setFormValue={setFormValue}
          control={control}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          name={computedSlug}
          fieldsList={fields}
          disabled={isDisabled}
          field={field}
          index={index}
          {...props}
          defaultValue={defaultValue}
        />
      );
    case "DATE_TIME":
      return (
        <HFDateTimePicker
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          showCopyBtn={false}
          control={control}
          name={computedSlug}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          {...props}
        />
      );

    case "TIME":
      return (
        <HFTimePicker
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          placeholder={field.attributes?.placeholder}
          {...props}
        />
      );
    case "FORMULA":
    case "NUMBER":
      return (
        <HFNumberField
          disabled={isDisabled}
          isFormEdit
          control={control}
          name={computedSlug}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          isBlackBg={isBlackBg}
          {...props}
        />
      );

    case "CHECKBOX":
      return (
        <HFCheckbox
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          {...props}
        />
      );

    case "SWITCH":
      return (
        <HFSwitch
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          required={field.required}
          {...props}
        />
      );

    case "EMAIL":
      return (
        <HFTextField
          disabled={isDisabled}
          isFormEdit
          isBlackBg={isBlackBg}
          control={control}
          name={computedSlug}
          rules={{
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Incorrect email format",
            },
          }}
          fullWidth
          required={field.required}
          placeholder={field.attributes?.placeholder}
          {...props}
        />
      );

    // case "PHOTO":
    //   return (
    //     <FRow label={field.label} required={field.required}>
    //       <HFImageUpload
    //         control={control}
    //         name={computedSlug}
    //         required={field.required}
    //         {...props}
    //       />
    //     </FRow>
    //   )

    case "ICON":
      return (
        <HFIconPicker
          isFormEdit
          control={control}
          name={computedSlug}
          required={field.required}
          {...props}
        />
      );

    default:
      return (
        <div style={{ padding: "0 4px" }}>
          <CellElementGenerator field={field} row={row} />
        </div>
      );
  }
};

export default CellFormElementGenerator;
