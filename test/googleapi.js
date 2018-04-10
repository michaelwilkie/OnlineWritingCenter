const {google} = require('googleapis');
const urlshortener = google.urlshortener('v1');

const params = {
  shortUrl: 'http://goo.gl/xKbRu3',
  key: 'AIzaSyBW1OEOmewP3uRELYhKoS9h8f03no0pE58'
};

// get the long url of a shortened url
urlshortener.url.get(params, (err, response) => {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log('Long url is', response.data.longUrl);
});