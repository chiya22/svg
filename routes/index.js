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
  const no_riyou = document.querySelector("#__no_riyou > tspan");
  const name_riyou = document.querySelector("#__name_riyou > tspan");
  const ymdyoubi_hakkou = document.querySelector("#__ymdyoubi_hakkou > tspan");
  const ymdyoubi_riyou = document.querySelector("#__ymdyoubi_riyou > tspan");
  const name_room_1 = document.querySelector("#__name_room_1 > tspan");
  const time_1 = document.querySelector("#__time_1 > tspan");
  const price_1 = document.querySelector("#__price_1 > tspan");
  const price_total = document.querySelector("#__price_total > tspan");
  no_riyou.textContent = "12345";
  name_riyou.textContent = "プラットフォームサービス株式会社　様";
  ymdyoubi_hakkou.textContent = "2022年07月02日(土)";
  ymdyoubi_riyou.textContent = "2022年07月04日(月)";
  name_room_1.textContent = "会議室501";
  // time_1.setAttribute("textLength", 12);
  // time_1.setAttribute("lengthAdjust", "spacingAndGlyphs");
  time_1.textContent = "10:00～18:00";
  console.log(time_1.getAttribute("textLength"));
  console.log(time_1.getAttribute("x"));
  const bbb = time_1.getAttribute("x");
  time_1.setAttribute("textLength", 100);
  time_1.setAttribute("lengthAdjust", "spacingAndGlyphs");
  time_1.setAttribute("x", 330);
  price_1.textContent = "12,300円";
  price_total.textContent = "12,300円";
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
