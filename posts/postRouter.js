const express = require("express");

const router = express.Router();

const Posts = require("../data/db.js");

//handles requests starting with /api/posts

//POST = /api/posts/
router.post('/', (req, res) => {
    Posts.insert(req.body)
    .then(post => {
        if (!post.title || !post.contents) {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        } else if (post) {
            res.status(201).json(post);
        }
    })
    .catch(error => {
      res.status(500).json({ error: "There was an error while saving the post to the database" });
    });
  });

//POST = /api/posts/:id/comments
// router.post('/:id/comments', (req, res) => {
//     Posts.insertComment(req.body)
//     .then(post => {
//         if (!post.title || !post.contents) {
//             res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
//         } else if (post) {
//             res.status(201).json(post);
//         }
//     })
//     .catch(error => {
//       res.status(500).json({ error: "There was an error while saving the post to the database" });
//     });    
// });

//GET = /api/posts/
router.get('/', (req, res) => {
    Posts.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({ error: "The posts information could not be retrieved." });
    });
  });

  //GET = /api/posts/:id
  router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({ message: 'Error retrieving the post' });
    });
  });

//GET = /api/posts/:id/comments
// router.get("/:id/comments", (req, res) => {
//     Posts.findPostComments(req.params.id)
//     .then(post => {

//     })
// })

//stuff from guided proj
router.delete('/:id', (req, res) => {
    Hubs.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The hub has been nuked' });
      } else {
        res.status(404).json({ message: 'The hub could not be found' });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error removing the hub',
      });
    });
  });
  
  router.put('/:id', (req, res) => {
    const changes = req.body;
    Hubs.update(req.params.id, changes)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: 'The hub could not be found' });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error updating the hub',
      });
    });
  });

  router.get("/:id/messages", (req, res) => {
    Hubs.findHubMessages(req.params.id)
    .then(messages => {
        res.status(200).json(messages);
    })
    .catch(err => {
        res.status(500).json({errorMessage: "error reading messages"});
    });
});

// add an endpoint for adding new message to a hub
router.post("/:id/messages", (req, res) => {
    Hubs.addMessage(req.body)
    .then(message => {
        res.status(201).json(message);
    })
    .catch(err => {
        res.status(500).json({errorMessage: "problem adding message"});
    });
});

module.exports = router;