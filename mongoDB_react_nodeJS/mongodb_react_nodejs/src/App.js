// Frontend code 
// Filename - App.js

import{useState} from 'react';

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: "post",
        body: JSON.stringify({ name, email }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      console.log(result);
      if (result) {
        alert("Data saved succesfully");
        setEmail("");
        setName("");
      }
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  }

  return (
    <>
      <h1>This is React WebApp </h1>
      <form onSubmit={handleOnSubmit}>
        <input type="text" placeholder="name"
          value={name} onChange={(e) => setName(e.target.value)} /><br></br>
        <input type="email" placeholder="email"
          value={email} onChange={(e) => setEmail(e.target.value)} /><br></br>
        <button type="submit">submit</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </>
  );
}

export default App;