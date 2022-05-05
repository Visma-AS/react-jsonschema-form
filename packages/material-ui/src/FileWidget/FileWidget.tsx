import React, { useState, useRef, useEffect } from "react";
import { WidgetProps } from "@visma/rjsf-core";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import DescriptionIcon from "@material-ui/icons/Description";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Button from "@material-ui/core/Button";
import { useIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  inputLabel: {
    position:"absolute",
    left:"-10000px",
    top:"auto",
    width:"1px",
    height:"1px",
    overflow:"hidden"
  },
});

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

interface Props {
  filesInfo?: FileInfo[];
}

function dataURItoBlob(dataURI: string) {
  // Split metadata from data
  const splitted = dataURI.split(",");
  // Split params
  const params = splitted[0].split(";");
  // Get mime-type from params
  const type = params[0].replace("data:", "");
  // Filter the name property from params
  const properties = params.filter(param => {
    return param.split("=")[0] === "name";
  });
  // Look for the name and use unknown if no name property.
  let name;
  if (properties.length !== 1) {
    name = "unknown";
  } else {
    // Because we filtered out the other property,
    // we only have the name case here.
    name = properties[0].split("=")[1];
  }

  // Built the Uint8Array Blob parameter from the base64 string.
  const binary = atob(splitted[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  // Create the blob object
  const blob = new window.Blob([new Uint8Array(array)], { type });

  return { blob, name };
}

function addNameToDataURL(dataURL: any, name: any) {
  return dataURL.replace(";base64", `;name=${encodeURIComponent(name)};base64`);
}

function processFile(file: any) {
  const { name, size, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = event => {
      resolve({
        dataURL: addNameToDataURL(event.target!.result, name),
        name,
        size,
        type,
      });
    };
    reader.readAsDataURL(file);
  });
}

function processFiles(files: any) {
  return Promise.all([].map.call(files, processFile));
}

function extractFileInfo(dataURLs: any[]) {
  return dataURLs
    .filter(dataURL => typeof dataURL !== "undefined")
    .map(dataURL => {
      const { blob, name } = dataURItoBlob(dataURL);
      return {
        name: name,
        size: blob.size,
        type: blob.type,
      };
    });
}

const FileWidget = ({
                      id,
                      options,
                      value,
                      disabled,
                      readonly,
                      multiple,
                      autofocus,
                      onChange,
                      label
                    }: WidgetProps) => {
  const [state, setState] = useState<FileInfo[]>();
  const inputRef = useRef();
  const intl = useIntl();
  const classes = useStyles();

  useEffect(() => {
    if (value === null) {
      setState(undefined);
    } else {
      const values = Array.isArray(value) ? value : [value];
      const initialFilesInfo: FileInfo[] = extractFileInfo(values);
      if (initialFilesInfo.length > 0) {
        setState(initialFilesInfo);
      } else {
        setState(undefined);
      }
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files).then((filesInfo: any) => {
      setState(filesInfo);
      const values = filesInfo.map((fileInfo: any) => fileInfo.dataURL);
      if (multiple) {
        onChange(values);
      } else {
        onChange(values[0]);
      }
    });
  };

  const RemoveButton = ({index}: any) => {
    const onRemoveClick = () => {
      if (multiple) {
        const newValues = value.splice(index, 1);
        onChange(newValues);
      } else {
        onChange(null);
      }
    }

    return (
      <IconButton
        aria-label={intl.formatMessage({defaultMessage: "Remove file"})}
        onClick={onRemoveClick}>
        <HighlightOffIcon />
      </IconButton>
    );
  }

  const FilesInfo = ({ filesInfo }: Props) => {
    if (!filesInfo || filesInfo.length === 0) {
      return null;
    }
    return (
      <List id="file-info">
        {filesInfo.map((fileInfo: any, key: any) => {
          const { name, size, type } = fileInfo;
          return (
            <ListItem key={key}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary={name} secondary={`${type}, ${size} bytes`} />
              <RemoveButton index={key} />
            </ListItem>
          );
        })}
      </List>
    );
  };

  let ariaLabel = label;

  if (!ariaLabel) {
    const element = options!.element as {label: string, title: string, useLabel: boolean};
    ariaLabel = element.useLabel ? element.label : element.title;
  }

  return (
    <>
      <label htmlFor={`file-input-${id}`} className={classes.inputLabel}>{ariaLabel}</label>
      <input
        ref={inputRef.current}
        id={`file-input-${id}`}
        type="file"
        disabled={readonly || disabled}
        onChange={handleChange}
        autoFocus={autofocus}
        multiple={multiple}
        aria-hidden={true}
        accept={options.accept as string}
        style={{display: 'none'}}
      />
      <Button
        aria-label={ ariaLabel &&
          `${ariaLabel}: ${intl.formatMessage({defaultMessage: 'Choose file'})}`
        }
        variant="outlined"
        onClick={() => document.getElementById(`file-input-${id}`)!.click()}
      >
        { intl.formatMessage({defaultMessage: 'Choose file'}) }
      </Button>
      <FilesInfo filesInfo={state} />
    </>
  );
};

export default FileWidget;