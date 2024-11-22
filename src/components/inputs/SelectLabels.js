import Select from "react-select";
import makeAnimated from "react-select/animated";

const SelectLabels = ({ selectedTags, setSelectedTags }) => {
  const options = [
    { value: "Importante", label: "Importante" },
    { value: "Urgente", label: "Urgente" },
    { value: "Escuela", label: "Escuela" },
    { value: "Bajo", label: "Bajo" },
  ];

  const animatedComponents = makeAnimated();

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "300px", 
      overflowX: "auto", 
      backgroundColor: "transparent",
      borderColor: "#ced4da",
      borderRadius: "8px",
      minHeight: "56px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#ced4da",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      overflow: "hidden", 
      flexWrap: "nowrap", 
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "#495057",
      backgroundColor: state.isSelected ? "#0d6efd" : "white",
      "&:hover": {
        backgroundColor: "#0d6efd",
        color: "white",
      },
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: "#0d6efd",
      borderRadius: "15px", 
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "white",
      borderRadius: "15px", 
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "white",
      borderRadius: "15px", 
      ":hover": {
        backgroundColor: "#dc3545",
        color: "white",
      },
    }),
  };

  return (
    <Select
      components={animatedComponents}
      isMulti
      options={options}
      value={selectedTags}
      onChange={setSelectedTags}
      styles={customStyles}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
};

export default SelectLabels;
