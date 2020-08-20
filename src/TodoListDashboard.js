import React, { Component } from 'react';
import TodoList from './TodoList';

class TodoListDashboard extends Component {
  constructor() {
    super()
    this.state = {
      lists: []
    }
  }
    
  render() {
    const listEntries = this.props.entries
    const listsView = listEntries.map((list) => {
      return (
        <TodoList key={list.id} list={list} editList = {this.props.editList} deleteList= {this.props.deleteList}/>
      )
    });

    return <ul>{listsView}</ul>
  }
}

export default TodoListDashboard