import React, { useState } from "react";
import "../styles/FAQS.css";
import faqImage from "../assets/FAQs.jpg";

const faqsData = [
  {
    pregunta: "¿Cómo puedo gestionar mis tareas?",
    respuesta:
      'Puedes gestionar tus tareas accediendo al menú de "Tareas". Allí podrás crear, editar y eliminar tareas de acuerdo a tus necesidades.',
  },
  {
    pregunta: "¿Cómo utilizo el asistente CheckMate?",
    respuesta:
      "El asistente CheckMate te ayuda a organizar tus tareas y optimizar tu tiempo. Puedes acceder a él desde el menú principal y seguir las instrucciones para configurarlo.",
  },
  {
    pregunta: "¿Cómo mejorar tu cuenta a PREMIUM?",
    respuesta:
      'Para actualizar a una cuenta PREMIUM, ve a la sección de "Configuración" y selecciona la opción de mejora. Sigue los pasos indicados para completar la actualización.',
  },
  {
    pregunta: "¿Cómo mostrar mis tareas en el calendario?",
    respuesta:
      "Las tareas se mostrarán automáticamente en el calendario cuando les asignes una fecha. Puedes revisar y organizar tus tareas directamente desde el calendario.",
  },
  {
    pregunta: "¿Cómo puedo personalizar la visualización de la interfaz?",
    respuesta:
      'Dirígete a "Configuración" donde encontrarás opciones para cambiar colores, temas y el diseño de la interfaz, permitiéndote ajustarlo a tu preferencia.',
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleRespuesta = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-container">
      <h2>FAQs</h2>
      <img src={faqImage} alt="FAQ Imagen" className="faq-image" />

      <ul className="faq-list">
        {faqsData.map((faq, index) => (
          <li
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleRespuesta(index)}
          >
            <strong>{faq.pregunta}</strong>
            {activeIndex === index && (
              <div className="respuesta">{faq.respuesta}</div>
            )}
          </li>
        ))}
      </ul>
      <div className="contact">
        <p>
          Contáctanos
          <br />
          dotime@ayuda.com
        </p>
      </div>
    </div>
  );
};

export default FAQ;
