import Discord from "discord.js";
import axios, { AxiosResponse } from "axios";

const url = "https://www.reddit.com/r/greentext.json?count=10";

export async function greentext(channel: Discord.TextChannel) {
    axios.get(url).then(res => onSuccess(res, channel)).catch(onFailed);
}

async function onSuccess(response: AxiosResponse, channel: Discord.TextChannel) {
    let data = response.data.data;
    let urls: [] = data.children.map((post: any) => { return { link: post?.data?.url, comment: post?.data?.title } });
    let rn = Math.ceil(Math.random() * urls.length - 1)
    let randomUrl = urls[rn]['link'];
    let comment = urls[rn]['comment']

    console.log(`Getting image from: ${randomUrl}`);
    channel.send(comment, { files: [randomUrl] });
}

function onFailed(err: Error) {
    console.log(err.message);
}