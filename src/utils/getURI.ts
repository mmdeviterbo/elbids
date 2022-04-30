const getURI=(path: string): string=>{
  const prod = path   //'production'
  const dev = `http://localhost:8080${path}`         //'development'
  return process.env.NODE_ENV ==='production'? prod : dev 
}

export {
  getURI
}