import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import Button from "@material-ui/core/Button";
import GetAppIcon from '@material-ui/icons/GetApp';

import "./styles.css";

export default function SinglePage(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const { pdf, docx } = props;

  return (
    <>
    <Button
        variant="contained"
        color="default"
        style={{marginLeft: '46%'}}
        startIcon={<GetAppIcon />}
        href={docx}
      >
        Загрузить DOCX
      </Button>
      <Document
        file={pdf}
        options={{ workerSrc: "/pdf.worker.js" }}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <p align="center">Образец выполнения</p>
        <Page pageNumber={pageNumber} />
      </Document>
      <div align="center">
        <p>
          Страница {pageNumber || (numPages ? 1 : "--")} из {numPages || "--"}
        </p>
        <Button
          disabled={pageNumber <= 1}
          onClick={previousPage}
          variant="contained"
          color="primary"
        >
          Назад
        </Button>
        <Button
          disabled={pageNumber >= numPages}
          onClick={nextPage}
          variant="contained"
          color="primary"
        >
          Вперед
        </Button>
      </div>
    </>
  );
}
