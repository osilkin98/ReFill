import React from 'react';
import {nouns, adjectives, slurs} from './words';
import './App.css';


let randomIndex = function(items, prevIdx=null) {
    let idx = Math.floor(Math.random() * items.length);
    if(prevIdx !== null && ( Math.abs(idx - prevIdx) % 2 === 0)) {
        idx = (idx + 1) % items.length;
    }
    return idx;
};

// filterText: "1 2<%f>3 4<%f>"
function createFiltered(filteredText, filterStack) {
    let filtered = filteredText.split('<%f>');
    let complete = [filtered[0]];
    for (let i = 0; i < filterStack.length; i++) {
        complete.push(<strong>{filterStack[i]}</strong>);
        complete.push(filtered[i + 1]);
    }
    return complete;
}

function makePhrase() {
    let phrase = [];
    let adjIdx = randomIndex(adjectives);
    phrase.push(adjectives[adjIdx]);
    if (Math.random() > 0.5) {
        adjIdx = randomIndex(adjectives, adjIdx);
        phrase.push(adjectives[adjIdx])
    }
    let nounIdx = randomIndex(nouns);
    phrase.push(nouns[nounIdx]);
    return phrase.join(' ');
}

export class FilteredInput extends React.Component {
    constructor(props) {
        super(props);
        this.slursRegex = new RegExp('(' + slurs.join('|') + ')', 'giu');
        this.state = {
            value: '',
            valueFiltered: 'Placeholder',
            filterStack: [],
            unFilterStack: []
        };
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {
        let value = event.target.value;
        let stack = Object.assign([], this.state.filterStack);
        let unfilteredStack = Object.assign([], this.state.unFilterStack);
        let idx = 0;
        let filtered = value.replace(this.slursRegex, (match) => {
                idx++;
                if (idx === unfilteredStack.length && match !== unfilteredStack[idx - 1]) {
                    unfilteredStack.pop();
                    stack.pop();
                }
                if (idx > unfilteredStack.length) {
                    unfilteredStack.push(match);
                    stack.push(makePhrase());
                }
                return '<%f>';
            }
        );
        while (idx < stack.length) { stack.pop(); unfilteredStack.pop(); }
        this.setState({
            value: value,
            valueFiltered: filtered,
            filterStack: stack,
            unFilterStack: unfilteredStack
        });
        // todo: iterate through valueFiltered and record new phrases if any then pop off unused ones if shortened
    }

    render() {
        return (
            <span className="filterOutput">
                <input
                    id="filterInput"
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                    autoFocus
                    onBlur={() => document.getElementById('filterInput').focus()}

                />
                <p className="unfiltered">{createFiltered(this.state.valueFiltered, this.state.unFilterStack)}</p>
                <p className="filtered">{createFiltered(this.state.valueFiltered, this.state.filterStack)}</p>
            </span>
        );
    }
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FilteredInput auto/>
      </header>
    </div>
  );
}

export default App;
