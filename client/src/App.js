import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    );

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    // FETCH ALL THE PLANS FIRST

    // const result = await axios({
    //   url: 'https://api.zervise.com/payment/subscription',
    //   method: 'POST',
    //   data: {
    //     planId: 'plan_HKUrjjRFDJ9b1r',
    //     totalCount: 24, // how many times the client will be charged
    //     quantity: 10, // total_amount = base_amount_in_plan * quantity
    //     // renewing: true,
    //   },
    //   headers: {
    //     'auth-token':
    //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb24iOnsiaWQiOiI2MDk5NTk0YmMwODdjNmMxMjliZWQ0NzQiLCJjbGllbnRJZCI6IjYwOTk1Y2JkZmU2NmFkNTBiNzZkNWNhOCIsInJvbGUiOiJvd25lciJ9LCJpYXQiOjE2MjM2ODUwMDcsImV4cCI6MTYyNDU0OTAwN30.Oyabi1BDVrg8COrD8AuW7yWg5gYn1zipfvAkR-dAfz4',
    //   },
    // });
    const result = await axios({
      url: 'http://localhost:7001/payment/subscription',
      method: 'POST',
      data: {
        planId: 'plan_HKUrjjRFDJ9b1r',
        totalCount: 24, // how many times the client will be charged
        quantity: 10, // total_amount = base_amount_in_plan * quantity
        // renewing: true,
      },
      headers: {
        'auth-token':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb24iOnsiaWQiOiI2MDdhOWRiYjE3NTY2MDE4ZWM1YzZmNDkiLCJjbGllbnRJZCI6IjYwN2E5ZGI4MTc1NjYwMThlYzVjNmYzYiIsInJvbGUiOiJvd25lciJ9LCJpYXQiOjE2MjQwMzE0MDUsImV4cCI6MTYyNDg5NTQwNX0.rpD2xz99wdLjmADxFV1S3i2NGBY_fT8MrPoV9tWI1Ow',
      },
    });

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }
    console.log('1st step', result.data);

    const {
      subscription: { id: subscriptionId },
      clientId,
    } = result.data;

    const options = {
      key: 'rzp_test_s05xmzqXYuRglI', // Enter the Key ID generated from the Dashboard
      subscription_id: subscriptionId,
      name: 'Soumya Corp.',
      description: 'Test Transaction',
      image: { logo },
      handler: async function (response) {
        console.log('response from razorpay', response);
        const data = {
          clientId,
          razorpayPaymentId: response.razorpay_payment_id,
          subscriptionId: response.razorpay_subscription_id,
          razorpaySignature: response.razorpay_signature,
        };

        // const result = await axios({
        //   url: 'https://api.zervise.com/payment/success',
        //   method: 'POST',
        //   data,
        //   headers: {
        //     'auth-token':
        //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb24iOnsiaWQiOiI2MDk5NTk0YmMwODdjNmMxMjliZWQ0NzQiLCJjbGllbnRJZCI6IjYwOTk1Y2JkZmU2NmFkNTBiNzZkNWNhOCIsInJvbGUiOiJvd25lciJ9LCJpYXQiOjE2MjM2ODUwMDcsImV4cCI6MTYyNDU0OTAwN30.Oyabi1BDVrg8COrD8AuW7yWg5gYn1zipfvAkR-dAfz4',
        //   },
        // });
        const result = await axios({
          url: 'http://localhost:7001/payment/success',
          method: 'POST',
          data,
          headers: {
            'auth-token':
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb24iOnsiaWQiOiI2MDdhOWRiYjE3NTY2MDE4ZWM1YzZmNDkiLCJjbGllbnRJZCI6IjYwN2E5ZGI4MTc1NjYwMThlYzVjNmYzYiIsInJvbGUiOiJvd25lciJ9LCJpYXQiOjE2MjQwMzE0MDUsImV4cCI6MTYyNDg5NTQwNX0.rpD2xz99wdLjmADxFV1S3i2NGBY_fT8MrPoV9tWI1Ow',
          },
        });
        console.log('2nd step', result.data);

        alert(result.data.msg);
      },
      prefill: {
        name: 'Soumya Dey',
        email: 'SoumyaDey@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Soumya Dey',
      },
      theme: {
        color: '#61dafb',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  async function updateSubscription() {
    const result = await axios({
      url: 'http://localhost:7001/payment/subscription',
      method: 'PATCH',
      data: {
        updateAtCycleEnd: false,
        planId: 'plan_HKUrjjRFDJ9b1r',
        // remainingCount: 3, // how many times the client will be charged
        quantity: 4, // total_amount = base_amount_in_plan * quantity
      },
      headers: {
        'auth-token':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb24iOnsiaWQiOiI2MDdhOWRiYjE3NTY2MDE4ZWM1YzZmNDkiLCJjbGllbnRJZCI6IjYwN2E5ZGI4MTc1NjYwMThlYzVjNmYzYiIsInJvbGUiOiJvd25lciJ9LCJpYXQiOjE2MjQwMzE0MDUsImV4cCI6MTYyNDg5NTQwNX0.rpD2xz99wdLjmADxFV1S3i2NGBY_fT8MrPoV9tWI1Ow',
      },
    });
    // const result = await axios.post(
    //   `http://localhost:7001/payment/subscription/update/607a9db817566018ec5c6f3b`,
    //   {
    //     updateAtCycleEnd: false,
    //     planId: 'plan_GhhaCLOaRbbcEQ',
    //     remainingCount: 3, // how many times the client will be charged
    //     quantity: 5, // total_amount = base_amount_in_plan * quantity
    //   }
    // );

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }
    console.log('1st step', result.data);
  }

  async function cancelSubscription() {
    const result = await axios({
      url: 'http://localhost:7001/payment/subscription',
      method: 'DELETE',
      data: {
        cancelAtCycleEnd: false,
      },
      headers: {
        'auth-token':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJzb24iOnsiaWQiOiI2MDdhOWRiYjE3NTY2MDE4ZWM1YzZmNDkiLCJjbGllbnRJZCI6IjYwN2E5ZGI4MTc1NjYwMThlYzVjNmYzYiIsInJvbGUiOiJvd25lciJ9LCJpYXQiOjE2MjQwMzE0MDUsImV4cCI6MTYyNDg5NTQwNX0.rpD2xz99wdLjmADxFV1S3i2NGBY_fT8MrPoV9tWI1Ow',
      },
    });
    // const result = await axios.post(
    //   `http://localhost:7001/payment/subscription/cancel/607a9db817566018ec5c6f3b`,
    //   {
    //     cancelAtCycleEnd: false,
    //   }
    // );

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }
    console.log('1st step', result.data);
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Buy React now!</p>
        <button className='App-link' onClick={displayRazorpay}>
          Subscribe
        </button>

        <button className='App-link' onClick={updateSubscription}>
          Update Subscription
        </button>

        <button className='App-link' onClick={cancelSubscription}>
          Cancel Subscription
        </button>
      </header>
    </div>
  );
}

export default App;
