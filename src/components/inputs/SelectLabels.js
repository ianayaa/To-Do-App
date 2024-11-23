import Select from "react-select";
import makeAnimated from "react-select/animated";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import React, { useState } from 'react';
import CreateLabelDialog from '../dialog/CreateLabelDialog';

const SelectLabels = ({ selectedTags, setSelectedTags, customIcon }) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [customOptions, setCustomOptions] = useState([]);

  const defaultOptions = [
    { 
      value: "Importante", 
      label: "Importante",
      icon: <PriorityHighIcon sx={{ color: "#dc3545" }} />,
      color: "#dc3545"
    },
    { 
      value: "Urgente", 
      label: "Urgente",
      icon: <NotificationsActiveIcon sx={{ color: "#fd7e14" }} />,
      color: "#fd7e14"
    },
    { 
      value: "Escuela", 
      label: "Escuela",
      icon: <SchoolIcon sx={{ color: "#0d6efd" }} />,
      color: "#0d6efd"
    },
    { 
      value: "Bajo", 
      label: "Bajo",
      icon: <AccessTimeIcon sx={{ color: "#198754" }} />,
      color: "#198754"
    },
  ];

  const options = [
    ...defaultOptions,
    ...customOptions,
    { 
      value: "__create__",
      label: "Crear etiqueta",
      icon: <AddIcon sx={{ color: "#FFC247" }} />,
      color: "#25283D",
      isFixed: true
    }
  ];

  const handleChange = (selected) => {
    if (selected?.some(option => option.value === "__create__")) {
      setCreateDialogOpen(true);
      // Remove the "Crear etiqueta" option from selection
      const filteredSelection = selected.filter(option => option.value !== "__create__");
      setSelectedTags(filteredSelection);
    } else {
      setSelectedTags(selected || []);
    }
  };

  const handleSaveCustomLabel = (newLabel) => {
    setCustomOptions([...customOptions, newLabel]);
    setSelectedTags([...selectedTags, newLabel]);
  };

  const animatedComponents = makeAnimated();

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      backgroundColor: "transparent",
      borderColor: state.isFocused ? "#ffc247" : "rgba(255, 255, 255, 0.3)",
      borderRadius: "8px",
      minHeight: "40px",
      boxShadow: "none",
      cursor: "pointer",
      position: "relative",
      zIndex: 2,
      "&:hover": {
        borderColor: "#ffc247",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#25283d",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      marginTop: "4px",
      padding: "4px",
      position: "absolute",
      width: "100%",
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
      pointerEvents: "auto",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "4px",
      maxHeight: "none !important",
      overflowY: "visible",
    }),
    option: (provided, { data, isFocused, isSelected }) => ({
      ...provided,
      color: "#fff",
      backgroundColor: isSelected 
        ? data.color 
        : isFocused 
          ? "rgba(255, 255, 255, 0.1)" 
          : "transparent",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      cursor: "pointer",
      borderRadius: "4px",
      margin: "2px 0",
      "&:hover": {
        backgroundColor: data.color,
        color: "white",
        "& svg": {
          color: "white !important"
        }
      },
    }),
    multiValue: (styles, { data }) => ({
      ...styles,
      backgroundColor: data.color,
      borderRadius: "15px",
      padding: "2px 2px 2px 8px",
      margin: "2px 4px 2px 0",
      "& svg": {
        color: "white !important"
      }
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "white",
      fontSize: "0.875rem",
      padding: "0",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: "white",
      borderRadius: "0 15px 15px 0",
      padding: "0 6px",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        color: "white",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: "1rem",
      fontWeight: "400",
      letterSpacing: "0.5px",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
      margin: "0",
      padding: "0",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      "& > div": {
        color: "rgba(255, 255, 255, 0.5)",
        padding: "4px",
        "&:hover": {
          color: "#ffc247",
        },
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.5)",
      "&:hover": {
        color: "#ffc247",
      },
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.5)",
      "&:hover": {
        color: "#ffc247",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
      flexWrap: "wrap",
    }),
  };

  const formatOptionLabel = ({ label, icon, data, isSelected }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {React.cloneElement(icon, {
        sx: { 
          color: isSelected ? 'white' : icon.props.sx.color 
        }
      })}
      <span>{label}</span>
    </div>
  );

  return (
    <>
      <div style={{ position: "relative", zIndex: 100 }}>
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={options}
          styles={customStyles}
          value={selectedTags}
          onChange={handleChange}
          formatOptionLabel={formatOptionLabel}
          placeholder="+ Agregar etiquetas"
          menuPortalTarget={document.body}
          menuPosition="fixed"
        />
      </div>
      <CreateLabelDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleSaveCustomLabel}
      />
    </>
  );
};

export default SelectLabels;
