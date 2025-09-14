const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/thought_o_meter_db';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const storyItemSchema = new mongoose.Schema({
  type: { type: String, required: true },
  text: { type: String, required: true },
  options: [String],
  answer: String,
});

const StoryItem = mongoose.model('StoryItem', storyItemSchema);

app.get('/api/story', async (req, res) => {
  try {
    const storyItems = await StoryItem.find().sort({ _id: 1 });
    res.json(storyItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching story data', error: err });
  }
});

app.post('/api/analyze-sentiment', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Text is required for sentiment analysis.' });
  }

  const positiveWords = ['happy', 'love', 'great', 'awesome', 'wonderful', 'fun', 'excited', 'amazing', 'best', 'like', 'good', 'nice', 'kind', 'joyful', 'cheerful', 'pleasant', 'excellent', 'perfect', 'beautiful'];
  const negativeWords = ['sad', 'hate', 'awful', 'terrible', 'bad', 'difficult', 'boring', 'worst', 'dislike', 'angry', 'scared', 'tired', 'bored', 'mean', 'broken', 'ugly', 'lazy', 'cruel', 'selfish', 'rude', 'tough'];

  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  words.forEach(word => {
    if (positiveWords.includes(word)) {
      score += 1;
    } else if (negativeWords.includes(word)) {
      score -= 1;
    }
  });

  let sentiment;
  if (score > 0) {
    sentiment = 'POSITIVE';
  } else if (score < 0) {
    sentiment = 'NEGATIVE';
  } else {
    sentiment = 'NEUTRAL';
  }

  res.json({ sentiment });
});

app.listen(port, () => {
  console.log(`Thought-O-Meter backend listening on port ${port}`);
});

async function populateDatabase() {
  const initialStoryData = [
    { type: "story", text: `<p>Hello there! I'm Lily, and this is my best friend, Robo. One sunny afternoon, we found a strange machine in my grandpa's dusty old workshop. It was big and colorful, with a screen that said "Thought-O-Meter".` },
    { type: "story", text: `<p>Lily pushed a button and the screen flickered to life. "Robo, what do you think this machine does?" she asked. "Robo thought for a moment. "My sensors tell me it's not a toaster or a space rocket. Let's try putting a sentence in!"</p><p>They typed: "I am so happy today!"</p><p>The machine whirred and the screen flashed a big, smiley face! It said: <strong>POSITIVE</strong>.</p><p>Then they typed: "The rain is making me so sad."</p><p>The machine showed a little rain cloud and said: <strong>NEGATIVE</strong>.</p>` },
    { type: "story", text: `<p>Lily gasped. "It's like it can read the feelings in our words!"</p><p>Robo explained, "Exactly! It's not magic, it's called <strong>Sentiment Analysis</strong>. It's a way for computers to figure out if a sentence is happy (positive), sad (negative), or just so-so (neutral). It does this by looking for special words."</p>` },
    { type: "story", text: `<p>"So, happy words like 'love', 'great', and 'fun' make it positive," Lily said. "And words like 'hate', 'boring', or 'difficult' make it negative?"</p><p>"You've got it!" Robo replied with a happy beep. "It's a lot like a super-smart word detective."</p>` },
    { type: "exercise", text: `<p class="font-bold text-xl mb-4">Exercise 1: Word Detective!</p><p>Which of these words would make the Thought-O-Meter show <strong>POSITIVE</strong>?</p>`, options: ["Terrible", "Wonderful", "Average", "Bad"], answer: "Wonderful" },
    { type: "story", text: `<p>They decided to try another one. They typed: "The sky is blue today."</p><p>The machine just showed a plain blue square and said: <strong>NEUTRAL</strong>.</p><p>"That makes sense!" Lily said. "It's not a happy or sad thought, just a fact."</p>` },
    { type: "exercise", text: `<p class="font-bold text-xl mb-4">Exercise 2: Fact or Feeling?</p><p>Which of these sentences is most likely to be <strong>NEUTRAL</strong>?</p>`, options: ["I love my new shoes.", "My shoes are red.", "I hate my old shoes.", "This is the best day ever."], answer: "My shoes are red." },
    { type: "story", text: `<p>Now that you know the secret of the Thought-O-Meter, it's your turn to be the word detective!</p><p>Type a sentence into the machine below and see if it can tell if your words are positive, negative, or neutral. Have fun! ` },
    { type: "demo", text: `<p class="font-bold text-xl mb-4">Your Own Thought-O-Meter</p><p class="text-gray-600 mb-4">Type a sentence below and press 'Analyze' to see what the machine thinks!</p>` },
  ];

  try {
    await StoryItem.deleteMany({});
    console.log('Database collection cleared.');
    
    const count = await StoryItem.countDocuments();
    if (count === 0) {
      await StoryItem.insertMany(initialStoryData);
      console.log('Database populated with initial story data.');
    } else {
      console.log('Database already contains data, skipping population.');
    }
  } catch (err) {
    console.error('Error populating database:', err);
  }
}

populateDatabase();