import React from "react";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from '@material-ui/core/FormControl';

import { utils, WidgetProps } from '@visma/rjsf-core';
import Typography from '@material-ui/core/Typography';

const getScore = (choices: {enumNames: string, enum?: string, meta?: {score: number}}[], value: string) => {
  let choice = choices.find(choice => choice.enum === value);
  if (!choice) {
    choice = choices[Number(value)];
  }
  return choice && choice.meta ? choice.meta.score : undefined;
}

const getScores = (choices: {enumNames: string, enum?: string, meta?: {score: number}}[], value: string[]) => {
  if (value.length > 0) {
    let choiceString = value.map(item => getScore(choices, item)) as any[];
    choiceString = choiceString.filter(value => value !== undefined);
    return choiceString.length > 0 ? choiceString.join(', ') : '';
  } else {
    return "";
  }
}

const selectValue = (value: any, selected: any, all: any) => {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));

  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a: any, b: any) => all.indexOf(a) > all.indexOf(b));
};

const deselectValue = (value: any, selected: any) => {
  return selected.filter((v: any) => v !== value);
};

const CheckboxesWidget = ({
  id,
  disabled,
  label,
  required,
  options,
  value,
  autofocus,
  readonly,
  onChange,
  onBlur,
  onFocus,
}: WidgetProps) => {
  const { enumOptions, enumDisabled, inline, showScore, element } = options;
  const rawChoices = element ?
    (options!.element! as {choices: {enumNames: string, enum?: string, meta?: {score: number}}[]}).choices :
    [];

  const _onChange = (option: any) => ({
    target: { checked },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const all = (enumOptions as any).map(({ value }: any) => value);

    if (checked) {
      onChange(selectValue(option.value, value, all));
    } else {
      onChange(deselectValue(option.value, value));
    }
  };

  const _onBlur = ({
    target: { value },
  }: React.FocusEvent<HTMLButtonElement>) => onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLButtonElement>) => onFocus(id, value);

  return (
    <div style={{display: 'flex'}}>
      <div style={{flex: '1 1'}}>
        <FormControl component="fieldset">
          <legend style={{position: 'absolute', clip: 'rect(0,0,0,0)'}}>{utils.generateAriaLabel(label, options, required)}</legend>
          <FormGroup row={!!inline}>
            {(enumOptions as any).map((option: any, index: number) => {
              const checked = value.indexOf(option.value) !== -1;
              const itemDisabled =
                enumDisabled && (enumDisabled as any).indexOf(option.value) != -1;
              const checkbox = (
                <Checkbox
                  id={`${id}_${index}`}
                  checked={checked}
                  disabled={disabled || itemDisabled || readonly}
                  autoFocus={autofocus && index === 0}
                  onChange={_onChange(option)}
                  onBlur={_onBlur}
                  onFocus={_onFocus}
                />
              );
              return (
                <FormControlLabel
                  control={checkbox}
                  key={index}
                  style={{marginTop: '6px'}}
                  label={option.label}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </div>
    <div>
      { (showScore && value) &&
        <Typography>{
          getScores(rawChoices, value)
        }</Typography>
      }
    </div>
  </div>
  );
};

export default CheckboxesWidget;
