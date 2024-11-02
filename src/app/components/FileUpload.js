import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, IconButton, Avatar, Fade, Paper, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-nunito), Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    secondary: {
      main: '#ff7043',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-nunito), Arial, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-nunito), Arial, sans-serif',
          borderRadius: '25px',
        },
      },
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  width: 350,
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  fontFamily: 'var(--font-nunito), Arial, sans-serif',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #81c784 0%, #4caf50 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1, 2),
  borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[200],
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  marginBottom: theme.spacing(1),
  wordWrap: 'break-word',
}));

const typingAnimation = keyframes`
  0% { opacity: .2; }
  20% { opacity: 1; }
  100% { opacity: .2; }
`;

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& span': {
    width: 6,
    height: 6,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    display: 'inline-block',
    margin: '0 2px',
    animation: `${typingAnimation} 1.4s infinite both`,
    '&:nth-of-type(2)': {
      animationDelay: '.2s',
    },
    '&:nth-of-type(3)': {
      animationDelay: '.4s',
    },
  },
}));

const StyledSendButton = styled(Button)(({ theme }) => ({
  minWidth: '56px',
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  padding: 0,
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 4px 10px rgba(255, 112, 67, 0.3)',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 14px rgba(255, 112, 67, 0.4)',
  },
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 2px 6px rgba(255, 112, 67, 0.4)',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[500],
  },
}));

const SendIconWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'rotate(15deg)',
  },
}));


export default function PopupChat({ user, onClose }) {
  const [isOpen, setIsOpen] = useState(!!onClose);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Please be careful not to share any sensitive information. We are happy to provide you to instant access to the best health information and advise to consult a doctor for serious issues." },
    { role: 'assistant', content: "Hello, how may we assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prev => [...prev, data.choices[0].message]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble responding right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  if (!isOpen && !onClose) {
    return (
      <ThemeProvider theme={theme}>
        <Fade in={true}>
          <IconButton
            onClick={() => setIsOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              zIndex: 1000,
              width: 60,
              height: 60,
              borderRadius: '50%',
            }}
          >
            <ChatIcon fontSize="large" />
          </IconButton>
        </Fade>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Fade in={isOpen}>
        <StyledPaper elevation={6}>
          <ChatHeader>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.light', mr: 1 }}>
                <HealthAndSafetyIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>HealthBot</Typography>
            </Box>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </ChatHeader>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                {msg.role === 'assistant' && (
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
                    <HealthAndSafetyIcon fontSize="small" />
                  </Avatar>
                )}
                <MessageBubble isUser={msg.role === 'user'}>
                  <Typography variant="body2">{msg.content}</Typography>
                </MessageBubble>
              </Box>
            ))}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
                  <HealthAndSafetyIcon fontSize="small" />
                </Avatar>
                <MessageBubble>
                  <TypingIndicator>
                    <span></span>
                    <span></span>
                    <span></span>
                  </TypingIndicator>
                </MessageBubble>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your health question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                inputRef={inputRef}
                sx={{ 
                  mr: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '28px',
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.secondary.main,
                    },
                  },
                }}
                disabled={isTyping}
              />
              <StyledSendButton
                type="submit"
                disabled={isTyping || !input.trim()}
                aria-label="Send message"
              >
                <SendIconWrapper>
                  {isTyping ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <SendIcon fontSize="medium" />
                  )}
                </SendIconWrapper>
              </StyledSendButton>
            </form>
          </Box>
        </StyledPaper>
      </Fade>
    </ThemeProvider>
  );
}