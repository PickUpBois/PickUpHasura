import express from "express";
import { initConfig } from './config';
import actionsRouter from './actionRoutes';
import eventsRouter from './eventRoutes';
import { startOpenEvents } from "./events/eventHandlers/eventHandler";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { fetchEventTeam } from "./models/event";
import fs from 'fs'
import path from "path";
import { makeExecutableSchema } from "graphql-tools";
import { initAdmin } from "./admin";

const schemaFile = path.join(__dirname, "schema.graphql");
const typeDefs = fs.readFileSync(schemaFile, 'utf8')

const app = express();
 // default port to listen

initConfig()

initAdmin()

app.use(express.json());
app.use('/actions', actionsRouter)
app.use('/events', eventsRouter)

const port = process.env.PORT || 3000;

startOpenEvents().then(() => {
    console.log('started open events')
}).catch((e) => {
    console.log(e)
})

const resolvers = {
    Query: {
        getEventTeam: async (_, { teamId }) => {
            console.log('fetching team')
            return await fetchEventTeam(teamId.toString())
        }
    }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

// start the express server
app.listen( port, async () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }`);
} );
