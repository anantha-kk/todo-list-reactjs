import React, { Component } from 'react';
import TodoItems from './TodoItems';
import fetch from 'isomorphic-fetch';

class App extends Component {
  constructor() {
    super()
    this.state = {
      items: [],
      currentItem: {title:''},
    }
  }
  componentDidMount = async () => {
    const response = await fetch('https://m2ve8r4p80.execute-api.us-east-1.amazonaws.com/beta/todos-team3?userId=testUser10', {
      headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
				'User-Agent': 'todo',
			},
      method:'GET'
    });
    const json = await response.json();
    this.setState({items : json});
  }
  
  handleInput = e => {
    const itemText = e.target.value;
    const currentItem = { title: itemText }
    this.setState({
      currentItem
    })
  }

  addItem = async(e) => {
    e.preventDefault();
    const newItem = this.state.currentItem;
    const request = {title: newItem.title, name:"test",items:[{"name":"test"}],userId:'testUser10'};
    if (newItem.title !== '') {
      const response = await fetch('https://m2ve8r4p80.execute-api.us-east-1.amazonaws.com/beta/todos-team3', {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'todo',
          },
          body: JSON.stringify(request),
          method:'POST'
        });
      const json = await response.json();
      if(response.status === 200){
        request.id = json.id;
        const items = this.state.items;
        items.unshift(request);
        this.setState({ items: items });
        this.inputElement.value = '';
      }
    }
  }

  editItem = async (title,id) => {
    const response = await fetch(`https://b3tcfb1z62.execute-api.us-east-1.amazonaws.com/dev/api/todos/${id}`, {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'todo',
          },
          body: JSON.stringify({ title: title }),
          method:'PUT'
        });
    const json = await response.json();
    this.state.items.forEach(item => {
      if(item._id === json._id) {
        item.title = json.title;
      }
    });
    this.setState({ items: this.state.items});
  }

  deleteItem = async(id) => {
    const filteredItems = this.state.items.filter(item => {
      return item.id !== id
    })
    const response = await fetch(`https://m2ve8r4p80.execute-api.us-east-1.amazonaws.com/beta/todos-team3/${id}`, {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'todo',
          },
          method:'DELETE'
        });
    const json = await response.json();
    if(response.status === 200){
      this.setState({ items: filteredItems});
    }
  }
  render() {
    return (
      <div>
        <div>
          <div>
            <input
                  placeholder="Enter Task"
                  ref={c => {
                    this.inputElement = c;
                  }}
                  value={this.state.currentItem.text}
                  onChange={this.handleInput}
            />
            <button onClick={this.addItem}>Add Task</button>
          </div>
        </div>
        <TodoItems entries={this.state.items} editItem={this.editItem} deleteItem={this.deleteItem}/>
      </div>
    );
  }
}

export default App;
