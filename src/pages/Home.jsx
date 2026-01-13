import React from 'react'
import Hero from '../components/Hero'
import LatestCollections from '../components/LatestCollections'; // Adjust the path as needed
import BestSeller from '../components/BestSeller';


const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestCollections/>
      <BestSeller/>
    </div>
  );
};

export default Home