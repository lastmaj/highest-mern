import React from "react";
import Winner from "./Winner";

const Winners = props => {
  const table = props.data.map(w => {
    return <Winner data={w} key={w.id} />;
  });
  return (
    <table className="winners-table">
      <thead>
        <tr>
          <th key="1">Team Name</th>
          <th key="2">Points</th>
          <th key="3">Profile Link</th>
        </tr>
      </thead>
      <tbody>{table}</tbody>
    </table>
  );
};

export default Winners;
