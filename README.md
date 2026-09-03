# Neztech Conversational Voice AI Platform - Frontend Demo

A high-performance, single-page frontend web application built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. It features a modern brand header, an interactive Voice AI Demo section connected to **VAPI** (Voice AI API) using the official `@vapi-ai/web` SDK, real-time audio visualization, transcript logs, and backend API integration hooks.

---

## Features

- **Company Branding & Header**: Sleek geometric logo placeholder and company name (`Neztech`) with responsive navigation and live status indicator.
- **Interactive Voice Demo**:
  - Connected via WebRTC to conversational Voice AI.
  - **Live WebRTC Audio Calling**: Sub-500ms conversational voice interaction.
  - **Controls**: Call Start/Stop with animated glowing pulse rings, Mute/Unmute microphone toggle.
  - **Dynamic Audio Waveform**: Real-time visualizer that reacts to incoming and outgoing audio levels.
  - **Live Conversation Transcript**: Streaming speaker cards with fixed height and internal scrolling.
- **Enterprise Capabilities Grid**: Showcase ultra-low latency, full-duplex interruption, enterprise security, and webhook function calling.
- **About Neztech**: Dedicated section showcasing platform architecture, metrics, and capabilities.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and set your credentials:
```env
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
VITE_VAPI_ASSISTANT_ID=your_vapi_assistant_id
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
npm run preview
```
