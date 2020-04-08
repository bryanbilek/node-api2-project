const express = require("express");

const router = express.Router();

const Posts = require("../data/db.js");

//POST /posts/ does post but response tells me error
//PUT /posts/:id updates but gives me error message

//POST = /api/posts/
// router.post('/', (req, res) => {
//     Posts.insert(req.body)
//         .then(post => {
//             if (post.title === undefined || post.contents === undefined) {
//                 res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
//             } else {
//                 res.status(201).json(post);
//             }
//         })
//         .catch(error => {
//             res.status(500).json({ error: "There was an error while saving the post to the database" });
//         });
// });

router.post("/", (req, res) => {
    Posts.insert(req.body)
    .then(post => {
        if (!post || !post.title || !post.contents) {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
        } else {
            res.status(201).json(post);
        }
    })
    .catch(err => {
        res.status(500).json({ error: "There was an error while saving the post to the database" });
    })
})

//POST = /api/posts/:id/comments
router.post("/:id/comments", (req, res) => {
    Posts.findCommentById(req.params.id)
    .then(post => {
        if (post) {
            Posts.insertComment(req.body)
            .then(comment => {
                if (req.body.text) {
                    res.status(201).json(comment);
                } else {
                    res.status(400).json({ errorMessage: "Please provide text for the comment." });
                }
            })
            .catch(err => {
                res.status(500).json({ error: "The comments information could not be retrieved." });
            })
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
});

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
            } else {
                res.status(200).json(post);
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({ message: 'Error retrieving the post' });
        });
});

// GET = /api/posts/:id/comments
router.get("/:id/comments", async (req, res) => {
    try {
        const post = await Posts.findById(+req.params.id);
        console.log("post", post);
        if (!post.length) {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
        const comments = await Posts.findPostComments(Number(req.params.id))
        console.log("comments", comments);
        res.status(200).json(comments);
    } catch (err) {
        console.log("err", err)
        res.status(500).json({ error: "The comments information could not be retrieved." });
    }
});

//DELETE = /api/posts/:id
router.delete("/:id", (req, res) => {
    Posts.remove(req.params.id)
        .then(post => {
            if (post) {
                res.status(201).json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The post could not be removed" });
        });
});

//PUT = /api/posts/:id
router.put('/:id', (req, res) => {
    Posts.update(req.params.id, req.body)
        .then(post => {
            if (!post.title || !post.contents) {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
            } else if (!post) {
                Posts.findById(req.params.id)
                    .then(post => {
                        res.status(404).json({ message: "The post with the specified ID does not exist." })
                    })
            } else {
                res.status(200).json(post);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post information could not be modified." });
        });
});


module.exports = router;