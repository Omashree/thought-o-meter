# The Thought-O-Meter 🤖
Welcome to The Thought-O-Meter, a fun and interactive web application designed to teach 6th graders about the basics of Sentiment Analysis! 🚀

---

## 🌐 Live Demo

You can check out the live version of the application here:

👉 [https://thought-o-meter.netlify.app](https://thought-o-meter.netlify.app)

---

## 📚 About the Project
Join Lily 👧 and her robot friend, Robo 🤖, on an exciting adventure to discover how a special machine called the "Thought-O-Meter" can understand feelings from words. This project uses a friendly story, interactive exercises, and a simple demo to make learning about AI and machine learning both easy and fun.

---

## ✨ Features
* **Interactive Storyline:** A step-by-step story that explains the core concepts of sentiment analysis. 📖
* **Built-in Exercises:** Fun, multiple-choice questions throughout the story to test your knowledge. 🧠
* **Live Sentiment Analyzer:** An interactive demo where you can type your own sentences and see how the "Thought-O-Meter" analyzes their feelings. 💬
* **Engaging UI/UX:** A mobile-responsive and visually appealing design tailored for young learners. 🧪

---

## 💻 Technologies Used
This project is built using the MERN stack with a focus on a single-file React frontend for simplicity and a conceptual backend.

* **Frontend:** React, Tailwind CSS
* **Backend:** Express.js, MongoDB (via Mongoose)

---

## ⚙️ How to Run the App
To get the "Thought-O-Meter" up and running, you'll need to run both the backend and the frontend.

**1. Backend Setup**
  1. The backend is a simple Express.js server that serves the story content and performs the sentiment analysis.
  2. Make sure you have Node.js and MongoDB installed.
  3. Navigate to your backend folder in the terminal: `cd backend`.
  4. Install the required packages: `npm install express mongoose cors`.
  5. Start the backend server: `node index.js`

💡 Important: The `index.js` file is configured to automatically populate the database when you run it for the first time.

**2. Frontend Setup**
  The frontend is a single-file React application that connects to the backend API.
    1. Navigate to your frontend folder in the terminal: `cd frontend`.
    2. Install the required packages: `npm install`.
    3. Start the frontend server: `npm run dev`
  Now, you can interact with the app, go through the story, and test the sentiment analyzer!

Happy learning! 🎉
