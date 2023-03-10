import React, { useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import {
  Input,
  Select,
  DatePicker,
  Tag,
  Popconfirm,
  Button,
  Typography,
} from 'antd';
import {
  STATUS_OPTIONS,
  sortDate,
  STATUS_FILTER_OPTIONS,
  getTagsAvailable,
} from './column_props';
import Tags from './Components/Tags';
import { updateTask, deleteTask, postNewTask } from './queryFunctions';
import dayjs from 'dayjs';
import './App.css';

const { Text, Title } = Typography;
const App = () => {
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState({}); //when edit button is clicked, this editingRow will contain the data of that particular row with the changes as done by the user.
  const [loading, setLoading] = useState({});
  const [fetchLoading, setFetchLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    //data fetching from mock api
    setFetchLoading(true);
    fetch('https://63e9d49ee0ac9368d644fa65.mockapi.io/data/data', {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setFetchLoading(false);
      })
      .catch((error) => {
        setFetchLoading(false);
        console.log(error);
      });
  }, []);

  //function to add new task
  const handleAdd = () => {
    const newData = {
      id: `${data.length + 1}`,
      date_created: new Date().toISOString(),
      title: '',
      description: '',
      due_date: new Date().toISOString(),
      tag: [],
      status: 'OPEN',
      newTask: true,
    };
    setData([newData, ...data]);
    setEditingRow(newData);
  };
  //function to remove the newly created task if it is not posted to the database
  const wipeNewlyCreatedTask = () => {
    const newData = [...data];
    newData.splice(0, 1);
    setData(newData);
    setEditingRow({});
  };
  //function to implement global search
  const handleSearch = (data) => {
    return data.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
    );
  };

  const dateFormat = 'YYYY/MM/DD';

  //column format of the table
  const columns = [
    {
      title: 'Date Created',
      dataIndex: 'date_created',
      valueType: 'date',
      sorter: (a, b) => sortDate(a.date_created, b.date_created),
      render: (text, row) => <Text>{text}</Text>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: (a, b) => {
        return a.title.localeCompare(b.title);
      },
      render: (text, row) => {
        if (editingRow.id === row.id) {
          return (
            <Input
              maxLength={100}
              placeholder="Enter Title"
              type="text"
              defaultValue={text}
              onChange={(event) =>
                setEditingRow({ ...editingRow, title: event.target.value })
              }
            />
          );
        }
        return <Text>{text}</Text>;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a, b) => {
        return a.title.localeCompare(b.title);
      },
      render: (text, row) => {
        if (editingRow.id === row.id) {
          return (
            <Input
              maxLength={1000}
              placeholder="Enter Description"
              type="text"
              defaultValue={text}
              onChange={(event) =>
                setEditingRow({
                  ...editingRow,
                  description: event.target.value,
                })
              }
            />
          );
        }
        return <Text>{text}</Text>;
      },
    },

    {
      title: 'Due Date',
      dataIndex: 'due_date',
      valueType: 'date',
      sorter: (a, b) => sortDate(a.due_date, b.due_date),
      render: (text, row) => {
        if (editingRow.id === row.id) {
          return (
            <DatePicker
              disabledDate={(d) => !d || d.isBefore(editingRow.date_created)}
              onChange={(date) =>
                setEditingRow({
                  ...editingRow,
                  due_date: date,
                })
              }
              defaultValue={dayjs(row.due_date)}
              format={dateFormat}
            />
          );
        }
        return <Text>{text}</Text>;
      },
    },

    {
      title: 'Tag',
      dataIndex: 'tag',
      filters: getTagsAvailable(data),

      filterSearch: true,
      onFilter: (value, record) => record.tag.includes(value),
      render: (text, row) => {
        if (editingRow.id === row.id) {
          return <Tags rowData={editingRow} updateTags={setEditingRow} />;
        }
        return text.map((element) => (
          <Tag
            key={element}
            style={{
              userSelect: 'none',
            }}
          >
            {element}
          </Tag>
        ));
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: STATUS_FILTER_OPTIONS,
      filterSearch: true,
      onFilter: (value, record) => record.status.startsWith(value), //status filtering
      render: (text, row) => {
        if (editingRow.id === row.id) {
          return (
            <Select
              defaultValue={text}
              onChange={(selectedValue) =>
                setEditingRow({ ...editingRow, status: selectedValue })
              }
              options={STATUS_OPTIONS}
            />
          );
        }
        return <Tag className={`${row.status} status`}>{text}</Tag>;
      },
    },
    {
      title: 'Options',
      valueType: 'option',
      dataIndex: 'id',
      render: (text, row, index, action) => {
        //EDIT,DELTE,SAVE,CANCEL buttons
        if (editingRow.id === row.id) {
          return [
            <Button
              loading={loading.id === row.id}
              type="primary"
              onClick={
                'newTask' in editingRow
                  ? () =>
                      postNewTask(
                        editingRow,
                        data,
                        setEditingRow,
                        setData,
                        setLoading
                      )
                  : () => {
                      updateTask(
                        editingRow,
                        index,
                        data,
                        setEditingRow,
                        setData,
                        setLoading
                      );
                    }
              }
            >
              Save
            </Button>,
            <Button
              danger
              onClick={
                'newTask' in editingRow
                  ? () => wipeNewlyCreatedTask()
                  : () => setEditingRow({})
              }
            >
              Cancel
            </Button>,
          ];
        } else {
          return [
            <Button
              type="primary"
              onClick={() => {
                setEditingRow(row);
              }}
            >
              Edit
            </Button>,
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() =>
                deleteTask(row, index, data, setData, setEditingRow, setLoading)
              }
              okText="Yes"
              cancelText="No"
            >
              <Button loading={loading.id === row.id} danger>
                Delete
              </Button>
            </Popconfirm>,
          ];
        }
      },
    },
  ];

  return (
    <>
      <Title level={2} style={{ textAlign: 'center' }}>
        TODO APP
      </Title>
      <ProTable
        size="small"
        columns={columns}
        loading={fetchLoading}
        dataSource={handleSearch(data)}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Input
            placeholder="Search here..."
            style={{
              width: 200,
            }}
            onChange={(e) => setQuery(e.target.value)}
          />,
          <Button onClick={() => handleAdd()} type="primary">
            Add new task
          </Button>,
        ]}
        pagination={{
          pageSize: 15,
          showSizeChanger: false,
          showTotal: false,
        }}
      />
    </>
  );
};

export default App;
