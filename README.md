# VoteWise India 🇮🇳

VoteWise India is a multilingual, AI-powered election assistant designed to educate and empower Indian voters. Built specifically for the **Promptswar Hackathon**.

## 🌟 Features

- **🗣️ Multilingual Accessibility**: Full support for 14 Indian languages, ensuring voters across the nation can access vital information.
- **🤖 Gemini AI Chat**: A nonpartisan AI guide capable of explaining the Model Code of Conduct, NOTA, EVM usage, and polling booth rules.
- **📰 Live Election News**: Dynamic fetching of the latest political news, tailored with relevant images to keep voters informed.
- **⚡ Premium UI**: Built with Next.js and styled with culturally resonant Indian-flag themes and seamless dark/light modes.

## 📸 Dashboard Preview

### 🏠 Home Page
![Home Page](screenshots/home.png)

### 🤖 AI Chat Assistant (Hindi Example)
![AI Chat](screenshots/chat.png)

### 📰 Live News Feed
![News Feed](screenshots/news.png)

### 🛠️ Interactive Voter Tools
![Voter Tools](screenshots/tools.png)

## 🚀 Tech Stack

- **Framework**: Next.js 14 App Router
- **AI Integration**: Google Gemini (`@google/genai`)
- **News APIs**: GNews.io and NewsData.io
- **Styling**: Vanilla CSS with localized fonts
- **Deployment**: Google Cloud Run

## 📥 Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Configuration

Create a `.env.local` file and add the required API keys:
```env
GEMINI_API_KEY=your_gemini_key_here
GNEWS_API_KEY=your_gnews_key_here
NEWSDATA_API_KEY=your_newsdata_key_here
```
