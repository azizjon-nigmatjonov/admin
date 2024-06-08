import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material"
import { Controller, useWatch } from "react-hook-form"
import useDebouncedWatch from "../../hooks/useDebouncedWatch"
import { Parser } from "hot-formula-parser"
import { useEffect } from "react"
import IconGenerator from "../IconPicker/IconGenerator"
import { useState } from "react"

const parser = new Parser()

const CHFFormulaField = ({
  control,
  name,
  rules = {},
  setFormValue = () => {},
  required,
  disabledHelperText,
  fieldsList,
  disabled,
  field,
  index,
  ...props
}) => {
  const [formulaIsVisible, setFormulaIsVisible] = useState(false)
  const formula = field?.attributes?.formula ?? ""
  const [newFieldsList, setNewFieldsList] = useState([])

  const currentValue = useWatch({
    control,
    name
  })

  const values = useWatch({
    control,
    name: `multi.${index}`
  })

  const updateValue = () => {
    let computedFormula = formula
    const fieldsListSorted = newFieldsList
      ? [...newFieldsList]?.sort((a, b) => b.slug?.length - a.slug?.length)
      : []
    fieldsListSorted?.forEach((field) => {

      let value = values[field.slug] ?? 0

      if (typeof value === "string") value = `'${value}'`

      computedFormula = computedFormula.replaceAll(`${field.slug}`, value)
    })

    const { error, result } = parser.parse(computedFormula)

    let newValue = error ?? result
    if (newValue !== currentValue) setFormValue(name, newValue)
  }

  useDebouncedWatch(updateValue, [values], 300)
  useEffect(() => {
    if (fieldsList?.length) {
      setNewFieldsList([...fieldsList, {slug: 'price'}, {slug: 'merchant_percent'}])
    }
  }, [fieldsList])

  useEffect(() => {
    updateValue()
  }, [])

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          size="small"
          onChange={onChange}
          value={formulaIsVisible ? formula : value}
          name={name}
          error={error}
          fullWidth
          helperText={!disabledHelperText && error?.message}
          InputProps={{
            readOnly: disabled,
            style: {
              background: disabled ? "#c0c0c039" : "#fff",
            },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title={formulaIsVisible ? "Закрыть формулу" : "Откройте формулу"}
                >
                  <IconButton
                    edge="end"
                    color={formulaIsVisible ? "primary" : "default"}
                    onClick={() => setFormulaIsVisible((prev) => !prev)}
                  >
                    <IconGenerator icon="square-root-variable.svg" size={15} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          {...props}
        />
      )}
    ></Controller>
  )
}

export default CHFFormulaField
