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
  }, []);
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
      // ordered keeps track of the order the arrays, just in case their prior configuration is ever needed
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
    return level;
  }
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
    columns.rows[level.depth] = [];
    if (level.header != "") {
      columns.rows[level.depth - 1] = [
        <th
          colSpan={level.length}
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
        columns.data.push(...deeperRows.data);
      });
    }
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
    const columns = makeColumns(parsed, deepestPoint);
    const keys = Object.keys(columns.rows);
    // add in baseline headers in their appropriate spot
    columns.rows[keys[0]] = [...columns.headers,...columns.rows[keys[0]]]
    const rows = keys.map(((key) => {return <tr className="fields" rowSpan={2}>{...columns.rows[key]}</tr>}) )
    console.log(rows)
    return (
      <table className="contactList">
        <thead>{rows}</thead>
        <tbody className="selectedContact">{...columns.data}</tbody>
      </table>
    );
      }
  return (
    <div>
      <table className="contactList">
        {contact ? makeTable() : null}
      </table>
    </div>
  );
}
