import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { uiShowAbout } from '../actions/ui';
import ModalWindow from './modal/modalwindow';

import '../../src/styles/form.css';
import '../..//src/styles/aboutform.css';

class AboutForm extends Component {

  static propTypes = {
    uiShowAbout: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  render() {
    // no render when not open
    if (!this.props.open) {
      return null;
    }

    return (<ModalWindow
      open={this.props.open}
      title="Genome Designer"
      closeOnClickOutside
      closeModal={(buttonText) => {
        this.props.uiShowAbout(false);
      }}
      payload={
          <div className="gd-form aboutform">
            <div className="title">Genome Designer</div>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pharetra dictum dui nec facilisis. Aenean posuere lobortis semper. Donec lobortis nisi ac neque pellentesque vulputate. Nunc laoreet tortor eros, sed venenatis lacus egestas et. Nulla vitae hendrerit urna, dictum lacinia quam. Duis quis velit vel ex tincidunt commodo sit amet ac tellus. Nulla condimentum ligula elit, vel volutpat orci consectetur eu. Praesent nec diam id sem iaculis volutpat ut ac diam. Pellentesque vitae tellus vel erat tempus lobortis et elementum erat. Etiam interdum rutrum quam, vitae rutrum mi aliquet sit amet. Praesent a orci sit amet odio blandit aliquam sed eu odio. Duis nisl sapien, aliquet eget aliquet ac, eleifend eget sem.
            </p>
            <br/>
            <button
              type="submit"
              onClick={() => {
                this.props.uiShowAbout(false);
              }}>Close
            </button>
          </div>}
    />);
  }
}

function mapStateToProps(state) {
  return {
    open: state.ui.showAbout,
  };
}

export default connect(mapStateToProps, {
  uiShowAbout,
})(AboutForm);
