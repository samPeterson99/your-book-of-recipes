import Link from "next/link"
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from "next/router"

const RecipeCard = ({ 
    recipe
 }: {
    recipe: {
        _id: string
        title: string
        source?: string
        ingredients: string[]
        instructions: string[]
    }
 }) => {
    const router = useRouter()

    const link: string = `/recipePage`

    const ingredientPreview: string[] = recipe.ingredients.slice(0, 3);
    const ingredientLength: number = recipe.ingredients.length;

    async function deleteRecipe(recipeId: string) {
        const endpoint: string =  `/api/deleteRecipe/${recipeId}`;

        //need to figure out type
        const response = await fetch(endpoint);

        const result: [] = await response.json();
        router.push('/dashboard');
    }

    return (
        <div className='contents'>
        <div className='flex flex-col h-full bg-cream rounded border-4 border-black justify-between'>
            <XMarkIcon className="z-50 stroke-2 text-cream font-bold  bg-black  p-1 h-8 self-end"
                onClick={() => deleteRecipe(recipe._id)} />
                <h3 className="text-2xl">{recipe.title}</h3>
                <ul className="h-1/2 list-disc" >
                    {ingredientPreview.map((form, index) =>{
                        return <li key={index} className='text-sm ml-8'>{form},</li>})}
                    {ingredientLength === 4 && <p className='text-sm ml-4'>and 1 more ingredient</p>}
                    {recipe.ingredients.length > 4 && <p className='text-sm ml-4'>and {(recipe.ingredients.length - 3)} more ingredients</p>}
                </ul>

                <Link href={{
                pathname: link,
                query: {
                    id: recipe._id
                }
                }} className="border-y-2 w-full bg-purple border-gray-400">Click for recipe</Link>
        </div>
    </div>
    )
}

export default RecipeCard;