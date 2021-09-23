var express = require('express');
var router = express.Router();

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const pdfmaker = require('pdfmake');
// https://pdfmake.github.io/docs/0.1/


/* GET home page. */
router.post('/', (req, res, next) => {

  // テンプレートSVGを取得し、独自SVGを作成する
  const stdin = fs.readFileSync("public/template/A4.svg","utf8").toString();
  const dom = new JSDOM(stdin);
  const document = dom.window.document;
  const name_nyukyo = document.querySelector("#name_nyukyo > tspan");
  const case1 = document.querySelector("#case1 > tspan");
  const case2 = document.querySelector("#case2 > tspan");
  const case3 = document.querySelector("#case3 > tspan");
  const case4 = document.querySelector("#case4 > tspan");
  name_nyukyo.textContent = "入居者番号";
  case1.textContent = "請求額";
  case2.textContent = "16,500円";
  case3.textContent = "請求額（税込）";
  case4.textContent = "13,500円";
  const svgcontent = document.querySelector("svg");

  // fontの指定
  const fonts = {
    NotoSansJP: {
      normal: 'public/fonts/NotoSansJP-Regular.otf',
      bold: 'public/fonts/NotoSansJP-Medium.otf',
    }
  };
  const printer = new pdfmaker(fonts);
  const docDefinition = {
    content:[
      {
        svg:svgcontent.outerHTML
      }
    ],
    pageSize: 'A4',
    pageMargins: [ 0, 0, 0, 0 ],
    defaultStyle: {
      font: 'NotoSansJP',
    },
    ownerPassword: '123456',
    permissions: {
      printing: false, //'lowResolution'
      // printing: 'highResolution', //'lowResolution'
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: false,
      documentAssembly: false
    },
  };
  const options = {
  }

  const pdfDoc = printer.createPdfKitDocument(docDefinition,options);
  pdfDoc.pipe(res);
  pdfDoc.end();

  res
  .status(200)
  .attachment("A4.pdf")
  .set('Content-Type', 'application/pdf')
  .set('isBase64Encoded', true)
  .toString('base64');


  // res.render("index", {
  //   title: 'SVG-TEST-PDF-PROTEXT'
  // })

});

router.get('/', (req, res, next) => {
  res.render("index", {
    title: 'SVG-TEST'
  })
});

module.exports = router;
