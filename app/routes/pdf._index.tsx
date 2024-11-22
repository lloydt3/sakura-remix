import { Link, useNavigation } from "@remix-run/react";
import Button from "~/components/ui/custom-button";

export default function PDFmain() {
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center">Loading...</div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Button className="m-5">
        <Link to="/pdf/pdf2png">PDF→PNG変換</Link>
      </Button>
    </div>
  );
}
