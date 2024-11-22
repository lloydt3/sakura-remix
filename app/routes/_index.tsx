import type { MetaFunction } from "@remix-run/node";
import { useNavigation } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "L2T3" },
    { name: "description", content: "まだ決まっていない" },
  ];
};

export default function Index() {
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center">Loading...</div>
    );
  }
  return (
    <div className="flex min-h-screen justify-center">
      <h1 className="m-10">Welcome! 🖖</h1>
    </div>
  );
}
