## Kata POC
###### Full Serverless application that can save user and read/post messages


### Prerequisites
```
Serverless
Node 12
```

### Setup

For installing dependencies
```
yarn
``` 

For run application
```
yarn start
```

For deploy to AWS
```
yarn deploy
```

Use endpoint of `createTestEnv` to setup database with some data. IMPORTANT!: script not optimized, take 30s to update data
```
GET /createTestEnv
```

### Documentation

#### PostMessage

Post message for user
```
POST /postMessage
```
Event model
```
text: string //The text of the message
```


Provide in header the key `user` evalueted with `{userId}`

#### Messages

To read messages in db. If `time` not provided take the oldest one as input  
```
GET /postMessage/{time}
```

Provide in header the key `user` evalueted with `{userId}`
