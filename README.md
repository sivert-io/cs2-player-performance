# Leetify Team Balancer 🎯  

Leetify Team Balancer is a web application that calculates player performance using Leetify stats and forms balanced teams. It contacts the Leetify API with a 1-second delay per player, generates a profile for each one, and assigns a total score. This score is then used to create fair and balanced teams using a snake-draft algorithm. 🐍  

## Table of Contents 📖  

- [Features ✨](#features-)  
- [Getting Started 🚀](#getting-started-)  
- [Configuration ⚙️](#configuration-)  
- [Development 🏗️](#development-)  
- [Contributing 🤝](#contributing-)  
- [Thanks 🙌](#thanks-)  

## Features ✨  

- 📊 Fetches player performance stats from Leetify  
- ⏳ Ensures a 1-second delay per API request to prevent rate-limiting  
- 🎯 Generates a player profile with a total score  
- 🐍 Uses a snake-draft method to create balanced teams  
- ⚡ Built with Next.js for fast and modern web performance  

## Getting Started 🚀  

To run the project locally, follow these steps:  

1. **Clone the repository**  

```sh  
git clone https://github.com/yourusername/leetify-team-balancer.git  
cd leetify-team-balancer  
```  

2. **Install dependencies**  

```sh  
npm install  
```  

3. **Create a .env file** and add your Leetify API key:  

```ini  
LEETIFY_API_KEY="your_api_key_here"  
```  

4. **Start the development server** 

```sh  
npm run dev  
```  

The app will be available at `http://localhost:3000` 🎉  

## Configuration ⚙️  

To connect with the Leetify API, ensure you have a valid API key stored in a `.env` file. The app contacts the API with a delay of 1 second per request to avoid rate limits.  

## Development 🏗️  

For local development and contributions:  

1. **Run the development server**  

```sh  
npm run dev  
```  

2. **Build the production version**  

```sh  
npm run build  
```  

3. **Start the production server**  

```sh  
npm start  
```  

## Contributing 🤝  

We welcome contributions! If you find a bug or want to improve the app, feel free to open an issue or submit a pull request. 🚀  

## Thanks 🙌  

A special thanks to:  
- 🏆 [Leetify](https://leetify.com/) for providing detailed CS stats  
- 🛠️ The open-source community for their support and contributions  

Happy team balancing! ⚡
