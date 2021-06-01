// implement your posts router here
const express = require('express');

const router = express.Router();

const Posts = require('./posts-model');
console.log('Post MODEL -> ', Posts);

router.get('/', (req, res) => {
	Posts.find()
		.then(posts => {
			console.log(posts);
			res.status(200).json(posts);
		})
		.catch(error => {
			console.log(error);
			res.status(500).json({
				message: 'The posts information could not be retrieved',
				error: error.message
			});
		});
});

router.get('/:id', (req, res) => {
	Posts.findById(req.params.id)
		.then(post => {
			if (!post) {
				res.status(404).json({
					message: 'The post with the specified ID does not exist'
				});
			} else {
				res.status(200).json(post);
			}
		})
		.catch(error => {
			console.log(error);
			res.status(500).json({
				message: 'The post information could not be retrieved',
				error: error.message
			});
		});
});

router.post('/', (req, res) => {
	const post = req.body;
	if (!post.title || !post.contents) {
		res.status(400).json({
			message: 'Please provide title and contents for the post'
		});
	} else {
		Posts.insert(post)
			.then(newID => {
				// post.id = newID; // DIRTY
				Posts.findById(newID.id).then(res2 => {
					console.log('this is it: ', res2);
					res.status(201).json(res2);
				});
			})
			.catch(error => {
				console.log(error);
				res.status(500).json({
					message: 'There was an error while saving the post to the database',
					error: error.message
				});
			});
	}
});

router.put('/:id', async (req, res) => {
	if (!req.body.title || !req.body.contents) {
		res.status(400).json({
			message: 'Please provide title and contents for the post'
		});
	} else {
		try {
			const post = await Posts.update(req.params.id, req.body);
			if (!post) {
				res.status(404).json({
					message: 'The post with the specified ID does not exist'
				});
			} else {
				const updated = await Posts.findById(req.params.id);
				res.status(200).json(updated);
			}
		} catch (error) {
			res.status(500).json({
				message: 'The post information could not be modified',
				error: error.message
			});
		}
	}
});

// DELETE
router.delete('/:id', async (req, res) => {
	const possiblePost = await Posts.findById(req.params.id);
	if (!possiblePost) {
		res.status(404).json({
			message: 'The post with the specified ID does not exist'
		});
	} else {
		Posts.remove(req.params.id)
			.then(stuff => {
				console.log('STUFF: ', stuff);
				res.status(200).json(possiblePost);
			})
			.catch(error => {
				console.log(error);
				res.status(500).json({
					message: 'The post could not be removed',
					error: error.message
				});
			});
	}
});

// GET comments
router.get('/:id/comments', async (req, res) => {
	const thisID = req.params.id;
	try {
		const possiblePost = await Posts.findById(thisID);
		if (!possiblePost) {
			res.status(404).json({
				message: 'The post with the specified ID does not exist'
			});
		} else {
			console.log('possiblePost comments: ', possiblePost.comments);
			res.status(200).json(possiblePost.comments);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'The comments information could not be retrieved',
			error: error.message
		});
	}
});

router.use('*', (req, res) => {
	res.status(400).json({
		message: 'not found'
	});
});

module.exports = router;
