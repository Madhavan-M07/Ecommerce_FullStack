import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t ">
        <Title text1={"ABOUT "} text2={" US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16 ">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus
            cupiditate voluptates ducimus esse. Reprehenderit eius ducimus ipsum
            repudiandae officia labore!Reprehenderit eius ducimus ipsum
            repudiandae officia labore!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
            minima repellat consectetur illum sit quae iste molestias,
            voluptatum neque.Reprehenderit eius ducimus ipsum repudiandae
            officia labore!
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit ab
            itaque recusandae enim expedita sit accusantium tempora officiis
            iure repellendus animi, corrupti natus eveniet temporibus?
          </p>
        </div>
      </div>
      <div className="text-xl py-4 ">
        <Title text1={"WHY "} text2={" CHOOSE US"} />
      </div>
      
    </div>
  );
};

export default About;
