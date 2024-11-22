import { useState } from "react";
import "pdfjs-dist/build/pdf.worker.mjs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import Dropzone from "react-dropzone";
import Button from "~/components/ui/custom-button";
// // Some PDFs need external cmaps.
// const CMAP_URL = "../../../node_modules/pdfjs-dist/cmaps/";
const CMAP_URL = "/cmaps/";
const CMAP_PACKED = true;
// const STANDARD_FONT_DATA_URL = "pdfjs-dist/standard_fonts/";
// const CMAP_PACKED = true;
// // Where the standard fonts are located.
// const STANDARD_FONT_DATA_URL = "../../../node_modules/pdfjs-dist/standard_fonts/";
const STANDARD_FONT_DATA_URL = "/standard_fonts/";

export default function PdfToImage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState<{ url: string; name: string }[]>(
    [],
  );

  const clearPdfAndState = () => {
    setPdfFile(null);
    setConverting(false);
  };
  const convertPdfToImage = async () => {
    if (!pdfFile) {
      alert("PDFファイルを選択してください。");
      return;
    }
    setConverting(true);
    try {
      console.log("Converting PDF to Image");

      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const pdfArrayBuffer = fileReader.result as ArrayBuffer;
        const pdf = await getDocument({
          data: pdfArrayBuffer,
          cMapUrl: CMAP_URL,
          cMapPacked: CMAP_PACKED,
          standardFontDataUrl: STANDARD_FONT_DATA_URL,
        }).promise;

        // const page = await pdf.getPage(1);
        console.log("Loading PDF");
        const pages = await pdf.numPages;
        console.log(`PDF has ${pages} pages`);

        for (let i = 1; i <= pages; i++) {
          console.log(`Converting page ${i} of ${pages}`);
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 }); // Adjust scale as needed
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;
          console.log("Rendering page");
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const c = {
                url: url,
                name: `${pdfFile.name.split(".pdf")[0]}_${pages > 10 ? i.toString().padStart(pages.toString().length, "0") : i}.png`,
              };
              setConverted((prev) => [...prev, c]);
            }
          }, "image/png");
          page.cleanup();
          if (i === pages) {
            clearPdfAndState();
          }
        }
      };

      fileReader.readAsArrayBuffer(pdfFile);
    } catch (e) {
      console.error(e);
      alert("エラーが発生しました。");
      clearPdfAndState();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center">
      <h1>PDF→画像変換</h1>
      <div className="m-5 flex h-40 w-[70svw] mx-5 cursor-pointer items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
        {pdfFile ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <p>{pdfFile.name}</p>
            <div className="flex items-center justify-center gap-2">
              <Button
                disabled={converting}
                className="bg-rose-800 disabled:opacity-30"
                onClick={() => setPdfFile(null)}
              >
                削除
              </Button>
              {pdfFile && (
                <Button
                  disabled={converting}
                  onClick={convertPdfToImage}
                  className="disabled:opacity-30"
                >
                  {converting ? "変換中..." : "変換"}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Dropzone
            accept={{ "application/pdf": [".pdf"] }}
            onDrop={(acceptedFiles) => setPdfFile(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} accept="application/pdf" />
                  <p className="text-balance p-3 text-center">
                    ファイルをドロップするか、クリックしてファイルを選択してください
                  </p>
                  <p className="text-center text-rose-600">1ファイルのみ</p>
                </div>
              </section>
            )}
          </Dropzone>
        )}
      </div>
      {converted.length > 0 && (
        <Button
          disabled={converting}
          onClick={() => setConverted([])}
          className="disabled:opacity-30"
        >
          クリア
        </Button>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {converted.length > 0 &&
          converted
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c, index) => (
              <a
                className="m-2 flex flex-col items-center justify-center rounded-lg px-2 py-1 text-sm shadow-sm ring-1 ring-zinc-100 dark:ring-zinc-500 transition-all hover:shadow-md hover:ring-0"
                href={c.url}
                download={c.name}
                key={index}
              >
                <img src={c.url} alt={c.name} className="h-auto w-32" />
                {c.name}
              </a>
            ))}
      </div>
    </div>
  );
}
