import React, { Component } from "react";
import {
  Form,
  Segment,
  Divider,
  Dimmer,
  Loader,
  Table
} from "semantic-ui-react";
import { fetchAPI } from "../utility";

class ListUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      branchId: "",
      roleId: "",
      dimmerActive: false,
      branchOptions: [],
      customerRoles: [],
      userList: [],
      userListFiltered: []
    };
    this.filterByFirstName = this.filterByFirstName.bind(this);
    this.filterByLastName = this.filterByLastName.bind(this);
    this.filterByEmail = this.filterByEmail.bind(this);
    this.filterByRole = this.filterByRole.bind(this);
    this.filterByBranch = this.filterByBranch.bind(this);
  }

  componentDidMount() {
    this.fetchCustRoles();
    this.fetchBranchNames();
    this.fetchUserList();
  }

  async fetchCustRoles() {
    try {
      const res = await fetchAPI("/cust/get_customer_roles", {});
      const data = await res.json();
      const customerRoles = data.customerRoles.map(role => ({
        key: role.customer_role_id,
        value: role.customer_role_id,
        text: role.customer_role_name
      }));
      this.setState({ customerRoles });
    } catch (err) {
      console.error(err);
    }
  }

  async fetchBranchNames() {
    try {
      const res = await fetchAPI("/branch/get_branch_names", {});
      const data = await res.json();
      const branchOptions = data.branchNames.map(branch => ({
        key: branch.id,
        text: branch.name,
        value: branch.id
      }));
      this.setState({ branchOptions });
    } catch (err) {
      console.error(err);
    }
  }

  async fetchUserList() {
    this.setState({ dimmerActive: true });
    try {
      const res = await fetchAPI("/user/get_user_list", {});
      const data = await res.json();
      this.setState({
        userList: data.userList,
        userListFiltered: data.userList,
        dimmerActive: false
      });
    } catch (err) {
      console.error(err);
    }
  }

  filterByFirstName(e) {
    const firstName = e.target.value;
    this.setState({ firstName });
    this.filterUserList("firstName", firstName);
  }

  filterByLastName(e) {
    const lastName = e.target.value;
    this.setState({ lastName });
    this.filterUserList("lastName", lastName);
  }

  filterByEmail(e) {
    const email = e.target.value;
    this.setState({ email });
    this.filterUserList("email", email);
  }

  filterByRole(e, data) {
    const roleId = data.value;
    this.setState({ roleId });
    this.filterUserList("role", roleId);
  }

  filterByBranch(e, data) {
    const branchId = data.value;
    this.setState({ branchId });
    this.filterUserList("branch", branchId);
  }

  filterUserList(field, value) {
    let userListFiltered = [...this.state.userList];
    if (field === "firstName") {
      userListFiltered = userListFiltered.filter(user =>
        user.first_name.includes(value)
      );
    }
    if (field === "lastName") {
      userListFiltered = userListFiltered.filter(user =>
        user.last_name.includes(value)
      );
    }
    if (field === "email") {
      userListFiltered = userListFiltered.filter(user =>
        user.email_address.includes(value)
      );
    }
    if (field === "role") {
      userListFiltered = userListFiltered.filter(
        user => user.role_id === value
      );
    }
    if (field === "branch") {
      userListFiltered = userListFiltered.filter(
        user => user.branch_id === value
      );
    }
    this.setState({ userListFiltered });
  }

  render() {
    const { dimmerActive } = this.state;

    return (
      <div style={{ minHeight: "100vh" }}>
        <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
          <Dimmer active={dimmerActive} inverted>
            <Loader>Fetching Data</Loader>
          </Dimmer>
          <h1>Users List</h1>

          <Segment color="green">
            <Form>
              <Form.Group>
                <Form.Input
                  label="First Name"
                  placeholder={"First Name"}
                  value={this.state.firstName}
                  onChange={this.filterByFirstName}
                />
                <Form.Input
                  label="Last Name"
                  placeholder={"Last Name"}
                  value={this.state.lastName}
                  onChange={this.filterByLastName}
                />
                <Form.Input
                  label="Email"
                  placeholder={"Email"}
                  value={this.state.email}
                  onChange={this.filterByEmail}
                />
                <Form.Select
                  onChange={this.filterByRole}
                  value={this.state.roleId}
                  size="small"
                  label="Role"
                  placeholder="Select Role"
                  name="role"
                  options={this.state.customerRoles}
                />
                <Form.Select
                  onChange={this.filterByBranch}
                  value={this.state.branchId}
                  name="branch"
                  size="small"
                  label="Branch"
                  placeholder="Select Branch"
                  options={this.state.branchOptions}
                />
              </Form.Group>
            </Form>
            <Divider />
            <Table striped color="blue">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>First Name</Table.HeaderCell>
                  <Table.HeaderCell>Last Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Role</Table.HeaderCell>
                  <Table.HeaderCell>Branch</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.userListFiltered.map(user => (
                  <Table.Row>
                    <Table.Cell>{user.first_name}</Table.Cell>
                    <Table.Cell>{user.last_name}</Table.Cell>
                    <Table.Cell>{user.email_address}</Table.Cell>
                    <Table.Cell>
                      {
                        this.state.customerRoles.filter(
                          role => role.value === user.role_id
                        )[0].text
                      }
                    </Table.Cell>
                    <Table.Cell>
                      {
                        this.state.branchOptions.filter(
                          branch => branch.value === user.branch_id
                        )[0].text
                      }
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Segment>
        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default ListUsers;
