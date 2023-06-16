const port = 5000;
import app from "./index";
import http from "http";
import connectDB from "./db";
const server = http.createServer(app);

connectDB().then(() => {
    server.listen(port, () => {
        console.log(`Server running`);
    });
}).catch((error) => console.error("Erro ao se conectar ao DB", error))

