const server = require("./server"); //importanto o server 

const port = 8080; // criando variável para porta

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

