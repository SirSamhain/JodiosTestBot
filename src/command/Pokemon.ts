import Discord from "discord.js";
const PokeApi = require("pokeapi-typescript");
const Jimp = require('jimp');

const jimp = new Jimp();
const pokeApiClient = new PokeApi();
let pokeName: String; // may need to move this to Main.ts

// whosThatPokemon will grab a random pokemon from pokeApi,
// keep track of the name of it, and use Jimp to print a silhouette of its sprite.
// TODO
export async function whosThatPokemon(channel: Discord.TextChannel) {
    let pokeImgUrl: String;
    // get the pokemon based on the random number
    pokeApiClient.Pokemon.resolve(Math.ceil(Math.random() * 807)).then(result => {
        let pokemang = JSON.parse(result);
        pokeName = pokemang.name;
        pokeImgUrl = pokemang.sprites.front_default;
    });
    // alright now we gotta actually get the image from the URL and then turn it into a silhouette and send it.
}

 /* 
 /  pokeGuess will take a user's guess, so long as pokeName isn't null or whatever
 /  if the user guesses right, then we set the pokeName to null and call the user a weirdo
 /  args can have length > 1 since some pokemon have spaces in their names (Tapu Koko)
 /  kind of annoying but whatever.
 /
 /  Should be working, but needs to be tested.
*/ 
export async function pokeGuess(channel: Discord.TextChannel, args: string[]) {
    if (pokeName.length == 0) {
        channel.send("You must use !whosThatPokemon before trying to make guesses.");
        return;
    } else if(args.length == 0) {
        channel.send("You have to actually make a guess, stupid.");
        return;
    }
    let guess = args[0];
    if (args.length > 1) {
        for (let arg of args) {
            guess += " " + arg;
        }
    }
    if (guess == pokeName) {
        channel.send("Correct! The Pokemon is " + pokeName + "!\n" + 
            "Wow! You actually guessed it correctly, you incredibly sad, weird nerd. " + 
            "How did you get that? Do you live with your parents? Are you really just a big enough " +
            "loser that you actually know the names of these pokemon by heart? What is wrong with you?");
        pokeName = "";
        return;
    } else {
        channel.send("Incorrect! Wow!");
    }
}