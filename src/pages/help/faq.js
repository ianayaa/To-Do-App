import React, { useState, useEffect } from "react";
import "../../styles/faqs.css";
import faqs_image from "../../assets/FAQs.jpg";
import { TextField, IconButton, Collapse, Typography, Box, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

const faqsData = [
  {
    categoria: "Gestión de Tareas",
    preguntas: [
      {
        pregunta: "¿Cómo puedo crear una nueva tarea?",
        respuesta: 'Para crear una nueva tarea, haz clic en el botón "+" en la esquina inferior derecha de la pantalla o usa el botón "Nueva Tarea" en la barra superior. Completa los detalles como título, descripción, fecha límite y prioridad.',
        keywords: ["crear", "nueva tarea", "tarea", "añadir"]
      },
      {
        pregunta: "¿Cómo organizo mis tareas por prioridad?",
        respuesta: "Puedes asignar diferentes niveles de prioridad (Alta, Media, Baja) a tus tareas al crearlas o editarlas. En la vista de tareas, puedes filtrar y ordenar por prioridad usando los controles en la parte superior.",
        keywords: ["prioridad", "organizar", "filtrar", "ordenar"]
      },
      {
        pregunta: "¿Cómo edito o elimino una tarea existente?",
        respuesta: "Para editar una tarea, haz clic en ella y selecciona el ícono de editar (lápiz). Para eliminar, usa el ícono de papelera. También puedes hacer clic derecho sobre una tarea para ver todas las opciones disponibles.",
        keywords: ["editar", "eliminar", "modificar", "borrar"]
      },
      {
        pregunta: "¿Puedo añadir subtareas a una tarea principal?",
        respuesta: "Sí, dentro de una tarea puedes añadir subtareas haciendo clic en 'Agregar Subtarea'. Esto te permite dividir tareas grandes en componentes más manejables y hacer seguimiento de su progreso individual.",
        keywords: ["subtareas", "checklist", "dividir"]
      }
    ]
  },
  {
    categoria: "Calendario y Planificación",
    preguntas: [
      {
        pregunta: "¿Cómo visualizo mis tareas en el calendario?",
        respuesta: "Las tareas se muestran automáticamente en el calendario cuando tienen una fecha asignada. Puedes cambiar entre vista mensual, semanal o diaria usando los controles en la parte superior del calendario.",
        keywords: ["calendario", "vista", "fechas"]
      },
      {
        pregunta: "¿Puedo establecer recordatorios para mis tareas?",
        respuesta: "Sí, al crear o editar una tarea, puedes configurar recordatorios. Elige cuándo y cómo quieres ser notificado (correo electrónico, notificación en la app) antes de la fecha límite.",
        keywords: ["recordatorios", "notificaciones", "alertas"]
      },
      {
        pregunta: "¿Cómo funciona la vista de agenda semanal?",
        respuesta: "La vista de agenda semanal muestra tus tareas organizadas por día, permitiéndote ver rápidamente tu carga de trabajo para la semana. Puedes arrastrar y soltar tareas entre días para reorganizar tu planificación.",
        keywords: ["agenda", "semanal", "planificación"]
      }
    ]
  },
  {
    categoria: "Colaboración y Compartir",
    preguntas: [
      {
        pregunta: "¿Cómo comparto una tarea con otros usuarios?",
        respuesta: "Para compartir una tarea, ábrela y haz clic en el ícono de compartir. Ingresa los correos electrónicos de los usuarios con quienes deseas compartirla y selecciona sus permisos (ver, editar, administrar).",
        keywords: ["compartir", "colaborar", "equipo"]
      },
      {
        pregunta: "¿Puedo asignar tareas a otros miembros del equipo?",
        respuesta: "Sí, al crear o editar una tarea, puedes asignarla a cualquier miembro de tu equipo usando el campo 'Asignar a'. Los usuarios asignados recibirán una notificación y podrán ver la tarea en su tablero.",
        keywords: ["asignar", "equipo", "miembros"]
      },
      {
        pregunta: "¿Cómo funcionan los comentarios en las tareas?",
        respuesta: "Cada tarea tiene una sección de comentarios donde los miembros del equipo pueden discutir detalles, compartir actualizaciones o hacer preguntas. Los comentarios se muestran en orden cronológico y puedes mencionar a otros usuarios usando @.",
        keywords: ["comentarios", "discusión", "mensajes"]
      }
    ]
  },
  {
    categoria: "Cuenta y Configuración",
    preguntas: [
      {
        pregunta: "¿Cómo cambio mi contraseña?",
        respuesta: 'Ve a "Configuración > Seguridad" y selecciona "Cambiar Contraseña". Deberás ingresar tu contraseña actual y la nueva contraseña dos veces para confirmar el cambio.',
        keywords: ["contraseña", "seguridad", "cambiar"]
      },
      {
        pregunta: "¿Qué incluye la cuenta Premium?",
        respuesta: "La cuenta Premium ofrece características avanzadas como: tareas recurrentes, campos personalizados, reportes detallados, integración con calendarios externos, almacenamiento ilimitado para archivos adjuntos y prioridad en el soporte técnico.",
        keywords: ["premium", "características", "beneficios"]
      },
      {
        pregunta: "¿Cómo personalizo las notificaciones?",
        respuesta: 'En "Configuración > Notificaciones" puedes personalizar qué notificaciones recibes y cómo las recibes. Puedes configurar diferentes preferencias para tareas asignadas, menciones, recordatorios y actualizaciones del equipo.',
        keywords: ["notificaciones", "alertas", "configuración"]
      }
    ]
  },
  {
    categoria: "Asistente CheckMate",
    preguntas: [
      {
        pregunta: "¿Qué es el asistente CheckMate?",
        respuesta: "CheckMate es nuestro asistente inteligente que te ayuda a organizar mejor tu tiempo. Analiza tus patrones de trabajo y te sugiere la mejor manera de programar tus tareas, además de ofrecerte recordatorios inteligentes y sugerencias de productividad.",
        keywords: ["checkmate", "asistente", "IA"]
      },
      {
        pregunta: "¿Cómo aprovecho al máximo el asistente CheckMate?",
        respuesta: "Para aprovechar CheckMate al máximo, mantén tus tareas actualizadas y completa las encuestas de retroalimentación. Cuanta más información tenga sobre tus hábitos de trabajo, mejores serán sus recomendaciones y sugerencias de planificación.",
        keywords: ["optimizar", "recomendaciones", "productividad"]
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
        <img src={faqs_image} alt="FAQ Imagen" className="faq-image" />
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
