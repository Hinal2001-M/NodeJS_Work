const request = require('request');

const accessToken = ''
const igUserId = ''
const igMediaId = ''
const partnerId = ''

const options ={
    url: `https://graph.instagram.com/${igMediaId}/collaborations`,
    method: 'POST',
    headers:{
        "Authorization": `Bearer ${accessToken}`
    },
    json:{
        'partner_id': partnerId,
        'media_id': igMediaId,
        'ig_user_id': igUserId,
        'acceptance_message': 'I accept your Collaboration request!'
    }
};