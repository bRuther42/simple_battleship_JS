//Author: Brooklynn Rutherford
//Description: Simple JavaScript Battleship Game


// REQUIRES *****************************************************************************************************************

const fs = require("fs");
const rls = require("readline-Sync");


// SHIP KEY *****************************************************************************************************************

const mapText = fs.readFileSync("map.txt", "utf-8"); //Read in map text
// console.log(mapText);

const shipArray = mapText.split("\r\n"); //Split @ end of each line to make "rows" 
// console.log(shipArray);

const shipGrid = []; //loop through shipArray to split each rows elements into "columns" == array[row][col]]
for(let i=0;i<shipArray.length;i++)
{
    shipGrid.push(shipArray[i].split(","));
}
// console.log(shipGrid);
// console.log(shipGrid[0][5]);


// BATTLEGROUND ****************************************************************************************************************

const battleGround = new Array(10).fill('~~').map(()=>new Array(10).fill('~~')); //Create array for display of H/M filled with ~~WATER~~
// console.table(battleGround);


// INTRO ************************************************************************************************************************

console.log("Let's Play Battleship! \nYou have 30 missiles to fire to sink all 5 ships.");
console.log("");

function displayArray(array) //Function that will display inputed array as a table with letters by making each row an object with letter identifier
{
    const objectTrial = {};
    for(let i=0;i<=array.length;i++)
    {
        array.forEach((element,index) => {objectTrial[String.fromCharCode(65+index)] = element;});
    };
    console.table(objectTrial);
}
displayArray(battleGround); //Display array with only ~~WATER~~


// SOME VARIABLES ******************************************************************************************************************

let missileLeft = 30; //for displayed countdown and determining if game is over before sinking all ships ->will change
const maxGuess = 30;  //for overall loop ->won't change
let currentGuess = 0; //to run overall loop 

const maxHits = 17; //to determine if game is won after sinking all ships ->won't change
let guessHits = 0;  //to determine if game is won or display how many hits were made ->will change


// VALIDATION **********************************************************************************************************************

//Inputted coordinates->split->must be w/n these valid answers
const validRow = ['A','B','C','D','E','F','G','H','I','J'];  
const validColumn = ['0','1','2','3','4','5','6','7','8','9'];

function validCheck(user_row_col,valid_row_col)  //Returns T/F for if the guessed row/col is w/n valid answers as a boolean value 
{
    if(valid_row_col.includes(user_row_col))
    {
        return true;
    }
    else
    {
        return false;
    }
}


// LOOPING ****************************************************************************************************************************

while(currentGuess<=maxGuess)
{
    let userInput;   //Variables used w/n the loop 
    let inputArray;
    let rowCheck;
    let colCheck;
    missileLeft;     //Variables already stated outside of loop to be used again w/n loop
    maxGuess;
    currentGuess;
    maxHits;
    guessHits;
   
    userInput = rls.question("Please enter a coordinate (Ex: A0): ");  //OG coord question
    inputArray = userInput.split("");    //split to create an array of inputted values
    // console.log(inputArray);

    //checking that the split array items are valid
    rowCheck = validCheck(inputArray[0],validRow);  
    colCheck = validCheck(inputArray[1],validColumn);
    // console.log(typeof inputArray[0], typeof inputArray[1]);

    if(rowCheck != true || colCheck != true || inputArray.length>=3) //checking if the row OR col aren't true OR that the split array is more than should be
    {
        console.log("Invalid entry, please use uppercase letter and an integer from 0-9... ");
        continue;
    }

    let row = (inputArray[0]).charCodeAt(0)-65;  //turning the letter row into number row -> easier to check in the other arrays
    let col = parseInt(inputArray[1]);  //string col -> number col

    if((shipGrid[row][col] === '1') && (battleGround[row][col] === '~~'))  //check if inputted answer is a 1 in shipGrid AND hasn't already been hit
    {
        console.log("HIT!!");
        guessHits++;  //add a hit
        currentGuess++;  //add a guess
        if(guessHits === maxHits)  //check if all hits have been made to win game
        {
            console.log("YOU SUNK THE FLEET! \nYou made ", guessHits, "of", maxHits, " hits, and sank all the ships. \nYOU WON");
            break;  //end game
        }
        missileLeft--; //lose a missile (after the win in case last guess is final hit)
        console.log("You have", missileLeft, "missiles remaining.");  //how many missiles left
        battleGround[row][col] = 'X';  //replacing ~~WATER~~ with X hit
        displayArray(battleGround);  //display changed array
    }
    else if((shipGrid[row][col] === '1') && (battleGround[row][col] === 'X'))  //check if inputted answer is 1 in shipGrid AND has already been hit
    {
        console.log("You've already hit this location...");  //start loop again w/o adding a guess or removing a missile
        continue;
    }
    else if((shipGrid[row][col] === '0') && (battleGround[row][col] === 'O'))  //check if inputted answer is 0 in shipGrid AND has already been missed
    {
        console.log("You've already missed this location...");  //start loop again w/o adding a guess or removing a missile
        continue;
    }
    else  //if a miss in shipGrid and ~~WATER~~
    {
        console.log("MISS...");
        missileLeft--;
        if(missileLeft===0)  //if all missiles have been used
        {
            console.log("You used all 30 missiles but only made ", guessHits, " of", maxHits,"hits and didn't sink all the ships. \nGAME OVER...");
            break;  //end
        }
        console.log("You have", missileLeft, "missiles remaining.");
        battleGround[row][col] = 'O';  //replace ~~WATER~~ with O miss
        displayArray(battleGround);  //display changed array
    }
};











