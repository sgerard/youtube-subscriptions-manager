var google = require('googleapis');
var configAuth = require('./config/auth');

function Ysm(opt) {
    // optional params
    opt = opt || {};

    // private data
    var youtube = google.youtube('v3');
    var subscriptions = [];

    // API/data for end-user
    return {
        setAuthClient: function setAuthClient(accessToken, refreshToken) {
            var OAuth2 = google.auth.OAuth2;
            var googleAuth = configAuth.googleAuth;
            var oauth2Client = new OAuth2(
                googleAuth.clientID, googleAuth.clientSecret, googleAuth.callbackURL);

            oauth2Client.setCredentials({
                access_token: accessToken,
                refresh_token: refreshToken
            });

            google.options({auth: oauth2Client});
        },

        requestUserSubscriptions: function requestUserSubscriptions(done, pageToken) {
            var requestOptions = {
                mine: true,
                part: 'id,snippet,contentDetails',
                maxResults: 10,
                order: "alphabetical"
            };
            if (pageToken) {
                requestOptions.pageToken = pageToken;
            } else {
                subscriptions = [];
            }
            youtube.subscriptions.list(requestOptions, function(err, response) {
                if (err) {
                    done(err, null);
                } else {
                    subscriptions = subscriptions.concat(response.items);

                    var nextPageToken = response.nextPageToken;
                    if (nextPageToken) {
                        requestUserSubscriptions(done, nextPageToken);
                    } else {
                        done(null, subscriptions);
                    }
                }
            });
        },

        getSubscriptions: function getSubscriptions(done) {
            this.requestUserSubscriptions(done);
        },

        getVideos: function getVideos(channelId, videoCount, done) {
            var requestOptions = {
                id: channelId,
                part: 'contentDetails'
            };
            youtube.channels.list(requestOptions, function(err, response) {
                if (err) {
                    done(err, null);
                } else {
                    var uploadsPlaylistId =
                        response.items[0].contentDetails.relatedPlaylists.uploads;
                    requestOptions = {
                        playlistId: uploadsPlaylistId,
                        part: 'snippet',
                        maxResults: videoCount
                    };
                    youtube.playlistItems.list(requestOptions, function(err, response) {
                        if (err) {
                            done(err, null);
                        } else {
                            done(null, response.items);
                        }
                    });
                }
            });
        }
    }
}

var ysm = module.exports = exports = Ysm();
