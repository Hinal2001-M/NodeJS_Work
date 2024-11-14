require('dotenv').config();
const express = require('express');
const app = express()
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
const CronJob = require('cron').CronJob;

const postToInstagram = async () => {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

    const imageBuffer = await get({
        url: 'https://pixabay.com/photos/tree-sunset-clouds-sky-silhouette-736885/',
        encoding: null,
    });
    await ig.publish.photo({
        file: imageBuffer,
        caption: 'awesome',
    });
}

const cronInstagram = new CronJob('30 10 * * *', async () => {
    postToInstagram();
});

cronInstagram.start();