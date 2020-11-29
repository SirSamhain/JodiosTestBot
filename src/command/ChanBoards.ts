import Discord from "discord.js";
import axios, { AxiosResponse } from "axios";

let baseUrl = "https://a.4cdn.org";
let imageBaseUrl = "https://i.4cdn.org";


/**
 * This method is invoked by @OnMessageService
 * get's a random 4chan page from 1-10
 * creates a url ae. https://a.4cdn.org/pol/8.json
 * which returns a list of threads from the given
 * page at the time of invocation
 * @param channel 
 * @param board 
 */
export async function getRandomImageFromBoard(channel: Discord.TextChannel, board: string) {
    console.log(board);

    let randomPage = Math.ceil( Math.random() * 10 );
    let url = baseUrl + board + randomPage + ".json"
    axios.get(url).then(res => onSuccessfulGetThreads(res, channel, board)).catch(onError);

}

/**
 * When getRandomImageFromBoard() is successful
 * to call the API then this method will be invoked
 * and will get a random thread (0-14) and call the 
 * api once again to retrieve all the posts of the 
 * random thread. Thread# is just the post number
 * of the very first post in the thread :)
 * @param response 
 * @param channel 
 * @param board 
 */
async function onSuccessfulGetThreads(response: AxiosResponse, channel: Discord.TextChannel, board: string) {
    let data = response.data;
    let threads: [] = data.threads!;
    let randomThread = Math.ceil(Math.random() * threads.length)
    let threadNumber = threads[randomThread]['posts'][0]['no'];
    let threadUrl = baseUrl + board + "thread/" + threadNumber + ".json";
    axios.get(threadUrl).then(res => onSuccessfulGetPosts(res, channel, board, threadNumber)).catch(onError);
}

/**
 * When onSuccessfulGetThreads() method is a success
 * then it will invoke this method which get's a random
 * (0-number of posts in thread) and will get send the 
 * picture associated with the post to the channel that
 * the command was executed in.
 * @param response 
 * @param channel 
 * @param board 
 * @param threadNumber 
 */
async function onSuccessfulGetPosts(response: AxiosResponse, channel: Discord.TextChannel, board: string, threadNumber: string) {
    let data = response.data;
    let posts: [] = data.posts!;
    //@ts-ignore
    posts = posts.filter(post => post['filename']!=undefined&&post['tim']!=undefined&&post['ext']!=undefined);
    let randomPost = posts[Math.floor(Math.random() * posts.length)]
    let imageUrl = imageBaseUrl + board  + randomPost['tim'] + randomPost['ext'];
    console.log(`Getting image from: ${imageUrl}`);
    channel.send("https://boards.4chan.org"+board+"thread/"+threadNumber, { files: [imageUrl] });
}

/**
 * When any error occurs in this file,
 * this method will be invoked and log 
 * the error passed as a parameter.
 * @param err 
 */
function onError(err: Error) {
    console.log(err.message);
}
