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
  } else if (uiSchema['ui:widget'] === 'checkbox' || (schema.type === 'boolean' && uiSchema['ui:widget'] !== 'radio')) {
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

const FieldTemplate = ({
  id,
  children,
  classNames,
  disabled,
  displayLabel,
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

  const headerNumber = id.split('_').length + 1;

  return (
    <Box pl={uiSchema['ui:options'] && indentation(uiSchema['ui:options']!.element) ? 3 : 0}>
      <WrapIfAdditional
        classNames={classNames}
        disabled={disabled}
        id={id}
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
          {showTitle(schema, uiSchema) && getLabel(uiSchema, label) ?
            <Typography
              aria-label={required ? intl.formatMessage({defaultMessage: 'Required field'}) : undefined}
              component={ headerNumber === 2 ? "h2"
                : headerNumber === 3 ? "h3"
                  : headerNumber === 4 ? "h4"
                    : headerNumber === 5 ? "h5" : "h6"
              }
              variant="subtitle1">
              { getLabel(uiSchema, label) }
              { required ? ' *' : null }
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
          {children}
          {rawErrors.length > 0 && (
            <List id={utils.errorsId(id)} dense={true} disablePadding={true}>
              {rawErrors.map((error, i: number) => {
                return (
                  <ListItem key={i} disableGutters={true}>
                    <FormHelperText>{error}</FormHelperText>
                  </ListItem>
                );
              })}
            </List>
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
