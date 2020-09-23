const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname+"/public"));

mongoose.connect("mongodb://localhost:27017/movieDB", {useNewUrlParser: true});

const movieSchema = {
  title: String,
  description: String
};

const Movie = mongoose.model("movie", movieSchema);

app.get("/",function(req, res){

res.sendFile(__dirname+"/index.html");

})



app.route("/movies")

.get(function(req, res){
  Movie.find(function(err, foundMovies){
    if (!err) {
      res.send(foundMovies);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newMovie = new Movie({
    title: req.body.title,
    description: req.body.description
  });

  newMovie.save(function(err){
    if (!err){
      res.sendFile(__dirname+"/success_add.html");
    } else {
      res.send(err);
    }

  

  });

})

.delete(function(req, res){

  Movie.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all Movies.");
    } else {
      res.send(err);
    }
  });
});


app.route("/movies/:movieTitle")

.get(function(req, res){

  Movie.findOne({title: req.params.movieTitle}, function(err, foundMovie){
    if (foundMovie) {
      res.send(foundMovie);
    } else {
      res.send("No movie matching that title was found.");
    }
  });
})

.put(function(req, res){

  movie.update(
    {title: req.params.movieTitle},
    {title: req.body.title, description: req.body.description},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected movie.");
      }
    }
  );
})

.patch(function(req, res){

  movie.update(
    {title: req.params.movieTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated movie.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  movie.deleteOne(
    {title: req.params.movieTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding movie.");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
