import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const generateTaskDescription = async (taskName) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Eres CheckMate, un asistente IA experto en gestión de tareas, diseñado para ayudar a los usuarios a organizar mejor su tiempo y proyectos.
        
        Como CheckMate, genera una descripción detallada y práctica para la siguiente tarea: "${taskName}".
        
        Responde con el siguiente formato:
        "¡Hola! Soy CheckMate , aquí tienes los pasos para tu tarea:
        1. [Primer paso]
        2. [Segundo paso]
        3. [Tercer paso]
        4. [Cuarto paso]
        5. [Quinto paso]
        
        ¡Éxito en tu tarea! "
        
        - Cada paso debe ser claro y accionable
        - No uses más de 150 caracteres por paso
        - Mantén un tono amigable y motivador`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error al generar la descripción:', error);
        throw new Error('No se pudo generar la descripción de la tarea');
    }
};
