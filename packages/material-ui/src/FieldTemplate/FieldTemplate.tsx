import React from "react";

import { FieldTemplateProps, utils } from "@visma/rjsf-core";
import { useIntl } from 'react-intl';

import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Box from '@material-ui/core/Box';

import WrapIfAdditional from "./WrapIfAdditional";

const showTitle = (schema: any, uiSchema: any) => {
  if (schema.type === 'array') {
    return schema.items.type !== 'object' && (schema.items.enum || schema.items.enumNames);
  } else if (uiSchema['ui:options'].element.type === 'dateRange' && uiSchema['ui:options'].element.list === false) {
    return (uiSchema['ui:options'].element.title || uiSchema['ui:options'].element.label)
  }
  else if (uiSchema['ui:widget'] === 'checkbox' || (schema.type === 'boolean' && uiSchema['ui:widget'] !== 'radio')) {
    return false;
  }
  return schema.format === 'table' || !(schema.type === 'object' || (schema.type === 'string' && schema.title === undefined));
}

const getLabel = (uiSchema: any, defaultLabel: string) => {
  if (uiSchema['ui:options'] && uiSchema['ui:options']!.element) {
    const { useLabel, label, title } = uiSchema['ui:options']!.element;
    return useLabel ? label : title;
  }
  return defaultLabel;
}

const indentation = (element: any) => {
  return element.indent;
}

const ErrorList = (props: {id: string, errors: string[]}) => {
  const {id, errors} = props;
  return (<List id={utils.errorsId(id)} dense={true} disablePadding={true}>
    {errors.map((error, i: number) => {
      return (
        <ListItem key={i} disableGutters={true}>
          <FormHelperText>{error}</FormHelperText>
        </ListItem>
      );
    })}
  </List>);
}

const FieldTemplate = ({
  id,
  children,
  classNames,
  disabled,
  hidden,
  label,
  onDropPropertyClick,
  onKeyChange,
  readonly,
  required,
  rawErrors = [],
  rawHelp,
  rawDescription,
  schema,
  uiSchema
}: FieldTemplateProps) => {
  const intl = useIntl();
  if (hidden) {
    return null;
  }

  const { type } = schema;

  const displayLabel = (uiSchema: any) => {
    if(uiSchema['ui:options'].element.description) {
      return true
    } else {
      return false
    }
  }

  return (
    <Box pl={uiSchema['ui:options'] && indentation(uiSchema['ui:options']!.element) ? 3 : 0}>
      <WrapIfAdditional
        classNames={classNames}
        disabled={disabled}
        id={id}
        uiSchema={uiSchema}
        label={label}
        onDropPropertyClick={onDropPropertyClick}
        onKeyChange={onKeyChange}
        readonly={readonly}
        required={required}
        schema={schema}>
        <FormControl
          fullWidth={true}
          error={rawErrors.length ? true : false}
          required={required}>
          {showTitle(schema, uiSchema) && getLabel(uiSchema, label) && getLabel(uiSchema, label).trim() !== '' ?
            <Typography
              component="p"
              variant="subtitle1">
              { getLabel(uiSchema, label) }
              { required && <> <abbr title={intl.formatMessage({defaultMessage: 'Required field'})}>*</abbr></> }
            </Typography>
            : null}
          {displayLabel && rawDescription && (schema.type !== 'boolean' || uiSchema['ui:widget'] === 'radio') ? (
            <Typography
              id={utils.descriptionId(id)}
              variant="caption"
              color="textSecondary">
              {rawDescription}
            </Typography>
          ) : null}
          {rawErrors.length > 0 && type === 'object' && (
            <ErrorList id={id} errors={rawErrors} />
          )}
          {children}
          {rawErrors.length > 0 && type !== 'object' && (
            <ErrorList id={id} errors={rawErrors} />
          )}
          {rawHelp && (
            <FormHelperText id={utils.helpId(id)}>{rawHelp}</FormHelperText>
          )}
        </FormControl>
      </WrapIfAdditional>
    </Box>
  );
};

export default FieldTemplate;
