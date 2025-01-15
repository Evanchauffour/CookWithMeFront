"use client";

import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import { useUserSession } from '@/hook/useUserSession';
import { createRecipe, getRecipesByUser, updateRecipe } from '@/apiServices/recipes';
import { Category } from '@/types/types';
import { getCategories } from '@/apiServices/categories';
import RecipeItem from '@/components/RecipeItem';

type Step = {
    recipe?: Recipe;
    number: string;
    title: string;
    content: string;
};

type Recipe = {
    id?: string;
    name: string;
    author: string;
    nbLikes: number;
    category: string;
    steps: Step[];
    createdAt: string;
    nbReviews?: number;
};

const HomePage: React.FC = () => {
    const { user } = useUserSession();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [name, setName] = useState('');
    const [nbLikes, setNbLikes] = useState(0);
    const [categoryId, setCategoryId] = useState('');
    const [steps, setSteps] = useState<Step[]>([{ number: "1", title: '', content: '' }]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openModif = (e: React.MouseEvent<HTMLButtonElement>, recipe: Recipe) => {
        e.preventDefault();
        setName(recipe.name);
        setCategoryId(recipe.category.replace('/api/categories/', ''));
        setSteps(recipe.steps.map(step => ({
            ...step,
            recipe: recipe,
        }))); setNbLikes(recipe.nbLikes);
        setEditingRecipeId(recipe.id ?? null);
        setIsEditing(true);
        setIsModalOpen(true);
    };


    const handleAddStep = () => {
        setSteps([...steps, { number: String(steps.length), title: '', content: '' }]);
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


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newRecipe: Recipe = {
            name,
            author: `/api/users/${user?.id}`,
            nbLikes,
            category: `/api/categories/${categoryId}`,
            steps,
            createdAt: new Date().toISOString(),
        };

        try {
            if (isEditing && editingRecipeId) {
                // Si on est en mode édition, on met à jour la recette existante
                const updatedRecipe = {
                    ...newRecipe,
                    id: editingRecipeId,  // Ajouter l'ID de la recette à mettre à jour
                };

                await updateRecipe(updatedRecipe);
                console.log('Recette mise à jour avec succès');
            } else {
                // Sinon, on crée une nouvelle recette
                await createRecipe(newRecipe);
                console.log('Nouvelle recette créée avec succès');
            }

            // Réinitialisation des champs et fermeture du modal
            setName('');
            setNbLikes(0);
            setCategoryId('');
            setSteps([{ number: '1', title: '', content: '' }]);
            setIsEditing(false);
            setEditingRecipeId(null);
            closeModal();
            getRecipeUser(); // Recharger la liste des recettes
        } catch (error) {
            console.error('Erreur lors de la soumission de la recette :', error);
        }
    };


    const getRecipeUser = async () => {
        try {
            console.log(user)
            const response = await getRecipesByUser(user?.id || 0);
            console.log(response)
            setRecipes(response?.data.member);

        } catch (error) {
            console.error('Erreur lors de la récupération des recettes :', error);
        }
    }

    const categoriesGet = async () => {
        try {
            console.log(user)
            const response = await getCategories();
            console.log(response)
            setCategories(response?.data.member);

        } catch (error) {
            console.error('Erreur lors de la récupération des recettes :', error);
        }
    }


    useEffect(() => {
        getRecipeUser()
        categoriesGet()

    }, [user]);

    return (
        <div className="w-full">
            <div className="w-[800px] mx-auto flex flex-col gap-8">
                <section className="w-full flex justify-between">
                    <h2 className="text-2xl font-bold mb-2 text-black">Mes recettes</h2>
                    <button onClick={openModal} style={buttonStyle} className="bg-blue-500 text-white flex">
                        Ajouter une recette
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <h2 className="text-2xl font-bold mb-4 text-black">Ajouter une recette</h2>
                        <form onSubmit={handleSubmit} className='grid grid-cols-2'>
                            <div className="mb-4">
                                <label className="block font-bold">Nom de la recette</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border border-gray-300 p-2 w-full rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4 ml-2">
                                <label className="block font-bold">Categories</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="border border-gray-300 p-2 w-full rounded"
                                    required>
                                    <option value="">Choisir une catégorie</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='col-span-2 '>
                                <h3 className="text-lg font-bold mb-2">Étapes</h3>
                                {steps.map((step, index) => (
                                    <div key={index} className="mb-4 border p-4 rounded">
                                        <div className="mb-2">
                                            <label className="block font-bold">Titre de l&apos;étape {index + 1}</label>
                                            <input
                                                type="text"
                                                value={step.title}
                                                onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                                                className="border border-gray-300 p-2 w-full rounded"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold">Contenu de l&apos;étape {index + 1}</label>
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
                                            Supprimer l&apos;étape
                                        </button>
                                    </div>
                                ))}
                            </div>


                            <button
                                type="button"
                                onClick={handleAddStep}
                                className="bg-blue-500 text-white p-2 rounded mb-4 col-span-2"
                            >
                                Ajouter une étape
                            </button>

                            <div className="flex justify-between col-span-2">
                                {isEditing ? (
                                    <button
                                        type="submit"
                                        className="bg-yellow-500 text-white p-2 rounded mr-2"
                                    >
                                        Mettre à jour la recette
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white p-2 rounded mr-2"
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
                            <li key={recipe.id}>                            
                                <RecipeItem recipe={recipe} index={0} isEdition openEditModal={(e) => openModif(e, recipe)}/>
                            </li>
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
