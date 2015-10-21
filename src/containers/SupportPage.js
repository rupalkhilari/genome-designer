import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

//alternative syntax for simple, stateless components... until we need this page to do more
let SupportPage = (props) => {
  return (
    <div>
      <h1>Support Page</h1>
    </div>
  );
};

export default connect()(SupportPage);
