import { downloadData } from "../api/user";
import { Button } from "./Button";

export const DownloadDataLink = () => {
  const handleDownloadData = () => {
    downloadData().then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([JSON.stringify(res.data)]),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.json");
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  return (
    <>
      <p>
        Download all of your data in JSON format. This data does not contain
        internal information that has no meaning outside of this application
        (e.g. authentication tokens).
      </p>
      <Button onClick={handleDownloadData}>Download my data</Button>
    </>
  );
};
