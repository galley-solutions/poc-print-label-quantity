import { BarsArrowDownIcon } from "@heroicons/react/24/outline";
import { ButtonHTMLAttributes, ReactNode, useState } from "react";

type Item = {
  id: string;
  name: string;
  volume: number;
};

type Mode = null | "volume" | "headcount" | "fixed";

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

  const [mode, setMode] = useState<Mode>("volume");
  const [quantity, setQuantity] = useState(0);

  function generateValues() {
    return items.reduce(
      (values, item) => {
        values[item.id] = mode === "volume" ? item.volume : HEADCOUNT;
        return values;
      },
      {} as Record<string, number>
    );
  }

  const [values, setValues] = useState<Record<string, number>>(generateValues);

  function applyQuantity() {
    const next = { ...values };

    for (const item of items) {
      let value = quantity;

      if (mode === "volume") {
        value = item.volume + quantity;
      } else if (mode === "headcount") {
        value = HEADCOUNT + quantity;
      }

      next[item.id] = value;
    }

    setValues(next);
  }

  return (
    <div className="w-full min-h-[100vh] bg-neutral-600 p-4">
      <div className="bg-white rounded p-4 w-1/2 max-w-xl flex flex-col gap-6 mx-auto">
        <div>
          <h1 className="font-bold text-xl">Label Quantity</h1>
          <hr />
        </div>

        <div className="flex gap-4 items-center">
          <QuantityMode headcount={HEADCOUNT} mode={mode} onChange={setMode} />

          <div>
            <Label>{mode === "fixed" ? "Quantity" : "Extra Labels"}</Label>
            <div className="flex gap-2 items-center">
              <input
                className="border p-1 w-16"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.valueAsNumber)}
              />

              <ApplyButton
                disabled={mode === "fixed" && !quantity}
                onClick={applyQuantity}
              />
            </div>
          </div>

          {/*
            <div>
              <Label>Extra Labels</Label>
              <div className="flex gap-1 items-center">
                <input
                  className="border p-1 w-16"
                  type="number"
                  value={extra}
                  onChange={(e) => setExtra(e.target.valueAsNumber)}
                />

                <ApplyButton disabled={!extra} onClick={applyExtra} />
              </div>
            </div>
          */}
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

function QuantityMode({
  mode,
  headcount,
  onChange,
  onConfirm,
}: {
  mode: Mode;
  headcount: number;
  onChange: (mode: Mode) => void;
  onConfirm?: () => void;
}) {
  return (
    <div className="text-xs flex flex-col items-start gap-1">
      <Label>Quantity Mode</Label>

      <div className="flex gap-2 items-center">
        <select
          className="h-9"
          value={mode || ""}
          onChange={(e) => onChange(e.target.value as Mode)}
        >
          <option value=""></option>
          <option value="fixed">Fixed Quantity</option>
          <option value="volume">Volume (calculated per item)</option>
          <option value="headcount">Headcount ({headcount})</option>
        </select>

        {onConfirm && <ApplyButton disabled={!mode} onClick={onConfirm} />}
      </div>

      {/*
      <div className="flex flex-col gap-1 rounded bg-neutral-200 overflow-hidden">
        <Checkbox
          label="Item Volume"
          helper="Calculated per item"
          checked={mode === "volume"}
          onChange={(checked) => onChange(checked ? "volume" : null)}
        />

        <hr className="border-neutral-300" />

        <Checkbox
          label="Headcount"
          helper={`${headcount}`}
          checked={mode === "headcount"}
          onChange={(checked) => onChange(checked ? "headcount" : null)}
        />
      </div>
      */}
    </div>
  );
}

// @ts-ignore
function Checkbox({
  label,
  helper,
  checked,
  onChange,
}: {
  label: string;
  helper?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      data-checked={checked}
      className={cn(
        "flex w-full items-center gap-2 cursor-pointer p-1",
        checked ? "bg-primary text-white" : "hover:bg-neutral-300"
      )}
    >
      <input
        type="checkbox"
        name="mode"
        value="headcount"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 peer bg-white"
      />

      <div className="-flex gap-1 cursor-pointer">
        <div className="font-bold">{label}</div>

        {helper && <div className="text-current opacity-60">{helper}</div>}
      </div>
    </label>
  );
}

function cn(...classes: (string | undefined | false | number)[]): string {
  return classes.filter(Boolean).join(" ");
}

function ApplyButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="text-sm bg-primary text-white rounded-full p-1.5 font-bold disabled:opacity-50 disabled:bg-neutral-200 disabled:text-black"
    >
      <BarsArrowDownIcon className="w-5" />
    </button>
  );
}
