import React from 'react';
import Landing from './Homes';
import Quote from '../components/Quote';
import Popular from '../components/Popular';
import Working from '../components/Working';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Last from '../components/Last';

const Home = () => {
  return (
    <div className="w-full min-h-screen">
      <Hero />
      <Quote />
      <Popular />
      <Working />
      <Landing />
      <Last />
      <Footer />
    </div>
  );
};

export default Home;
