import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';
import { calorieMap } from '../data/calorieData';

// IMPORTANT: API key should be moved to environment variables for production
// Create a .env file with: REACT_APP_HUGGINGFACE_API_KEY=your_key_here
const HUGGINGFACE_API_KEY = "Bearer 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";

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

    const handleUpload = () => {
        if (!selectedFile) {
            console.error('No file selected for upload');
            return;
        }

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
