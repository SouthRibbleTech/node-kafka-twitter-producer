var Twitter = require('twitter')
const { Kafka } = require('kafkajs')
require('dotenv').config()

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})
const producer = kafka.producer()

//Twitter Stream: https://github.com/desmondmorris/node-twitter/tree/master/examples#streams

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

var search_term = 'boris, iran, trump'

client.stream('statuses/filter', {track: search_term}, async (tweet_stream)=>{
  await producer.connect()
  tweet_stream.on('data', async (tweet)=>{
    //Do something with the tweet
    
    await producer.send({
      topic: 'tweets',
      messages: [
        { value: JSON.stringify(tweet) },
      ],
    })
  })    
})
