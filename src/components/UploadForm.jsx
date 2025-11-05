import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaSpinner, FaPlus, FaTimes, FaUtensils, FaClock, FaLeaf } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinningFaSpinner = styled(FaSpinner)`
  animation: ${spin} 2s linear infinite;
`;

const ROBOFLOW_API_KEY = process.env.REACT_APP_ROBOFLOW_API_KEY || "THFU6CVXMDuaozeptpA1";
const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

function UploadForm() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState('');
    const [showIngredientEditor, setShowIngredientEditor] = useState(false);
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recipeType, setRecipeType] = useState('');
    const [cuisineType, setCuisineType] = useState('');
    const [dietType, setDietType] = useState('');
    const [showRecipeOptions, setShowRecipeOptions] = useState(false);
    const [nutrition, setNutrition] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
        setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
        setIngredients([]);
        setShowIngredientEditor(false);
        setShowRecipeOptions(false);
        setRecipe(null);
        setNutrition(null);
        setErrorMessage('');
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleUpload = () => {
        setIsLoading(true);
        setErrorMessage('');
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
                    setShowIngredientEditor(true);
                    setIsLoading(false);
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

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleAddIngredient = () => {
        if (newIngredient.trim()) {
            setIngredients([...ingredients, newIngredient.trim()]);
            setNewIngredient('');
        }
    };

    const handleGenerateRecipe = async () => {
        setErrorMessage('');
        if (ingredients.length === 0) {
            setErrorMessage('Please add at least one ingredient');
            return;
        }

        setIsLoading(true);
        setShowRecipeOptions(false);

        try {
            // Search for recipes with the ingredients
            const searchParams = new URLSearchParams({
                apiKey: SPOONACULAR_API_KEY,
                includeIngredients: ingredients.join(','),
                number: 1,
                instructionsRequired: 'true',
                addRecipeInformation: 'false'
            });

            if (recipeType) searchParams.append('type', recipeType);
            if (cuisineType) searchParams.append('cuisine', cuisineType);
            if (dietType) searchParams.append('diet', dietType);

            const searchResponse = await axios.get(
                `https://api.spoonacular.com/recipes/complexSearch?${searchParams.toString()}`
            );

            if (searchResponse.data.results && searchResponse.data.results.length > 0) {
                const recipeId = searchResponse.data.results[0].id;

                // Get detailed recipe information
                const detailsResponse = await axios.get(
                    `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`
                );

                setRecipe(detailsResponse.data);
                
                // Extract nutrition data
                if (detailsResponse.data.nutrition) {
                    setNutrition(detailsResponse.data.nutrition);
                }
            } else {
                setErrorMessage('No recipes found with these ingredients. Try different options.');
            }
        } catch (error) {
            console.error('Error generating recipe:', error);
            setErrorMessage('Failed to generate recipe. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            marginTop: '60px', 
            marginBottom: '60px', 
            paddingBottom: '60px',
            padding: '20px'
        }}>
            {/* Image Upload Section */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '30px',
                width: '100%',
                maxWidth: '1200px'
            }}>
                <div style={{ paddingTop: '20px', width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ color: '#333', marginBottom: '10px', textAlign: 'center' }}>Upload the Image of your Fridge</h1>
                    <p style={{ color: '#666', marginBottom: '20px', textAlign: 'center' }}>We will detect ingredients and help you create amazing recipes...</p>
                    
                    <div {...getRootProps()} style={{ 
                        border: '2px dashed #4CAF50', 
                        padding: '20px', 
                        marginBottom: '20px', 
                        height: '400px', 
                        width: '400px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: '10px',
                        backgroundColor: '#f9f9f9',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}>
                        <input {...getInputProps()} />
                        {selectedFile ? 
                            <img src={previewUrl} alt="Uploaded" style={{
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                borderRadius: '8px'
                            }} /> :
                            isDragActive ? 
                                <>
                                    <FaUpload size={50} color="#4CAF50" />
                                    <p style={{ marginTop: '10px', color: '#4CAF50' }}>Drop the files here ...</p>
                                </> : 
                                <>
                                    <FaUpload size={50} color="#999" />
                                    <p style={{ marginTop: '10px', color: '#666', textAlign: 'center' }}>
                                        Drag 'n' drop your fridge image here, or click to select
                                    </p>
                                </>
                        }
                    </div>
                    
                    <button 
                        onClick={handleUpload} 
                        disabled={!selectedFile || isLoading}
                        style={{ 
                            backgroundColor: selectedFile ? '#4CAF50' : '#ccc', 
                            color: 'white', 
                            padding: '12px 30px', 
                            borderRadius: '8px', 
                            border: 'none', 
                            cursor: selectedFile ? 'pointer' : 'not-allowed', 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            width: '400px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isLoading ? 'Detecting Ingredients...' : 'Detect Ingredients'}
                    </button>

                    {errorMessage && (
                        <div style={{
                            marginTop: '10px',
                            padding: '10px',
                            backgroundColor: '#ffebee',
                            border: '1px solid #f44336',
                            borderRadius: '4px',
                            color: '#c62828',
                            width: '400px',
                            textAlign: 'center'
                        }}>
                            {errorMessage}
                        </div>
                    )}
                </div>

                {/* Loading Spinner */}
                {isLoading && !showIngredientEditor && (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '300px'
                    }}>
                        <SpinningFaSpinner size={60} color="#4CAF50" />
                        <p style={{ marginTop: '20px', color: '#666' }}>Processing your image...</p>
                    </div>
                )}

                {/* Ingredient Editor Section */}
                {showIngredientEditor && !isLoading && (
                    <div style={{ 
                        border: '2px solid #4CAF50', 
                        padding: '25px', 
                        borderRadius: '10px',
                        backgroundColor: 'white',
                        minWidth: '400px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        marginTop: '40px',
                        width: '100%',
                        maxWidth: '600px'
                    }}>
                        <h2 style={{ 
                            color: '#333', 
                            marginBottom: '20px',
                            borderBottom: '2px solid #4CAF50',
                            paddingBottom: '10px'
                        }}>
                            <FaUtensils style={{ marginRight: '10px' }} />
                            Detected Ingredients
                        </h2>
                        
                        <div style={{ marginBottom: '20px' }}>
                            {ingredients.map((ingredient, index) => (
                                <div key={index} style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    padding: '10px 15px',
                                    marginBottom: '8px',
                                    backgroundColor: '#f0f8f0',
                                    borderRadius: '6px',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <span style={{ 
                                        fontSize: '16px', 
                                        color: '#333',
                                        textTransform: 'capitalize'
                                    }}>
                                        {ingredient}
                                    </span>
                                    <button 
                                        onClick={() => handleRemoveIngredient(index)}
                                        style={{ 
                                            backgroundColor: '#ff4444', 
                                            color: 'white', 
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '30px',
                                            height: '30px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease'
                                        }}
                                        title="Remove ingredient"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add New Ingredient */}
                        <div style={{ 
                            display: 'flex', 
                            gap: '10px', 
                            marginBottom: '25px' 
                        }}>
                            <input 
                                type="text"
                                value={newIngredient}
                                onChange={(e) => setNewIngredient(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                                placeholder="Add more ingredients..."
                                style={{ 
                                    flex: 1,
                                    padding: '10px 15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                            <button 
                                onClick={handleAddIngredient}
                                style={{ 
                                    backgroundColor: '#4CAF50', 
                                    color: 'white', 
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontWeight: 'bold'
                                }}
                            >
                                <FaPlus /> Add
                            </button>
                        </div>

                        {/* Recipe Options Button */}
                        <button 
                            onClick={() => setShowRecipeOptions(!showRecipeOptions)}
                            style={{ 
                                backgroundColor: '#2196F3', 
                                color: 'white', 
                                padding: '12px 25px', 
                                borderRadius: '8px', 
                                border: 'none', 
                                cursor: 'pointer', 
                                fontSize: '16px', 
                                fontWeight: 'bold',
                                width: '100%',
                                marginBottom: '15px'
                            }}
                        >
                            {showRecipeOptions ? 'Hide Recipe Options' : 'Choose Recipe Type'}
                        </button>

                        {/* Recipe Options */}
                        {showRecipeOptions && (
                            <div style={{ 
                                marginBottom: '20px',
                                padding: '20px',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '8px'
                            }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '8px', 
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }}>
                                        Recipe Type:
                                    </label>
                                    <select 
                                        value={recipeType}
                                        onChange={(e) => setRecipeType(e.target.value)}
                                        style={{ 
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            border: '1px solid #ddd',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="">Any Type</option>
                                        <option value="main course">Main Course</option>
                                        <option value="side dish">Side Dish</option>
                                        <option value="dessert">Dessert</option>
                                        <option value="appetizer">Appetizer</option>
                                        <option value="salad">Salad</option>
                                        <option value="bread">Bread</option>
                                        <option value="breakfast">Breakfast</option>
                                        <option value="soup">Soup</option>
                                        <option value="beverage">Beverage</option>
                                        <option value="sauce">Sauce</option>
                                        <option value="snack">Snack</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '8px', 
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }}>
                                        Cuisine:
                                    </label>
                                    <select 
                                        value={cuisineType}
                                        onChange={(e) => setCuisineType(e.target.value)}
                                        style={{ 
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            border: '1px solid #ddd',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="">Any Cuisine</option>
                                        <option value="african">African</option>
                                        <option value="american">American</option>
                                        <option value="british">British</option>
                                        <option value="cajun">Cajun</option>
                                        <option value="caribbean">Caribbean</option>
                                        <option value="chinese">Chinese</option>
                                        <option value="eastern european">Eastern European</option>
                                        <option value="european">European</option>
                                        <option value="french">French</option>
                                        <option value="german">German</option>
                                        <option value="greek">Greek</option>
                                        <option value="indian">Indian</option>
                                        <option value="irish">Irish</option>
                                        <option value="italian">Italian</option>
                                        <option value="japanese">Japanese</option>
                                        <option value="jewish">Jewish</option>
                                        <option value="korean">Korean</option>
                                        <option value="latin american">Latin American</option>
                                        <option value="mediterranean">Mediterranean</option>
                                        <option value="mexican">Mexican</option>
                                        <option value="middle eastern">Middle Eastern</option>
                                        <option value="nordic">Nordic</option>
                                        <option value="southern">Southern</option>
                                        <option value="spanish">Spanish</option>
                                        <option value="thai">Thai</option>
                                        <option value="vietnamese">Vietnamese</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '8px', 
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }}>
                                        Diet:
                                    </label>
                                    <select 
                                        value={dietType}
                                        onChange={(e) => setDietType(e.target.value)}
                                        style={{ 
                                            width: '100%',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            border: '1px solid #ddd',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="">Any Diet</option>
                                        <option value="gluten free">Gluten Free</option>
                                        <option value="ketogenic">Ketogenic</option>
                                        <option value="vegetarian">Vegetarian</option>
                                        <option value="lacto-vegetarian">Lacto-Vegetarian</option>
                                        <option value="ovo-vegetarian">Ovo-Vegetarian</option>
                                        <option value="vegan">Vegan</option>
                                        <option value="pescetarian">Pescetarian</option>
                                        <option value="paleo">Paleo</option>
                                        <option value="primal">Primal</option>
                                        <option value="low fodmap">Low FODMAP</option>
                                        <option value="whole30">Whole30</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Generate Recipe Button */}
                        <button 
                            onClick={handleGenerateRecipe}
                            disabled={ingredients.length === 0 || isLoading}
                            style={{ 
                                backgroundColor: ingredients.length > 0 ? '#FF5722' : '#ccc', 
                                color: 'white', 
                                padding: '15px 30px', 
                                borderRadius: '8px', 
                                border: 'none', 
                                cursor: ingredients.length > 0 ? 'pointer' : 'not-allowed', 
                                fontSize: '18px', 
                                fontWeight: 'bold',
                                width: '100%',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            🍳 Generate Recipe
                        </button>
                    </div>
                )}
            </div>

            {/* Loading for Recipe Generation */}
            {isLoading && showIngredientEditor && (
                <div style={{ 
                    marginTop: '30px',
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center' 
                }}>
                    <SpinningFaSpinner size={50} color="#FF5722" />
                    <p style={{ marginTop: '15px', color: '#666', fontSize: '16px' }}>
                        Finding the perfect recipe for you...
                    </p>
                </div>
            )}

            {/* Recipe Display Section */}
            {recipe && !isLoading && (
                <div style={{ 
                    width: '100%', 
                    maxWidth: '1400px',
                    marginTop: '40px'
                }}>
                    <div style={{ 
                        border: '2px solid #FF5722', 
                        padding: '30px', 
                        borderRadius: '15px',
                        backgroundColor: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        {/* Recipe Header */}
                        <div style={{ 
                            borderBottom: '3px solid #FF5722', 
                            paddingBottom: '20px',
                            marginBottom: '25px'
                        }}>
                            <h2 style={{ 
                                color: '#FF5722', 
                                fontSize: '32px',
                                marginBottom: '10px'
                            }}>
                                {recipe.title}
                            </h2>
                        </div>

                        {/* 3-Column Layout */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '300px 1fr 1fr',
                            gap: '30px',
                            alignItems: 'start'
                        }}>
                            {/* Left Column: Image and Time */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {recipe.image && (
                                    <img 
                                        src={recipe.image} 
                                        alt={recipe.title}
                                        style={{ 
                                            width: '300px',
                                            height: '300px',
                                            objectFit: 'cover',
                                            borderRadius: '10px',
                                            marginBottom: '20px'
                                        }}
                                    />
                                )}
                                <div style={{ textAlign: 'center' }}>
                                    <FaClock size={30} color="#FF5722" />
                                    <p style={{ 
                                        marginTop: '8px', 
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }}>
                                        Ready in
                                    </p>
                                    <p style={{ fontSize: '18px', color: '#FF5722' }}>
                                        {recipe.readyInMinutes} minutes
                                    </p>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                    <FaUtensils size={30} color="#FF5722" />
                                    <p style={{ 
                                        marginTop: '8px', 
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }}>
                                        Servings
                                    </p>
                                    <p style={{ fontSize: '18px', color: '#FF5722' }}>
                                        {recipe.servings}
                                    </p>
                                </div>
                                {(recipe.vegan || recipe.vegetarian) && (
                                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                        <FaLeaf size={30} color={recipe.vegan ? "#4CAF50" : "#8BC34A"} />
                                        <p style={{ 
                                            marginTop: '8px', 
                                            fontWeight: 'bold',
                                            color: recipe.vegan ? "#4CAF50" : "#8BC34A"
                                        }}>
                                            {recipe.vegan ? "Vegan" : "Vegetarian"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Center Column: Ingredients */}
                            <div>
                                <h3 style={{ 
                                    color: '#333', 
                                    fontSize: '24px',
                                    marginBottom: '15px',
                                    borderLeft: '4px solid #FF5722',
                                    paddingLeft: '15px'
                                }}>
                                    Ingredients
                                </h3>
                                <ul style={{ 
                                    listStyleType: 'none', 
                                    padding: 0,
                                    lineHeight: '2'
                                }}>
                                    {recipe.extendedIngredients && recipe.extendedIngredients.map((ing, index) => (
                                        <li key={index} style={{ 
                                            padding: '10px 15px',
                                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                                            borderRadius: '5px',
                                            marginBottom: '5px'
                                        }}>
                                            ✓ {ing.original}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right Column: Instructions and Nutrition */}
                            <div>
                                {/* Instructions */}
                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ 
                                        color: '#333', 
                                        fontSize: '24px',
                                        marginBottom: '15px',
                                        borderLeft: '4px solid #FF5722',
                                        paddingLeft: '15px'
                                    }}>
                                        Instructions
                                    </h3>
                                    {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
                                        <ol style={{ 
                                            paddingLeft: '20px',
                                            lineHeight: '1.8'
                                        }}>
                                            {recipe.analyzedInstructions[0].steps.map((step, index) => (
                                                <li key={index} style={{ 
                                                    marginBottom: '15px',
                                                    fontSize: '16px',
                                                    color: '#555'
                                                }}>
                                                    {step.step}
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <div 
                                            dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                                            style={{ 
                                                lineHeight: '1.8',
                                                color: '#555'
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Nutrition Information */}
                                {nutrition && nutrition.nutrients && (
                                    <div style={{ 
                                        padding: '25px',
                                        backgroundColor: '#e8f5e9',
                                        borderRadius: '10px',
                                        border: '2px solid #4CAF50'
                                    }}>
                                        <h3 style={{ 
                                            color: '#4CAF50', 
                                            fontSize: '24px',
                                            marginBottom: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}>
                                            <FaLeaf /> Nutritional Information (per serving)
                                        </h3>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                            gap: '10px'
                                        }}>
                                            {nutrition.nutrients.slice(0, 8).map((nutrient, index) => (
                                                <div key={index} style={{ 
                                                    backgroundColor: 'white',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}>
                                                    <p style={{ 
                                                        fontWeight: 'bold',
                                                        color: '#333',
                                                        marginBottom: '5px',
                                                        fontSize: '14px'
                                                    }}>
                                                        {nutrient.name}
                                                    </p>
                                                    <p style={{ 
                                                        fontSize: '18px',
                                                        color: '#4CAF50',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {Math.round(nutrient.amount)}{nutrient.unit}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadForm;
