import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, TextField, Button, Typography, CircularProgress, Paper, Avatar,
  IconButton, Tooltip, Divider, useTheme, Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  maxWidth: '70%',
  backgroundColor: isUser ? theme.palette.primary.light : theme.palette.background.paper,
  borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
  boxShadow: theme.shadows[1],
  border: isUser ? 'none' : `1px solid ${theme.palette.divider}`,
}));

const MessageAvatar = styled(Avatar)(({ theme, isUser }) => ({
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.secondary.main,
  width: 32,
  height: 32,
  marginRight: theme.spacing(1),
}));

const InputArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export default function ChatComponent({ chatId, user }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your HealthChat AI assistant. How can I help you with your health questions today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], chatId }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prev => [...prev, data.choices[0].message]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm experiencing technical difficulties at the moment. Please try again later or contact our support team if the issue persists. Remember, for any urgent medical concerns, please consult with a healthcare professional directly." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" sx={{ fontFamily: 'var(--font-nunito), Arial, sans-serif' }}>
      <Box flexGrow={1} overflowY="auto" p={2}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
            <MessageBubble isUser={msg.role === 'user'}>
              <Box display="flex" alignItems="center" mb={1}>
                <MessageAvatar isUser={msg.role === 'user'}>
                  {msg.role === 'user' ? <PersonIcon /> : <LocalHospitalIcon />}
                </MessageAvatar>
                <Typography variant="subtitle2" fontWeight="bold" color={msg.role === 'user' ? 'primary' : 'secondary'}>
                  {msg.role === 'user' ? 'You' : 'HealthChat AI'}
                </Typography>
                {msg.role === 'assistant' && (
                  <Chip
                    label="AI"
                    size="small"
                    color="secondary"
                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
              <Typography variant="body1">{msg.content}</Typography>
            </MessageBubble>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <MessageBubble>
              <Box display="flex" alignItems="center">
                <MessageAvatar>
                  <LocalHospitalIcon />
                </MessageAvatar>
                <Typography variant="subtitle2" fontWeight="bold" color="secondary">
                  HealthChat AI
                </Typography>
                <Chip
                  label="AI"
                  size="small"
                  color="secondary"
                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} color="secondary" />
                <Typography variant="body2">Analyzing your query...</Typography>
              </Box>
            </MessageBubble>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Divider />
      <InputArea>
        <Tooltip title="Attach medical records">
          <IconButton color="primary" sx={{ mr: 1 }}>
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Describe your symptoms or ask a health question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          multiline
          maxRows={4}
          disabled={isLoading}
          sx={{ mr: 1 }}
        />
        <Tooltip title="Voice input">
          <IconButton color="primary" sx={{ mr: 1 }}>
            <MicIcon />
          </IconButton>
        </Tooltip>
        <Button
          onClick={handleSend}
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ minWidth: 'auto', p: '10px', borderRadius: '50%' }}
        >
          {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
        </Button>
        <Tooltip title="More options">
          <IconButton color="primary" sx={{ ml: 1 }}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </InputArea>
    </Box>
  );
}