const getURI=(path: string): string=>{
  const prod = `https://elbids-server.herokuapp.com`   //'production'
  const dev = `http://localhost:8080${path}`         //'development'
  return process.env.NODE_ENV ==='production'? prod : dev 
}

export {
  getURI
}