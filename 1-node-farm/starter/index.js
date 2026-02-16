const fs = require("fs");
const http = require("http");
const url = require("url");

///////////////////////////////// File System //////////////////////////////////
// Blocking, synchronous way
// const textInp = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textInp);
// const textOut = `This is what we know about the avocado: ${textInp}. \nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written successfully");

// Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("File written successfully");
//       });
//     });
//   });
// });
// console.log("Will read file...");

///////////////////////////////// Server //////////////////////////////////
const replaceTemplate = (temp, product) => {
  const replace = (field, value) => {
    const pattern = new RegExp(
      "\\{%" + field + "%\\}|\\{&" + field + "&\\}",
      "g",
    );
    return (temp) => temp.replace(pattern, value);
  };

  let output = temp;
  output = replace("PRODUCTNAME", product.productName)(output);
  output = replace("IMAGE", product.image)(output);
  output = replace("PRICE", product.price)(output);
  output = replace("FROM", product.from)(output);
  output = replace("NUTRIENTSCTNAME", product.nutrients)(output);
  output = replace("QUANTITY", product.quantity)(output);
  output = replace("DESCRIPTION", product.description)(output);
  output = replace("ID", product.id)(output);

  if (!product.organic) {
    output = replace("NOT_ORGANIC", "not-organic")(output);
  }

  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template_overview.html`,
  "utf-8",
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template_card.html`,
  "utf-8",
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template_product.html`,
  "utf-8",
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, { "content-type": "text/html" });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);

    // Not Found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(7000, "127.0.0.1", () => {
  console.log("Server is listening on port 7000...");
});
