import { app } from './app';
import { initializeDatabase } from './infra/database';
import routes from './routes';

const port = process.env.APP_PORT || 3000;

initializeDatabase()
  .then(() => {
    app.use("/api", routes);
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
  });