import React from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faExclamation,
  faMinus,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";

const priorities = [
  {
    value: "alta",
    label: "Alta",
    icon: <FontAwesomeIcon icon={faExclamation} style={{ color: "#f44336" }} />,
    color: "#f44336"
  },
  {
    value: "normal",
    label: "Normal",
    icon: <FontAwesomeIcon icon={faMinus} style={{ color: "#FFC247" }} />,
    color: "#FFC247"
  },
  {
    value: "baja",
    label: "Baja",
    icon: <FontAwesomeIcon icon={faArrowDown} style={{ color: "#4CAF50" }} />,
    color: "#4CAF50"
  }
];

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
    zIndex: 9999,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
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
    "& svg": {
      color: isSelected ? "white !important" : `${data.color} !important`
    },
    "&:hover": {
      backgroundColor: data.color,
      color: "white",
      "& svg": {
        color: "white !important"
      }
    },
  }),
  singleValue: (provided, { data }) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "white",
    backgroundColor: data.color,
    padding: "2px 8px",
    borderRadius: "15px",
    "& svg": {
      color: "white !important"
    }
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
  input: (provided) => ({
    ...provided,
    color: "white",
    margin: "0",
    padding: "0",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "1rem",
    fontWeight: "400",
    letterSpacing: "0.5px",
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
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "rgba(255, 255, 255, 0.5)",
    "&:hover": {
      color: "#ffc247",
    },
  }),
};

const PrioritySelect = ({ value, onChange, isDisabled }) => {
  const selectedOption = priorities.find(p => p.value === value);

  return (
    <div style={{ position: 'relative', zIndex: 2 }}>
      <Select
        value={selectedOption}
        onChange={(option) => onChange(option.value)}
        options={priorities}
        styles={customStyles}
        formatOptionLabel={({ label, icon }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon}
            <span>{label}</span>
          </div>
        )}
        placeholder="Prioridad"
        isSearchable={false}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default PrioritySelect;
