import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from './navbar';
import Footer from './footer';


const Layout = ({ children }) => {
  const location = useLocation();
  const showHeaderFooter = location.pathname !== '/' && location.pathname !== '/Signup';

  // Define default metadata
  const defaultTitle = 'MyLMS';
  const defaultDescription = 'The official dashboard for the MyLMS Management System.';

  // Function to determine the page title based on the pathname
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Login';
      case '/dashboard':
        return 'Dashboard';
      case '/signup':
        return  'Sign Up';
      default:
        return 'Page';
    }
  };

  return (
    <>
      {/* Helmet for metadata management */}
      <Helmet>
        <title>{`${getPageTitle()} | ${defaultTitle}`}</title>
        <meta name="description" content={defaultDescription} />
        <meta property="og:title" content={`${getPageTitle()} | ${defaultTitle}`} />
        <meta property="og:description" content={defaultDescription} />
        <meta property="og:url" content={`https://your-website.com${location.pathname}`} />
        <meta property="og:type" content="website" />
        {/* You can add more metadata here */}
      </Helmet>

      {showHeaderFooter && <Navbar />}
      <main>{children}</main>
      {showHeaderFooter && <Footer />}
    </>
  );
};

export default Layout;