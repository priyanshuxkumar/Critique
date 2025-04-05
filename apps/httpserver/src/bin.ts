import { app } from ".";
import { config } from "./config";

(async () => {
  app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
  });
})();
