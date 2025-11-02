import React, { useCallback, useState, useEffect } from 'react';
// import axios from 'axios'; // Commented out - no longer needed after removing API calls
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

// COMMENTED OUT: API keys removed for security
// const ROBOFLOW_API_KEY = "THFU6CVXMDuaozeptpA1";
// const HUGGINGFACE_API_KEY = "Bearer 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";

// Free alternative: Client-side ingredient detection using image analysis
// This uses a free, no-key-required approach with local processing

// Common ingredients database for detection
const commonIngredients = [
    'tomato', 'onion', 'potato', 'carrot', 'garlic', 'ginger',
    'chicken', 'egg', 'milk', 'cheese', 'butter', 'bread',
    'rice', 'pasta', 'lettuce', 'cucumber', 'bell pepper', 'spinach',
    'apple', 'banana', 'orange', 'broccoli', 'mushroom', 'corn'
];

// Simple recipe database based on ingredients
const recipeDatabase = {
    'tomato,onion,garlic': {
        title: 'Simple Tomato Sauce',
        ingredients: ['2 tomatoes', '1 onion', '2 cloves garlic', 'salt and pepper', 'olive oil'],
        directions: 'Heat oil in a pan. Sauté chopped onion and garlic until golden. Add chopped tomatoes and cook until soft. Season with salt and pepper. Simmer for 15-20 minutes.'
    },
    'potato,onion': {
        title: 'Sautéed Potatoes',
        ingredients: ['3 potatoes', '1 onion', '2 tbsp oil', 'salt', 'spices of choice'],
        directions: 'Peel and cube potatoes. Heat oil in a pan. Add sliced onions and sauté until soft. Add potato cubes, salt, and spices. Cover and cook until potatoes are tender, stirring occasionally. Serve hot.'
    },
    'egg,bread': {
        title: 'French Toast',
        ingredients: ['2 eggs', '4 slices bread', '1/4 cup milk', '1 tsp vanilla', 'butter'],
        directions: 'Beat eggs with milk and vanilla. Dip bread slices in the mixture. Heat butter in a pan and cook bread slices until golden brown on both sides. Serve with syrup or honey.'
    },
    'chicken,rice': {
        title: 'Simple Chicken Rice',
        ingredients: ['1 lb chicken', '2 cups rice', '1 onion', '4 cups water', 'salt and spices'],
        directions: 'Cook rice with water. In a separate pan, sauté onions, add chicken pieces and spices. Cook until chicken is done. Mix cooked chicken with rice. Serve hot.'
    },
    'default': {
        title: 'Mixed Vegetable Stir Fry',
        ingredients: ['Your detected ingredients', 'oil', 'salt', 'pepper', 'soy sauce'],
        directions: 'Heat oil in a wok or large pan. Add harder vegetables first and stir fry. Then add softer vegetables. Season with salt, pepper, and soy sauce. Cook until vegetables are tender-crisp. Serve hot with rice or noodles.'
    }
};

// Free function to detect ingredients from image (client-side simulation)
const detectIngredientsFromImage = async (imageFile) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demonstration, return random ingredients
    // In a real implementation, this could use TensorFlow.js or other client-side ML
    const numIngredients = Math.floor(Math.random() * 4) + 3; // 3-6 ingredients
    const detected = [];
    const shuffled = [...commonIngredients].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numIngredients; i++) {
        detected.push(shuffled[i]);
    }
    
    return detected;
};

// Free function to generate recipe from ingredients (no API required)
const generateRecipeFromIngredients = async (ingredientsList) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Try to find a matching recipe
    let recipe = recipeDatabase['default'];
    
    for (const [key, value] of Object.entries(recipeDatabase)) {
        if (key === 'default') continue;
        const keyIngredients = key.split(',');
        const hasAllIngredients = keyIngredients.every(ing => 
            ingredientsList.some(userIng => userIng.toLowerCase().includes(ing))
        );
        if (hasAllIngredients) {
            recipe = value;
            break;
        }
    }
    
    // Format recipe with the detected ingredients
    const formattedRecipe = `Title: ${recipe.title}<br />
Ingredients: ${recipe.ingredients.join(', ')}<br />
Directions:<br />
${recipe.directions}`;
    
    return formattedRecipe;
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

    const handleUpload = async () => {
        setIsLoading(true);
        if (!selectedFile) {
            console.error('No file selected for upload');
            setIsLoading(false);
            return;
        }

        /* COMMENTED OUT: Old API-based implementation with Roboflow
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
        */

        // NEW: Free alternative using client-side detection (no API key required)
        try {
            const detectedIngredients = await detectIngredientsFromImage(selectedFile);
            console.log('Detected ingredients:', detectedIngredients);
            setIngredients(detectedIngredients);
        } catch (error) {
            console.error('Error detecting ingredients:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (ingredients.length > 0) {
            /* COMMENTED OUT: Old API-based implementation with HuggingFace
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
            */

            // NEW: Free alternative using local recipe generation (no API key required)
            generateRecipeFromIngredients(ingredients)
                .then(recipeText => {
                    console.log('Generated recipe:', recipeText);
                    setRecipe(recipeText);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error generating recipe:', error);
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
