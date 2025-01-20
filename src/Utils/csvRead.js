import Papa from "papaparse";

export const readcsv = (file, delimiter = "") => {
  return new Promise((resolve, reject) => {
    if (!file) {
      console.error("Nenhum arquivo selecionado.");
      reject(new Error("Nenhum arquivo selecionado."));
      return;
    }

    Papa.parse(file, {
      delimiter: delimiter,
      header: true,
      complete: (result) => {
        console.log(result.data);
        resolve(result.data); // Resolva os dados analisados
      },
      error: (error) => {
        alert("Erro ao analisar CSV: " + error.message);
        reject(error); // Rejeite em caso de erro
      },
    });
  });
};
