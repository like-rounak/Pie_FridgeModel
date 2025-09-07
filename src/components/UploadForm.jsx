import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import openai from 'openai';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';


const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinningFaSpinner = styled(FaSpinner)`
  animation: ${spin} 2s linear infinite;
`;

function UploadForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
        setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleUpload = () => {
        setIsLoading(true);
        if (!selectedFile) {
            console.error('No file selected for upload');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            const base64Image = reader.result.split(',')[1];

            axios({
                method: "POST",
                url: "https://serverless.roboflow.com/aicook-lcv4d/3",
                params: {
                    api_key: process.env.REACT_APP_ROBOFLOW_API
                },
                data: base64Image,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(function(response) {
                console.log(response.data);
                if (response.data && Array.isArray(response.data.predictions)) {
                    const classes = response.data.predictions.map(item => item.class);
                    setIngredients(classes);
                } else {
                    console.error('Invalid response format');
                }
            })
            .catch(function(error) {
                console.log(error.message);
                console.log(process.env.REACT_APP_ROBOFLOW_API);
            });
        };
    };

    useEffect(() => {
        if (ingredients.length > 0) {
            const data = {
                inputs: ingredients.join(', ')
            };

            fetch("https://api-inference.huggingface.co/models/flax-community/t5-recipe-generation", {
                headers: { 
                    Authorization: process.env.REACT_APP_HUGGINGFACE_API,
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                console.log(result); // Log the entire response object
                if (result && result[0] && result[0].generated_text) {
                    let recipeText = result[0].generated_text;
                    recipeText = recipeText.replace(/title:/i, '<br />Title:');
                    recipeText = recipeText.replace(/ingredients:/i, '<br />Ingredients:');
                    recipeText = recipeText.replace(/directions:/i, '<br />Directions:<br />'); // Start directions on a new line
                    recipeText = recipeText.replace(/(?<=\D)(?=\b\d+\b)/g, ','); // Add comma before each number except the first one
                    recipeText = recipeText.replace(/_/g, ' '); // Replace underscore with space
                    recipeText = recipeText.replace(/(\.\s)([a-z])/g, function(match) {
                        return match.toUpperCase();
                    }); // Capitalize first letter after every full stop
                    recipeText = recipeText.replace(/(directions:<br \/>\s*)([^<]+)/i, function(match, p1, p2) {
                        return p1 + p2.charAt(0).toUpperCase() + p2.slice(1);
                    }); // Capitalize first letter of the first line in directions
                    recipeText = recipeText.replace(/(\d+)\sDegrees\s(f)/gi, '$1 °F'); // Convert "Degrees f" to "°F"
                    recipeText = recipeText.replace(/(\.\s)/g, '$1<br />'); // Add new line after each full stop

                    // Split the recipe text into sections
                    let sections = recipeText.split('<br />');
                    // Find the ingredients section and remove the first comma
                    for (let i = 0; i < sections.length; i++) {
                        if (sections[i].startsWith('Ingredients:')) {
                            sections[i] = sections[i].replace(',', '');
                            break;
                        }
                    }
                    // Join the sections back together
                    recipeText = sections.join('<br />');

                    setRecipe(recipeText);
                    setIsLoading(false);
                } else {
                    console.error('No data in response');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }, [ingredients]);
    
    
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', marginBottom: '60px', paddingBottom: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ paddingTop: '20px' }}>
                    <h1>Upload the Image of your Fridge</h1> {/* Title */}
                    <p>We will list out the ingredients, and make a recipe for you too ...</p> {/* Paragraph */}
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
                {isLoading ? 
                    <SpinningFaSpinner size={50} /> : (
                    <>
                        {ingredients.length > 0 && (
                            <div style={{ marginLeft: '20px', border: '1px solid black', padding: '10px', borderRadius: '5px' }}>
                                <h2>Ingredients</h2>
                                {ingredients.map((ingredient, index) => (
                                    <p key={index}>{ingredient}</p>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            {recipe && (
                <div style={{ width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ border: '1px solid black', padding: '10px', borderRadius: '5px' }}>
                        <h2>Recipe</h2>
                        <div dangerouslySetInnerHTML={{ __html: recipe }} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadForm;
