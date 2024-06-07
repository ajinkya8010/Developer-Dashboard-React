import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Chart from './components/Chart';
import Table from './components/Table';

interface ActivityMeta {
  label: string;
  fillColor: string;
}

interface TotalActivity {
  name: string;
  value: string;
}

interface DayWiseActivity {
  date: string;
  items: {
    children: {
      count: string;
      label: string;
      fillColor: string;
    }[];
  };
}

interface Row {
  name: string;
  totalActivity: TotalActivity[];
  dayWiseActivity: DayWiseActivity[];
}

interface AuthorWorklogData {
  activityMeta: ActivityMeta[];
  rows: Row[];
}

interface APIResponse {
  data: {
    AuthorWorklog: AuthorWorklogData;
  };
}

const App: React.FC = () => {
  const [data, setData] = useState<AuthorWorklogData | null>(null);

  useEffect(() => {
    const baseURL = process.env.NODE_ENV === 'development' ? '' : process.env.PUBLIC_URL;
    console.log('Base URL:', baseURL);
    const url = `${baseURL}/mock.json`;
    console.log('Fetching data from:', url);
    axios.get(url)
      .then(response => {
        const apiResponse = response.data;
        setData(apiResponse.data.AuthorWorklog);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  return (
    <div className="app">
      <Dashboard />
      {data && <Chart data={data} />}
      {data && <Table data={data} />}
    </div>
  );
};

export default App;
