import React from 'react';
import { useIntl } from 'react-intl';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ErrorIcon from '@material-ui/icons/Error';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

import { ErrorListProps } from '@visma/rjsf-core';

const ErrorList = ({ errors, uiSchema }: ErrorListProps) => {
  const intl = useIntl();
  const uiOrder = uiSchema['ui:order'] || [];
  //Sorted array of errors according to uiOrder for correct error message order
  const newErrors = errors.map(error => {
    const newError = { ...error };

    // Get content from inside the first square brackets
    const match = newError.property ? newError.property.match(/\[(.*?)\]/) : undefined;
    if (match) {
      // Remove single quotes
      newError.property = match[1].replace(/'/g, '');
    }

    // If property starts with a dot and is not a number, remove dot and keep the rest, done for ex .autofill_age
    else if (/^\./.test(newError.property)) {
      newError.property = newError.property.replace('.', '');
    }

    return newError;

    // Sort list of newErrors according to uiOrder
  }).sort((a, b) => {
    const indexA = uiOrder.indexOf(a.property);
    const indexB = uiOrder.indexOf(b.property);
    return indexA - indexB;
  });

  return (
    <Paper
      elevation={2}>
      <Box id="formula-validation-errors" mb={2} p={2}>
        {uiSchema.formWithSteps ? <Typography component="h4"  variant="h6">
          {intl.formatMessage({defaultMessage: 'Invalid inputs'})}
        </Typography>
          :
          <Typography component="h2"  variant="h6">
            {intl.formatMessage({defaultMessage: 'Invalid inputs'})}
          </Typography> }
        <List role="alert"  dense={true}>
          {newErrors.map((error, i: number) => {
            return (
              <ListItem key={i}>
                <ListItemIcon>
                  <ErrorIcon color="error" />
                </ListItemIcon>
                <ListItemText primary={error.stack} />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Paper>
  );
}

export default ErrorList;
