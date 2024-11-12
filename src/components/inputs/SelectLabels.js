import Select from "react-select";
import makeAnimated from "react-select/animated";

const SelectLabels = ({ selectedLabels, setSelectedLabels }) => {
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
      width: "300px", // Ancho predeterminado
      overflowX: "auto", // Permitir desplazamiento horizontal
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
      overflow: "hidden", // Evitar que el contenido desborde
      flexWrap: "nowrap", // Asegurar que los chips no se envuelvan
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
      borderRadius: "15px", // Hacer los "pills" redondeados
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "white",
      borderRadius: "15px", // Asegurar que el texto dentro de los pills también sea redondeado
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "white",
      borderRadius: "15px", // Redondear el botón de eliminar
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
      value={selectedLabels}
      onChange={setSelectedLabels}
      styles={customStyles}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
};

export default SelectLabels;
