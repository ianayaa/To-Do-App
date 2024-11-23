const CLAUDE_API_KEY = process.env.REACT_APP_CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export const sendMessage = async (messages) => {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
      }),
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error al enviar mensaje a Claude:', error);
    throw error;
  }
};
