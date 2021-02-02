//Design Patterns and Software Architecture:

 //The "Proxy" design pattern: Proxy is a structural design pattern that lets you provide a substitute or placeholder for another object. A proxy control access to the original object,
    //allowing you to perform something either before or after the request gets through to the original object.

//The Problem:
//Why would you want to control access to an object? Here is an example: you have a massive object that consumes a vast amount of system resources.
    //You need it from time to time, but not always.
//You could implement lazy initialization: create this object only when it’s actually needed. All of the object’s clients would need to execute some deferred initialization code.
    //Unfortunately, this would probably cause a lot of code duplication. In an ideal world, we’d want to put this code directly into our object’s class, but that isn’t always possible.
    //For instance, the class may be part of a closed 3rd-party library.

//The Solution:
//-The Proxy pattern suggests that you create a new proxy class with the same interface as an original service object. Then you update your app so that it passes the proxy object to all of
    //the original object’s clients. Upon receiving a request from a client, the proxy creates a real service object and delegates all the work to it.

//-But what’s the benefit? If you need to execute something either before or after the primary logic of the class, the proxy lets you do this without changing that class. Since the proxy
    //implements the same interface as the original class, it can be passed to any client that expects a real service object.

    //Example:
//A JavaScript class is a **template** for JavaScript objects.
    class FoodLogger {
        constructor(){
            this.foodLog = [] // The JavaScript "this" keyword refers to the object it belongs to. In a method, "this" = owner object. Alone: this = global object. In a function, this refers to the global object
        }
        log(order) {
            this.foodLog.push(order.foodItem)
        }
    }

    //this is the singleton
    class FoodLoggerSingleton{
        //the constructor method is a special method, and has to be executed automatically when a new object is created
        //also is used to initialize object properties
        constructor() {
            if (!FoodLoggerSingleton.instance) {
                FoodLoggerSingleton.instance = new Foodlogger()
            }
        }
        getFoodLoggerInstance(){
            return FoodLoggerSingleton.instance
        }
    }
//Module exports are the instruction that tells Node.js which bits of code (functions, objects, strings, etc.)
//to “export” from a given file so other files are allowed to access the exported code.
module.exports = FoodLoggerSingleton
////On Node.js "module.exports"-> https://stackify.com/node-js-module-exports/#:~:text=Module%20exports%20are%20the%20instruction,to%20access%20the%20exported%20code.
//Now that we implemented the singleton, we don't have to worry about losing logs from multiple instances because you only have one in your project. So when you want to log the food that has
//been ordered, you can use the same FoodLogger instance across multiple files or components.

const FoodLogger = require('./FoodLogger')
//require is a function we can use to import our other modules, and it looks like the above. require will search for modules using the following rules:
//1. Is there a core module with the required path? Yes, return it.
//2. Is there a node_modules package with the name of the path? Yes, return it
//3. Is there a file(or directory) with the name of the given path? Yes, return it.
//4. Otherwise, throw error
const foodLogger = new FoodLogger().getFoodLoggerInstance()

class Customer {
  constructor(order) {
    this.price = order.price
    this.food = order.foodItem
    foodLogger.log(order)
  }
  // other cool stuff happening for the customer
}

module.exports = Customer

//The above is an example of a Customer class using the singleton



//Naive Bayes Classifier in JavaScript

/*Essentially, we are calculating the probability that a word is found in a specific group. We then calculate the total probability for the block of text.

So our classifier object will have two methods. The first one will be used to teach our script and the second one will be used to categorize some text. The Classifier also holds a dictionary of words,
associating those into a group.*/


//Create a classifier object
var Classifier = function() {
   this.dictionaries = {};
};

//Classify is used to "teach" something to your machine
//You pass it a string and a group to which it's associated with
Classifier.prototype.classify = function(text, group) {
    //Code will go here.
};


//Categorize will check a string against the dictionaries to see
//in which group it falls.
Classifier.prototype.categorize = function(text) {
    //Code will go here.
};
//Let’s first take a look at our classify function. When we provide this function a string, it should take each word and add them to the specified group. This is easily done with a .map function.

Classifier.prototype.classify = function(text, group) {
   var words = text.split(" ");
   this.dictionaries[group] ? "" : this.dictionaries[group] = {};
   var self = this;
   words.map((w) => {
       self.dictionaries[group][w] ? self.dictionaries[group][w]++ : self.dictionaries[group][w] = 1;
   });
};
/*For the categorization part, we loop through our dictionary, extract the words that we have in the string to categorize and calculate the probability for each word of being in a group or another.
We then average out the probabilities and return the group name of the most probable group.*/

//Categorize will check a string against the dictionaries to see
//in which group it falls.
Classifier.prototype.categorize = function(text) {
   var words = text.split(" ");
   var self = this;
   var probabilities = {};
   var groups = [];
   var finals = {};

   //Find the groups
   for (var k in this.dictionaries) {groups.push(k);}

   for (var i = 0; i < words.length; i++) {
       //Ignore small words
       if (words[i].length <= 2) continue;
       //find the word in each group
       var sums = {};
       var probs = {};
       for (var j = 0; j < groups.length; j++) {
           if (!sums[words[i]]) sums[words[i]] = 0;
           if (!this.dictionaries[groups[j]][words[i]]) this.dictionaries[groups[j]][words[i]] = 0;
           sums[words[i]] += this.dictionaries[groups[j]][words[i]];
           probs[groups[j]] = (this.dictionaries[groups[j]][words[i]]) ? this.dictionaries[groups[j]][words[i]] : 0;
       }
       // Calculate the actual probability that a word is part of a group or another
       for (var j = 0; j < groups.length; j++) {
           (!probabilities[words[i]]) ? probabilities[words[i]] = {} : "";
           (!probs[groups[j]]) ? probabilities[words[i]][groups[j]] = 0 : probabilities[words[i]][groups[j]] = probs[groups[j]]/sums[words[i]];
       }
       //Average out the probabilities
       for (var j = 0; j < groups.length; j++) {
           if (!finals[groups[j]]) finals[groups[j]] = [];
           finals[groups[j]].push(probabilities[words[i]][groups[j]]);
       }
   }

   for (var i = 0; i < groups.length; i++) {
       finals[groups[i]] = average(finals[groups[i]]);
   }

   //Find the highest probability
   var highestGroup = "";
   var highestValue = 0;
   for (var group in finals) {
       if (finals[group] > highestValue) {
           highestGroup = group;
           highestValue = finals[group];
       }
   }

   return highestGroup;
};
//We also needed an average function so we added the following in our code

//Just an average function
function average(numbers) {
   var sum = 0;
   for (var i = 0; i < numbers.length; i++) {
       sum += numbers[i];
   }
   return sum / numbers.length;
}
//So, there you have it, your first machine learning algorithm. You can test that it works by running the following script.

var classifier = new Classifier();
classifier.classify("Ce texte est en francais", "fr");
classifier.classify("Celui ci est aussi en francais", "fr");
classifier.classify("This text is in english", "en");
classifier.classify("This text is also in english", "en");

console.log(classifier.categorize("text in english"));
console.log(classifier.categorize("texte en francais"));
//That's it. This code will output

> en
> fr
/*This is obviously a very simple implementation. It will work but there are several tweaks that can be done in order to increase the performance. But you now know you to build
your own implementation and this will help you to use it in your code base. Using this simple script, you could implement a spam filter (by passing the email content as the text
and “spam” or “not-spam” as the group). You will need to train your algorithm to start but eventually, it will be able to make the decisions by itself.*/