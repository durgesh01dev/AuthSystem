const app = require('./app')
//desctructuring the port numebr
const {PORT} = process.env;

//listening the server
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}...`);
})