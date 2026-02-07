import React from "react";
import "./styles/HomePage.css";
import bg from "../assets/homePageTopBackG_Image.png";
import Button from "./sharedComponents/Button";
import HomePageOurServiceCard from "./HomePageOurServiceCard";

import { ourServicesData } from "../staticData/ourServiceData.ts";

const HomePage: React.FC = () => {
  return (
    <>
      <div className="HomePage" style={{ backgroundImage: `url(${bg})` }}>
        <div className="topHomePage">
          <h1 className="welcomeMessage">
            <p className="span1">Welcome To </p> <p className="span2">TBoard</p>
          </h1>
          <h3 className="welcomeMessage">
            <p className="span1"> Your one-stop solution </p>
            <p className="span2"> for all board-related needs</p>
          </h3>
          <div className="homePageButtons">
            <Button buttonText="Get Started" />
            <div className="learn-more-btn">
              <Button buttonText="Learn More" />
            </div>
          </div>
        </div>
        <div className="bottomHomePage">
          <section className="ourServices">
            <h2>What we Offer</h2>
            <p>
              TBoard is a simple, visual way to manage projects—create boards,
              break work into tasks, and move cards across columns as progress
              happens.
            </p>

            <div className="ourServicesGrid">

                {ourServicesData.map((service, index) => (
                  <HomePageOurServiceCard
                    key={index}
                    title={service.title}
                    description={service.description}
                  />
                ))}

            </div>
          </section>
        </div>
      </div>    
    </>
  );
};

export default HomePage;
