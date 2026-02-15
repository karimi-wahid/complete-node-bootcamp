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

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the overview");
  } else if (pathName === "/product") {
    res.end("This is the product");
  } else if (pathName === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
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
