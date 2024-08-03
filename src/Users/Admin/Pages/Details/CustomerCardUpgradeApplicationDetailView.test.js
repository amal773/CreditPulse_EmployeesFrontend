// CustomerCardUpgradeApplicationDetailView.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import CustomerCardUpgradeApplicationDetailView from './CustomerCardUpgradeApplicationDetailView';
import DetailView from '../../Components/DetailView/DetailView';

jest.mock('../../Components/DetailView/DetailView', () => jest.fn(() => <div>DetailView Component</div>));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}));

describe('CustomerCardUpgradeApplicationDetailView Component', () => {
  const mockCustomer = {
    customerId: '123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobileNumber: '1234567890',
    aadhaarNumber: '123412341234',
    panId: 'ABCDE1234F',
    address: '123 Main St',
    dob: '1990-01-01',
    employmentYears: 5,
    isPresentlyEmployed: true,
    companyName: 'ABC Corp',
    annualIncome: '1000000',
    incomeProofFilePath: 'income-proof.pdf'
  };

  beforeEach(() => {
    useLocation.mockReturnValue({
      state: { customer: mockCustomer }
    });
  });

  test('renders correctly with customer details and download files', () => {
    render(
      <MemoryRouter>
        <CustomerCardUpgradeApplicationDetailView />
      </MemoryRouter>
    );

    expect(DetailView).toHaveBeenCalledWith(
      expect.objectContaining({
        activeItem: 'All Pending Customer Upgrade Applications',
        details: mockCustomer,
        detailFields: expect.arrayContaining([
          { label: 'Customer ID', key: 'customerId' },
          { label: 'Name', key: 'name' },
          { label: 'Email', key: 'email' },
          { label: 'Mobile Number', key: 'mobileNumber' },
          { label: 'Aadhaar Number', key: 'aadhaarNumber' },
          { label: 'PAN ID', key: 'panId' },
          { label: 'Address', key: 'address' },
          { label: 'Date of Birth', key: 'dob', format: expect.any(Function) },
          { label: 'Employment Years', key: 'employmentYears' },
          { label: 'Is Presently Employed', key: 'isPresentlyEmployed', format: expect.any(Function) },
          { label: 'Company Name', key: 'companyName' },
          { label: 'Annual Income', key: 'annualIncome' }
        ]),
        downloadFiles: expect.arrayContaining([
          { label: 'Download Employment Proof', key: 'incomeProofFilePath' }
        ])
      }),
      {}
    );
  });

  test('renders correctly without customer details', () => {
    useLocation.mockReturnValue({
      state: {}
    });

    render(
      <MemoryRouter>
        <CustomerCardUpgradeApplicationDetailView />
      </MemoryRouter>
    );

    expect(DetailView).toHaveBeenCalledWith(
      expect.objectContaining({
        activeItem: 'All Pending Customer Upgrade Applications',
        details: undefined,
        detailFields: expect.any(Array),
        downloadFiles: expect.any(Array)
      }),
      {}
    );
  });

  test('date formatting function works correctly', () => {
    useLocation.mockReturnValue({
      state: { customer: mockCustomer }
    });
    render(
      <MemoryRouter>
        <CustomerCardUpgradeApplicationDetailView />
      </MemoryRouter>
    );

    const { detailFields } = DetailView.mock.calls[0][0];
    const dobField = detailFields.find(field => field.key === 'dob');
    const formattedDate = dobField.format('1990-01-01');
    expect(formattedDate).toBe(new Date('1990-01-01').toLocaleDateString());
  });

  test('employment status formatting function works correctly', () => {
    useLocation.mockReturnValue({
      state: { customer: mockCustomer }
    });
    render(
      <MemoryRouter>
        <CustomerCardUpgradeApplicationDetailView />
      </MemoryRouter>
    );

    const { detailFields } = DetailView.mock.calls[0][0];
    const employmentField = detailFields.find(field => field.key === 'isPresentlyEmployed');
    expect(employmentField.format(true)).toBe('Yes');
    expect(employmentField.format(false)).toBe('No');
  });
});
