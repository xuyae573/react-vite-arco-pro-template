import React from 'react';
import { Grid } from '@arco-design/web-react';
import Overview from './overview';

import Shortcuts from './shortcuts';
import Announcement from './announcement';
import Docs from './docs';
 
import './mock';

const { Row, Col } = Grid;

function Workplace() {
  return (
    <div style={{ width: '100%' }}>
      <Row className="grid-gutter-demo" gutter={24}>
        <Col span={20}>
          <Overview />
          <Shortcuts />
        </Col>
        <Col span={4}>
          <Announcement />
          <Docs />
        </Col>
      </Row>
    </div>
  );
}

export default Workplace;
