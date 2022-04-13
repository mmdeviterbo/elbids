const getURI=(path: string): string=>{
  const prod = `https://elbids.herokuapp.com`   //'production'
  const dev = `http://localhost:3001${path}`         //'development'
  return process.env.NODE_ENV ==='production'? prod : dev 
}

export {
  getURI
}