import { useState } from "react";
import { Button } from "@link-saver/ui";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-80 p-4">
      <h1 className="text-2xl font-bold mb-4">Extension Popup</h1>
      <div className="flex flex-col gap-4">
        <p>Count: {count}</p>
        <Button onClick={() => setCount((count) => count + 1)}>Click me</Button>
      </div>
    </div>
  );
}

export default App;
