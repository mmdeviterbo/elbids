import { ReactElement } from "react";
import AddItemDialog from "./AddItemDialog";
import FilterSideBar from './FilterSideBar';
import GridItems from "./GridItems";
import { Container } from '@material-ui/core';

const Shop=():ReactElement=>{
  return(
    <>
      <Container style={{"display":"flex"}}>
        <AddItemDialog/>
        <FilterSideBar/>
        <GridItems/>
      </Container>
    </>
  )
}
export default Shop