export const createSubnet = (values, emsId, routerRef) => API.post(`/api/providers/${emsId}/cloud_subnets`, {
  action: 'create',
  resource: {...values, router_ref: routerRef},
}).then(response => {
  response['results'].forEach(res => window.add_flash(res.message, res.success ? 'success' : 'error'));
});

export const fetchRouter = (routerId) => API.get(`/api/network_routers/${routerId}?attributes=ems_ref,name,ems_id`);

export const fetchSubnetsForPort = (portId) => API.get(`/api/network_ports/${portId}/cloud_subnets?expand=resources&attributes=network_router_id`);

export const fetchSecurityGroupsForSubnet = (subnetId) => API.get(`/api/cloud_subnets/${subnetId}/security_groups?expand=resources&attributes=name`);

export const fetchSecurityGroupsForRouter = (routerId) => API.get(`/api/network_routers/${routerId}/security_groups?expand=resources&attributes=name`);

export const fetchSecurityGroupsForPort = (portId) => API.get(`/api/network_ports/${portId}/security_groups?expand=resources&attributes=name`);

export const handleApiError = (self) => {
  return (err) => {
    let msg = __('Unknown API error');
    if(err.data && err.data.error && err.data.error.message) {
      msg = err.data.error.message
    }
    self.setState({loading: false, error: msg});
  };
};

export const newApiLikeError = (msg) => { return { data: { error: { message: msg } } } };
