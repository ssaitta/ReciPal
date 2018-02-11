"use strict";

//initalize the HTML class names we use to find the ingredients list and directions list
let ingredientsClassName = ''
let directionsClassName = ''
let website = ''

//use the async API chrome.storage to retreive the url from the backgorund script. Then based on that url set the ingredients and directions class names for the three recipe sites, nytimes cooking, foodnetwork, and all recipes.
chrome.storage.sync.get('url', (obj) => {
    console.log('fetched')
    let url = obj.url
    if (url.indexOf('nytimes') !== -1){
        ingredientsClassName = 'recipe-ingredients'
        directionsClassName = 'recipe-steps'
        website = 'nytimes'
    }
    else if (url.indexOf('foodnetwork') !== -1){
        ingredientsClassName = 'o-Ingredients__a-ListItemText'
        directionsClassName = 'o-Method__m-Body'
        website = 'foodnetwork'
    }
    else if (url.indexOf('allrecipes') !== -1){
        ingredientsClassName = 'dropdownwrapper'
        directionsClassName = 'recipe-directions__list'
        website = 'allrecipes'
    }
    main()
})

//delayed so that the async chrome.storage.sync.get() is completed first
function main(){

let ingredientObj = {}, ingredientsList = [], removedCommas = '', removeGarbage = '';


if (website === 'nytimes'){
    [...ingredientsList] = document.getElementsByClassName(ingredientsClassName)[0].children
}

if (website === 'foodnetwork'){
    [...ingredientsList] = document.getElementsByClassName(ingredientsClassName)
}

if (website === 'allrecipes'){
    let [...ingredentLists] = document.getElementsByClassName(ingredientsClassName)
    ingredentLists.forEach((elem) => {
        ingredientsList.push([...elem.children])
    })
    ingredientsList = ingredientsList.reduce(function(a, b){
        return a.concat(b);
    })
    ingredientsList.pop() //the last ingredient is the "Add all ingredients to list" button
}

//building the ingredients object:
ingredientsList.forEach((elem, index) => {
    let quantityTextPart = [], foodTextPart = [];
    let num = ['½', '1/2', '⅓', '1/3', '¼', '1/4', '⅛', '1/8', '⅜', '3/8', '⅝', '5/8', '⅞', '7/8', '⅔', '⅔', '2/3', '¾', '3/4', '⅕', '1/5', '⅖', '2/5', '⅗', '3/5', '⅘', '4/5', '⅙', '1/6', '⅚', '5/6']
        let measurments = ['cup', 'cups', 'teaspoon', 'teaspoons', 'tablespoon', 'tablespoons', 'clove', 'cloves', 'medium', 'pound', 'pounds', 'sprig', 'sprigs', 'plus', 'about', 'small', 'pinch', 'box', 'bag', 'stalk', 'stick', 'approximately', 'to', 'pieces', 'ounces', 'oz', 'lb', 'lbs', 'tbs', 'tsp', 'bunch', 'inch']
        let food = ['onion', 'onions', 'garlic', 'oil', 'sausage', 'sage', 'wine', 'chicken', 'pork', 'lamb', 'venison', 'beef', 'heart', 'liver', 'tongue', 'bone', 'buffalo', 'bison', 'calf', 'goat', 'ham', 'kangaroo', 'marrow', 'moose', 'organ', 'meats', 'bacon', 'rabbit', 'snake', 'sweetbread', 'sweetbreads', 'tripe', 'turtle', 'veal', 'cornish', 'game', 'hen', 'duck', 'goose', 'guinea', 'pheasant', 'quail', 'squab', 'turkey', 'steak', 'steaks', 'artichoke', 'artichokes', 'arugula', 'bean', 'beans', 'sprouts', 'chickpeas', 'garbanzo', 'garbanzos', 'lentils', 'lentil', 'black', 'green', 'red', 'yellow', 'pink', 'white', 'kidney', 'lima', 'navy', 'pinto', 'pea', 'peas', 'split', 'soy', 'beet', 'bok', 'choy', 'broccoflower', 'broccoli', 'brussels', 'cabbage', 'carrots', 'cauliflower',
        'celery', 'chard', 'greens', 'collard', 'corn', 'frisee', 'fennel', 'anise', 'basic', 'caraway', 'cilantro', 'chamomile', 'dill', 'lavender', 'lemon', 'grass', 'mint', 'marjoram', 'oregano', 'parsley', 'rosemary', 'thyme', 'kale', 'lettuce', 'mushroom', 'mushrooms', 'mustard', 'okra', 'leek', 'leeks', 'shallot', 'shallots', 'spring', 'pepprs', 'chili', 'jalapeño', 'habanero', 'paprika', 'tabasco', 'flakes', 'cayenne', 'powder', 'rhubarb', 'ginger', 'parsnip', 'parsnips', 'turnip', 'rutabaga', 'radish', 'radishes', 'wasabi', 'horseradish', 'squash', 'melon', 'bitter', 'acorn', 'butternut', 'banana', 'bananas', 'courgette', 'courgettes', 'zucchini', 'cucumber', 'pickel', 'pickels', 'patty', 'spaghetti', 'tomato', 'sweet', 'taro', 'yam', 'yucca', 'water', 'chestnut', 'chestnuts', 'watercress', 'apricot', 'apricots', 'avocado',
        'avocados', 'blackberry', 'blackberries', 'blueberry', 'blueberries', 'blackcurrant', 'blackcurrants', 'boysenberry', 'boysenberries', 'berries', 'currant', 'currants', 'broth', 'stock', 'pumpkin', 'heavy', 'salt', 'pepper', 'penne', 'romano', 'parmiigiano', 'pumpernickel', 'bay', 'leaf', 'cinnamon', 'cherry', 'cherries', 'coconut', 'coconuts', 'cranberry', 'cranberries', 'date', 'dates', 'dragonfruit', 'durian', 'durians', 'elderberry', 'elderberries', 'fig', 'figs', 'goji', 'gooseberry', 'gooseberries', 'grape', 'grapes', 'raisin', 'raisins', 'grapefruit', 'grapefruits', 'fruit', 'fruits', 'guava', 'guavas', 'huckleberry', 'huckleberries', 'jackfruit', 'juniper', 'kiwi', 'kiwis', 'kiwifruit', 'kiwifruits', 'lemon', 'lemons', 'lime',
        'limes', 'lychee', 'lychees', 'mango', 'mangos', 'melon', 'melons', 'cantaloupe', 'honeydew', 'watermelon', 'mulberry', 'mulberries', 'nectarine', 'nectarines', 'olive', 'olives', 'orange', 'blood', 'oranges', 'clementine', 'clementines', 'mandarine', 'mandarines', 'tangerine', 'tangerines', 'papaya', 'passionfruit', 'passion', 'peach', 'peaches', 'pear', 'pears', 'persimmon', 'persimmons', 'plum', 'plums', 'prune', 'prunes', 'pinapple', 'pinapples', 'plumcot', 'plumcots', 'purple', 'raspberry', 'raspberries', 'redcurrant', 'redcurrants', 'satsuma', 'soursop', 'star', 'strawberry', 'strawberries', 'tamarillo', 'tamarillos', 'ugli', 'yuzu', 'nutmeg', 'cheese', 'spinach', 'apple', 'apples', 'vinegar', 'mustard', 'honey', 'potatoes', 'potato', 'milk', 'butter',
        'chives', 'rolls', 'butter', 'buttermilk', 'milk', 'cheese', 'blue', 'cabot', 'cheddar', 'camembert', 'manchego', 'bread', 'crumbs', 'american', 'appenzeller', 'bergenost', 'stilton', 'brick', 'brie', 'campode', 'montalban', 'casein', 'cheshire', 'colby', 'jack', 'colby-jack', 'cordobes', 'cottage', 'cougar', 'gold', 'cream', 'drunken', 'edam', 'emmenthal', 'swiss', 'english', 'derby', 'farmer', 'feta', 'ghee', 'gorgonzola', 'gouda', 'queso', 'gruyere', 'half', 'havarti', 'monterey', 'jarlsbery', 'kefalotyri', 'brown', 'kefir', 'mascarpone', 'mozzarella', 'muenster', 'naked', 'paneer', 'parmesan', 'pimento', 'pecorino', 'pepperjack', 'provel', 'provolone', 'quark', 'ricotta', 'romano', 'roquefort', 'sheep', 'cheeses', 'sour', 'string', 'teleme', 'whey',
        'protein', 'velveeta', 'yogurt', 'absinthe', 'beer', 'bourbon', 'brandy', 'calvados', 'champagne', 'cider', 'cognac', 'frangelico', 'gin', 'grand', 'marnier', 'grappa', 'grenadine', 'jägermeister', 'kahlua', 'kirschwasser', 'kirsch', 'liqueur', 'liqueurs', 'ouzo', 'port', 'run', 'sherry', 'tequila', 'triple', 'sec', 'vermouth', 'vodka', 'whiskey', 'scotch', 'irish', 'rice', 'muffin', 'soda', 'oat', 'oats', 'pita', 'pitas', 'pumpernickel', 'cakes', 'rye', 'scones', 'sourdough', 'wheat', 'spelt', 'flour', 'tea', 'tortilla', 'tortillas', 'bran', 'pasta', 'barley', 'buckwheat', 'cornmeal', 'cornstarch', 'flax', 'flaxseed', 'seed', 'seeds', 'millet', 'oatmeal', 'polenta', 'quinoa', 'curry', 'soybean', 'spelt', 'tapioca', 'tannier', 'alfalfa', 'snap', 'snail', 'black-eyed',
        'cannellini', 'edamame', 'fava', 'pods', 'agave', 'nectar', 'yeast', 'baking', 'barbecue', 'sauce', 'malt', 'molasses', 'capers', 'chipotle', 'chutney', 'cocktail', 'syrup', 'maple', 'dextrose', 'enchilada', 'fish', 'gelatin', 'relish', 'hot', 'ketchup', 'juice', 'rind', 'rinds', 'marmite', 'mayo', 'mayonnaise', 'jelly', 'miso', 'msg', 'oyster', 'picante', 'salsa', 'salsas', 'sea', 'course', 'sauerkraut', 'stevia', 'sugar', 'tamari', 'tartar', 'teriyaki', 'thai', 'peanut', 'peanuts', 'tofu', 'vinegar', 'balsamic', 'spread', 'caviar', 'egg', 'yolk', 'eggs', 'yolks', 'whites', 'roe', 'carp', 'herring', 'sailfish', 'fish', 'salmon', 'allspice', 'spice', 'spices', 'anise', 'basil', 'cardamom', 'german', 'style', 'country', 'coriander', 'jasmine', 'peppermint', 'rose', 'spearmint',
        'tarragon', 'vanilla', 'almond', 'butterscotch', 'coffee', 'root', 'sea', 'anchovy', 'arctic', 'char', 'barracuda', 'bass', 'lake', 'drum', 'bluefish', 'bluenose', 'bullhead', 'butterfish', 'capelin', 'catfish', 'seabass', 'chilean', 'chub', 'clam', 'cobia', 'cod', 'conch', 'corvina', 'crab', 'crayfish', 'croaker', 'cusk', 'dab', 'ele', 'escolar', 'flounder', 'frog', 'gray', 'sole', 'amberjack', 'grenadier', 'grouper', 'haddock', 'hake', 'halfmoon', 'halibut', 'harvest', 'imitation', 'jellyfish', 'dried', 'salted', 'lingcod', 'lobster', 'tail', 'tails', 'mackerel', 'atlantic', 'spanish', 'mahi', 'mahi-mahi', 'marlin', 'monkfish', 'mullet', 'muskellunge', 'mussels', 'ocean', 'pout', 'octopus', 'opah', 'opaleye', 'roughy', 'oysters', 'clams', 'legs', 'crabs', 'parrotfish',
        'perch', 'pickerel', 'pike', 'pilchards', 'plaice', 'pomfret', 'pompano', 'pollock', 'porgy', 'red', 'snapper', 'rockfish', 'rosefish', 'sable', 'sablefish', 'salmon', 'sanddabs', 'sardine', 'scad', 'scallops', 'scallop', 'scrod', 'scup', 'turtle', 'urchin', 'urchins', 'seatrout', 'trout', 'shad', 'shark', 'fin', 'sheepshead', 'shrimp', 'shrimps', 'skate', 'smelt', 'spearfish', 'escargot', 'squid', 'calamari', 'sturgeon', 'sucker', 'sunfish', 'tatoaba', 'telapia', 'tilefish', 'trevally', 'rainbow', 'tuna', 'yellowfin', 'european', 'walleye', 'weakfish', 'seabass', 'whitefish', 'whiting', 'wolfish', 'wreckfish', 'yellowtail', 'acai', 'breadfruit', 'pasta', 'barley', 'bran', 'wheat', 'buckwheat', 'chia', 'cous', 'farro', 'flax', 'graham', 'nuts', 'nut', 'kamut',
        'lentil', 'dahl', 'maize', 'bread', 'millet', 'polenta', 'popcorn', 'quinoa', 'wild', 'rye', 'semolina', 'cereal', 'grain', 'soba', 'noodles', 'sorghum', 'soy', 'flakes', 'crips', 'cakes', 'puffed', 'cake', 'soybean', 'spelt', 'sprouted', 'tapioca', 'taro', 'pomegranate', 'boysenberry', 'chamomile', 'gogi', 'hibiscus', 'horseradish', 'brazil', 'cashews', 'cashew', 'hazelnut', 'hazelnuts', 'macadamia', 'nutella', 'peanut', 'peanuts', 'pecan', 'pecans', 'pine', 'pignola', 'pistachio', 'pistachios', 'poppy', 'sesame', 'sunflower', 'walnut', 'walnuts', 'canola', 'castor', 'fat', 'cocoa', 'lard', 'margarine', 'palm', 'shea', 'shortening', 'adobo', 'bits', 'bacon', 'barbecue', 'seasoning', 'spice', 'bullion', 'soup', 'ranch', 'mix', 'dressing', 'rub', 'caesar', 'cajun',
        'flavoring', 'creole', 'fajita', 'italian', 'jerk', 'jerky', 'mesquite', 'old', 'bay', 'pastrami', 'flavor', 'extract', 'yeast', 'chocolate', 'chips', 'chunks', 'oreo', 'cracker', 'powdered', 'confectioner’s', 'dark', 'light', 'semi-sweet', 'semi', 'sweet', 'bittersweet', 'unsweetened', 'coloring', 'sprinkles', 'nonpareils', 'candy', 'candies', 'malt', 'superfine', 'condensed', 'espresso', 'peel', 'caramel', 'toffee', 'M&Ms', 'jell-o', 'amaretto', 'rum', 'purée', 'evaporated', 'asparagus', 'bamboo', 'shoots', 'raab', 'chinese', 'cassava', 'eggplant', 'eggplants', 'endive', 'endives', 'escarole', 'portabella', 'portobello', 'shiitake', 'straw', 'tree', 'snow', 'gold', 'quorn', 'scallion', 'scallions', 'seaweed', 'macaroni', 'summer', 'winter', 'tamarind', 'breadcrumb', 'panko',
        'tomatillas', 'anchovies', 'parmesan', 'cumin'
          ]

    if (website === 'foodnetwork'){
        removeGarbage = elem.innerHTML.replace('&nbsp;', ' ')
        removedCommas = removeGarbage.replace(/[,(.)\-]/g, " ").toLowerCase()
    }
    //what happenes when there are two ingredients lists with the same ingredient
    //http://www.foodnetwork.com/recipes/trisha-yearwood/slow-cooker-georgia-pulled-pork-barbeque-recipe-2078315
    if (website === "nytimes" || website === "allrecipes"){
        removedCommas = elem.innerText.replace(/[,().\-]/g, " ").toLowerCase()
    }

    let fullTextSplit = removedCommas.split(' ').filter(e => e !== '')
    quantityTextPart = fullTextSplit.filter((word) => {
        if (num.indexOf(word) !== -1 || measurments.indexOf(word) !== -1 || +word){
            return word
        }
    })
    foodTextPart = fullTextSplit.filter((word) => {
        if (food.indexOf(word) !== -1){
            return word
        }
    })


    ingredientObj[index] = {}
    ingredientObj[index]['quantity'] = quantityTextPart.join(' ')
    ingredientObj[index]['foodPart'] = foodTextPart
})

//dealing with pluras and singluar in the directions that are not in ingredients list
for ( let key in ingredientObj){
    let vowels = ['a', 'e', 'i', 'o', 'u']
    let current = ingredientObj[key].foodPart
    current.forEach(food => {
        let lastLetter = food[food.length - 1]
        let secondLast = food[food.length - 2]
        let thirdLast = food[food.length - 3]
        if (lastLetter === 's'){
            current.push(food + 'es')
            //making singular version
            if (secondLast === 'e'){
                if (thirdLast === 'i'){
                    return current.push(food.slice(0, food.length - 3) + 'y')
                }
                else {
                    return current.push(food.slice(0, food.length - 2))
                }
            }
            else {
                return current.push(food.slice(0, food.length - 1))
            }
        }
        if (lastLetter === 'x' || lastLetter === 'z'){
            return current.push(food + 'es')
        }
        if (lastLetter === 'h' && secondLast === 'c' || secondLast === 's'){
            return current.push(food + 'es')
        }
        if (lastLetter === 'f'){
            return current.push(food.slice(0, food.length - 1) + 'ves')
        }
        if (lastLetter === 'e' && secondLast === 'f'){
            return current.push(food.slice(0, food.length - 2) + 'ves')
        }
        if (lastLetter === 'y'){
            if (vowels.indexOf(secondLast) === -1){
                return current.push(food.slice(0, food.length - 1) + 'ies')
            }
            else {
                return current.push(food + 's')
            }
        }
        if (lastLetter === 'o'){
            if (vowels.indexOf(secondLast) === -1){
                return current.push(food + 'es')
            }
            else {
                return current.push(food + 's')
            }
        }
        else {
            return current.push(food + 's')
        }
    })
}

console.log(ingredientObj)

//building out the directions list and making it iterable
let [...directionsListHTML] = document.getElementsByClassName(directionsClassName) //"o-Method__m-Body"
let [...directionsList] = directionsListHTML[0].children
//this will give us the list in the form of srings in an array of the directions

//Using for loops to locate all ingredients in the directions section and adding the highlight and tooltip text.
directionsList.forEach(elem => {
    let directionArray = elem.innerHTML.replace(/[()]/gm, "").replace(/\r\n|\n|\r/gm, " ").toLowerCase().split(' '), newPara = '';
    if (elem.childElementCount === 0 && website === "nytimes" ||
    elem.childElementCount === 0 && website === "foodnetwork" ||
    elem.childElementCount === 1 && website === "allrecipes"){

        for (let i = 0;i < Object.keys(ingredientObj).length;i++){
            for (let j = 0;j < ingredientObj[i].foodPart.length;j++){ //need this nested since some have more than one food part.
                let currentFood = ingredientObj[i].foodPart[j]
                for (let k = 0; k < directionArray.length ;k++){
                    let directionWord = directionArray[k]
                    if (directionWord !== ""){
                        if (directionWord === currentFood || directionWord === currentFood + ',' || directionWord === currentFood + '.'){
                            //retain ',' if present in original directions
                           if (directionWord.charAt(directionArray[k].length - 1) === ','){
                            directionArray[k] = `<span style="background-color:rgba(247, 213, 26, 0.507)" title="` + ingredientObj[i].quantity + `">` + currentFood + `</span>,`
                           }
                           //retain '.' if present in original directions
                           else if (directionWord.charAt(directionArray[k].length - 1) === '.'){
                            directionArray[k] = `<span style="background-color:rgba(247, 213, 26, 0.507)" title="` + ingredientObj[i].quantity + `">` + currentFood + `</span>.`
                           }
                           else {
                            directionArray[k] = `<span style="background-color:rgba(247, 213, 26, 0.507)" title="` + ingredientObj[i].quantity + `">` + currentFood + `</span>`
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
}
