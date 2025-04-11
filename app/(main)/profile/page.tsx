const ProfilePage = () => {
  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <section>
        <h2>Personal Information</h2>
        <p>Name: John Doe</p>
        <p>Email: john.doe@example.com</p>
      </section>
      <section>
        <h2>Order History</h2>
        <ul>
          <li>Order #12345 - $50.00</li>
          <li>Order #67890 - $75.00</li>
        </ul>
      </section>
    </div>
  );
};

export default ProfilePage;
