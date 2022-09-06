import React from "react";

import TextField, {
  StandardTextFieldProps as TextFieldProps,
} from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import { WidgetProps, utils } from "@visma/rjsf-core";
import Typography from "@material-ui/core/Typography";

const { rangeSpec } = utils;

export type TextWidgetProps = WidgetProps & Pick<TextFieldProps, Exclude<keyof TextFieldProps, 'onBlur' | 'onFocus'>>;

const useStyles = makeStyles({
  inputLabelRoot: {
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1
  },
  inputFormControl: {
    "label + &": {
      marginTop: 0
    }
  }
});

const TextWidget = ({
  id,
  placeholder,
  required,
  readonly,
  disabled,
  type,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  autofocus,
  options,
  schema,
  uiSchema,
  rawErrors = [],
  formContext,
  registry, // pull out the registry so it doesn't end up in the textFieldProps
  ...textFieldProps
}: TextWidgetProps) => {
  const bannedCharacters = options && options.element
    ? (options.element as {bannedCharacters: string}).bannedCharacters
    : undefined;

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = (value === "" ? options.emptyValue : value);
    let cleanedValue = rawValue;
    if (typeof cleanedValue === 'string' && bannedCharacters && bannedCharacters.length > 0) {
      for (const character of bannedCharacters) {
        cleanedValue = cleanedValue.split(character).join('');
      }
    }
    onChange(cleanedValue ?
      schema.maxLength ? String(cleanedValue).substring(0, Number(schema.maxLength)) : cleanedValue
      : "");
  };
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  const classes = useStyles();
  const inputType = (type || schema.type) === 'string' ?  'text' : `${type || schema.type}`

  let ariaLabel = label;

  if (!ariaLabel) {
    const element = options!.element as {
      label: string,
      title: string,
      labelError: string,
      useLabel: boolean
    };
    ariaLabel = element.useLabel
      ? (element.label === "" || !element.label ? element.labelError : element.label)
      : element.title;
  }

  return (
    <>
      <TextField
        id={id}
        placeholder={placeholder}
        autoFocus={autofocus}
        required={required}
        label={ariaLabel}
        hiddenLabel
        disabled={disabled || readonly}
        type={inputType as string}
        value={value || value === 0 ? value : ""}
        error={rawErrors.length > 0}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        InputProps={{ "aria-describedby": utils.ariaDescribedBy(id), classes: {
            formControl: classes.inputFormControl
          }
        }}
        inputProps={inputType === 'number' ? {...rangeSpec(schema)} : {}}
        {...(textFieldProps as TextFieldProps)}
        InputLabelProps={{shrink: false, className: classes.inputLabelRoot}}
      />
      {options.showCharacterCounter &&
      <div>
        <Typography variant="subtitle2" style={{float: "right"}}>
          {(value ? value.length : 0)} {schema.maxLength !== undefined && " / " + schema.maxLength}
        </Typography>
      </div>
      }
    </>
  );
};

export default TextWidget;
