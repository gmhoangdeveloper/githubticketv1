const express = require('express')
const app = express()

// Import the axios library, to make HTTP requests
const axios = require('axios')

// This is the client ID and client secret that you obtained
// while registering the application
const clientID = '2a975929a194f77122dd'
const clientSecret = '3177ea91d2595816cd782c625ca634f242c639e0'

app.get('/', function (req, res) {
    res.send('Hello World!')
  })
// Declare the redirect route
app.get('/issues', (req, res) => {

  // The req.query object has the query params that were sent to this route.a
  const requestToken = 'd'
  
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
         accept: 'application/json'
    }
    
  }).then((response) => {
    
    const accessToken = response.data.access_token
    console.log(response.data)
    
    // redirect the user to the home page, along with the access token
    res.redirect(`/issues?access_token=${accessToken}`)
  })
})

app.use(express.static(__dirname + '/src/component/github'))
app.listen(3000,()=>{
    console.log("Server listening on port : 3000")
})