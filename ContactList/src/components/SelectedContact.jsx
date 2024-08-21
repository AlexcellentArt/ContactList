import React from "react";
import { useState, useEffect } from "react";
export default function SelectedContact({
  selectedContactId,
  setSelectedContactId,
}) {
  const [contact, setContact] = useState({});
  const [headers, setHeaders] = useState();
  const [fields, setFields] = useState();
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
    //fetch data
    fetchContact();
    // parse it into an object split into headers and fields
    // const pair = parseData(contact)
    // console.log(pair)
    // setHeaders(pair[0])
    // setFields(pair[1])
    const pair =  parse(contact)
    setHeaders(pair[0])
    setFields(pair[1])
  }, []);
  // function parseData(jsonObj) {
  //   const headers = [];
  //   const fields = [];
  //   // const pair = {header:null,field:null};
  //    Object.keys(jsonObj).map((key) => {
  //     const obj = jsonObj[key];
  //     if (obj.constructor === Object) {
  //       const subPair = parseData(obj);
  //       // pair.header = subPair.header;
  //       headers.push(<th>{key}{subPair[0]}</th>)

  //       // pair.field = subPair.field;
  //       fields.push(<div>{subPair[1]}</div>)
  //     } else {
  //       // pair.header = <th>{key}</th>;
  //       // pair.field = <td>{contact[key]}</td>;
  //       // headers.push(<th>{key}</th>)
  //       // fields.push(<td>{contact[key]}</td>)
  //       // return (
  //       //   <>
  //       //     <th>key</th>
  //       //     <td>{contact[key]}</td>
  //       //   </>
  //       // );
  //     }
  //   });
  //   console.log(headers);
  //   console.log(fields)
  //   // setHeaders()
  //   return [headers,fields];
  // }
  function parse(jsonObj) {
    const headers = [];
    const fields = [];
    const keys = Object.keys(jsonObj).map((key) => {
      const obj = jsonObj[key];
      if (obj.constructor === Object) {
        const tiles =  parse(obj);
        headers.push(<th colSpan={tiles.length-1  }>{key}</th>)
        fields.push(<table className="contactList subTable"><thead>{tiles[0]}</thead><tbody><tr>{tiles[1]}</tr></tbody></table>)
      } else {
        headers.push(<th>{key}</th>)
        fields.push(<td>{jsonObj[key]}</td>)
        // return (
        //   <>
        //     <th>{key}</th>
        //     <td>{contact[key]}</td>
        //   </>
        // );
      }
    });
    console.log("Tiles:")
    const result = [headers,fields]
    console.log(result)
    return result
  }
  function makeTable(){
    const pair =  parse(contact)
    // setHeaders(pair[0])
    // setFields(pair[1])
    return <><thead><tr>{pair[0]}</tr></thead><tbody><tr>{pair[1]}</tr></tbody></>
  }
  return (
    <div>
    <table className="contactList">
    {makeTable()}
      {/* <thead>
      <tr
        onClick={() => {
          setSelectedContactId(contact.id);
        }}
      >
        </tr>

      </thead>
        <tbody>
        {
          // console.log(Object.keys(contact))
          // const keys = Object.keys(contact);
          // <th>key</th>
        }
        {/* <td>{contact.name}</td>
        <td>{contact.email}</td>
        <td>{contact.phone}</td> 
        </tbody> */}
    </table>
    {/* // {makeTable()} */}
    </div>
  );
}
