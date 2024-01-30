import React, { useState, useEffect } from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem } from '@mui/material';
import './CustomerForm.css';

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    city: 'Select City',
    gender: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const storedCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    setCustomers(storedCustomers);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleRadioButtonChange = (event) => {
    setFormData({
      ...formData,
      gender: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.gender) {
      alert("Please select either Male or Female.");
      return;
    }

    // Check if the employee ID already exists
    const isEmployeeIdExists = customers.some(
      (customer) => customer.employeeId === formData.employeeId
    );

    if (isEmployeeIdExists) {
      alert("Employee ID must be unique. Please enter a different Employee ID.");
      return;
    }

    if (isEditMode) {
      // Update existing customer data
      const updatedCustomers = customers.map((customer) =>
        customer.name === formData.name ? formData : customer
      );
      setCustomers(updatedCustomers);
    } else {
      // Add new customer data
      setCustomers([...customers, formData]);
    }

    // Save data to local storage
    localStorage.setItem('customers', JSON.stringify(customers));

    // Reset the form
    setFormData({
      name: '',
      employeeId: '',
      city: 'Select City',
      gender: '',
    });
    setIsEditMode(false);
  };

  const handleEditClick = (name) => {
    // Set form data for editing
    const customerToEdit = customers.find((customer) => customer.name === name);
    setFormData(customerToEdit);
    setIsEditMode(true);
  };

  return (
    <div className="customer-form-container">
      <h2>Customer Information Form:</h2>
      <form onSubmit={handleSubmit} className="customer-form">
        <TextField
          style={{ marginBottom: "20px" }}
          label="Name"
          variant="outlined"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
        <TextField
          style={{ marginBottom: "20px" }}
          label="Employee ID"
          variant="outlined"
          type="number"
          value={formData.employeeId}
          onChange={(e) => handleInputChange('employeeId', e.target.value)}
          required
        />
        <FormControl variant="outlined" required style={{ marginBottom: "20px" }}>
          <FormLabel>City:</FormLabel>
          <Select
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          >
            <MenuItem value="Select City" disabled>Select City</MenuItem>
            <MenuItem value="New York">New York</MenuItem>
            <MenuItem value="London">London</MenuItem>
            <MenuItem value="Tokyo">Tokyo</MenuItem>
          </Select>
        </FormControl>
        <FormControl component="fieldset" required style={{ marginBottom: "20px" }}>
          <FormLabel component="legend">Gender:</FormLabel>
          <RadioGroup
            style={{ alignSelf: "center" }}
            row
            aria-label="gender"
            name="gender"
            value={formData.gender}
            onChange={handleRadioButtonChange}
            required
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
          </RadioGroup>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          {isEditMode ? 'Update' : 'Save'}
        </Button>
      </form>

      <div className="customer-list-container">
        <h2>Customer List:</h2>
        <ul className="customer-list">
          {customers.map((customer) => (
            <li key={customer.name} className="customer-item">
              <span>Entered Name: {customer.name}</span>|
              <span>Employee ID: {customer.employeeId}</span>|
              <span>City: {customer.city}</span>|
              <span>Gender: {customer.gender}</span>
              <Button variant="outlined" onClick={() => handleEditClick(customer.name)}>Edit</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomerForm;

