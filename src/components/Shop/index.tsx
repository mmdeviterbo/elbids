import { ReactElement } from "react";
import AddItemDialog from "./AddItemDialog";
import FilterSideBar from './FilterSideBar';
import GridItems from "./GridItems";
import { Container } from '@material-ui/core';
import { Post } from "../../types";

const Shop=({postsProp}: {postsProp?: Post[]}):ReactElement=>{
  return(
    <>
      <Container style={{"display":"flex"}}>
        <AddItemDialog/>
        <FilterSideBar/>
        <GridItems postsProp={postsProp}/>
      </Container>
    </>
  )
}
export default Shop