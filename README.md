# The Curator: LinkedIn AI Assistant 🚀

An open-source, privacy-first LinkedIn content creation tool. Generate, preview, and natively publish AI-powered LinkedIn posts — entirely from your browser.

> **Privacy First: All AI calls and LinkedIn API requests go directly from your browser to the provider. Your API keys never leave your device and are stored exclusively in your browser. There is no central backend.**

## ⚡ Non-Tech Friendly: 1-Click Setup

You don't need to know how to code to use this tool! You can deploy your entirely own, secure copy of this application for free in about 2 minutes.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/26BB/Linkdein-Assistant-)

**How to set it up:**
1. Click the **Deploy to Netlify** button above.
2. Connect your GitHub account when prompted. Netlify will clone this code to your GitHub and instantly deploy a live website for you.
3. Once deployed, click the generated link to visit your new live app!
4. Go to **Settings** in the app, pick an AI provider (like OpenAI or Gemini), and paste your API key (links to get these are below).

### Setting up LinkedIn Auto-Posting
To post directly to your personal LinkedIn feed from the app, you need to create a simple app on LinkedIn:

1. Go to the [LinkedIn Developer Portal](https://developer.linkedin.com/) and click "Create app".
2. Fill in the required details (Name, LinkedIn Page, URL).
3. Go to the **Auth** tab in your new app.
4. Copy your **Client ID** and **Client Secret**.
5. Under **OAuth 2.0 settings**, add your new Netlify website URL (e.g., `https://your-site.netlify.app`) to the **Authorized redirect URLs**.
6. Open your Assistant website, go to **Settings -> LinkedIn Connection**, and paste your credentials. Done!

---

## 👩‍💻 For Developers: Running Locally

If you want to modify the code, you can run the project locally. You will need Node.js and the Netlify CLI installed.

```bash
# 1. Clone & Install
git clone https://github.com/26BB/Linkdein-Assistant-.git
cd Linkdein-Assistant-
npm install

# 2. Start the Application with Netlify CLI
npx netlify-cli dev
```

Open `http://localhost:8888`. The Netlify CLI is required because it securely proxies the local OAuth serverless functions located in `netlify/functions/`.

## Supported AI Providers

| Provider | Model | How to get a free/paid API Key |
|---|---|---|
| OpenAI | gpt-4o-mini | [platform.openai.com](https://platform.openai.com/api-keys) |
| Google Gemini | gemini-1.5-flash | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| Anthropic Claude | claude-3-haiku | [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| Mistral AI | mistral-small-latest | [console.mistral.ai](https://console.mistral.ai/api-keys/) |
| Groq | llama-3.1-8b-instant | [console.groq.com](https://console.groq.com/keys) |

## Features Expanded

- 🤖 **5 AI Providers Supported** — Plug and play without needing code changes.
- ✍️ **AI Content Creator** — Generate editorial-quality posts with 4 tone styles: Thought Leader, Educational, Conversational, Analytical.
- 📅 **Scheduler** — Map out your calendar locally with a Draft → Scheduled → Published workflow.
- 🔗 **Direct LinkedIn Integration** — Connect your personal LinkedIn account via OAuth and publish directly to your feed. No more copy-pasting required.

## License
MIT
