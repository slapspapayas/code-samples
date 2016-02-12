/*
  Assume listeners for data state updates happen at the top of
  the tree. By the time this component is reached it's all props.
*/

import React from 'react';
import { ChainsService, TriggersService } from 'data/DataService';

// Related to electron: http://electron.atom.io/docs/v0.36.7/api/dialog/#dialog
import dialog from 'dialog';

export let ChainTab = React.createClass({
  propTypes: {
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    isActive: React.PropTypes.bool,
    eventChain: React.PropTypes.object,
    activeTrigger: React.PropTypes.object
  },

  setActiveTab() {
    if (!this.props.isActive) {
      ChainsService.setActiveEventChain(this.props.eventChain);
    }
  },

  removeChainTab() {
    let { activeTrigger } = this.props;
    let chains = TriggersService.getTriggerChains(activeTrigger);

    // Alert user if deletion is invalid and return
    if (chains.length < 2) {
      let message = 'Cannot delete last chain!';
      let buttons = ['Ok'];
      dialog.showMessageBox({ message, buttons });
      return;
    }

    // Safe to delete
    ChainsService.deleteChain(this.props.eventChain, activeTrigger, chains);
  },

  renderRemoveButton() {
    if (!this.props.isActive) {
      return null;
    }

    return (
      <span
        className="button icon icon-remove"
        onClick={this.removeChainTab}
      />
    );
  },

  render() {
    let activeClass = this.props.isActive ? 'active' : '';

    return (
      <li
        key={this.props.id}
        className={`chain-tab ${activeClass}`}
        onClick={this.setActiveTab}
      >
        <span className="chain-tab-content">
          <span className="chain-tab-name">{this.props.name}</span>
          {this.renderRemoveButton()}
        </span>
      </li>
    );
  }
});
