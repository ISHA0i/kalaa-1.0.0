import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import '../styles/Page.css';
import Controls from './Controls';

// Lazy load components
const SignIn = lazy(() => import('../components/view/Account/SignIn'));
const SignUp = lazy(() => import('../components/view/Account/SignUp'));
const Cart = lazy(() => import('../components/view/cart/Cart'));
const Profile = lazy(() => import('../components/view/Account/Profile'));
const Product = lazy(() => import('../components/Product'));
const Contact = lazy(() => import('../components/view/Pages/Contact'));
const Home = lazy(() => import('../components/Home'));
const About = lazy(() => import('../components/view/Pages/About'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// Base page component
const PageContainer = ({ className, children }) => (
  <div className={`page-container ${className}`}>
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  </div>
);

PageContainer.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

// Page Components
const SignInPage = () => (
  <PageContainer className="signin-page-container">
    <SignIn />
  </PageContainer>
);

const SignUpPage = () => (
  <PageContainer className="signup-page-container">
    <SignUp />
  </PageContainer>
);

const CartPage = () => (
  <PageContainer className="cart-page-container">
    <Cart />
  </PageContainer>
);

const HomePage = () => (
  <PageContainer className="home-page-container">
    <Home />
    <Product />
  </PageContainer>
);

const ProductPage = () => (
  <PageContainer className="product-page-container">
    <Product />
  </PageContainer>
);

const ContactPage = () => (
  <PageContainer className="contact-page-container">
    <Contact />
  </PageContainer>
);

const AboutPage = () => (
  <PageContainer className="about-page-container">
    <About />
  </PageContainer>
);

const ProfilePage = () => (
  <PageContainer className="profile-page-container">
    <Profile />
  </PageContainer>
);

// Add display names for debugging
SignInPage.displayName = 'SignInPage';
SignUpPage.displayName = 'SignUpPage';
CartPage.displayName = 'CartPage';
HomePage.displayName = 'HomePage';
ProductPage.displayName = 'ProductPage';
ContactPage.displayName = 'ContactPage';
AboutPage.displayName = 'AboutPage';
ProfilePage.displayName = 'ProfilePage';

// Export wrapped components
export const SignInComponent = Controls(SignInPage);
export const SignUpComponent = Controls(SignUpPage);
export const CartComponent = Controls(CartPage);
export const ProfileComponent = Controls(ProfilePage);
export const AboutComponent = Controls(AboutPage);
export const HomeComponent = Controls(HomePage);
export const ProductComponent = Controls(ProductPage);
export const ContactComponent = Controls(ContactPage);
