import Fastify from "fastify";
import turmaRoutes from "./routes/turmaRoutes/turmaRoutes";


const server = Fastify();

server.register(turmaRoutes)

server.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server is running at ${address}`);
  });
  