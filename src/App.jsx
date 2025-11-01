import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import UploadForm from "./components/UploadForm";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import Nutritional from './components/Nutritional';
//import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import "./App.css";

const MainRoutes = () => {
    const [landingPageData, setLandingPageData] = useState({});

    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    return (
        <div>
            <Navigation />
            <Routes>
                <Route path="/" element={
                    <>
                        <Header data={landingPageData.Header} />
                        <Features data={landingPageData.Features} />
                        <About data={landingPageData.About} />
                        <Services data={landingPageData.Services} />
                        <Gallery data={landingPageData.Gallery} />
                        <Team data={landingPageData.Team} />
                        <Contact data={landingPageData.Contact} />
                    </>
                } />
                <Route path="/uploadform" element={<UploadForm />} />
                <Route path="/nutritional" element={<Nutritional />} />
            </Routes>
        </div>
    );
};
const App = () => {
    return (
        <Router>
            <MainRoutes />
        </Router>
    );
};

export default App;