const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated, ensureGuest} = require('../helpers/helpers');

// Stories Index
router.get('/', (req, res) => {
  Story.find({status:'Public'})
    .populate('user')
    .then(stories => {
    
      res.render('stories/index', {
        stories: stories
      });
    });
});

// Show Single Story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .populate('user')
  .populate('comments.commentUser')
  .then(story => {
    res.render('stories/show', {
      story: story
    });
  });
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

//My Story Form
router.get('/my',ensureAuthenticated, (req, res) =>{
    Story.find({user:req.user.id})
    .populate('user')
    .then(stories => {
      res.render('stories/my', {
        stories: stories
      });
    }).catch(err => console.log(err));
});

router.get('/user/:id',(req, res) =>{
  Story.find({
    user: req.params.id,
    status : 'Public'
  }).populate('user').
then(stories =>{
      res.render('stories/index',{
        stories : stories
      })
  });
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    res.render('stories/edit', {
      story: story
    });
  });
});
router.post('/comment/:id',(req, res) => {
  Story.findOne({
    _id : req.params.id
  }).then(story =>{
    story.comments.unshift({
      commentBody : req.body.comment,
      commentUser : req.user.id
    });
    story.save().then(story => {
      res.redirect(`/stories/show/${story.id}`);
    })
  });
});

router.delete('/:id',(req, res) => {
  Story.remove({
    _id : req.params.id
  }).then(() => {
    res.redirect('/dashboard');
  })
})

router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
  .then(story => {
    let allowComments;
    
    if(req.body.allowComments){
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save()
      .then(story => {
        res.redirect('/dashboard');
      }).catch(err => console.log(err));
  }).catch(err => console.log(err));
});

// Process Add Story
router.post('/', (req, res) => {
  let allowComments;

  if(req.body.allowComments){
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments:allowComments,
    user: req.user.id
  }

  // Create Story
  new Story(newStory)
    .save()
    .then(story => {
      res.redirect(`/stories/show/${story.id}`);
    });
});

module.exports = router;