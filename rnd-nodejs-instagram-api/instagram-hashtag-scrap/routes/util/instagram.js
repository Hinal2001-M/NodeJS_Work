const Axios = require('axios');
const { result } = require('lodash');
const _ = require('lodash');
const defaults = require('./../../config/defaults');
const topParser = require('./post-parser');

module.exports = async function (_hashtag, _limit, _recent) {
    try {
        let response = await Axios({
            baseURL: defaults.URL_INSTAGRAM_EXPLORE_TAGS,
            url: '/' + _hashtag,
            method: 'get',
            params: {
                __a: 1
            },
            // headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36" }
        });
        if (typeof _response === 'string') {
            if (_response.includes("page not found")) {
                return { err: "page not found" };
            } else {
                return { err: _response }
            }
        } else {
            let post = topParser(_recent, response);
            console.log('INSTAGRAM',{response});
            while (post.length < _limit) {
                let has_next_page = response.data.graphql.hashtag.edge_hashtag_to_media.page_info.has_next_page;
                let end_cursor = response.data.graphql.hashtag.edge_hashtag_to_media.page_info.end_cursor;
                console.log(has_next_page);
                if (has_next_page) {
                    response = await Axios({
                        baseURL: defaults.URL_INSTAGRAM_EXPLORE_TAGS,
                        url: '/' + _hashtag,
                        method: 'get',
                        params: {
                            __a: 1,
                            max_id: end_cursor
                        },
                        headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36" }
                    });
                    let morePosts = topParser(_recent, response);
                    posts = _.concat(post, morePosts);
                } else {
                    break;
                }
            }
            posts = _.uniqBy(post, 'id');

            if (posts.length > _limit) {
                posts.splice(_limit, posts.length)
            }
            let promise = [];

            _.forEach(posts, (d) => {
                promise.push(Axios.get(d.post_url + '?__a=1'));
            });
            let finalData = [];
            let data = await Axios
                .all(promise)
                .then((results) => {
                    return results.map(r => {
                        let data = r.data.graphql.shortcode_media;
                        let ownerDetail = {
                            profile_pic_url: data.owner.profile_pic_url,
                            username: data.owner.username,
                            full_name: data.owner.full_name
                        }
                        return Object.assign({}, _.find(posts, { 'id': data.id }), { owner: ownerDetail });
                    });
                });
            return data
        }
    } catch (error) {
        console.log("Error");
        return { err: error.message };
    }
}