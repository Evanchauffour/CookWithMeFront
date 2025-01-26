"use client";

import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useUserSession } from "@/hook/useUserSession";
import {
    createRecipe,
    createRecipeIngredient,
    getRecipesByUser,
    updateRecipe,
    getRecipeIngredientByRecipe,
    deleteRecipeIngredient
} from "@/apiServices/recipes";
import { Category } from "@/types/types";
import { getCategories } from "@/apiServices/categories";
import { getIngredients } from "@/apiServices/ingredients";
import Select from "react-select";

type Step = {
    recipe?: Recipe;
    number: string;
    title: string;
    content: string;
};

type Ingredient = {
    id: number;
    name: string;
};

type RecipeIngredient = {
    ingredientId: number;
    quantity: number;
    unit: string;
};

type Recipe = {
    id?: string;
    name: string;
    author: string;
    nbLikes: number;
    category: string;
    steps: Step[];
    recipeIngredients: RecipeIngredient[];
    createdAt: string;
    nbReviews?: number;
};

const HomePage: React.FC = () => {
    const { user } = useUserSession();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    const [isEditing, setIsEditing] = useState(false);
    const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [name, setName] = useState("");
    const [nbLikes, setNbLikes] = useState(0);
    const [categoryId, setCategoryId] = useState("");
    const [steps, setSteps] = useState<Step[]>([{ number: "1", title: "", content: "" }]);
    const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleAddStep = () => {
        setSteps([...steps, { number: String(steps.length + 1), title: "", content: "" }]);
    };

    const handleStepChange = (index: number, field: keyof Step, value: string) => {
        const updatedSteps = steps.map((step, i) =>
            i === index ? { ...step, [field]: value } : step
        );
        setSteps(updatedSteps);
    };

    const handleRemoveStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleAddIngredient = () => {
        setRecipeIngredients([...recipeIngredients, { ingredientId: 0, quantity: 0, unit: "" }]);
    };

    const handleIngredientChange = (index: number, field: keyof RecipeIngredient, value: any) => {
        const updatedIngredients = recipeIngredients.map((ingredient, i) =>
            i === index ? { ...ingredient, [field]: value } : ingredient
        );
        setRecipeIngredients(updatedIngredients);
    };

    const handleRemoveIngredient = (index: number) => {
        setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newRecipe: Recipe = {
            name,
            author: `/api/users/${user?.id}`,
            nbLikes,
            category: `/api/categories/${categoryId}`,
            steps,
            recipeIngredients,
            createdAt: new Date().toISOString(),
        };

        try {
            if (isEditing && editingRecipeId) {
                const updatedRecipe = { ...newRecipe, id: editingRecipeId };
                await updateRecipe(updatedRecipe);
                await deleteRecipeIngredient(editingRecipeId);
                console.log("Recette mise à jour avec succès");
                const promiseRecipeIngredient = recipeIngredients.map((recipeIngredient) => {
                    const recipeIngredientFormatted = {
                        quantity: recipeIngredient.quantity,
                        unit: recipeIngredient.unit,
                        recipe: `/api/recipes/${editingRecipeId}`,
                        ingredient: `/api/ingredients/${recipeIngredient.ingredientId}`,
                    };
                    return createRecipeIngredient(recipeIngredientFormatted);
                });
                await Promise.all(promiseRecipeIngredient);

            } else {
                const recipeId = await createRecipe(newRecipe);
                const promiseRecipeIngredient = recipeIngredients.map((recipeIngredient) => {
                    const recipeIngredientFormatted = {
                        quantity: recipeIngredient.quantity,
                        unit: recipeIngredient.unit,
                        recipe: `${recipeId}`,
                        ingredient: `/api/ingredients/${recipeIngredient.ingredientId}`,
                    };
                    return createRecipeIngredient(recipeIngredientFormatted);
                });
                await Promise.all(promiseRecipeIngredient);
                console.log("Nouvelle recette créée avec succès");
            }

            setName("");
            setNbLikes(0);
            setCategoryId("");
            setSteps([{ number: "1", title: "", content: "" }]);
            setRecipeIngredients([]);
            setIsEditing(false);
            setEditingRecipeId(null);
            closeModal();
            getRecipeUser();
        } catch (error) {
            console.error("Erreur lors de la soumission de la recette :", error);
        }
    };
    const resetModal = () => {
        setName("");
        setNbLikes(0);
        setCategoryId("");
        setSteps([{ number: "1", title: "", content: "" }]);
        setRecipeIngredients([]);
        setIsEditing(false);
        setEditingRecipeId(null);
    }
    const loadRecipeForEditing = async (recipe: Recipe) => {
        try {
            // Mettre à jour les données de base de la recette
            setName(recipe.name);
            setNbLikes(recipe.nbLikes);
            setCategoryId(recipe.category.id.toString()); // Utiliser l'ID de la catégorie
            setSteps(
                recipe.steps.map((step) => ({
                    number: step.number,
                    title: step.title,
                    content: step.content,
                }))
            );

            // Récupérer les ingrédients de la recette via l'API
            const recipeIngredientsData = await getRecipeIngredientByRecipe(recipe);
            console.log('Données récupérées pour les ingrédients de la recette:', recipeIngredientsData);

            // Formater les données des ingrédients pour l'utiliser dans le formulaire
            const formattedIngredients = recipeIngredientsData.map((ri: any) => ({
                ingredientId: ri.ingredient.id, // ID de l'ingrédient
                name: ri.ingredient.name,      // Nom de l'ingrédient
                quantity: ri.quantity,         // Quantité
                unit: ri.unit,                 // Unité
            }));

            // Mettre à jour l'état des ingrédients
            setRecipeIngredients(formattedIngredients);
        } catch (error) {
            console.error('Erreur lors du chargement des ingrédients pour l\'édition :', error);
        }
    };



    const handleEditRecipe = (recipe: Recipe) => {
        setIsEditing(true);
        setEditingRecipeId(recipe.id || null);
        loadRecipeForEditing(recipe);
        openModal();
    };

    const getRecipeUser = async () => {
        try {
            const response = await getRecipesByUser(user?.id || 0);
            setRecipes(response?.data.member);
        } catch (error) {
            console.error("Erreur lors de la récupération des recettes :", error);
        }
    };

    const categoriesGet = async () => {
        try {
            const response = await getCategories();
            setCategories(response?.data.member);
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
        }
    };

    const ingredientsGet = async () => {
        try {
            const response = await getIngredients();
            setIngredients(response?.data.member);
        } catch (error) {
            console.error("Erreur lors de la récupération des ingrédients :", error);
        }
    };

    useEffect(() => {
        getRecipeUser();
        categoriesGet();
        ingredientsGet();
    }, [user]);
    return (
        <div className="w-full">
            <div className="w-[800px] mx-auto flex flex-col gap-8">
                <section className="w-full flex justify-between">
                    <h2 className="text-2xl font-bold mb-2 text-black">Mes recettes</h2>
                    <button onClick={(e) => { setIsEditing(false); resetModal(); openModal() }} style={buttonStyle} className="bg-blue-500 text-white flex">
                        Ajouter une recette
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <h2 className="text-2xl font-bold mb-4 text-black">Ajouter une recette</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block font-bold">Nom de la recette</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border border-gray-300 p-2 w-full rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-bold">Catégorie</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="border border-gray-300 p-2 w-full rounded"
                                    required
                                >
                                    <option value="">Choisir une catégorie</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2">
                                <h3 className="text-lg font-bold mb-2">Ingrédients</h3>
                                {recipeIngredients.map((ingredient, index) => (
                                    <div key={index} className="mb-4 border p-4 rounded">
                                        <div className="mb-2">
                                            <label className="block font-bold">Ingrédient</label>
                                            <select
                                                value={ingredient.ingredientId}
                                                onChange={(e) =>
                                                    handleIngredientChange(index, 'ingredientId', Number(e.target.value))
                                                }
                                                className="border border-gray-300 p-2 w-full rounded"
                                                required
                                            >
                                                <option value="">Choisir un ingrédient</option>
                                                {ingredients.map((ing) => (
                                                    <option key={ing.id} value={ing.id}>
                                                        {ing.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                            <label className="block font-bold">Quantité</label>
                                            <input
                                                type="number"
                                                value={ingredient.quantity}
                                                onChange={(e) =>
                                                    handleIngredientChange(index, 'quantity', Number(e.target.value))
                                                }
                                                className="border border-gray-300 p-2 w-full rounded"
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block font-bold">Unité</label>
                                            <input
                                                type="text"
                                                value={ingredient.unit}
                                                onChange={(e) =>
                                                    handleIngredientChange(index, 'unit', e.target.value)
                                                }
                                                className="border border-gray-300 p-2 w-full rounded"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveIngredient(index)}
                                            className="bg-red-500 text-white p-2 rounded"
                                        >
                                            Supprimer l'ingrédient
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddIngredient}
                                    className="bg-blue-500 text-white p-2 rounded"
                                >
                                    Ajouter un ingrédient
                                </button>
                            </div>

                            <div className="col-span-2">
                                <h3 className="text-lg font-bold mb-2">Étapes</h3>
                                {steps.map((step, index) => (
                                    <div key={index} className="mb-4 border p-4 rounded">
                                        <div className="mb-2">
                                            <label className="block font-bold">Titre de l'étape {index + 1}</label>
                                            <input
                                                type="text"
                                                value={step.title}
                                                onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                                                className="border border-gray-300 p-2 w-full rounded"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold">Contenu de l'étape {index + 1}</label>
                                            <textarea
                                                value={step.content}
                                                onChange={(e) => handleStepChange(index, 'content', e.target.value)}
                                                className="border border-gray-300 p-2 w-full rounded"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStep(index)}
                                            className="bg-red-500 text-white p-2 rounded mt-2"
                                        >
                                            Supprimer l'étape
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddStep}
                                    className="bg-blue-500 text-white p-2 rounded"
                                >
                                    Ajouter une étape
                                </button>
                            </div>

                            <div className="col-span-2 flex justify-between">
                                {isEditing ? (
                                    <button
                                        type="submit"
                                        className="bg-yellow-500 text-white p-2 rounded"
                                    >
                                        Mettre à jour la recette
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white p-2 rounded"
                                    >
                                        Créer la recette
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-red-500 text-white p-2 rounded"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </Modal>
                </section>
                <section>
                    <ul className="grid grid-cols-3 gap-4">
                        {recipes.map((recipe) => (
                            <div className="rounded-lg pb-4" key={recipe.id}>
                                <div className="aspect-square bg-blue-200 rounded-lg"></div>
                                <h3 className="text-xl font-medium text-black">{recipe.name}</h3>
                                <div className="w-full flex items-center justify-between text-black">
                                    <p className="text-opacity-50 text-sm">{recipe.nbLikes} ❤️</p>
                                    <button
                                        className="p-2 bg-green-600 rounded text-white"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            console.log("Modifier la recette", recipe);
                                            handleEditRecipe(recipe);

                                        }}
                                    >
                                        Modifier
                                    </button>
                                </div>
                            </div>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default HomePage;
