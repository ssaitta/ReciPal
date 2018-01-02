"use strict"; 

//initalize the HTML class names we use to find the ingredients list and directions list
let ingredientsClassName = ''
let directionsClassName = ''

//use the async API chrome.storage to retreive the url from the backgorund script. Then based on that url set the ingredients and directions class names for the three recipe sites, nytimes cooking, foodnetwork, and all recipes. 

chrome.storage.sync.get('url', (obj)=>{   
    console.log('fetched')
    let url = obj.url
    if(url.indexOf('nytimes')!==-1){
        ingredientsClassName = 'recipeIngredient'
        directionsClassName = 'recipeInstructions'
        console.log(ingredientsClassName)
    }
    else if(url.indexOf('foodnetwork')!==-1){
        ingredientsClassName = 'o-Ingredients__a-ListItemText'
        directionsClassName = 'o-Method__m-Body'
    }
    else if(url.indexOf('allrecipes')!==-1){
        ingredientsClassName = 'checkList'
        directionsClassName = 'recipe-directions__list'
    }
})

console.log(ingredientsClassName)   //right now this is coming through as blank because chrome.storage.sync.get is async

//currently hard coded to work with food network:

//breaking down the ingredients list into the ingredients object:
let [...ingredientsList] = document.getElementsByClassName("o-Ingredients__a-ListItemText") //"o-Ingredients__a-ListItemText"
console.log(ingredientsList)
let ingredientObj = {}
//this will give us the list in the from of strings in an array of the ingredients 


//building the ingredients object:
ingredientsList.forEach((elem,index)=>{
    let num = ['1','2','3','4','5','6','7','8','9','1/2','1/3','1/4','1/8','2/3','2/4','3/4']
    let measurments = ['cup','cups','teaspoon','teaspoons','tablespoon','tablespoons','clove','cloves','medium','pound','pounds','sprig','sprigs','plus','about','small','pinch']
    let food = ['onion','onions','garlic','oil','sausage','sage','wine','chicken','stock','pumpkin','heavy', 'cream' ,'salt','pepper','penne','romano','parmiigiano','pumpernickel','bay', 'leaf', 'cinnamon','nutmeg','cheese','spinach','apple','apples','vinegar','mustard','honey']
    let removedCommans = elem.innerHTML.replace(',','');
    let fullTextSplit = removedCommans.split(' ')
    let quantityTextPart = fullTextSplit.filter((word)=>{
       if(num.indexOf(word) !== -1 || measurments.indexOf(word) !== -1){
           return word
       }
    }) 

    let foodTextPart = fullTextSplit.filter((word)=>{
        if(food.indexOf(word) !== -1){
            return word
        }
    }) 
    ingredientObj[index] = {}
    ingredientObj[index]['quantity'] = quantityTextPart.join(' ')
    ingredientObj[index]['foodPart'] = foodTextPart//.join(' ')
})

// console.log(ingredientObj)


//building out the directions list and making it iterable
let [...directionsListHTML] = document.getElementsByClassName("o-Method__m-Body") //"o-Method__m-Body"
let [...directionsList] = directionsListHTML[0].children

//this will give us the list in the form of srings in an array of the directions


//Using for loops to locate all ingredients in the directions section and adding the highlight and tooltip text.
directionsList.forEach(elem=>{  
    let directionArray = elem.innerHTML.split(' ') //note: has lots of '' elements
    let newPara = ''
    if(elem.childElementCount===0){
        for(let i=0;i<Object.keys(ingredientObj).length;i++){
            for(let j=0;j<ingredientObj[i].foodPart.length;j++){ //need this nested since some have more than one food part.
                let currentFood = ingredientObj[i].foodPart[j]
                for(let k=0; k<directionArray.length ;k++){
                    let directionWord = directionArray[k].toLowerCase()
                    if(directionWord!==""){
                        if(directionWord===currentFood||directionWord ===currentFood+','||directionWord===currentFood+'.'){
                            //retain ',' if present in original directions
                           if(directionWord.charAt(directionArray[k].length-1)===','){
                            directionArray[k]=`<span style="background-color:yellow" title="`+ingredientObj[i].quantity+`">`+currentFood+`</span>,`
                           }
                           //retain '.' if present in original directions
                           else if(directionWord.charAt(directionArray[k].length-1)==='.'){
                            directionArray[k]=`<span style="background-color:yellow" title="`+ingredientObj[i].quantity+`">`+currentFood+`</span>.`
                           }
                           else{
                            directionArray[k]=`<span style="background-color:yellow" title="`+ingredientObj[i].quantity+`">`+currentFood+`</span>`
                           }
                        }
                    }
                }
            }
        }
    //replae whole direction paragraph
    newPara = directionArray.join(' ')
    elem.innerHTML = newPara
    }
})


//testing on 
//http://www.foodnetwork.com/recipes/rachael-ray/pasta-with-pumpkin-and-sausage-recipe-1939614

