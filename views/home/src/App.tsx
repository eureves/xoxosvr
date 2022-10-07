import { useEffect, useState, useCallback, useMemo } from "react";
import "./App.css";

const serverUrl: string = "http://localhost:8000";
const keysInitState = { modifiers: { ctrl: false, shift: false }, keys: "F8" };

function App() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [editingKeys, setEditingKeys] = useState<Boolean>(false);
  const [keysPressed, setKeysPressed] = useState<{
    modifiers: { ctrl: boolean; shift: boolean };
    keys: string;
  }>(keysInitState);

  useEffect(() => {
    fetch(serverUrl + "/api/1/user")
      .then((res) => res.json())
      .then((res) => setUser(res))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    fetch(serverUrl + "/api/1/config")
      .then((res) => res.json())
      .then((res) => setKeysPressed(res))
      .catch((err) => console.log(err));
  }, [user]);

  const keyPressHandler = useCallback((e: globalThis.KeyboardEvent) => {
    setKeysPressed((state) => {
      if (e.ctrlKey)
        return { keys: state.keys, modifiers: { ctrl: true, shift: state.modifiers.shift } };
      if (e.shiftKey)
        return { keys: state.keys, modifiers: { ctrl: state.modifiers.ctrl, shift: true } };
      if (e.key) return { keys: e.key.toLocaleUpperCase(), modifiers: state.modifiers };
      return { ...state };
    });
  }, []);

  useMemo(() => {
    if (editingKeys) {
      setKeysPressed(keysInitState);
      document.addEventListener("keydown", keyPressHandler);
    } else {
      document.removeEventListener("keydown", keyPressHandler);
    }
  }, [editingKeys, keyPressHandler]);

  const handleEditKeyComb = () => {
    setEditingKeys((state) => !state);
    if (editingKeys) {
      fetch(serverUrl + "/api/1/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(keysPressed),
      });
    }
  };

  return (
    <div className="container mx-auto ">
      {user ? (
        <h1>{user.name}</h1>
      ) : (
        <a href={serverUrl + "/auth"}>
          <button className="p-1 bg-purple-800 rounded text-white">Login with Twitch</button>
        </a>
      )}
      {user && (
        <div className="flex mx-auto w-2/3 gap-4 justify-between rounded bg-slate-400 p-2 items-center">
          <span className="flex-1">Skip request</span>
          <button className="rounded p-2 bg-slate-600" onClick={handleEditKeyComb}>
            {editingKeys ? "Save" : "Edit"}
          </button>
          <div className="rounded p-2 bg-slate-600">
            {keysPressed.modifiers.ctrl && "ctrl+"}
            {keysPressed.modifiers.shift && "shift+"}
            {keysPressed.keys}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
