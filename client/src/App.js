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

    const validTill = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ); // calculate the valid till date according to the plan and totalCount

    const result = await axios.post('http://localhost:7001/payment/subscribe', {
      clientId: '601c13682a018714f4d63bdb',
      planId: 'plan_GhhcZUqG3dz49W',
      totalCount: 6, // how many times the client will be charged
      quantity: 2, // total_amount = base_amount_in_plan * quantity
      validTill,
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
      key: 'rzp_test_rUGcQqfD4qZhGp', // Enter the Key ID generated from the Dashboard
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

        const result = await axios.post(
          'http://localhost:7001/payment/success',
          data
        );
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

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Buy React now!</p>
        <button className='App-link' onClick={displayRazorpay}>
          Subscribe
        </button>
      </header>
    </div>
  );
}

export default App;
