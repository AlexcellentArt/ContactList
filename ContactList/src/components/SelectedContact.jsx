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
        // setContact(json);
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
    // const pair = parseV2(contact);
    // setHeaders(pair[0]);
    // setFields(pair[1]);
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

  function compileArrayToRows(array) {
    const compiled = { main: [], sub: [], depth: 0 };
    // filter and handle the arrays first, passing back the deepest point
    array.forEach((frag) => {
      // if array, check for sub arrays
      if (Array.isArray(frag)) {
        compiled.depth += 1;
        compiled.sub.push(compileArrayToRows(frag));
      } else {
        compiled.main.push(frag);
      }
    });
    return compiled;
  }
  function parseV2(jsonObj, header = "", prevDepth = 1) {
    const level = {
      header: header,
      pairs: [],
      depth: prevDepth + 1,
      sublevels: [],
      ordered: [],
      length: 0
    };
    console.log(Object.keys(jsonObj).fl);
    Object.keys(jsonObj).forEach((key) => {
      const obj = jsonObj[key];
      // ordered keeps track of the order the arrays should be resorted in once converted to headers
      if (obj.constructor === Object) {
        const res = parseV2(obj, key, level.depth);
        level.sublevels.push(res);
        level.ordered.push(`s.${level.sublevels.length - 1}`);
        level.length += res.length;
      } else {
        level.pairs.push({ key: key, value: jsonObj[key] });
        level.ordered.push(`p.${level.pairs.length - 1}`);
        level.length += 1;
      }
    });
    // if (level.sublevels.length){
    //   level.sublevels.forEach((lev) => {
    //     if (lowestDepth < lev.depth) {lowestDepth = lev.depth}
    //   })
    // }
    // else {
    //   lowestDepth = level.depth;
    // }
    return level;
  }
  // function sortParsed(result) {
  //   console.log("PARSE RESULTS");
  //   console.log(result);
  //   console.log("COMPILER RESULTS");
  //   console.log(compileArrayToRows(result));
  //   const compiled = compileArrayToRows(result);
  //   console.table(compiled);
  //   compiled.sub.forEach((obj) => {
  //     obj.main.forEach((ob) => console.log(ob));
  //     obj.sub.forEach((o) => console.log(o));
  //   });
  //   const table = { headers: { main: [], sub: [] }, body: result[1] };
  //   // sort headers into rows. Top level will not be encased in one already and are in arrays still
  //   // main and sub headers are kept separate so the latter can have the ability to collapse easily added later
  //   result[0].forEach((frag) => {
  //     console.log(frag);
  //     if (Array.isArray(frag)) {
  //       table.headers.sub.push(<tr className="subHeaders">{frag}</tr>);
  //     } else {
  //       table.headers.main.push(frag);
  //     }
  //   });
  //   // finally encase main in row
  //   table.headers.main = (
  //     <tr className="mainHeaders">{...table.headers.main}</tr>
  //   );
  //   return table;
  // }
  function determineDeepestPoint(level) {
    let lowestDepth = level.depth;
    if (level.sublevels.length) {
      level.sublevels.forEach((lev) => {
        const depth = determineDeepestPoint(lev);
        if (lowestDepth < depth) {
          lowestDepth = depth;
        }
      });
    }
    return lowestDepth;
  }
  function makeColumns(level, deepestPoint) {
    const columns = { rows: {}, headers: [], data: [] };
    // get sub level rows first
    // level.ordered.forEach((code) =>
    // { const guide = code.split(".")
    //   if (guide[0] === "p")
    //   {
    //     // get pair by index
    //     rows.headers.push(<th rowSpan={deepestPoint - level.depth}>{obj.key}</th>);
    //     rows.data.push(<td>{obj.value}</td>);

    //   }

    // })
    columns.rows[level.depth] = [];
    if (level.header != "") {
      columns.rows[level.depth - 1] = [
        <th
          // rowSpan={deepestPoint - level.depth}
          colSpan={level.length}
          // scope="col"
        >
          {level.header}
        </th>,
      ];
    }
    // then make headers and data
    level.pairs.forEach((obj) => {
      columns.rows[level.depth].push(
        <th rowSpan={deepestPoint - level.depth +1}>
          {obj.key}
        </th>
      );
      columns.data.push(<td>{obj.value}</td>);
    });
    // make header first and adjust it's span
    if (level.sublevels.length) {
      level.sublevels.forEach((lev) => {
        const deeperRows = makeColumns(lev, deepestPoint);
        Object.keys(deeperRows.rows).forEach((key) => {
          console.log(key);
          console.log(deeperRows.rows[key]);
          if (key in columns.rows) {
            columns.rows[key] = [...columns.rows[key], ...deeperRows.rows[key]];
          } else {
            columns.rows[key] = deeperRows.rows[key];
          }
        });
        // flatten
        // rows.headers.push(...deeperRows.headers)
        // columns.headers.push(...deeperRows.headers)

        // rows.data.push(<tr>{deeperRows.data}</tr>)
        // rows.headers = [...rows.headers, ...deeperRows.headers];
        columns.data.push(...deeperRows.data);
      });
    }
    // const level = {header:header,pairs:[],depth:prevDepth + 1,sublevels:[]}
    return columns;
  }
  function makeTable() {
    // parse contact then sort into headers,sub headers and body
    if (contact == {}) {
      return;
    }
    console.log(contact);
    const parsed = parseV2(contact);
    // deepest point is determined so that the col span can be calculated
    const deepestPoint = determineDeepestPoint(parsed);
    console.log("Deepest point is " + deepestPoint);
    console.log(parsed);
    console.log(makeColumns(parsed, deepestPoint));
    const columns = makeColumns(parsed, deepestPoint);
    const keys = Object.keys(columns.rows);
    console.log(columns.rows)
    // add in baseline headers in their appropriate spot
    columns.rows[keys[0]] = [...columns.headers,...columns.rows[keys[0]]]
    console.log("KEYS");
    console.log(keys);
    const rows = keys.map(((key) => {return <tr rowSpan={2}>{...columns.rows[key]}</tr>}) )
    console.log(rows)
    return (
      <table>
        <thead>{rows}</thead>
        <tbody>{...columns.data}</tbody>
      </table>
    );
    {
      /* <thead>{[sorted.headers.main, ...sorted.headers.sub]}</thead>
        <tbody>
          <tr>{sorted.body}</tr>
        </tbody> */
    }
    // make top level last
    // const sorted = sortParsed(parse(contact));
    // setHeaders(pair[0])
    // setFields(pair[1])
    // sort through into rows
    // console.log(sorted);
    // const mainRow = []
    // const subRows = []
    // sorted.forEach((frag)=> {if (frag.type === 'th'){
    //   mainRow.push(frag)
    // } else {subRows.push(frag)}})
    // table.headers = <tr>{...mainRow}</tr>...subRows

    return (
      <>
        {/* <thead>{[sorted.headers.main, ...sorted.headers.sub]}</thead>
        <tbody>
          <tr>{sorted.body}</tr>
        </tbody> */}
      </>
    );
  }
  return (
    <div>
      <table className="contactList">
        {contact ? makeTable() : null}
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
