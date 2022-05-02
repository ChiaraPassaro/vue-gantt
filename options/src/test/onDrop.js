const LexoRank = require("@kayron013/lexorank/lib/index.js");
console.log(LexoRank.default.from('0|aaa'));
// Mock data
const Tasks = {
  'a': {
    name: 'Name Group',
    groupCode: 'a',
    bucket: 0,
    tasks: [
      {
        id: 1,
        bucket: 0,
        groupCode: 'a',
        rank: new LexoRank.default('aaa', '0').toString(),
        startDate: '2022-02-01',
        endDate: '2022-02-16',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 1',
      },
      {
        id: 2,
        bucket: 0,
        groupCode: 'a',
        rank: new LexoRank.default('aab', '0').toString(),
        startDate: '2022-02-16',
        endDate: '2022-02-18',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 2'
      },
      {
        id: 3,
        bucket: 0,
        groupCode: 'a',
        rank: new LexoRank.default('aac', '0').toString(),
        startDate: '2022-02-20',
        endDate: '2022-02-22',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 3'
      },
      {
        id: 4,
        bucket: 0,
        groupCode: 'a',
        rank: new LexoRank.default('aad', '0').toString(),
        startDate: '2022-02-25',
        endDate: '2022-02-26',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 4'
      },
      {
        id: 5,
        bucket: 0,
        groupCode: 'a',
        rank: new LexoRank.default('aaf', '0').toString(),
        startDate: '2022-02-26',
        endDate: '2022-02-28',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 5'
      },
    ]
  },
  'b': {
    name: 'Name Group 2',
    groupCode: 'b',
    bucket: 0,
    tasks: [
      {
        id: 6,
        bucket: 0,
        groupCode: 'b',
        rank: new LexoRank.default('baa', '0').toString(),
        startDate: '2022-02-01',
        endDate: '2022-02-16',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 1',
      },
      {
        id: 7,
        bucket: 0,
        groupCode: 'b',
        rank: new LexoRank.default('bab', '0').toString(),
        startDate: '2022-02-16',
        endDate: '2022-02-18',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 2'
      },
      {
        id: 8,
        bucket: 0,
        groupCode: 'b',
        rank: new LexoRank.default('bac', '0').toString(),
        startDate: '2022-02-20',
        endDate: '2022-02-22',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 3'
      },
      {
        id: 9,
        bucket: 0,
        groupCode: 'b',
        rank: new LexoRank.default('bad', '0').toString(),
        startDate: '2022-02-25',
        endDate: '2022-02-26',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 4'
      },
      {
        id: 10,
        bucket: 0,
        groupCode: 'b',
        rank: new LexoRank.default('baf', '0').toString(),
        startDate: '2022-02-26',
        endDate: '2022-02-28',
        days: 0,
        offset: 0,
        width: 0,
        marginLeft: 0,
        name: 'Lorem Ipsum 5'
      },
    ]
  },
};

function onDrop(e, dropIndex, dropRank, vs) {
  let itemIndex = e.itemIndex;
  let itemRank = LexoRank.default.from(e.itemRank);
  let itemRankValue = itemRank.value;
  let itemGroupLetter = itemRankValue[0];

  dropRank = LexoRank.default.from(dropRank);
  let dropBucket = dropRank.bucket;
  let dropRankValue = dropRank.value;
  let dropGroupLetter = dropRankValue[0];

  let rank = null;
  let newIndex = 0;

  let sameIndexDifferentGroupToNextLast = dropIndex === itemIndex && dropGroupLetter !== itemGroupLetter && vs == 'next' && dropIndex === Tasks[dropGroupLetter].tasks.length - 1;
  let firstToNextNotLast = dropIndex === 0 && vs === 'next' && dropIndex !== Tasks[dropGroupLetter].tasks.length - 1;
  let toFirstPrev = dropIndex === 0 && vs === 'prev';
  let toLast = dropIndex === Tasks[dropGroupLetter].tasks.length - 1;
  let next = vs === 'next';

  if (toLast) {
    console.log('last');
    rank = LexoRank.default.from(Tasks[dropGroupLetter].tasks[dropIndex].rank).increment();
    newIndex = dropIndex + 1;
  } else if (firstToNextNotLast) {
    console.log('firstToNextNotLast');
    rank = LexoRank.default.between(Tasks[dropGroupLetter].tasks[dropIndex].rank, Tasks[dropGroupLetter].tasks[dropIndex + 1].rank);
    newIndex = 1;
  } else if (toFirstPrev) {
    console.log('toFirstPrev')
    rank = LexoRank.default.between(LexoRank.default.from(Tasks[dropGroupLetter].tasks[dropIndex].rank).decrement(), LexoRank.default.from(Tasks[dropGroupLetter].tasks[dropIndex].rank));
    newIndex = 0;
  } else if (next) {
    console.log('next')
    rank = LexoRank.default.between(Tasks[dropGroupLetter].tasks[dropIndex].rank, Tasks[dropGroupLetter].tasks[dropIndex + 1].rank);
    newIndex = dropIndex + 1;
  }

  if (rank) {
    newIndex = (dropGroupLetter === itemGroupLetter && itemIndex < newIndex) ? newIndex - 1 : newIndex;
    let task = Tasks[itemGroupLetter].tasks.splice(itemIndex, 1)[0];
    task.bucket = dropBucket;
    task.groupCode = dropGroupLetter;
    task.rank = rank.toString();
    Tasks[task.groupCode].tasks.splice(newIndex, 0, task);
    return task.rank
  }

}

module.exports = onDrop;