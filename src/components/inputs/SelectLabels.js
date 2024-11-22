import Select from "react-select";
import makeAnimated from "react-select/animated";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const SelectLabels = ({ selectedTags, setSelectedTags }) => {
  const options = [
    { 
      value: "Importante", 
      label: "Importante",
      icon: <PriorityHighIcon sx={{ color: "#dc3545" }} />,
      color: "#dc3545" // Rojo
    },
    { 
      value: "Urgente", 
      label: "Urgente",
      icon: <NotificationsActiveIcon sx={{ color: "#fd7e14" }} />,
      color: "#fd7e14" // Naranja
    },
    { 
      value: "Escuela", 
      label: "Escuela",
      icon: <SchoolIcon sx={{ color: "#0d6efd" }} />,
      color: "#0d6efd" // Azul
    },
    { 
      value: "Bajo", 
      label: "Bajo",
      icon: <AccessTimeIcon sx={{ color: "#198754" }} />,
      color: "#198754" // Verde
    },
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
    option: (provided, { data }) => ({
      ...provided,
      color: "#495057",
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      "&:hover": {
        backgroundColor: data.color,
        color: "white",
      },
    }),
    multiValue: (styles, { data }) => ({
      ...styles,
      backgroundColor: data.color,
      borderRadius: "15px",
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "white",
      borderRadius: "15px",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: "white",
      "&:hover": {
        backgroundColor: data.color,
        opacity: "0.8",
      },
    }),
  };

  const formatOptionLabel = ({ label, icon }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {icon}
      <span>{label}</span>
    </div>
  );

  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      options={options}
      styles={customStyles}
      value={selectedTags}
      onChange={setSelectedTags}
      formatOptionLabel={formatOptionLabel}
      placeholder="Seleccionar etiquetas..."
    />
  );
};

export default SelectLabels;
