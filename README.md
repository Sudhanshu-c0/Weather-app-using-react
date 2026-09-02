# 🌤️ WeatherNow — React Weather App

A beautiful, responsive weather web app built with **React + Vite**.  
Enter any city name and instantly get real-time weather data powered by the OpenWeatherMap API.

![WeatherNow Preview](https://img.shields.io/badge/React-18-blue?logo=react) ![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite) ![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 🔍 Search any city worldwide
- 🌡️ Current temperature, feels like, min/max
- 💧 Humidity, 🌬️ Wind speed, 👁️ Visibility, 🔵 Pressure, 🌅 Sunrise
- 🎨 Dynamic background gradient that changes with weather (sunny, cloudy, rain, snow, thunder…)
- 🌙 Day / Night detection
- 💀 Skeleton loading state
- ⚠️ Friendly error messages for wrong city names
- 📱 Fully responsive (mobile-friendly)

## 🚀 Getting Started



### 1. Clone the repo
```bash
git clone https://github.com/Sudhanshu-c0/Weather-app-using-react.git
cd Weather-app-using-react
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API key

Create a `.env` file in the root of the project:

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

> Get a **free API key** from [openweathermap.org/api](https://openweathermap.org/api)  
> Sign up → go to **API keys** tab → copy your key.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 6 | Build tool & dev server |
| OpenWeatherMap API | Weather data |
| Vanilla CSS | Styling (glassmorphism + gradients) |

---

## 📁 Project Structure

```
weather-app/
├── public/
├── src/
│   ├── App.jsx       # Main component with all logic
│   ├── style.css     # All styles
│   └── main.jsx      # React entry point
├── .env              # ← Your API key goes here (not committed)
├── .gitignore
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚠️ Important

- Never commit your `.env` file — it's already in `.gitignore`
- The app will show a warning if the API key is missing or invalid

---

## 📜 License

MIT © [Sudhanshu Sekhar Patra](https://github.com/Sudhanshu-c0)
