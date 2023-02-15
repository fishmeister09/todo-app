export const STATUS_OPTIONS = [
  {
    value: 'OPEN',
    label: 'OPEN',
  },
  {
    value: 'WORKING',
    label: 'WORKING',
  },
  {
    value: 'OVERDUE',
    label: 'OVERDUE',
  },
  {
    value: 'DONE',
    label: 'DONE',
  },
];
export const STATUS_FILTER_OPTIONS = [
  {
    value: 'OPEN',
    text: 'OPEN',
  },
  {
    value: 'WORKING',
    text: 'WORKING',
  },
  {
    value: 'OVERDUE',
    text: 'OVERDUE',
  },
  {
    value: 'DONE',
    text: 'DONE',
  },
];

export const filterDate = (date) => {
  let formattedDate = `${date.getFullYear()}/
  ${date.getMonth() + 1}/${date.getDate()}`;

  return formattedDate;
};
export const sortDate = (a, b) => {
  return a < b ? -1 : a > b ? 1 : 0;
};
export const getTagsAvailable = (data) => {
  let tags = [];
  data.forEach((item) =>
    item.tag.forEach((t) =>
      tags.push({
        value: t,
        text: t,
      })
    )
  );

  return tags;
};
