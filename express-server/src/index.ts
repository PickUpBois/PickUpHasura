import express from "express";
import path from "path";
import { initConfig } from './config';
import actionsRouter from './actionRoutes';
import eventsRouter from './eventRoutes';
import exp from "constants";
import { initGraphqlClient } from "./gql_client";
const app = express();
 // default port to listen

initConfig()
initGraphqlClient();

app.use(express.json());
app.use('/actions', actionsRouter)
app.use('/events', eventsRouter)

const port = process.env.PORT || 3000;

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }`);
} );
