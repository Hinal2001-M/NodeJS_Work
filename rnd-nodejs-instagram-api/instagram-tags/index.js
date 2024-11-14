const request = require('request');

const pageAccessToken = process.env.PAGE_ACCESS_TOKEN
const photoId = process.env.PHOTO_ID
const taggedUserId = process.env.USER_ID

const url = `https://graph.facebook.com/{}/${photoId}/tags`;

const options = {
    method: 'POST',
    uri: url,
    qs: {
        access_token: pageAccessToken,
        user_id: taggedUserId
    }
};

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log('successfully tagged!');
    } else {
        console.error('failed to tag!:(');
    }
});