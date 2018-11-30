import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import ListItemText from '@material-ui/core/ListItemText';

import { Database, Open, Close } from '../src/components/svg';


class ListTest extends React.Component {
  state = {
    selectedKeys: Array(this.props.databases.length).fill(false),
  };

  handleClick = index => {
    const { selectedKeys } = this.state;
    selectedKeys[index] = !selectedKeys[index];
    this.setState(({ selectedKeys: selectedKeys }));
  };

  isOpen = index => {
    return this.state.selectedKeys[index];
  };

  createList = items => items.length > 0 ? items.map(
    (item, i) => (
      <List dense={true}>
        <ListItem
          key={`root/${i}`}
          dense={true}
          button
          disableGutters
          onClick={e => this.handleClick(i)}
        >
          <ListItemIcon style={{ marginRight: 0 }}>
            {this.state.selectedKeys[i] ? <Open /> : <Close />}
            <Database />
          </ListItemIcon>
          <ListItemText
            style={{ paddingLeft: 0 }}
            primary={item.name}
          />
        </ListItem>
        <Collapse
          key={`sub/${i}`}
          in={this.state.selectedKeys[i]}
          timeout="auto"
          unmountOnExit
        >
          <List dense={true} component="div" disablePadding>
            {this.createSubList(item.subs)}
          </List>
        </Collapse>
      </List>
    )) : null;

  createSubList = items => items.length > 0 ? items.map(
    (sub, i) => (
      <ListItem key={i} dense={true} button disableGutters>
        <ListItemText primary={sub} style={{ paddingLeft: 56 }} />
      </ListItem>
    )) : null;

  render() {
    const { databases } = this.props;
    return this.createList(databases);
  }
}

export default ListTest;
