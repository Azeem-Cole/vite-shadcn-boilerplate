import { Button } from "@link-saver/ui";
import { createFileRoute } from "@tanstack/react-router";
import reactLogo from "./../assets/react.svg";
import viteLogo from "./../assets/vite.svg";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full border-2">
      <div className="flex justify-center">
        <a href="https://vitejs.dev" target="_blank" className="mx-4">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="mx-4">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-5xl font-bold mb-6">Vite + React</h1>
      <div className="card">
        <Button
          onClick={() => setCount((count) => count + 1)}
          // className="bg-green-500"
        >
          count is {count}
        </Button>
        <p className="mt-4">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs mt-8">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}
