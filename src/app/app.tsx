import { BarsArrowDownIcon } from "@heroicons/react/24/outline";
import { ReactNode, useEffect, useState } from "react";

type Item = {
  id: string;
  name: string;
  volume: number;
};

function random(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

const HEADCOUNT = 15;

function App() {
  const [items] = useState(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: crypto.randomUUID(),
      name: `Item #${i + 1}`,
      volume: random(5, 50),
    }))
  );

  const [mode, setMode] = useState<null | "volume" | "headcount">("volume");
  const [quantity, setQuantity] = useState(0);
  const [extra, setExtra] = useState(0);

  function generateValues() {
    return items.reduce((values, item) => {
      values[item.id] = mode === "volume" ? item.volume : HEADCOUNT;
      return values;
    }, {} as Record<string, number>);
  }

  const [values, setValues] = useState<Record<string, number>>(generateValues);

  function applyQuantity() {
    const next = { ...values };

    for (const id in next) {
      next[id] = quantity;
    }

    setValues(next);
    setQuantity(0);
    setMode(null);
  }

  function applyExtra() {
    const next = { ...values };

    for (const id in next) {
      next[id] = next[id] + extra;
    }

    setValues(next);
    setExtra(0);
    setMode(null);
  }

  useEffect(() => {
    setValues(generateValues);
  }, [mode]);

  return (
    <div className="w-full h-full bg-neutral-600 flex items-start justify-center p-4">
      <div className="bg-white rounded p-4 w-1/2 max-w-xl flex flex-col gap-6">
        <div>
          <h1 className="font-bold text-xl">Label Quantity</h1>
          <h3 className="text-sm text-neutral-400">Headcount: {HEADCOUNT}</h3>

          <hr />
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] gap-6 items-center">
          <div className="text-xs flex flex-col items-start">
            <label className="flex gap-1 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="volume"
                checked={mode === "volume"}
                onChange={() => setMode("volume")}
                className="peer"
              />

              <span className="peer-checked:font-bold">Use Volume</span>
            </label>

            <label className="flex gap-1 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="headcount"
                checked={mode === "headcount"}
                onChange={() => setMode("headcount")}
                className="peer"
              />

              <span className="peer-checked:font-bold">Use Headcount</span>
            </label>
          </div>

          <div>
            <Label>Quantity</Label>
            <div className="flex gap-1 items-center">
              <input
                className="border p-1 w-16"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.valueAsNumber)}
              />

              <button
                disabled={!quantity}
                className="text-sm bg-primary text-white rounded-full p-1.5 font-bold disabled:opacity-50 disabled:bg-neutral-200 disabled:text-black"
                onClick={applyQuantity}
              >
                <BarsArrowDownIcon className="w-5" />
              </button>
            </div>
          </div>

          <div>
            <Label>Extra</Label>
            <div className="flex gap-1 items-center">
              <input
                className="border p-1 w-16"
                type="number"
                value={extra}
                onChange={(e) => setExtra(e.target.valueAsNumber)}
              />

              <button
                disabled={!extra}
                className="text-sm bg-primary text-white rounded-full p-1.5 font-bold disabled:opacity-50 disabled:bg-neutral-200 disabled:text-black"
                onClick={applyExtra}
              >
                <BarsArrowDownIcon className="w-5" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex p-2 bg-neutral-200 font-bold">
            <div className="flex-1">Name</div>
            <div>Quantity</div>
          </div>

          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                quantity={values[item.id]}
                onChange={(value) =>
                  setValues((curr) => ({
                    ...curr,
                    [item.id]: value,
                  }))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

function ItemRow({
  item,
  quantity,
  onChange,
}: {
  item: Item;
  quantity?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div id={item.id} className="flex border-b p-2 items-center">
      <div className="flex-1">
        <div>{item.name}</div>
        <div className="text-xs text-neutral-400">Volume: {item.volume}</div>
      </div>
      <input
        className="border p-1 w-16 text-right"
        type="number"
        value={quantity ?? ""}
        onChange={(e) => {
          onChange(e.target.valueAsNumber);
        }}
      />
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs font-bold uppercase text-neutral-500 font-mono">
      {children}
    </div>
  );
}
