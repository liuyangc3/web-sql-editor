import React from 'react';
import { storiesOf } from '@storybook/react';

import List from './list';

const databases = [
  { name: "usercenter", subs: ["table1", "table2"] },
  { name: "centerpark", subs: ["testtable1", "testtable2"] },
];

storiesOf('Test', module)
  .add('二级菜单', () => <List databases={databases} />
  );
