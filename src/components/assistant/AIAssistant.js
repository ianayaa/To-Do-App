import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Fade,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRobot } from '@fortawesome/free-solid-svg-icons';
import { sendMessage } from '../../services/aiService';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage([...messages, userMessage]);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.'
      }]);
    }

    setIsLoading(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '500px',
        width: '100%',
        backgroundColor: '#25283D',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#FFC247',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <FontAwesomeIcon icon={faRobot} />
          Asistente IA
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
            }}
          >
            <Paper
              sx={{
                p: 2,
                backgroundColor:
                  message.role === 'user'
                    ? 'rgba(255, 194, 71, 0.1)'
                    : 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography>{message.content}</Typography>
            </Paper>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <CircularProgress size={20} sx={{ color: '#FFC247' }} />
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          multiline
          maxRows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 194, 71, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FFC247',
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          sx={{
            color: '#FFC247',
            backgroundColor: 'rgba(255, 194, 71, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 194, 71, 0.2)',
            },
            '&.Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default AIAssistant;
