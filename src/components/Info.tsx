const Info = () => {
  return (
    <div className="frosted-card text-center">
      <h2 className="">How to use app</h2>
      {/* Add actual instructions, like either give location access or add your zip code */}
      <p className="">Enter your zip code to find stores near you.</p>
      <p>Test Zip Codes:</p>
      <ul>
        <li>35002</li>
        <li>35212</li>
        <li>35100</li>
      </ul>
    </div>
  );
};

export default Info;
