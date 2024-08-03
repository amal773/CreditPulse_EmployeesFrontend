import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Grievances from './Grievances';
import { resolveCustomerGrievance, resolveGuestGrievance, getCustomerGrievancesPending, getGuestGrievancesPending } from '../Utils/SchduleService';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../Utils/SchduleService');

describe('Grievances Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Grievances component and fetches pending grievances', async () => {
    getCustomerGrievancesPending.mockResolvedValue({ data: [] });
    getGuestGrievancesPending.mockResolvedValue({ data: [] });

    render(
      <Router>
        <Grievances />
      </Router>
    );

    expect(screen.getByText('Pending Grievances')).toBeInTheDocument();

    await waitFor(() => {
      expect(getCustomerGrievancesPending).toHaveBeenCalledTimes(1);
      expect(getGuestGrievancesPending).toHaveBeenCalledTimes(1);
    });
  });

  test('displays fetched grievances', async () => {
    const customerGrievances = [
      {
        grievanceId: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '1234567890',
        userType: 'Customer',
        timestamp: '2024-06-26 10:00:00',
        subject: 'Account Issue',
        status: 'PENDING',
      },
    ];
    const guestGrievances = [
      {
        grievanceId: 2,
        guestName: 'Jane Doe',
        guestEmail: 'jane@example.com',
        guestPhone: '0987654321',
        userType: 'Guest',
        timestamp: '2024-06-26 11:00:00',
        subject: 'Booking Issue',
        status: 'PENDING',
      },
    ];

    getCustomerGrievancesPending.mockResolvedValue({ data: customerGrievances });
    getGuestGrievancesPending.mockResolvedValue({ data: guestGrievances });

    render(
      <Router>
        <Grievances />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  // test('opens modal with correct grievance details', async () => {
  //   const grievances = [
  //     {
  //       grievanceId: 1,
  //       customerName: 'John Doe',
  //       customerEmail: 'john@example.com',
  //       customerPhone: '1234567890',
  //       userType: 'Customer',
  //       timestamp: '2024-06-26 10:00:00',
  //       subject: 'Account Issue',
  //       status: 'PENDING',
  //     },
  //   ];

  //   getCustomerGrievancesPending.mockResolvedValue({ data: grievances });
  //   getGuestGrievancesPending.mockResolvedValue({ data: [] });

  //   render(
  //     <Router>
  //       <Grievances />
  //     </Router>
  //   );

  //   await waitFor(() => {
  //     fireEvent.click(screen.getByText('View'));
  //   });

  //   // expect(screen.getByText('Grievance Detail')).toBeInTheDocument();
  //   expect(screen.getByText('Account Issue')).toBeInTheDocument();
  // });

  test('resolves grievance and updates status', async () => {
    const grievances = [
      {
        grievanceId: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '1234567890',
        userType: 'Customer',
        timestamp: '2024-06-26 10:00:00',
        subject: 'Account Issue',
        status: 'PENDING',
      },
    ];

    getCustomerGrievancesPending.mockResolvedValue({ data: grievances });
    getGuestGrievancesPending.mockResolvedValue({ data: [] });
    resolveCustomerGrievance.mockResolvedValue({});

    render(
      <Router>
        <Grievances />
      </Router>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('View'));
    });

    fireEvent.change(screen.getByPlaceholderText('Add your message here'), { target: { value: 'Resolved issue' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(resolveCustomerGrievance).toHaveBeenCalledWith(1, 'Resolved issue');
      expect(screen.getByText('RESOLVED')).toBeInTheDocument();
    });
  });

  test('pagination works correctly', async () => {
    const grievances = Array.from({ length: 20 }, (_, i) => ({
      grievanceId: i + 1,
      customerName: `Customer ${i + 1}`,
      customerEmail: `customer${i + 1}@example.com`,
      customerPhone: `123456789${i}`,
      userType: 'Customer',
      timestamp: `2024-06-26 10:00:00`,
      subject: 'Account Issue',
      status: 'PENDING',
    }));

    getCustomerGrievancesPending.mockResolvedValue({ data: grievances });
    getGuestGrievancesPending.mockResolvedValue({ data: [] });

    render(
      <Router>
        <Grievances />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Customer 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('2'));

    await waitFor(() => {
      expect(screen.getByText('Customer 9')).toBeInTheDocument();
    });
  });
});
