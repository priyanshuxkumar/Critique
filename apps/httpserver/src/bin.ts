import { app } from "."
import { config } from "./config";

app.listen(config.port , () => {
    console.log(`Server is running on http://localhost:${config.port}`)
})
