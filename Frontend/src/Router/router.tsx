import { createBrowserRouter } from 'react-router-dom';
import App from '../components/layout/App.tsx';
import HomePage from '../components/home/HomePage.tsx';
import Login from '../components/loginSignupComponents/Login.tsx';
import Signup from '../components/loginSignupComponents/Signup.tsx';
import ProjectComponents from '../components/ProjectComponent/ProjectComponents.tsx';
import ProjectBoard from '../components/ProjectComponent/ProjectBoard.tsx';
import ProtectedRoute from '../auth/ProtectedRoute.tsx';
import ContactUs from '../components/contactUs/ContactUs.tsx';
import AboutUs from '../components/aboutUs/AboutUs.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      {path: 'aboutus', element: <AboutUs />},
      {path: 'contactus', element: <ContactUs />},
      {
        path: 'projects',
        element: (
          <ProtectedRoute>
            <ProjectComponents />
          </ProtectedRoute>
        ),
      },
      {
        path: 'projects/:projectId',
        element: (
          <ProtectedRoute>
            <ProjectBoard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
