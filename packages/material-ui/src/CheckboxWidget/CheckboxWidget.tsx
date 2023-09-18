import React from "react";

import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { FormHelperText } from "@material-ui/core";

import { utils, WidgetProps } from '@visma/rjsf-core';


const CheckboxWidget = (props: WidgetProps) => {
  const {
    id,
    value,
    disabled,
    readonly,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    options,
    required,
  } = props;
  const _onChange = ({}, checked: boolean) => onChange(checked);
  const _onBlur = ({
    target: { value },
  }: React.FocusEvent<HTMLButtonElement>) => onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLButtonElement>) => onFocus(id, value);

  return (
    <>
      {options.description && <FormHelperText>{options.description}</FormHelperText>}
      <FormControlLabel
        control={
          <Checkbox
            id={id}
            checked={typeof value === "undefined" ? false : value}
            required={required}
            disabled={disabled || readonly}
            autoFocus={autofocus}
            onChange={_onChange}
            onBlur={_onBlur}
            onFocus={_onFocus}
          />
        }
        aria-label={utils.generateAriaLabel(props.label, options, required)}
        label={
        <span>
          { props.label }
          { required && " *"}
        </span>}
      />
    </>
  );
};

export default CheckboxWidget;
