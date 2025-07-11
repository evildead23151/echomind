# EchoMind: Your AI-Powered Voice Journal

![EchoMind Banner](https://place-hold.it/1200x600/8A2BE2/FFFFFF?text=EchoMind&fontsize=110)

**EchoMind is a voice-first journaling application that transforms your spoken thoughts into structured, searchable, and insightful notes. It's built for capturing fleeting ideas, daily reflections, and brainstorming sessions without ever touching a keyboard.**

This project is more than a simple transcriber; it's an experiment in creating a more natural and intelligent interface for personal knowledge management.

---

## 🚀 Core Features

- **Instant Voice Capture:** A clean, intuitive interface to instantly record your thoughts, powered by Expo AV.
- **AI-Powered Transcription:** High-accuracy speech-to-text conversion using the AssemblyAI API.
- **Modern, Responsive UI:** A polished and beautiful user interface built with React Native.
- **Secure API Handling:** API keys are managed securely using environment variables, not hardcoded into the source.
- **Cross-Platform:** Built with Expo, EchoMind is designed to run seamlessly on both iOS and Android from a single codebase[1].

---

## 🛠️ Tech Stack & Architecture

This project is built with a modern, scalable stack chosen for rapid development and a high-quality user experience.

| Category          | Technology                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| **Mobile**        | [React Native](https://reactnative.dev/), [Expo](https://expo.dev)                                           |
| **AI / Services** | [AssemblyAI](https://www.assemblyai.com/) (Speech-to-Text)                                                    |
| **State Mgmt**    | React Hooks (`useState`, `useContext`)                                                                        |
| **Navigation**    | [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)                              |
| **Styling**       | React Native StyleSheet                                                                                     |
| **Linting**       | ESLint, Prettier                                                                                            |
| **Security**      | `react-native-dotenv` for environment variable management                                                   |

---

## ⚙️ Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- An account with [AssemblyAI](https://www.assemblyai.com/) to get a free API key.

### Installation & Setup

1.  **Clone the repository:**
    ```
    git clone https://github.com/evildead23151/echomind.git
    cd echomind
    ```

2.  **Install project dependencies:**
    ```
    npm install
    ```

3.  **Set up your environment variables:**
    -   Create a new file in the root of the project named `.env`.
    -   This file will store your secret API keys and is ignored by Git.
    -   Add your AssemblyAI key to the file:
        ```
        # File: .env
        ASSEMBLYAI_API_KEY="your_assemblyai_api_key_goes_here"
        ```

4.  **Run the application:**
    -   Start the Expo development server:
        ```
        npx expo start
        ```
    -   Scan the QR code with the **Expo Go** app on your iOS or Android device.

The app should now be running on your phone, connected to the development server.

---

## 📈 Project Status & Roadmap

EchoMind is currently in active development. The core functionality of recording and transcribing is complete.

### Next Steps:
- [ ] **Local Storage:** Implement `AsyncStorage` to save notes persistently on the device.
- [ ] **Journal Feed:** Redesign the home screen to display a list of all saved journal entries.
- [ ] **Summarization:** Integrate an LLM (like GPT-4) to provide intelligent summaries of transcribed notes.
- [ ] **Search & Filtering:** Add functionality to search through past entries.
- [ ] **Cloud Sync:** Explore options for syncing journal entries across devices.

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 📬 Contact

Gitesh Malik - [@your_linkedin_profile](https://www.linkedin.com/giteshmalik1) - giteshmalikwork@gmail.com

Project Link: [https://github.com/evildead23151/echomind](https://github.com/evildead23151/echomind)

