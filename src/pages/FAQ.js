import React, { useState, useEffect } from "react";
import "../styles/FAQS.css";
import faqImage from "../assets/FAQs.jpg";
import { TextField, IconButton, Collapse, Typography, Box, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

const faqsData = [
  {
    categoria: "Gestión de Tareas",
    preguntas: [
      {
        pregunta: "¿Cómo puedo gestionar mis tareas?",
        respuesta: 'Puedes gestionar tus tareas accediendo al menú de "Tareas". Allí podrás crear, editar y eliminar tareas de acuerdo a tus necesidades.',
        keywords: ["tareas", "gestión", "crear", "editar", "eliminar"]
      },
      {
        pregunta: "¿Cómo mostrar mis tareas en el calendario?",
        respuesta: "Las tareas se mostrarán automáticamente en el calendario cuando les asignes una fecha. Puedes revisar y organizar tus tareas directamente desde el calendario.",
        keywords: ["calendario", "fecha", "organizar"]
      }
    ]
  },
  {
    categoria: "Asistente y Premium",
    preguntas: [
      {
        pregunta: "¿Cómo utilizo el asistente CheckMate?",
        respuesta: "El asistente CheckMate te ayuda a organizar tus tareas y optimizar tu tiempo. Puedes acceder a él desde el menú principal y seguir las instrucciones para configurarlo.",
        keywords: ["checkmate", "asistente", "ayuda"]
      },
      {
        pregunta: "¿Cómo mejorar tu cuenta a PREMIUM?",
        respuesta: 'Para actualizar a una cuenta PREMIUM, ve a la sección de "Configuración" y selecciona la opción de mejora. Sigue los pasos indicados para completar la actualización.',
        keywords: ["premium", "actualizar", "mejora"]
      }
    ]
  },
  {
    categoria: "Personalización",
    preguntas: [
      {
        pregunta: "¿Cómo puedo personalizar la visualización de la interfaz?",
        respuesta: 'Dirígete a "Configuración" donde encontrarás opciones para cambiar colores, temas y el diseño de la interfaz, permitiéndote ajustarlo a tu preferencia.',
        keywords: ["personalizar", "interfaz", "temas", "diseño"]
      }
    ]
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState(faqsData);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const filtered = faqsData.map(category => ({
      ...category,
      preguntas: category.preguntas.filter(faq => 
        faq.pregunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.respuesta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })).filter(category => category.preguntas.length > 0);
    
    setFilteredFaqs(filtered);
  }, [searchTerm]);

  const toggleRespuesta = (categoryIndex, questionIndex) => {
    const newIndex = activeIndex === `${categoryIndex}-${questionIndex}` ? null : `${categoryIndex}-${questionIndex}`;
    setActiveIndex(newIndex);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    setSearchTerm("");
  };

  return (
    <div className="faq-container">
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Preguntas Frecuentes
        </Typography>
        <img src={faqImage} alt="FAQ Imagen" className="faq-image" />
      </Box>

      <Box sx={{ mb: 4, display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
        {faqsData.map((category, index) => (
          <Chip
            key={index}
            label={category.categoria}
            onClick={() => handleCategoryClick(category.categoria)}
            color={selectedCategory === category.categoria ? "primary" : "default"}
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>

      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <TextField
          variant="outlined"
          placeholder="Buscar preguntas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "action.active", mr: 1 }} />,
          }}
          sx={{ width: "100%", maxWidth: 500 }}
        />
      </Box>

      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        {filteredFaqs.map((category, categoryIndex) => (
          <Box key={categoryIndex} sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: "primary.main" }}>
              {category.categoria}
            </Typography>
            {category.preguntas.map((faq, questionIndex) => (
              <Box
                key={questionIndex}
                sx={{
                  mb: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Box
                  onClick={() => toggleRespuesta(categoryIndex, questionIndex)}
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    bgcolor: activeIndex === `${categoryIndex}-${questionIndex}` ? "action.selected" : "background.paper",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: "medium" }}>
                    {faq.pregunta}
                  </Typography>
                  <IconButton
                    sx={{
                      transform: activeIndex === `${categoryIndex}-${questionIndex}` ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.3s",
                    }}
                    aria-label={activeIndex === `${categoryIndex}-${questionIndex}` ? "Cerrar respuesta" : "Ver respuesta"}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                <Collapse in={activeIndex === `${categoryIndex}-${questionIndex}`}>
                  <Box sx={{ p: 2, bgcolor: "background.default" }}>
                    <Typography variant="body1">{faq.respuesta}</Typography>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Box sx={{ textAlign: "center", mt: 4, pb: 4 }}>
        <Typography variant="h6" gutterBottom>
          ¿No encontraste lo que buscabas?
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <ContactSupportIcon color="primary" />
          <Typography>
            Contáctanos en <a href="mailto:dotime@ayuda.com">dotime@ayuda.com</a>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default FAQ;
