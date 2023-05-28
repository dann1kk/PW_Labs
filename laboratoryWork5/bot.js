const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const botToken = '5935718472:AAE_qY754z1jnLtGMejctm7PtXfUf3L4rvU';

// Middleware
app.use(bodyParser.json());
const savedNews = {};

// Webhook route
app.post(`/bot${botToken}`, (req, res) => {
  const { message } = req.body;

  if (message && message.text) {
    const command = message.text.split(' ')[0];

    switch (command) {
      case '/start':
        sendMessage(message.chat.id, 'Hello! Welcome to the bot.');
        break;
      case '/latest_news':
        const topic = message.text.split(' ')[1];
        searchNews(message.chat.id, topic);
        break;
      case '/save_news':
        const url = message.text.split(' ')[1];
        saveNews(message.chat.id, url);
        break;
      case '/saved_news':
        getSavedNews(message.chat.id);
        break;
      default:
        sendMessage(message.chat.id, 'Invalid command.');
        break;
    }
  }

  res.sendStatus(200);
});

// Helper functions
function sendMessage(chatId, text) {
  axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    chat_id: chatId,
    text,
  });
}


async function searchNews(chatId, topic) {
    const apiKey = '3c5d8f79c96d4b87ba5e0e10be21be26';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&apiKey=${apiKey}&language=en&pageSize=5`;
  
    try {
      const response = await axios.get(url);
      const data = response.data;
  
      if (data.status === 'ok') {
        const articles = data.articles;
  
        if (articles.length > 0) {
          articles.forEach((article) => {
            sendMessage(chatId, `${article.title}\n${article.url}`);
          });
        } else {
          sendMessage(chatId, 'No news articles found on the given topic.');
        }
      } else {
        sendMessage(chatId, 'Failed to fetch news. Please try again later.');
      }
    } catch (error) {
      console.error('Error searching news:', error);
      sendMessage(chatId, 'An error occurred while searching news. Please try again later.');
    }
  }
  
  function saveNews(chatId, url) {
    if (!savedNews[chatId]) {
      savedNews[chatId] = [];
    }
  
    savedNews[chatId].push(url);
    sendMessage(chatId, 'News article saved successfully.');
  }
  
  function getSavedNews(chatId) {
    const savedUrls = savedNews[chatId] || [];
  
    if (savedUrls.length > 0) {
      savedUrls.forEach((url) => {
        sendMessage(chatId, url);
      });
    } else {
      sendMessage(chatId, 'No saved news articles found.');
    }
  }

// Start the server
app.listen(port, () => {
  console.log(`Bot server is running on port ${port}`);
});
