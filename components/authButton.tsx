// pages/connect.js
export default function AuthButton() {
  const handleConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID;
    // You can add additional parameters such as state and redirect_uri if needed.
    window.location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write`;
  };

  return (
    <div>
      <h1>Connect your Stripe account</h1>
      <button onClick={handleConnect}>Connect with Stripe</button>
    </div>
  );
}
