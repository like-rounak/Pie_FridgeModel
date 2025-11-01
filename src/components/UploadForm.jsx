import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
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

// IMPORTANT: These API keys should be moved to environment variables for production
// Create a .env file with:
// REACT_APP_ROBOFLOW_API_KEY=your_key_here
// REACT_APP_HUGGINGFACE_API_KEY=your_key_here
// Then use process.env.REACT_APP_ROBOFLOW_API_KEY instead
const ROBOFLOW_API_KEY = "THFU6CVXMDuaozeptpA1";
const HUGGINGFACE_API_KEY = "Bearer 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";

const formatRecipeText = (text) => {
    let formatted = text;
    
    // Add line breaks for sections
    formatted = formatted.replace(/title:/i, '<br />Title:');
    formatted = formatted.replace(/ingredients:/i, '<br />Ingredients:');
    formatted = formatted.replace(/directions:/i, '<br />Directions:<br />');
    
    // Text formatting improvements
    formatted = formatted.replace(/(?<=\D)(?=\b\d+\b)/g, ',');
    formatted = formatted.replace(/_/g, ' ');
    formatted = formatted.replace(/(\.\s)([a-z])/g, match => match.toUpperCase());
    formatted = formatted.replace(/(directions:<br \/>\s*)([^<]+)/i, (match, p1, p2) => {
        return p1 + p2.charAt(0).toUpperCase() + p2.slice(1);
    });
    formatted = formatted.replace(/(\d+)\sDegrees\s(f)/gi, '$1 °F');
    formatted = formatted.replace(/(\.\s)/g, '$1<br />');
    
    // Clean up ingredients section
    const sections = formatted.split('<br />');
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].startsWith('Ingredients:')) {
            sections[i] = sections[i].replace(',', '');
            break;
        }
    }
    
    return sections.join('<br />');
};

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
            setIsLoading(false);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            const base64Image = reader.result.split(',')[1];

            axios({
                method: "POST",
                url: "https://detect.roboflow.com/aicook-lcv4d/3",
                params: {
                    api_key: ROBOFLOW_API_KEY
                },
                data: base64Image,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(response => {
                console.log(response.data);
                if (response.data && Array.isArray(response.data.predictions)) {
                    const classes = response.data.predictions.map(item => item.class);
                    setIngredients(classes);
                } else {
                    console.error('Invalid response format');
                    setIsLoading(false);
                }
            })
            .catch(error => {
                console.log(error.message);
                setIsLoading(false);
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
                    Authorization: HUGGINGFACE_API_KEY,
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result && result[0] && result[0].generated_text) {
                    setRecipe(formatRecipeText(result[0].generated_text));
                    setIsLoading(false);
                } else {
                    console.error('No data in response');
                    setIsLoading(false);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setIsLoading(false);
            });
        }
    }, [ingredients]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px', marginBottom: '60px', paddingBottom: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ paddingTop: '20px' }}>
                    <h1>Upload the Image of your Fridge</h1>
                    <p>We will list out the ingredients, and make a recipe for you too...</p>
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
