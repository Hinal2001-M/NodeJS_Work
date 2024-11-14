const {
    getShortLivedAccessToken, 
    getLongLivedAccessToken,
    getProfileData,
    getUserMediaData,
} = require("./instagram");

const Query = {
    Query: {
        getShortLivedAccessToken: () => getShortLivedAccessToken(),
        getLongLivedAccessToken: () => getLongLivedAccessToken(),
        getProfileData: () => getProfileData(),
        getUserMediaData: () => getUserMediaData(),
    },
};

module.exports = Query;