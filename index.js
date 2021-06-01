// require your server and launch it here
const server = require(`./api/server`);

// other way to do the below
// const port = 5000;
// server.listen(port, () => {
// 	console.log('listening on: ', port);
// });

server.listen(5000, () => {
	console.log('\n*** Server Running on http://localhost:5000 ***\n');
});
