"use strict"; 

//initalize the HTML class names we use to find the ingredients list and directions list
let ingredientsClassName = ''
let directionsClassName = ''
let website = ''

//use the async API chrome.storage to retreive the url from the backgorund script. Then based on that url set the ingredients and directions class names for the three recipe sites, nytimes cooking, foodnetwork, and all recipes. 

chrome.storage.sync.get('url', (obj)=>{   
    console.log('fetched')
    let url = obj.url
    if(url.indexOf('nytimes')!==-1){
        ingredientsClassName = 'recipe-ingredients'
        directionsClassName = 'recipe-steps'
        website = 'nytimes'
    }
    else if(url.indexOf('foodnetwork')!==-1){
        ingredientsClassName = 'o-Ingredients__a-ListItemText'
        directionsClassName = 'o-Method__m-Body'
        website = 'foodnetwork'
    }
    else if(url.indexOf('allrecipes')!==-1){
        ingredientsClassName = 'dropdownwrapper'
        directionsClassName = 'recipe-directions__list'
        website = 'allrecipes'
    }
})

//delayed so that the async chrome.storage.sync.get() is completed first
setTimeout(()=>{

let ingredientObj = {}, ingredientsList = [],removedCommas = '';


if(website==='nytimes'){
    [...ingredientsList] = document.getElementsByClassName(ingredientsClassName)[0].children
}

if(website==='foodnetwork'){
    [...ingredientsList] = document.getElementsByClassName(ingredientsClassName)
}

if(website==='allrecipes'){
    let [...ingredentLists] = document.getElementsByClassName(ingredientsClassName)
    ingredentLists.forEach((elem)=>{
        ingredientsList.push([...elem.children])
    })
    ingredientsList = ingredientsList.reduce(function(a,b){
        return a.concat(b);
    })
    ingredientsList.pop() //the last ingredient is the "Add all ingredients to list" button
}

//building the ingredients object:
ingredientsList.forEach((elem,index)=>{
    let quantityTextPart = [], foodTextPart = [];
    let num = ['0','1','2','3','4','5','6','7','8','9','½','1/2','⅓','1/3','¼','1/4','⅛','1/8','⅜','3/8','⅝','5/8','⅞','7/8','⅔','⅔','2/3','¾','3/4','⅕','1/5','⅖','2/5','⅗','3/5','⅘','4/5','⅙','1/6','⅚','5/6','26','28','16','10','15','20']
        let measurments = ['cup','cups','teaspoon','teaspoons','tablespoon','tablespoons','clove','cloves','medium','pound','pounds','sprig','sprigs','plus','about','small','pinch','box','bag','stalk','stick','approximately','to','pieces','ounces','oz','lb','lbs','tbs','tsp']
        let food = ['onion','onions','garlic','oil','sausage','sage','wine','chicken','stock','pumpkin','heavy', 'cream' ,'salt','pepper','penne','romano','parmiigiano','pumpernickel','bay', 'leaf', 'cinnamon','nutmeg','cheese','spinach','apple','apples','vinegar','mustard','honey','potatoes','potato','milk','butter','chives','rolls','butter','buttermilk','milk']

    if(website==='foodnetwork'){
        removedCommas = elem.innerHTML.replace(/,+/g,'').toLowerCase()
    }
    if(website ==="nytimes"||website ==="allrecipes"){
        removedCommas = elem.innerText.replace(/,+/g,'').toLowerCase()
    }

    let fullTextSplit = removedCommas.split(' ')
    quantityTextPart = fullTextSplit.filter((word)=>{
        if(num.indexOf(word) !== -1 || measurments.indexOf(word) !== -1){
            return word
        }
    }) 
    foodTextPart = fullTextSplit.filter((word)=>{
        if(food.indexOf(word) !== -1){
            return word
        }
    }) 
   

    ingredientObj[index] = {}
    ingredientObj[index]['quantity'] = quantityTextPart.join(' ')
    ingredientObj[index]['foodPart'] = foodTextPart//.join(' ')
})

console.log(ingredientObj)

//building out the directions list and making it iterable
let [...directionsListHTML] = document.getElementsByClassName(directionsClassName) //"o-Method__m-Body"
let [...directionsList] = directionsListHTML[0].children
//this will give us the list in the form of srings in an array of the directions

//Using for loops to locate all ingredients in the directions section and adding the highlight and tooltip text.
directionsList.forEach(elem=>{  
    let directionArray = elem.innerHTML.split(' '), newPara = '';

    if(elem.childElementCount===0 && website==="nytimes" ||
    elem.childElementCount===0 && website==="foodnetwork" ||
    elem.childElementCount===1 && website==="allrecipes"){
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
    //replace whole direction paragraph
    newPara = directionArray.join(' ')
    elem.innerHTML = newPara
    }
})

},0) //timeout

//testing on 
//http://www.foodnetwork.com/recipes/rachael-ray/pasta-with-pumpkin-and-sausage-recipe-1939614

