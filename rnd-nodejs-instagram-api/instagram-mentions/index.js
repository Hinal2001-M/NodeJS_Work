const {IgAPiClient} = require('instagram-private-api');

const username = '';
const password = '';
const targetUsername = '';

(async ()=>{
    const ig = new IgAPiClient();
    ig.state.generateDevice(username);
    await ig.simulate.preLoginFlow();
    const{userID} = await ig.account.login(username, password);
    ig.state.generateDevice(username);
    ig.state.proxyUrl = process.env.IG_PROXY_URL;
    const userFeed = ig.feed.user(userID);

    const media = await userFeed.items();
    const mediaID = media[0].id;
    const comment = await ig.publish.comment({
        mediaID: mediaID,
        text: `@${targetUsername} this is mention!`
    });
    console.log(`successfully mentioned @${targetUsername} in the comment`)
})();




