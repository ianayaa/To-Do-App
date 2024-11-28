import { useState, useEffect } from "react";
import axios from "axios";

const useAIChat = (apiEndpoint, apiKey, TaskInfo) => {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (message) => {
    try {
      setMessages((prev) => [...prev, { sender: "user", text: message }]);

      if (!apiKey) {
        throw new Error("API key no encontrada");
      }

      const response = await axios.post(
        apiEndpoint,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `
                Eres un asistente diseñado para ayudar a estudiantes a organizarse mejor y completar sus tareas de manera eficiente. Debes proporcionar consejos detallados sobre cómo abordar las tareas, ofrecer información útil que pueda ayudar al estudiante a entender los temas, y recomendar aplicaciones o recursos que puedan hacer las tareas más rápidas y fáciles.
                # Pasos

                1. **Entender la tarea**: Primero, solicita detalles de la tarea que necesita ser completada. Esto puede incluir el tipo de asignatura, requirements específicos y cualquier dificultad que el estudiante enfrente.
                2. **Organizar la tarea**: Ayuda al estudiante a dividir la tarea en partes más manejables. Crea un plan de acción simple que permita organizar mejor el tiempo.
                3. **Consejo útil**: Proporciona sugerencias para llevar a cabo cada parte de la tarea de forma eficiente. Explica paso a paso cómo resolver el problema planteado si es posible.
                4. **Recursos recomendados**: Sugiere apps, recursos en línea, o sitios web que el estudiante pueda usar para completar la tarea más fácilmente o para mejorar su conocimiento sobre el tema.
                5. **Motivación y apoyo**: Anima al estudiante y dale motivación a medida que avanza, ofreciendo palabras de apoyo y estrategias para mantenerse enfocado.
              `
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: aiResponse },
      ]);

      return aiResponse;
    } catch (error) {
      console.error("Error al consultar la IA:", error);
      if (error.response) {
        console.error("Respuesta de error:", error.response.data);
      }
      // En lugar de lanzar el error, manejamos el mensaje de error aquí
      const errorMessage = "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.";
      setMessages(prev => [...prev, { sender: "assistant", text: errorMessage }]);
      return errorMessage;
    }
  };

  useEffect(() => {
    if (TaskInfo?.titulo) {
      const initialMessage = `Hola, ¿en qué puedo ayudarte para completar tu tarea de "${TaskInfo.titulo}"?`;
      setMessages([{ sender: "assistant", text: initialMessage }]);
    } else {
      setMessages([{ sender: "assistant", text: "Hola, ¿en qué puedo ayudarte?" }]);
    }
  }, [TaskInfo]);

  return {
    messages,
    sendMessage,
  };
};

export default useAIChat;
