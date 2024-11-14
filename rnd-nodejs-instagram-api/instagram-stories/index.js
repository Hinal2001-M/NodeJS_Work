const axios = require('axios');
const FormData = require('form-data');

const ACCESS_TOKEN = 'IGQVJYdldSS2hZAVXpBWHJ4OEVrUzlGdDlSemdFb3FJVTFYa2ZAwVkMyRHRSQjJkekhQb05kTEVpX3l3OEhCSjJldnRMbEJKUlpadnhUTjhuYlRZAY0MtYkhoSG9TVjkzdTFNcFpDSDIzZAzc1V0tDakNOQQZDZD';
const USER_ID = '_._.hinal._._';

const form = new FormData();
form.append('"C:\Users\mehta\OneDrive\Pictures\Saved Pictures\moon-1859616.jpg"');


axios.post(`https://graph.instagram.com/${USER_ID}/media`,form,{
    params:{
        access_token: ACCESS_TOKEN,
        caption: 'story'
    },
    headers:{
        'Content-Type':  `multipart/form-data; boundary=${form._boundary}`
    }
})
.then(response =>{
    console.log('published successfully:', response);
})

.catch(error=>{
    console.log('error:', error);
})



















// require('dotenv').config();
// const app = require('express')();
// const axios = require('axios');
// const {IgApiClient} = require('instagram-private-api');

// const ig = new IgApiClient

// ig.state.generateDevice("_._.hinal._._");

// await ig.account.login("_._.hinal._._", "honey@8201");

// const imageBuffer = await fs.promise.readFile("C:\Users\mehta\Downloads\half-moon-4900302 (1).jpg");

// const {upload_id} = await ig.publish.photo({
//     file: imageBuffer,
// });

// const storyOptions = {
//     mediaId: upload_id,
//     attachment:{
//         media: 'photo',
//     },
// };

// await ig.publish.story(storyOptions);

// app.listen(9000,function (){
//     console.log('server start');
// })