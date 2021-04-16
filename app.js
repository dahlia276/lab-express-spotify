require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get("/", async (req, res) => {
    res.render("home");
});

app.get('/artist-search', async (req, res) => {
    //Query param
    let result = await spotifyApi.searchArtists(req.query.theArtistName);     
    console.log('The received data from the API: ', result.body);
    let artists = result.body.artists.items;
    res.render("artist-search-results", {artists}) 
})


app.get("/albums/:artistsId", async (req, res) => {
    let albums = await spotifyApi.getArtistAlbums(req.params.artistsId)
    console.log(albums.body.items)
    /*
    albums.body.items.forEach(album => {
        console.log(album)
    });
    */
    res.render("albums", {albums: albums.body.items})
})

app.get("/tracks/:artistsId", async (req, res) => {
    let tracks = await spotifyApi.getAlbumTracks(req.params.artistsId)
    
    tracks.body.items.forEach(track => {
        console.log(track)
    });
    res.render("tracks", {tracks: tracks.body.items})
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));



