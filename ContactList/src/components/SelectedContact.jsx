import React from "react";
import { useState, useEffect } from "react";
export default function SelectedContact({
  selectedContactId,
  setSelectedContactId,
}) {
  const [contact, setContact] = useState({});
  useEffect(() => {
    async function fetchContact() {
      console.log("FETCH SINGLE");
      try {
        const response = await fetch(
          `https://fsa-jsonplaceholder-69b5c48f1259.herokuapp.com/users/${selectedContactId}`
        );
        const json = await response.json();
        setContact(json);
        console.log("RESULTS:");
        console.log(json);
        setContact(json);
      } catch (error) {
        console.error(error);
      }
    }
    fetchContact();
  }, []);
  return (
    <tr
      onClick={() => {
        setSelectedContactId(contact.id);
      }}
    >
      <td>{contact.name}</td>
      <td>{contact.email}</td>
      <td>{contact.phone}</td>
    </tr>
  );
}
