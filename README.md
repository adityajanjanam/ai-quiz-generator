# AI Quiz Generator

A modern React application that generates interactive quizzes on any topic using Google's Gemini AI.

## Features

- Dynamic quiz generation on any topic
- Interactive multiple-choice questions
- Real-time answer checking
- Score tracking
- Modern, responsive UI
- Smooth animations and transitions

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Google Gemini API key

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/adityajanjanam/ai-quiz-generator.git
   cd ai-quiz-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   REACT_APP_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it in your `.env` file

## Usage

1. Enter any topic in the input field (e.g., "Quantum Physics", "Ancient Rome", "Machine Learning")
2. Click "Generate Quiz"
3. Select your answers
4. Click "Check Answers" to see your score

## Technologies Used

- React
- Google Gemini AI
- CSS-in-JS
- Modern JavaScript (ES6+)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
