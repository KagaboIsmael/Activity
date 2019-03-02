// srv addres : mongodb+srv://harith:<PASSWORD>@cluster0-9clfo.mongodb.net/test?retryWrites=true
// mongodb+srv://harith:<PASSWORD>@cluster0-9clfo.mongodb.net/test?retryWrites=true
 // mongodb://harith:<PASSWORD>@cluster0-shard-00-00-9clfo.mongodb.net:27017,cluster0-shard-00-01-9clfo.mongodb.net:27017,cluster0-shard-00-02-9clfo.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Thing = require('./models/thing');
const app = express();

mongoose.connect('mongodb+srv://harith:Tanzania_98@cluster0-9clfo.mongodb.net/test?retryWrites=true')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.post('/api/recipes', (req, res, next) => {
  const thing = new Thing({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });
  thing.save().then(
    () => {
      res.status(201).json({
        "message": 'Recipes added to the list!'
      });
    }
  ).catch(
    (error) => {
      console.log('something went wrong');
      console.error(error)
    }
  );
});

app.get('/api/recipes/:id', (req, res, next) => {
  Thing.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
});

app.put('/api/recipes/:id',(req,res,next) => {
  const thing = new Thing({
    _id:req.params.id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });
  Thing.updateOne({_id:req.params.id}, thing).then(
    () => {
      res.status(201).json({
        'message' : 'Slight changes on the recipes list'
      });
    }
  ).catch(
  (error) => {
    res.status(400).json({
      error:error
    });
  }
  )
})

app.delete('/api/recipes/:id', (req ,res ,next) => {
  Thing.deleteOne({_id:req.params.id}).then(
    () => {
      res.status(201).json ({
        'message' : 'One recipes deleted from the list'
      });
    }
    ).catch(
    (error) => {
      res.status(400).json({
        error:error
      });
    }
  )
})

app.use('/api/recipes', (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});
module.exports = app;