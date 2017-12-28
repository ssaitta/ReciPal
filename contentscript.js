//this gives us a list of all the directions and ingredients

const [...directionsListHTML] = document.getElementsByClassName("o-Method__m-Body")
const [...directionsList] = directionsListHTML[0].children

//this will give us the list in the form of srings in an array of the directions

directionsList.forEach(elem=>{  
    if(elem.childElementCount===0){
        console.log(elem.innerText)
        
    }
})

const [...ingredientsList] = document.getElementsByClassName("o-Ingredients__a-ListItemText")

//this will give us the list in the from of strings in an array of the ingredients 

ingredientsList.forEach(elem=>{
    //if(elem.childElementCount===0){
        //elem.classList.add('highlightedIngred') //this works but css doesn't c
        console.log(elem.innerHTML)
    //}
})

//testing on 
//http://www.foodnetwork.com/recipes/rachael-ray/pasta-with-pumpkin-and-sausage-recipe-1939614

