import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  handleApiError, newApiLikeError, fetchSubnetsForPort, fetchSecurityGroupsForSubnet,
  fetchSecurityGroupsForRouter, fetchSecurityGroupsForPort
} from '../utils/api.js'
import NuagePortSecurityGroupsForm from "./forms/nuage-port-security-groups-form";

class AssignNuageSecurityGroupsForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleFormStateUpdate = this.handleFormStateUpdate.bind(this);
    this.state = {
      loading: true,
      securityGroups: [],
      initialSecurityGroups: []
    }
  }

  securityGroupToSelectOption = securityGroup => { return { value: securityGroup.id, label: securityGroup.name } };

  availableSecurityGroups = portId => new Promise((resolve, reject) => {
    fetchSubnetsForPort(portId).then(subnets => {
      if(subnets.subcount !== 1) {
        reject(newApiLikeError(__('This port is not properly connected')));
      } else {
        let subnet = subnets.resources[0];

        // L2 subnet has security groups assigned to it, but L3 subnet uses router's security groups.
        if (subnet.network_router_id) {
          fetchSecurityGroupsForRouter(subnet.network_router_id).then(groups => resolve(groups.resources), reject);
        } else {
          fetchSecurityGroupsForSubnet(subnet.id).then(groups => resolve(groups.resources), reject);
        }
      }
    }, reject);
  });

  initializeData = (portId) => Promise.all([
    this.availableSecurityGroups(portId),
    fetchSecurityGroupsForPort(portId),
  ]).then(([availableGroups, currentGroups]) => {
    this.setState({
      loading: false,
      securityGroups: availableGroups.map(this.securityGroupToSelectOption),
      initialSecurityGroups: currentGroups.resources.map(g => g.id)
    });
  }, handleApiError(this));

  componentDidMount() {
    this.props.dispatch({
      type: 'FormButtons.init',
      payload: {
        newRecord: false,
        pristine: true,
        addClicked: () => createSubnet(this.state.values, this.state.emsId, this.state.routerRef)
      }
    });
    this.initializeData(ManageIQ.record.recordId);
  }

  handleFormStateUpdate(formState) {
    this.props.dispatch({ type: 'FormButtons.saveable', payload: formState.valid });
    this.props.dispatch({ type: 'FormButtons.pristine', payload: formState.pristine });
    this.setState({ values: formState.values });
  }

  render() {
    if(this.state.error) {
      return <p>{this.state.error}</p>
    }
    return (
      <NuagePortSecurityGroupsForm
        updateFormState={this.handleFormStateUpdate}
        loading={this.state.loading}
        securityGroups={this.state.securityGroups}
        initialValues={ { securityGroups: this.state.initialSecurityGroups } }
      />
    );
  }
}

AssignNuageSecurityGroupsForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(AssignNuageSecurityGroupsForm);
