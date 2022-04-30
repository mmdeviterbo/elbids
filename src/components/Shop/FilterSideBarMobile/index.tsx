import React, {useState, ReactElement, MouseEvent, KeyboardEvent} from 'react';
import clsx from 'clsx';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import Box from '@material-ui/core/Box';
import useStyles from './style'
import FilterSideBar from './../FilterSideBar';

type Anchor = 'top' | 'left' | 'bottom' | 'right';


const FilterSideBarMobile=(): ReactElement=> {
  const classes = useStyles();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: KeyboardEvent | MouseEvent) => {
    if (event && event.type === 'keydown' &&
        ((event as KeyboardEvent).key === 'Tab' ||
          (event as KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <FilterSideBar/>
    </div>
  );

  return (
    <div className={classes.filterMobile}>
      {(['left'] as Anchor[]).map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton aria-label="messages" color="inherit" onClick={toggleDrawer(anchor, true)}>
            <FilterListIcon/>
          </IconButton>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
export default FilterSideBarMobile