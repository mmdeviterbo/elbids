import { ApolloClient, InMemoryCache } from "@apollo/client"
import { getURI } from '../utils/getURI';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: getURI("/graphql")
})
export default client