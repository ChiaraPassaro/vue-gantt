const onDrop = require('./onDrop');

// test('element 0 to element 0 prev', () => {
//   expect(onDrop({itemIndex: 0, itemRank: '0|aaa'}, 0, '0|baa', 'prev')).toBe('0|ba91');
// });

// test('element 0 to element last next', () => {
//   expect(onDrop({itemIndex: 0, itemRank: '0|aaa'}, 4, '0|baf', 'next')).toBe('0|bag');
// })

// test('same index different group', () => {
//   expect(onDrop({itemIndex: 1, itemRank: '0|aab'}, 1, '0|bab', 'next')).toBe('0|bab1');
// });


// test(' different group', () => {
//   expect(onDrop({itemIndex: 2, itemRank: '0|aac'}, 1, '0|bab', 'next')).toBe('0|bab1');
// });


// test('last to first same group', () => {
//   expect(onDrop({itemIndex: 4, itemRank: '0|baf'}, 0, '0|baa', 'prev')).toBe('0|ba91');
// });

// test('last to first other group', () => {
//   expect(onDrop({itemIndex: 4, itemRank: '0|baf'}, 0, '0|aaa', 'prev')).toBe('0|aa91');
// });