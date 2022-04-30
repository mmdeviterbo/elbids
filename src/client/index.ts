import { ApolloClient, InMemoryCache } from "@apollo/client"
import { getURI } from '../utils/getURI';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://elbids-server.herokuapp.com"
})
export default client