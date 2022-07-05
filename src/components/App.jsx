import { Component } from 'react';
import { nanoid } from 'nanoid';
import { ContactForm } from 'components/ContactForm';
import { ContactList } from 'components/ContactList';
import { Filter } from 'components/Filter';
import { saveLocalStorage, loadLocalStorage } from './localStorage';

class App extends Component {
  static defaultProps = {};

  static propTypes = {};

  state = {
    contacts: [],
    name: '',
    number: '',
    filter: '',
  };

  componentDidMount() {
    const localStorageArray = loadLocalStorage('contacts');
    if (localStorageArray) {
      this.setState({ contacts: localStorageArray });
    }
  }

  componentDidUpdate() {
    if (this.state.name === '') {
      saveLocalStorage('contacts', this.state.contacts);
    }
  }

  handleSubmit = ev => {
    ev.preventDefault();
    if (this.state.contacts.some(contact => contact.name === this.state.name)) {
      alert(`${this.state.name} is already in contacts`);
    } else {
      this.setState(prevState => ({
        contacts: [
          ...prevState.contacts,
          { id: nanoid(), name: this.state.name, number: this.state.number },
        ],
        name: '',
        number: '',
      }));
    }
  };

  handleSetName = ev => {
    this.setState({ name: ev.target.value });
  };

  handleSetNumber = ev => {
    this.setState({ number: ev.target.value });
  };

  handleSetFilter = ev => {
    this.setState({ filter: ev.target.value });
  };

  deleteHandler = id => {
    const newContacts = this.state.contacts.filter((contact) => contact.id !== id);
    this.setState({ contacts: newContacts });
  }

  render() {
    const { contacts, name, number, filter } = this.state;

    return (
      <>
        <h1>Phonebook</h1>
        <form onSubmit={this.handleSubmit}>
          <ContactForm
            formId={nanoid()}
            type="text"
            inputName="Name"
            value={name}
            setName={this.handleSetName}
            pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
            title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
          />
          <ContactForm
            formId={nanoid()}
            type="tel"
            inputName="Number"
            value={number}
            setName={this.handleSetNumber}
            pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
            title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          />
          <button type="submit">Add contact</button>
        </form>
        <h1>Contacts</h1>
        <Filter
          setName={this.handleSetFilter}
          inputId={nanoid()}
          type="text"
          inputName="Filter"
          value={filter}
        />
        <ContactList contacts={contacts} filter={filter} deleteHandler={this.deleteHandler }/>
      </>
    );
  }
}

export default App;
