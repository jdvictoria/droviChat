# DroviChat

## Overview
An Expo project for Drovi test assesment wherein I need to create a simple React Native application that integrates with Convex to enable real-time chat functionality. The app should allow users to create chat rooms, send messages, and share chat rooms via QR codes. Messages within a chat should be updated and visible to all participants in real time.

## Getting Started

Follow these steps to get the project running locally.

### Prerequisites
- Node.js and npm installed
- Expo CLI installed globally:
  ```npm install -g expo-cli```

### Installation
1. Clone the repository
  ```https://github.com/jdvictoria/droviChat.git```
2. Navigate to the project directory:
  ```cd droviChat```  
3. Install dependencies
  ```npm install```

## Running the App
To start the Expo Go, use the following commands:

1. iOS
  ```npm run ios```
2. Android
  ```npm run android```

## Testing
This project uses Jest for testing. To run the tests:
  ```npm run test```
  
This command will start Jest and execute all test files, providing detailed output for each test suite.

## Project Structure
- /app: contains main screens / views
- /assets: contains fonts, icons and other assets
- /convex: contains schema, functions and other convex files
- /utils: contains helper functions
- __tests__: contains Jest tests for components 
