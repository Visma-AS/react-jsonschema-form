import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { ObjectFieldTemplateProps } from '@visma/rjsf-core';
import { utils } from '@visma/rjsf-core';

import AddButton from '../AddButton/AddButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';

const { canExpand } = utils;

const useStyles = makeStyles({
  root: {
    marginTop: 10,
  },
});

const ObjectFieldTemplate = ({
  DescriptionField,
  description,
  // TitleField,
  title,
  properties,
  // required,
  disabled,
  readonly,
  uiSchema,
  idSchema,
  schema,
  formData,
  onAddClick
}: ObjectFieldTemplateProps) => {
  const classes = useStyles();

  const isInArray = (schema as any).originalConfig ? (schema as any).originalConfig.listItem : false;

  return (
    <>
      {(uiSchema['ui:title'] || title) && !isInArray && (
        <Box id={`${idSchema.$id}-title`} mb={1} mt={1}>
          <Typography component={idSchema.$id === 'root' ? 'h2' : 'h3'} variant="subtitle1" style={{fontSize: 18}}>{title}</Typography>
          <Divider />
        </Box>
      )}
      {description && (
        <DescriptionField
          id={`${idSchema.$id}-description`}
          description={description}
        />
      )}
      <Grid container={true} spacing={2} className={classes.root}>
        {properties.map((element, index) =>
          // Remove the <Grid> if the inner element is hidden as the <Grid>
          // itself would otherwise still take up space.
          element.hidden ? (
            element.content
          ) : (
            <Grid
              item={true}
              xs={12}
              key={index}
              style={{ marginBottom: "10px" }}>
              {element.content}
            </Grid>
          )
        )}
        {canExpand(schema, uiSchema, formData) && (
          <Grid container style={{justifyContent: 'flex-end'}}>
            <Grid item={true}>
              <AddButton
                className='object-property-expand'
                onClick={onAddClick(schema)}
                disabled={disabled || readonly}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default ObjectFieldTemplate;
