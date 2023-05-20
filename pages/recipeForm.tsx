import { useRouter } from "next/router"
import { ExclamationTriangleIcon, MinusCircleIcon, PlusCircleIcon , ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline'
import { useState } from "react"

export default function RecipeForm() {
    const blankArray = ['', '', '', '', '']
    const emptyArray: string[] = []

    const [title, setTitle] = useState('')
    const [source, setSource] = useState('')
    const [ingredients, setIngredients] = useState(blankArray)
    const [instructions, setInstructions] = useState(blankArray)

    const [link, setLink] = useState('')

    const [errors, setErrors] = useState(emptyArray)
    const [warning, setWarning] = useState('')

    const router = useRouter()

    const handleIngredientChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        let data = [...ingredients]
        data[index] = event.target.value
        setIngredients(data)
    }

    const handleInstructionChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        let data = [...instructions]
        data[index] = event.target.value
        setInstructions(data)
    }

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let errorArray

        let trimmedTitle = title.trim()
        let trimmedSource = source.trim()
        let filteredIngredients = ingredients.filter(item => item.length > 0)
        let filteredInstructions = instructions.filter(item => item.length > 0)
        
        errorArray = []

        if (trimmedTitle === '') {
            console.log(1)
            errorArray.push('Please add a title')
        }

        console.log(filteredIngredients)
        if (!filteredIngredients.length) {
            console.log(2)
            errorArray.push('Please add ingredients')
        }

        if (!filteredInstructions.length) {
            console.log(3)
            errorArray.push('Please add instructions')
        }

        //set array to empty, if !errors
        //@ts-ignore
        setErrors(errorArray)
        if (errorArray.length) {
            return console.error(errorArray)
        }
        

        const recipe = {
            title: trimmedTitle,
            source: trimmedSource,
            ingredients: filteredIngredients,
            instructions: filteredInstructions
        }

        const JSONrecipe = JSON.stringify(recipe)
        const endpoint = '/api/addRecipe'
        const options = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSONrecipe
        }
        console.log('fetch')
        const response = await fetch(endpoint, options)

        const result = await response.json()

        console.log('push')
        router.push('/dashboard')
    }

    //the attempt structure is not working correctly
    //also can't be in global namespace
    let attempt = 0
    let prevLink: string
    
    function getAttempt(link: string) {
      if (link === prevLink) {
          attempt++
      } else {
          prevLink = link
          attempt++
          attempt = 1
      }
      console.log(attempt)
  
      return attempt
    }

    const getRecipe = async () => {
        console.log(link)
        let attempt = getAttempt(link)
        if (attempt > 2) {
            throw new Error('Too many attempts with this link')
        }
        try {
            if (attempt > 2) {
                throw new Error 
            }

            setErrors([])
            let url
            try {
                url = new URL(link)
            } catch(e) {
                console.log('error')
                return setErrors(['This is not a valid link. Make sure to copy the whole URL.'])
            }
            setWarning('this may take a minute')
    
    
            const object = {
                link: link
            }
    
            const json = JSON.stringify(object)
            console.log(json)
            const endpoint = '/api/getRecipeFromURL'
            const options = {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: json
            }
            console.log('fetch')
            const response = await fetch(endpoint, options)
           
            const result = await response.json()
            console.log(result)
    
            setTitle(link)
            setSource(result.source)
            setIngredients(result.ingredients)
            setInstructions(result.instructions)
            setWarning('')
        } catch (e) {
            console.log(e)
            if (attempt === 1 ) {
                setWarning("Something went wrong. Maybe try again.")
            } else if (attempt === 2) {
                setWarning("This link isn't working. You'll have to manually transfer it :(")
            } else {
                setWarning("Let's try a different link")
            }

        }

    }



    const addIngredient = () => {
        let data = [...ingredients]
        data.push('')
        setIngredients(data)
    }

    const addInstructionAbove = (index: number) => {
        let data = [...instructions]
        if (index === 0) {
            console.log(index)
            data.splice(0, 0, '')
            console.log(data)
        } else {
            console.log(index)
            data.splice(index, 0, '')
            console.log(data)
        }
        setInstructions(data)
    }

    const addInstructionBelow = (index: number) => {
        let data = [...instructions]
        if (index === instructions.length) {
            console.log(index)
            data.push('')
        } else {
            data.splice(index + 1, 0, '')
        }
        setInstructions(data)
    }

    const removeIngredientField = (index: number) => {
        let data = [...ingredients];
        data.splice(index, 1)
        setIngredients(data)
    }

    const removeInstructionField = (index: number) => {
        let data = [...instructions];
        data.splice(index, 1)
        setInstructions(data)
    }

    return (
        <div className="pageContainer">
            <form className="page" onSubmit={submit}>


                <div className="pageLeft">
                <ul>
                    {warning !== '' &&
                            <li className="warningSign flex"> 
                            <ExclamationTriangleIcon className="h-4  px-4 mx-4" /> 
                            <p>{warning}</p>
                            </li>
                    }
                </ul>
                <ul>
                    {errors.map((error, index)=> {
                        return(
                            <li className="errorSign flex" key={index}> 
                            <ExclamationTriangleIcon className="h-4  px-4 mx-4" /> 
                            <p>{error}</p>
                            </li>
                        )
                    })}
                </ul>

                <label className="labelLeft" htmlFor="title">A Recipe for</label>
                <input className="inputBoxLeft w-10/12" name="title" type='text' value={title}
                    onChange={event => setTitle(event.target.value)} />

                <label className="labelLeft">From:</label>
                <input className="inputBoxLeft w-10/12" name="source" type='text' value={source}
                    onChange={event => setSource(event.target.value)} />

                <hr className="border-black my-4 w-full shadow col-start-1"></hr>
                
                <label className="labelLeft">Link:</label>
                <input className="inputBoxLeft w-10/12" name="link" type='text'
                    onChange={event => setLink(event.target.value)} />
                <button className="flex-none border-2 col-start-1 w-1/2 mb-2 bg-purple" type='button'
                    onClick={getRecipe}>Get recipe from link</button>
                <button className="flex-none border-2 col-start-1 w-1/2 bg-purple" type="submit">Submit</button>
                </div>

                <div className="pageRight">
                <label className="iWord" htmlFor="ingredients">Ingredients</label>
                {ingredients.map((form, index) => {
                    return (
                        <div className="flex flex-row my-1 items-center" key={index}>
                            <input
                                className="inputBox"
                                name='ingredient'
                                value={form}
                                onChange={event => handleIngredientChange(event, index)}
                            />
                            <MinusCircleIcon className="inputButton"
                                            onClick={()=> removeIngredientField(index)}  />
                        </div>
                    )
                })}
                <PlusCircleIcon className="addButton" onClick={addIngredient} />
                <label className="iWord" htmlFor="instructions">Instructions</label>
                {instructions.map((form, index) => {
                    return (
                        <div className="flex flex-row my-1 place-items-center" key={index}>
                            <h3 className="label">{index + 1}.</h3>
                            <input
                                className="inputBox"
                                name="instruction"
                                value={form}
                                onChange={event => handleInstructionChange(event, index)} />
                            <ArrowUpCircleIcon className="inputButton" type="button" onClick={()=> addInstructionAbove(index)}/>
                            <button className="add">ADD</button>
                            <ArrowDownCircleIcon className="inputButton" onClick={()=> addInstructionBelow(index)} />
                            <MinusCircleIcon className="inputButton" onClick={()=> removeInstructionField(index)} />
                        </div>
                    )
                })}
                </div>
            </form>
        </div>
    )

}   




