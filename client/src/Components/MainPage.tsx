const MainPage = () => {
  return (
    <div className="fundraisers-list">
      <h1>Approved Fundraisers</h1>
      <div className="fundraiser-item">
        {/* props */}
        <h3>Fundraiser Title</h3>
        <p>Description of the fundraiser</p>
        <p>Goal: 5 ETH</p>
        <button>Donate</button>
      </div>
    </div>
  );
};
export default MainPage;
