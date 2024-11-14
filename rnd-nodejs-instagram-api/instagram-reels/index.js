const {IgApiClient} = require('instagram-private-api');
const ig = new  IgApiClient();

(async ()=>{
    ig.state.generateDevice(process.env.IG_USERNAME);
    await ig.account.login(process.env.IG_USERNAME,process.env.IG_PASSWORD);

    const videoBuffer = await fs.promises.readFile("C:\Users\mehta\OneDrive\Pictures\reel.mp4");

    const uploadOptions={
        video : videoBuffer,
        mediaType: 'video/mp4',
        caption: 'reel'
    };
    
    const {media} = await ig.publish.reel(uploadOptions);

    console.log(`post Instagram reels with media ID ${media.id} `);
})();