'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, List, ListItem, ListItemText, Typography, Button, AppBar, Toolbar, 
  IconButton, Avatar, Tooltip, useMediaQuery, Divider, TextField,
  Chip, Menu, MenuItem, ListItemIcon, CircularProgress
} from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { auth, db } from '../utils/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import ChatComponent from '../components/Chat';
import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-nunito), Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2', // Medical blue
      light: '#63a4ff',
      dark: '#004ba0',
    },
    secondary: {
      main: '#388e3c', // Healing green
      light: '#6abf69',
      dark: '#00600f',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
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
          textTransform: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
        },
      },
    },
  },
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const ChatListContainer = styled(Box)(({ theme }) => ({
  width: '300px',
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  overflowY: 'auto',
  height: '100%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 'auto',
    maxHeight: '300px',
    borderRight: 'none',
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: '#f5f5f5',
  [theme.breakpoints.down('md')]: {
    height: 'calc(100% - 300px)', // Adjust this value based on your ChatListContainer height
  },
}));

const DisclaimerBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.warning.main}`,
}));

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChatForMenu, setSelectedChatForMenu] = useState(null);
  const router = useRouter();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const chatsQuery = query(
          collection(db, 'chats'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const chatsUnsubscribe = onSnapshot(chatsQuery, (snapshot) => {
          const chatList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setChats(chatList);
          if (chatList.length > 0 && !selectedChat) {
            setSelectedChat(chatList[0].id);
          }
        });

        return () => chatsUnsubscribe();
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router, selectedChat]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const startNewChat = async () => {
    try {
      const newChatRef = await addDoc(collection(db, 'chats'), {
        userId: user.uid,
        createdAt: serverTimestamp(),
        title: 'New Consultation'
      });
      setSelectedChat(newChatRef.id);
    } catch (error) {
      console.error('Failed to start new chat', error);
    }
  };

  const handleChatMenuOpen = (event, chatId) => {
    setAnchorEl(event.currentTarget);
    setSelectedChatForMenu(chatId);
  };

  const handleChatMenuClose = () => {
    setAnchorEl(null);
    setSelectedChatForMenu(null);
  };

  const handleDeleteChat = async () => {
    if (selectedChatForMenu) {
      try {
        await deleteDoc(doc(db, 'chats', selectedChatForMenu));
        if (selectedChat === selectedChatForMenu) {
          setSelectedChat(chats.length > 1 ? chats[0].id : null);
        }
      } catch (error) {
        console.error('Failed to delete chat', error);
      }
    }
    handleChatMenuClose();
  };

  const handleRenameChat = () => {
    // Implement rename functionality
    handleChatMenuClose();
  };

  const handleArchiveChat = () => {
    // Implement archive functionality
    handleChatMenuClose();
  };

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chatList = (
    <ChatListContainer>
      <Box p={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search consultations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={startNewChat}
          sx={{ mt: 2 }}
        >
          New Consultation
        </Button>
      </Box>
      <Divider />
      <List>
        {filteredChats.map((chat) => (
          <ListItem
            key={chat.id}
            button
            onClick={() => setSelectedChat(chat.id)}
            selected={selectedChat === chat.id}
          >
            <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
              <LocalHospitalIcon />
            </Avatar>
            <ListItemText
              primary={chat.title}
              secondary={chat.createdAt ? new Date(chat.createdAt.toDate()).toLocaleString() : 'Just now'}
            />
            <IconButton edge="end" onClick={(event) => handleChatMenuOpen(event, chat.id)}>
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </ChatListContainer>
  );

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flexDirection="column" height="100vh" sx={{ fontFamily: 'var(--font-nunito), Arial, sans-serif' }}>
        <StyledAppBar position="static">
          <Toolbar>
            <LocalHospitalIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              HealthChat AI
            </Typography>
            {!isLargeScreen && (
              <Tooltip title="Start a new consultation">
                <IconButton color="inherit" onClick={startNewChat}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Settings">
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Help">
              <IconButton color="inherit">
                <HelpIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Log out">
              <IconButton color="inherit" onClick={handleLogout}>
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </StyledAppBar>
        <Box display="flex" flexDirection={isLargeScreen ? 'row' : 'column'} flexGrow={1}>
          {isLargeScreen && chatList}
          <MainContent>
            <DisclaimerBox>
              <Typography variant="body2" color="text.secondary">
                <InfoIcon sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.warning.dark }} />
                Medical Disclaimer: The information provided by HealthChat AI is for general informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </Typography>
            </DisclaimerBox>
            <ChatComponent chatId={selectedChat} user={user} />
          </MainContent>
          {!isLargeScreen && chatList}
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleChatMenuClose}
      >
        <MenuItem onClick={handleRenameChat}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Rename
        </MenuItem>
        <MenuItem onClick={handleArchiveChat}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          Archive
        </MenuItem>
        <MenuItem onClick={handleDeleteChat}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </ThemeProvider>
  );
}