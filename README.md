# React Login Dashboard Application

## Overview
This is a React-based web application that provides user authentication and a data visualization dashboard. The user credentials are securely stored (with password hashing) on Azure Cosmos DB database. The front-end  The application allows users to log in, view real-time data through interactive charts, and manage their session securely.

A demonstration of the system can be seen in the images below

<img src="https://github.com/user-attachments/assets/ffa93418-ac97-4735-8dd5-6d9214647099" width="400" >
<img src="https://github.com/user-attachments/assets/8ed167cc-7210-422e-8040-1efcaf29e5a4" width="400" >
<img src="https://github.com/user-attachments/assets/daf7da9c-9c43-4620-ac23-3a08871b5921" width="400" >
<img src="https://github.com/user-attachments/assets/51850512-0389-40b0-b1e6-6e8218dde8c5" width="400" >
<img src="https://github.com/user-attachments/assets/3f80e243-8f03-4c7c-9bcc-fc413cde0ab3" width="400" >
<img src="https://github.com/user-attachments/assets/aed16e34-2f76-4ac5-a58b-23170f071cf8" width="400" >


## Features
- User Authentication (Login/Logout)
- Protected Routes
- Interactive Dashboard
- Time Series Data Visualization
- Device Data Retrieval
- Responsive Design

## Tech Stack
- React (Vite)
- React Router for navigation
- C# .net core backend utilising MVC
- Azure Static Web Apps for deployment
- Environment Variable Management
- Real-time data fetching and visualization

## Project Structure
```
login-vite-project/
├── src/
│   ├── components/
│   │   ├── AppPage.jsx        # Main dashboard component
│   │   ├── LoginPage.jsx      # Login page component
│   │   ├── RegisterPage.jsx   # Registration page component
│   │   └── TimeSeriesChart.jsx # Data visualization component
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context provider
│   ├── App.jsx               # Main application component
│   └── main.jsx              # Application entry point
├── public/                   # Static assets
├── .env                      # Environment variables
├── vite.config.js           # Vite configuration
└── package.json             # Project dependencies and scripts
```

## Environment Variables
The application requires the following environment variables:
```
VITE_LOGIN_DATABASE=your_login_api_url
VITE_DATA_DATABASE=your_data_api_url
VITE_BEARER_TOKEN=your_bearer_token
```

## Setup and Installation
1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables

4. Start the development server
```bash
npm run dev
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally

## Deployment
### Azure Static Web Apps Deployment Steps:
1. Ensure GitHub repository is set up
2. Configure GitHub Actions:
   - Set up workflow file
   - Add environment variables to GitHub Secrets
3. Configure Azure:
   - Create Static Web App resource
   - Add environment variables to Configuration
4. Verify deployment through GitHub Actions

## Development Guidelines
### API Calls
- Use fetch API for all requests
- Include proper error handling
- Maintain authentication headers

### Authentication
- Managed through React Context
- Protected routes using React Router
- Persistent auth state with localStorage

### Environment Variables
- Must be prefixed with VITE_
- Configured in both development and production

## API Integration
### Authentication API
Endpoints available at `VITE_LOGIN_DATABASE`:
- POST /Account/login - User login
- GET /Account/logout - User logout

### Data API
Endpoints available at `VITE_DATA_DATABASE`:
- GET /?deviceId={id}&startDate={date}&endDate={date}&Data={type}

## Features Overview
### Authentication Flow
1. User attempts to access protected route
2. AuthContext checks authentication status
3. Unauthenticated users redirected to login
4. Successful login stores auth state
5. Protected routes become accessible

### Dashboard Features
- Time series data visualization
- Custom date range selection
- Device ID filtering
- Data type selection
- Real-time data updates

## Troubleshooting
### Common Issues
- Authentication state lost on refresh
  - Check localStorage implementation
  - Verify AuthContext setup
- API connection issues
  - Verify environment variables
  - Check network requests
- Build failures
  - Verify Vite configuration
  - Check dependencies
- Deployment issues
  - Review GitHub Actions setup
  - Verify Azure configuration

## Future Improvements
### Planned Features
- Email verification
- Password reset
- Enhanced visualizations
- User profile management
- Multi-factor authentication

## Contact
0812354879 - Sachen Pather

