import React from "react";

const Winner = props => {
  return (
    <tr>
      <td>{props.data.name}</td>
      <td>{props.data.points}</td>
      <td>
        <a href={props.data.url} target="_blank" rel="noopener noreferrer">
          Go!
        </a>
      </td>
    </tr>
  );
};

export default Winner;
