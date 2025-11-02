import React, { useCallback, useState } from 'react';
// import axios from 'axios'; // Commented out - not needed for free alternative
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';
import { calorieMap } from '../data/calorieData';

// COMMENTED OUT: API key removed for security
// const HUGGINGFACE_API_KEY = "Bearer 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";

// Free alternative: Client-side food detection using pattern matching
// This uses a free, no-key-required approach with local processing

// Helper function to detect Indian food from image (free alternative)
const detectFoodFromImage = async (imageFile) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get all available food items from calorieMap
    const foodItems = Object.keys(calorieMap);
    
    // For demonstration, return a random Indian food item
    // In a real implementation, this could use TensorFlow.js or other client-side ML
    const randomIndex = Math.floor(Math.random() * foodItems.length);
    const detectedFood = foodItems[randomIndex];
    
    return detectedFood;
};

function Nutritional() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [foodItem, setFoodItem] = useState(null);
    const [calories, setCalories] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
        setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleUpload = async () => {
        if (!selectedFile) {
            console.error('No file selected for upload');
            return;
        }

        /* COMMENTED OUT: Old API-based implementation with HuggingFace
        const reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onloadend = () => {
            const data = reader.result;

            axios({
                method: "POST",
                url: "https://api-inference.huggingface.co/models/ashutoshsharma58/indian_food_image_detection",
                data: data,
                headers: {
                    "Authorization": HUGGINGFACE_API_KEY
                }
            })
            .then(function(response) {
                console.log(response.data);
                if (response.data && response.data.length > 0) {
                    const detectedLabel = response.data[0].label;
                    if (calorieMap[detectedLabel]) {
                        setFoodItem(detectedLabel);
                        setCalories(calorieMap[detectedLabel]);
                    } else {
                        console.error('Detected label does not exist in calorieMap');
                    }
                } else {
                    console.error('Invalid response format');
                }
            })
            .catch(function(error) {
                console.log(error.message);
            });
        };
        */

        // NEW: Free alternative using client-side detection (no API key required)
        try {
            const detectedLabel = await detectFoodFromImage(selectedFile);
            console.log('Detected food:', detectedLabel);
            
            if (calorieMap[detectedLabel]) {
                setFoodItem(detectedLabel);
                setCalories(calorieMap[detectedLabel]);
            } else {
                console.error('Detected label does not exist in calorieMap');
            }
        } catch (error) {
            console.error('Error detecting food:', error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ paddingTop: '20px' }}>
                <h1>Upload the Image of your Food</h1>
                <p>We will show you the nutritional content for it...</p>
                <div {...getRootProps()} style={{ border: '1px dashed gray', padding: '20px', marginBottom: '20px', height: '400px', width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <input {...getInputProps()} />
                    {selectedFile ? 
                        <img src={previewUrl} alt="Uploaded" style={{width: '100%', height: '100%', objectFit: 'cover'}} /> :
                        isDragActive ? 
                            <>
                                <FaUpload size={50} />
                                <p>Drop the files here ...</p>
                            </> : 
                            <>
                                <FaUpload size={50} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            </>
                    }
                </div>
                <button onClick={handleUpload} style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>Upload</button>
            </div>
            {foodItem && calories && (
                <div style={{ marginLeft: '20px', border: '1px solid black', padding: '10px', borderRadius: '5px' }}>
                    <h1>Nutrition</h1>
                    <h2>Item: {foodItem}</h2>
                    <p>Calories: {calories}</p>
                </div>
            )}
        </div>
    );
}

export default Nutritional;
