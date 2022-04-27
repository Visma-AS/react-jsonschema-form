import React from 'react';
import { useIntl } from 'react-intl';

import { utils } from '@visma/rjsf-core';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { ArrayFieldTemplateProps, IdSchema } from '@visma/rjsf-core';

import AddButton from '../AddButton/AddButton';
import IconButton from '../IconButton/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const {
  isMultiSelect,
  getDefaultRegistry,
} = utils;

const indentation = (element: any) => {
  return element.indent;
}

const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { schema, registry = getDefaultRegistry(), uiSchema } = props;

  return(
    <Box pl={uiSchema.items && uiSchema.items!['ui:options'] && indentation(uiSchema.items!['ui:options']!.element) ? 3 : 0}>
      {
        isMultiSelect(schema, registry.rootSchema)
          ? <DefaultFixedArrayFieldTemplate {...props} />
          : <DefaultNormalArrayFieldTemplate {...props} />
      }
    </Box>
  );
};

type ArrayFieldTitleProps = {
  TitleField: any;
  idSchema: IdSchema;
  title: string;
  required: boolean;
};

const ArrayFieldTitle = ({
  idSchema,
  title,
  required
}: ArrayFieldTitleProps) => {
  if (!title) {
    return null;
  }

  const id = `${idSchema.$id}__title`;
  // return <TitleField id={id} title={title} required={required} />;
  return (
    <Box id={id} mb={1} mt={1}>
      <Typography component="h4" variant="subtitle1">{required ? title + ' *' : title}</Typography>
      <Divider />
    </Box>
  );
};

type ArrayFieldDescriptionProps = {
  DescriptionField: any;
  idSchema: IdSchema;
  description: string;
};

const ArrayFieldDescription = ({
  DescriptionField,
  idSchema,
  description,
}: ArrayFieldDescriptionProps) => {
  if (!description) {
    return null;
  }

  const id = utils.descriptionId(idSchema.$id);
  return <DescriptionField id={id} description={description} />;
};

// Used in the two templates
const DefaultArrayItem = (props: any) => {
  const intl = useIntl();
  const btnStyle = {
    flex: 1,
    paddingLeft: 3,
    paddingRight: 3,
    fontWeight: 'bold',
    minWidth: 0,
    marginLeft: 5,
    marginBottom: 10,
    borderRadius: 15,
    borderWidth: 2
  };
  return (
    <Grid container={true} key={props.key} alignItems="center">
      <Grid
        item={true}
        xs
        // Causes datepicker popover to be shown only partially
        // style={{ overflow: "auto" }}
      >
        <Box mb={2}>
          <Paper elevation={2}>
            <Box p={2}>{props.children}</Box>
          </Paper>
        </Box>
      </Grid>

      {props.hasToolbar && (
        <Grid item={true}>
          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconButton
              icon="arrow-up"
              className="array-item-move-up"
              aria-label={intl.formatMessage({defaultMessage: 'Move up'})}
              //tabIndex={-1}
              style={btnStyle as any}
              iconProps={{ fontSize: 'small' }}
              disabled={props.disabled || props.readonly || !props.hasMoveUp}
              onClick={props.onReorderClick(props.index, props.index - 1)}
            />
          )}

          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconButton
              icon="arrow-down"
              aria-label={intl.formatMessage({defaultMessage: 'Move down'})}
              //tabIndex={-1}
              style={btnStyle as any}
              iconProps={{ fontSize: 'small' }}
              disabled={props.disabled || props.readonly || !props.hasMoveDown}
              onClick={props.onReorderClick(props.index, props.index + 1)}
            />
          )}

          {props.hasRemove && (
            <IconButton
              icon="remove"
              aria-label={intl.formatMessage({defaultMessage: 'Remove item'})}
              //tabIndex={-1}
              style={btnStyle as any}
              iconProps={{ fontSize: 'small' }}
              disabled={props.disabled || props.readonly}
              onClick={props.onDropIndexClick(props.index)}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
};

const DefaultFixedArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  return (
    <fieldset className={props.className}>
      <ArrayFieldTitle
        key={`array-field-title-${props.idSchema.$id}`}
        TitleField={props.TitleField}
        idSchema={props.idSchema}
        title={props.uiSchema['ui:title'] || props.title}
        required={props.required}
      />

      {(props.uiSchema['ui:description'] || props.schema.description) && (
        <div
          className="field-description"
          key={`field-description-${props.idSchema.$id}`}
        >
          {props.uiSchema['ui:description'] || props.schema.description}
        </div>
      )}

      <div
        className="row array-item-list"
        key={`array-item-list-${props.idSchema.$id}`}
      >
        {props.items && props.items.map(DefaultArrayItem)}
      </div>

      {props.canAdd && (
        <AddButton
          className="array-item-add"
          onClick={props.onAddClick}
          disabled={props.disabled || props.readonly}
        />
      )}
    </fieldset>
  );
};

const DefaultNormalArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  return (
    <Paper elevation={2}>
      <Box p={2}>
        <ArrayFieldTitle
          key={`array-field-title-${props.idSchema.$id}`}
          TitleField={props.TitleField}
          idSchema={props.idSchema}
          title={props.uiSchema['ui:title'] || props.title}
          required={props.required}
        />

        {(props.uiSchema['ui:description'] || props.schema.description) && (
          <ArrayFieldDescription
            key={`array-field-description-${props.idSchema.$id}`}
            DescriptionField={props.DescriptionField}
            idSchema={props.idSchema}
            description={
              props.uiSchema['ui:description'] || props.schema.description
            }
          />
        )}

        <Grid container={true} key={`array-item-list-${props.idSchema.$id}`}>
          {props.items && props.items.map(p => DefaultArrayItem(p))}

          {props.canAdd && (
            <Grid container justify="flex-end">
              <Grid item={true}>
                <Box mt={2}>
                  <AddButton
                    className="array-item-add"
                    onClick={props.onAddClick}
                    disabled={props.disabled || props.readonly}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

export default ArrayFieldTemplate;
