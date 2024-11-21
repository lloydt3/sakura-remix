import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "L2T3" },
    { name: "description", content: "まだ決まっていない" },
  ];
};

export default function Index() {
  return (
    <div>
      <h1>Welcome!</h1>
    </div>
  );
}