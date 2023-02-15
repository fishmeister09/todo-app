import { message } from 'antd';

const URL = 'https://63e9d49ee0ac9368d644fa65.mockapi.io/data/data';

export const fetchFunction = async () => {
  let loginData = await fetch(URL, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  console.log(loginData, 'dataa');
  return loginData;
};

export const updateTask = (
  editingRow,
  index,
  data,
  setEditingRow,
  setData,
  setLoading
) => {
  setLoading({ id: editingRow.id });

  fetch(`${URL}/${editingRow.id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(editingRow),
  })
    .then((res) => {
      if (res.ok) {
        let newData = [...data];
        newData[index] = editingRow;
        setData(newData);
        setEditingRow({});
        console.log('updated task with id: ', editingRow.id);
        setLoading({});
        return message.success('Task Updated');
      }
    })

    .catch((error) => {
      setLoading({});
      console.log(error);
    });
};

export const postNewTask = (
  editingRow,
  data,
  setEditingRow,
  setData,
  setLoading
) => {
  if (editingRow.title.length === 0) {
    return message.warning('Title cannot be empty');
  }
  if (editingRow.description.length === 0) {
    return message.warning('Description cannot be empty');
  }
  setLoading({ id: editingRow.id });
  delete editingRow.newTask;
  console.log('editingrowdata', editingRow);
  fetch(`${URL}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(editingRow),
  })
    .then((res) => {
      if (res.ok) {
        let newData = [...data];
        newData.splice(0, 1);
        newData.push(editingRow);
        setData(newData);
        setEditingRow({});
        console.log(data);
        setLoading({});
        console.log('created task with id: ', editingRow.id);
        return message.success('Task Created');
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteTask = (
  row,
  index,
  data,
  setData,
  setEditingRow,
  setLoading
) => {
  setLoading({ id: row.id });
  fetch(`${URL}/${row.id}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (res.ok) {
        console.log('deleted task with id:', row.id);
        let newData = [...data];
        newData.splice(index, 1);
        setData(newData);
        setEditingRow({});
        setLoading({});
        return message.success('Task Deleted');
      }
    })
    .catch((error) => {
      setLoading({});
      console.log(error);
    });
};
