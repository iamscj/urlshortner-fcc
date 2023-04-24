require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb')
const urlparser = require('url')
const dns = require('dns')

const client = new MongoClient(process.env.DB_URL);
const db = client.db("test")
const urls = db.collections("urls")

// Basic Configuration
const port = process.env.PORT || 3000;


app.use(cors());
// app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const originalUrls = []
const shortUrls = []
// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const url = req.body.url
  if(url.includes("https://") || url.includes("http://"))
  {
    
  }
  else
  {
    return res.json({ error: 'invalid url' })
  }
  const foundIndex = originalUrls.indexOf(url)
  if (foundIndex < 0) {
    originalUrls.push(url);
    shortUrls.push(shortUrls.length)
    return res.json({
      original_url: url,
      short_url: shortUrls.length - 1
    })
  }
  return res.json({
    original_url: url,
    short_url: shortUrls[foundIndex]
  })
  res.json(req.body.url)

  // {"original_url":"https://url-shortener-microservice.freecodecamp.rocks",
  //   "short_url":1052}


  // console.log(req.body)
  // const url=req.body.url
  // const dnslookup = dns.lookup(urlparser.parse(url).hostname,
  //                         async(err,address)=>{
  //                           if(!address){
  //                             res.json({error:"Invalid URL"})
  //                           }
  //                           else{
  //                             const urlCount = await urls.countDocuments({})
  //                             const urlDoc={
  //                               url,
  //                               short_url:urlCount
  //                             }
  //                             const result=await urls.insertOne(urlDoc);
  //                             console.log(result);
  //                             res.json({original_url:url,short_url:urlCount})
  //                           }
  //                         })

  // res.json({ greeting: 'hello API' });
});

app.get("/api/shorturl/:shorturl",(req,res)=>{
  const shorturl = parseInt(req.params.shorturl)
  const foundIndex = shortUrls.indexOf(shorturl)
  if(foundIndex < 0)
  {
    return res.json({"error" : "No short URL found for the           Input"})
  }
  res.redirect(originalUrls[foundIndex]);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
