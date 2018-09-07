import React, { Component } from 'react';
import { Form, Field, FormSpy } from 'react-final-form';
import { Form as PfForm, Grid, Button, Col, Row, Spinner } from 'patternfly-react';
import PropTypes from 'prop-types';
import { required } from 'redux-form-validators';

import { FinalFormField, FinalFormTextArea, FinalFormSelect } from '@manageiq/react-ui-components/dist/forms';
import '@manageiq/react-ui-components/dist/forms.css';
import { ip4Validator, netmaskValidator } from '../../utils/validators'

const NuagePortSecurityGroupsForm = ({loading, updateFormState, securityGroups, initialValues}) => {
  if(loading){
    return (
      <Spinner loading size="lg" />
    );
  }

  return (
    <Form
      onSubmit={() => {}} // handled by modal
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <PfForm horizontal>
          <FormSpy onChange={state => updateFormState({ ...state, values: state.values })} />
          <Grid fluid>
            <Row>
              <Col xs={12}>
                <Field
                  name="securityGroups"
                  component={FinalFormSelect}
                  placeholder={__('Select any number of security groups')}
                  options={securityGroups}
                  label={__('Security Groups')}
                  validateOnMount={false}
                  labelColumnSize={3}
                  inputColumnSize={8}
                  multi
                />
              </Col>
              <hr />
            </Row>
          </Grid>
        </PfForm>
      )}
    />
  );
};

NuagePortSecurityGroupsForm.propTypes = {
  updateFormState: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

NuagePortSecurityGroupsForm.defaultProps = {
  loading: false,
};

export default NuagePortSecurityGroupsForm;
