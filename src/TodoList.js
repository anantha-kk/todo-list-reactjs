import React, { Component } from 'react';

class TodoList extends Component {
  constructor() {
    super()
    this.state = {
      editMode: false,
      list: {}
    };
  }

    componentDidMount = async () => {
        this.setState({list : this.props.list});
    }

    toggleEdit = (e) => {
        e.preventDefault();
        this.setState({editMode: !this.state.editMode});
    }

    handleListNameChange = (e) => {
        e.preventDefault();
        const list = this.state.list;
        list.name = e.target.value;
        this.setState({list: list});
    }

    handleListItemChange = (e, i) => {
        e.preventDefault();
        const list = this.state.list;
        list.items[i].value = e.target.value;
        this.setState({list: list});
    }

    handleListItemChecked = (e, i) => {
        const list = this.state.list;
        list.items[i].checked = e.target.checked;
        this.setState({list: list});
        this.props.editList(this.state.list);
    }

    saveList = (e) => {
        e.preventDefault();
        this.props.editList(this.state.list);
        this.toggleEdit(e);
    }

    addNewItem = () => {
        const list = this.state.list;
        list.items.push({"checked": false, "value": ""});
        this.setState({list: list});
    }

  render() {
      const list = this.state.list;
      return (
        <li key={list.id}>
            {
                this.state.editMode ?
                    <input className='listName' type='text' value={list.name}
                           onChange={(e) => {
                               this.handleListNameChange(e);
                           }} /> :
                    <span>{list.name}</span>
            }

          {
              !this.state.editMode ?
                  <button type='submit' onClick={this.toggleEdit}>Edit</button>
                  : <button type='submit' onClick={this.saveList}>Update</button>
          }
          <button type='submit' onClick={() => this.props.deleteList(list.id)}>Delete List</button>
            {
                this.renderToDoList()
            }
        </li>
      )
    }

    renderToDoList = () => {
      if (!this.state.list.id) {
          return;
      }
      const listId = this.state.list.id;
      const listItems = this.state.list.items;
      return (
        <div>
            {
                listItems.map((item, i) => {
                    return (
                        <div key={listId+'_'+i}>
                            <input className='listItemChecked' type='checkbox' checked={item.checked}
                                   onChange={(e) => { this.handleListItemChecked(e, i); }} />
                            {
                                this.state.editMode ?
                                    <input className='listItemText' value={item.value}
                                           onChange={(e) => {
                                               this.handleListItemChange(e, i);
                                           }} /> :
                                    <span>{item.value}</span>
                            }
                        </div>
                    );
                })
            }
            {
                this.state.editMode &&
                    <button type='submit' onClick={() => this.addNewItem()}>Add New Item</button>
            }

        </div>
      );
    }
}

export default TodoList