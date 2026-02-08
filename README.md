# Typing Speed Test App

A modern, responsive typing speed test application built with **Next.js, TypeScript, and Tailwind CSS**.
It allows users to measure their typing performance in real-time with detailed analytics, difficulty levels, and persistent high-score tracking.

---

## 🚀 Features

### ⌨️ Typing Test Engine

- Real-time typing input tracking
- Character-by-character validation
- Persistent error tracking
- Backspace correction support
- Visual cursor position indicator

### 📊 Live Statistics

- Words Per Minute (WPM)
- Accuracy percentage
- Elapsed / remaining time
- Correct & incorrect character counts

### ⏱️ Test Modes

- **Timed Mode (60s)** — countdown timer
- **Passage Mode** — unlimited time, count-up timer
- Early completion supported in both modes

### 🎚️ Difficulty Levels

- Easy
- Medium
- Hard
  Passages are randomly loaded from a local `data.json` file.

### 🏆 Personal Best System

- Persistent high score via `localStorage`
- First test → _Baseline Established_
- New record → _High Score Smashed_

### 🔁 Restart Functionality

- Restart anytime
- Loads a new random passage
- Resets stats and timer

### 🧊 Start Overlay

- Blurred inactive passage
- Centered start CTA
- Start via button or typing

### 📱 Fully Responsive

- Mobile dropdown controls
- Adaptive stat layout
- Responsive header elements

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Animation:** canvas-confetti
- **Persistence:** localStorage

---

## 📂 Project Structure

```
app/
  page.tsx

components/
  header.tsx
  controls.tsx
  stats-bar.tsx
  passage.tsx
  results.tsx

data.json
```

---

## ⚙️ Installation

```bash
git clone https://github.com/yourusername/typing-speed-test.git

cd typing-speed-test

npm install

npm run dev
```

App runs on:

```
http://localhost:3000
```

---

## 🧪 Testing Personal Best

Reset storage in browser console:

```js
localStorage.removeItem("typing-personal-best");
```

---

## 📌 Future Improvements

- Leaderboard system
- User accounts
- More test durations
- Sound effects
- Theme customization

---

## 🧑‍💻 Author

**MERIT**
Frontend Developer

GitHub: [https://github.com/yourusername](https://github.com/solawaleayomide)
