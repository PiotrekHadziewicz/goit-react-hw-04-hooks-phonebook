import { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { ContactForm } from 'components/ContactForm';
import { ContactList } from 'components/ContactList';
import { Filter } from 'components/Filter';
import { saveLocalStorage, loadLocalStorage } from './localStorage';

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [filter, setFilter] = useState('');
  const inputRef = useRef();
  const nameId = useRef(nanoid());
  const numberId = useRef(nanoid());
  const filterId = useRef(nanoid());

  useEffect(() => {
    const localStorageArray = loadLocalStorage('contacts');
    if (localStorageArray) {
      setContacts(localStorageArray);
    }
    inputRef.current.focus();
  },[]);

  useEffect(() => {
    saveLocalStorage('contacts', contacts);
  }, [contacts]);

  const handleSubmit = ev => {
    ev.preventDefault();
    if (contacts.some(contact => contact.name === name)) {
      alert(`${name} is already in contacts`);
    } else {
      setContacts([
        ...contacts,
        { id: nanoid(), name: name, number: number },
      ]);
      setName('');
      setNumber('');
      };
  };
  

  const handleSetName = ev => {
    setName(ev.target.value);
  };

  const handleSetNumber = ev => {
    setNumber(ev.target.value);
  };

  const handleSetFilter = ev => {
    setFilter(ev.target.value);
  };

  const deleteHandler = id => {
    const newContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(newContacts);
  };

  return (
    <>
      <h1>Phonebook</h1>
      <form onSubmit={handleSubmit}>
        <ContactForm
          inputRef={inputRef}
          formId={nameId.current}
          type="text"
          inputName="Name"
          value={name}
          setName={handleSetName}
          pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
          title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
        />
        <ContactForm
          formId={numberId.current}
          type="tel"
          inputName="Number"
          value={number}
          setName={handleSetNumber}
          pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
        />
        <button type="submit">Add contact</button>
      </form>
      <h1>Contacts</h1>
      <Filter
        setName={handleSetFilter}
        inputId={filterId.current}
        type="text"
        inputName="Filter"
        value={filter}
      />
      <ContactList contacts={contacts} filter={filter} deleteHandler={deleteHandler}/>
    </>
  );
}

export default App;
