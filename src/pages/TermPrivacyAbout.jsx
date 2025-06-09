import React from "react";
import Termcard from "../components/TearmCard";
import PrivacyCard from "../components/Privacy";
import AboutCard from "../components/About";
 
const SettingsPage = () => {
  return (
    <div className="min-h-screen w-full pt-20 bg-gray-100 px-4 sm:px-8 py-10">
      <div className=" mx-auto">
        <h1 className="text-xl font-semibold text-pink-600 mb-6">Settings</h1>
 
        <Termcard />
        <PrivacyCard />
        <AboutCard />
      </div>
    </div>
  );
};
 
export default SettingsPage;