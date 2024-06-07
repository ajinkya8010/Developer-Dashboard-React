import React, { useState } from 'react';
import './Table.css';


interface TableProps {
  data: {
    activityMeta: {
      label: string;
      fillColor: string;
    }[];
    rows: {
      name: string;
      totalActivity: {
        name: string;
        value: string;
      }[];
      dayWiseActivity: {
        date: string;
        items: {
          children: {
            count: string;
            label: string;
            fillColor: string;
          }[];
        };
      }[];
    }[];
  };
}

/*
 * Table component displays activity data in a tabular format with collapsible day-wise details.
  */

const Table: React.FC<TableProps> = ({ data }) => {

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
   /*
   * Toggles the accordion item to show or hide the day-wise activity.
   */

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Identity</th>
            {data.activityMeta.map((activity) => (
              <th key={activity.label}>{activity.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              {row.totalActivity.map((activity) => (
                <td key={activity.name}>{activity.value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Day Wise Activity</h2>
      {data.rows.map((row, rowIndex) => (
        <div key={row.name} className="accordion">
          <div className="accordion-item">
            <div
              className="accordion-header"
              onClick={() => toggleAccordion(rowIndex)}
            >
              <h3>{row.name}</h3>
              <span>{activeIndex === rowIndex ? '-' : '+'}</span>
            </div>
            <div className={`accordion-content ${activeIndex === rowIndex ? 'active' : ''}`}>
              {row.dayWiseActivity.map((day) => (
                <div key={day.date} className="day-activity">
                  <h4>{day.date}</h4>
                  <ul>
                    {day.items.children.map((activity) => (
                      <li key={activity.label}>
                        <span
                          className={`activity-icon activity-${activity.label
                            .toLowerCase()
                            .replace(' ', '-')}`}
                        ></span>
                        {activity.label}: <span className='value'>{activity.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )).reduce((acc: JSX.Element[][], curr: JSX.Element, index: number) => {
                if (index % 4 === 0) {
                  acc.push([]);
                }
                acc[acc.length - 1].push(curr);
                return acc;
              }, []).map((row, index) => (
                <div key={index} className="day-row">
                  {row}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Table;
