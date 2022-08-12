import { makeExecutableSchema } from "graphql-tools";
import {resolvers} from "./resolvers/resolvers";

export const typeDefs = ``;

export default makeExecutableSchema({
    typeDefs: [typeDefs],
    resolvers: resolvers
});