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

const ErrorList = ({ errors }: ErrorListProps) => {
  const intl = useIntl();

  return (
    <Paper
      elevation={2}>
      <Box id="formula-validation-errors" role="alert" mb={2} p={2}>
        <Typography component="h2" variant="h6">
          {intl.formatMessage({defaultMessage: 'Invalid inputs'})}
        </Typography>
        <List dense={true}>
          {errors.map((error, i: number) => {
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
