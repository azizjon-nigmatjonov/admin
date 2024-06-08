import { useEffect, useRef } from "react";
import CheckboxAttributes from "./CheckboxAttributes";
import DateAttributes from "./DateAttributes";
import FormulaAttributes from "./FormulaAttributes";
import FrontendFormulaAttributes from "./FrontendFormulaAttributes";
import IncrementIDAttributes from "./IncrementIDAttributes";
import InventoryBarcodeAttributes from "./InventoryBarcodeAttributes";
import MultiLineAttributes from "./MultiLineAttributes";
import NumberAttributes from "./NumberAttributes";
import PickListAttributes from "./PickListAttributes";
import RandomNumberAttribute from "./RandomNumberAttribute";
import SingleLineAttributes from "./SingleLineAttributes";

const Attributes = ({ control, watch, mainForm }) => {
  const fieldType = watch("type");

  if (!fieldType) return null;

  switch (fieldType) {
    case "INVENTORY_BARCODE":
      return <InventoryBarcodeAttributes control={control} />;

    case "SINGLE_LINE":
      return <SingleLineAttributes control={control} />;

    case "MULTISELECT":
    case "PICK_LIST":
      return <PickListAttributes control={control} />;

    case "MULTI_LINE":
      return <MultiLineAttributes control={control} />;

    case "DATE":
      return <DateAttributes control={control} />;

    case "NUMBER":
      return <NumberAttributes control={control} />;

    case "SWITCH":
    case "CHECKBOX":
      return <CheckboxAttributes control={control} />;

    case "FORMULA_FRONTEND":
      return (
        <FrontendFormulaAttributes control={control} mainForm={mainForm} />
      );

    case "FORMULA":
      return <FormulaAttributes control={control} mainForm={mainForm} />;

    case "INCREMENT_ID":
      return <IncrementIDAttributes control={control} />;

    case "RANDOM_NUMBERS":
      return <RandomNumberAttribute control={control} />;

    default:
      return <SingleLineAttributes control={control} />;
  }
};

export default Attributes;
