import { useMemo } from "react";
import FRow from "../FormElements/FRow";
import HFAutocomplete from "../FormElements/HFAutocomplete";
import HFCheckbox from "../FormElements/HFCheckbox";
import HFDatePicker from "../FormElements/HFDatePicker";
import HFDateTimePicker from "../FormElements/HFDateTimePicker";
import HFFormulaField from "../FormElements/HFFormulaField";
import HFIconPicker from "../FormElements/HFIconPicker";
import HFImageUpload from "../FormElements/HFImageUpload";
import HFVideoUpload from "../FormElements/HFVideoUpload";
import HFFileUpload from "../FormElements/HFFileUpload";
import HFMultipleAutocomplete from "../FormElements/HFMultipleAutocomplete";
import HFNumberField from "../FormElements/HFNumberField";
import HFSwitch from "../FormElements/HFSwitch";
import HFTextEditor from "../FormElements/HFTextEditor";
import HFTextField from "../FormElements/HFTextField";
import HFTextFieldWithMask from "../FormElements/HFTextFieldWithMask";
import HFTimePicker from "../FormElements/HFTimePicker";
import DynamicRelationFormElement from "./DynamicRelationFormElement";
import ManyToManyRelationFormElement from "./ManyToManyRelationFormElement";
import RelationFormElement from "./RelationFormElement";
import { Parser } from "hot-formula-parser";
import BarcodeGenerator from "./BarcodeGenerator";
import { useSelector } from "react-redux";
import InventoryBarCode from "./InventoryBarCode";
// import DocumentGeneratorButton from "./components/DocumentGeneratorButton";

const parser = new Parser();

const FormElementGenerator = ({
  field = {},
  control,
  setFormValue,
  formTableSlug,
  fieldsList,
  setBranchSend,
  ...props
}) => {
  const isUserId = useSelector((state) => state.auth.userId);
  const isBranchId = useSelector(
    (state) => state.auth.branchId?.[0]?.object_id
  );
  const computedSlug = useMemo(() => {
    if (field.id?.includes("@"))
      return `$${field.id.split("@")?.[0]}.${field.slug}`;
    return field.slug;
  }, [field.id, field.slug]);
  const defaultValue = useMemo(() => {
    const defaultValue =
      field.attributes?.defaultValue ?? field.attributes?.default_values;
    if (field?.attributes?.is_user_id_default === true) return isUserId;
    if (field?.attributes?.is_branch_id_default === true) return isBranchId;
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

  // if (!field.attributes?.field_permission?.view_permission) {
  //   return null
  // }


  if (field.id?.includes("#")) {
    if (field.relation_type === "Many2Many") {
      return (
        <ManyToManyRelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...props}
        />
      );
    } else if (field.relation_type === "Many2Dynamic") {
      return (
        <DynamicRelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...props}
        />
      );
    } else {
      return (
        <RelationFormElement
          control={control}
          field={field}
          setFormValue={setFormValue}
          formTableSlug={formTableSlug}
          defaultValue={defaultValue}
          disabled={isDisabled}
          setBranchSend={setBranchSend}
          {...props}
        />
      );
    }
  }

  switch (field.type) {
    case "SINGLE_LINE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={computedSlug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "PHONE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextFieldWithMask
            control={control}
            name={computedSlug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            mask={"(99) 999-99-99"}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );
    case "INVENTORY_BARCODE":
      return (
        <FRow label={field.label} required={field.required}>
          <InventoryBarCode
            control={control}
            name={field.slug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            field={field}

            // disabled={isDisabled}
            {...props}
          />
        </FRow>
      );
    case "PICK_LIST":
      return (
        <FRow label={field.label} required={field.required}>
          <HFAutocomplete
            control={control}
            name={computedSlug}
            width="100%"
            options={field?.attributes?.options}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "MULTI_LINE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextEditor
            control={control}
            name={computedSlug}
            fullWidth
            multiline
            rows={4}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={field.defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "DATE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFDatePicker
            control={control}
            name={computedSlug}
            fullWidth
            width={"100%"}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "DATE_TIME":
      return (
        <FRow label={field.label} required={field.required}>
          <HFDateTimePicker
            control={control}
            name={computedSlug}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "TIME":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTimePicker
            control={control}
            name={computedSlug}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "NUMBER":
      return (
        <FRow label={field.label} required={field.required}>
          <HFNumberField
            control={control}
            name={computedSlug}
            fullWidth
            type="number"
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "CHECKBOX":
      return (
        <HFCheckbox
          control={control}
          name={computedSlug}
          label={field.label}
          required={field.required}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...props}
        />
      );

    case "MULTISELECT":
      return (
        <FRow label={field.label} required={field.required}>
          <HFMultipleAutocomplete
            control={control}
            name={computedSlug}
            width="100%"
            required={field.required}
            field={field}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "SWITCH":
      return (
        <HFSwitch
          control={control}
          name={computedSlug}
          label={field.label}
          required={field.required}
          defaultValue={defaultValue}
          disabled={isDisabled}
          {...props}
        />
      );

    case "EMAIL":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
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
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "PHOTO":
      return (
        <FRow label={field.label} required={field.required}>
          <HFImageUpload
            control={control}
            name={computedSlug}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "VIDEO":
      return (
        <FRow label={field.label} required={field.required}>
          <HFVideoUpload
            control={control}
            name={computedSlug}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );
    case "FILE":
      return (
        <FRow label={field.label} required={field.required}>
          <HFFileUpload
            control={control}
            name={computedSlug}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "BARCODE":
      return (
        <FRow label={field.label} required={field.required}>
          <BarcodeGenerator
            control={control}
            name={field.slug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            // disabled={isDisabled}
            formTableSlug={formTableSlug}
            {...props}
          />
        </FRow>
      );

    case "ICON":
      return (
        <FRow label={field.label} required={field.required}>
          <HFIconPicker
            control={control}
            name={computedSlug}
            required={field.required}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "FORMULA":
    case "INCREMENT_ID":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            InputProps={{
              readOnly: true,
              style: {
                background: "#c0c0c039",
              },
            }}
            {...props}
          />
        </FRow>
      );

    case "FORMULA_FRONTEND":
      return (
        <FRow label={field.label} required={field.required}>
          <HFFormulaField
            setFormValue={setFormValue}
            control={control}
            required={field.required}
            placeholder={field.attributes?.placeholder}
            name={field.slug}
            fieldsList={fieldsList}
            field={field}
            defaultValue={defaultValue}
          />
        </FRow>
      );

    case "COLOR":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            type="color"
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );

    case "PASSWORD":
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={field.attributes?.disabled}
            type="password"
            {...props}
          />
        </FRow>
      );

    default:
      return (
        <FRow label={field.label} required={field.required}>
          <HFTextField
            control={control}
            name={field.slug}
            fullWidth
            required={field.required}
            placeholder={field.attributes?.placeholder}
            defaultValue={defaultValue}
            disabled={isDisabled}
            {...props}
          />
        </FRow>
      );
  }
};

export default FormElementGenerator;
