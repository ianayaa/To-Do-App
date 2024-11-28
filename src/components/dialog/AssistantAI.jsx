import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import useAIChat from "../../hooks/Assistant/useAIChat";

const AssistantAI = ({ open, onClose, TaskInfo }) => {
  const apiEndpoint = "https://api.openai.com/v1/chat/completions";
  const apiKey = process.env.REACT_APP_OPEN_AI_KEY;
  const messagesEndRef = useRef(null);
  const { messages, sendMessage } = useAIChat(apiEndpoint, apiKey, TaskInfo);

  const [input, setInput] = useState("");
  const [typewrittenResponse, setTypewrittenResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (!open) return;
    const scrollElement = messagesEndRef.current;
    if (scrollElement) {
      try {
        window.requestAnimationFrame(() => {
          scrollElement.scrollIntoView?.({ behavior: "smooth" });
        });
      } catch (error) {
        console.warn('Error al hacer scroll:', error);
      }
    }
  }, [open]);

  useEffect(() => {
    if (open && messages.length > 0) {
      const timeoutId = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, typewrittenResponse, open, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    try {
      setIsTyping(true);
      const botResponse = await sendMessage(input);
      setInput("");
      setTypewrittenResponse("");

      for (let i = 0; i < botResponse.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
        setTypewrittenResponse((prev) => prev + botResponse[i]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Fade}
      transitionDuration={300}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          backgroundColor: "#ffffff",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(4px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "80vh",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#25283d",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 2,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            backgroundColor: "#FFC247",
          },
        }}
      >
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "4px 12px",
          borderRadius: "20px",
        }}>
          <SmartToyIcon sx={{ fontSize: 24 }} />
          <Typography variant="h6" sx={{ 
            fontWeight: "600",
            fontSize: "1.1rem",
            letterSpacing: "0.5px",
          }}>
            CheckMate - Asistente Virtual
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            marginLeft: "auto",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              transform: "rotate(90deg)",
              transition: "all 0.3s ease-in-out",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent 
        sx={{ 
          p: 2,
          pb: 1,
          backgroundColor: "#f8f9fa",
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100% - 64px)', // Altura total menos el header
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            flex: 1,
            overflowY: "auto",
            p: 2,
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#FFC247",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#FFD47F",
              },
            },
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "70%",
                backgroundColor: message.sender === "user" ? "#25283d" : "#FFC247",
                color: message.sender === "user" ? "#ffffff" : "#000000",
                padding: "12px 16px",
                borderRadius: "16px",
                borderTopRightRadius: message.sender === "user" ? "4px" : "16px",
                borderTopLeftRadius: message.sender === "user" ? "16px" : "4px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  [message.sender === "user" ? "right" : "left"]: "-8px",
                  borderStyle: "solid",
                  borderWidth: "8px 8px 0 0",
                  borderColor: message.sender === "user" 
                    ? "#25283d transparent transparent transparent"
                    : "#FFC247 transparent transparent transparent",
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: "600",
                  color: message.sender === "user" ? "#ffffff" : "#25283d",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  marginBottom: "4px",
                }}
              >
                {message.sender === "user" ? (
                  <>
                    <PersonIcon sx={{ fontSize: 18 }} />
                    Tú
                  </>
                ) : (
                  <>
                    <SmartToyIcon sx={{ fontSize: 18 }} />
                    CheckMate
                  </>
                )}
              </Typography>

              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: 1.5,
                  "& b": {
                    color: message.sender === "user" ? "#FFC247" : "#25283d",
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: (isTyping && message.sender !== "user" && messages.length - 1 === index
                    ? typewrittenResponse
                    : message.text
                  ).replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                   .replace(/\n/g, "<br>"),
                }}
              />
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 2,
            mb: 0,
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje aquí..."
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.1)",
                },
                "&:hover fieldset": {
                  borderColor: "#FFC247",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#FFC247",
                },
              },
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            sx={{
              minWidth: "50px",
              height: "50px",
              borderRadius: "12px",
              backgroundColor: "#FFC247",
              color: "#25283d",
              "&:hover": {
                backgroundColor: "#FFD47F",
                transform: "translateY(-2px)",
                transition: "all 0.2s ease-in-out",
              },
              "&:disabled": {
                backgroundColor: "#e0e0e0",
                color: "#9e9e9e",
              },
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AssistantAI;
