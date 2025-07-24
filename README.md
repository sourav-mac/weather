# Weather App

A beautiful, responsive weather application that provides real-time weather information for cities around the world.

## Features

- Current weather conditions
- 5-day weather forecast
- Hourly weather forecast
- Air quality information
- Wind speed and direction
- Sunrise and sunset times
- Responsive design for all devices

## GitHub Pages Deployment

This app is configured to work with GitHub Pages. To deploy:

1. Push your code to your GitHub repository
2. Go to your repository settings
3. Navigate to "Pages" section
4. Select "Deploy from branch" 
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

Your app will be available at: `https://sourav-mac.github.io/weather/`

## Local Development

To run locally:

1. Clone the repository
2. Open `index.html` in a web browser
3. Or use a local server like Live Server in VS Code

## File Structure

```
├── index.html              # Main HTML file
├── static/
│   ├── css/
│   │   └── weather_style.css   # Main stylesheet
│   ├── js/
│   │   ├── app.js             # Main application logic
│   │   ├── api.js             # API handling
│   │   ├── module.js          # Utility functions
│   │   └── route.js           # Routing logic
│   ├── images/               # Weather icons and assets
│   └── font/                 # Custom fonts
├── .nojekyll                # Prevents Jekyll processing
└── _config.yml              # GitHub Pages configuration
```

## Technologies Used

- HTML5
- CSS3 (with modern features like Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- OpenWeatherMap API
- Material Symbols font

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.
