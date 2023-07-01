var CSV = {};
!(function (p) {
  "use strict";
  p.__type__ = "csv";
  var o =
    ("undefined" != typeof jQuery && jQuery.Deferred) ||
    ("undefined" != typeof _ && _.Deferred) ||
    function () {
      var t,
        n,
        e = new Promise(function (e, r) {
          (t = e), (n = r);
        });
      return {
        resolve: t,
        reject: n,
        promise: function () {
          return e;
        },
      };
    };
  (p.fetch = function (t) {
    var n = new o();
    if (t.file) {
      var e = new FileReader(),
        r = t.encoding || "UTF-8";
      (e.onload = function (e) {
        var r = p.extractFields(p.parse(e.target.result, t), t);
        (r.useMemoryStore = !0),
          (r.metadata = { filename: t.file.name }),
          n.resolve(r);
      }),
        (e.onerror = function (e) {
          n.reject({
            error: {
              message: "Failed to load file. Code: " + e.target.error.code,
            },
          });
        }),
        e.readAsText(t.file, r);
    } else if (t.data) {
      var i = p.extractFields(p.parse(t.data, t), t);
      (i.useMemoryStore = !0), n.resolve(i);
    } else if (t.url) {
      (
        window.fetch ||
        function (e) {
          var r = jQuery.get(e),
            t = {
              then: function (e) {
                return r.done(e), t;
              },
              catch: function (e) {
                return r.fail(e), t;
              },
            };
          return t;
        }
      )(t.url)
        .then(function (e) {
          return e.text ? e.text() : e;
        })
        .then(function (e) {
          var r = p.extractFields(p.parse(e, t), t);
          (r.useMemoryStore = !0), n.resolve(r);
        })
        .catch(function (e, r) {
          n.reject({
            error: {
              message:
                "Failed to load file. " + e.statusText + ". Code: " + e.status,
              request: e,
            },
          });
        });
    }
    return n.promise();
  }),
    (p.extractFields = function (e, r) {
      return !0 !== r.noHeaderRow && 0 < e.length
        ? { fields: e[0], records: e.slice(1) }
        : { records: e };
    }),
    (p.normalizeDialectOptions = function (e) {
      var r = {
        delimiter: ",",
        doublequote: !0,
        lineterminator: "\n",
        quotechar: '"',
        skipinitialspace: !0,
        skipinitialrows: 0,
      };
      for (var t in e)
        "trim" === t
          ? (r.skipinitialspace = e.trim)
          : (r[t.toLowerCase()] = e[t]);
      return r;
    }),
    (p.parse = function (e, r) {
      (r && (!r || r.lineterminator)) || (e = p.normalizeLineTerminator(e, r));
      var t,
        n,
        i = p.normalizeDialectOptions(r);
      (t = e),
        (n = i.lineterminator),
        (e =
          t.charAt(t.length - n.length) !== n
            ? t
            : t.substring(0, t.length - n.length));
      var o,
        a,
        l = "",
        s = !1,
        u = !1,
        c = "",
        f = [],
        d = [];
      for (
        a = function (e) {
          return (
            !0 !== u &&
              ("" === e ? (e = null) : !0 === i.skipinitialspace && (e = v(e)),
              h.test(e)
                ? (e = parseInt(e, 10))
                : m.test(e) && (e = parseFloat(e, 10))),
            e
          );
        },
          o = 0;
        o < e.length;
        o += 1
      )
        (l = e.charAt(o)),
          !1 !== s || (l !== i.delimiter && l !== i.lineterminator)
            ? l !== i.quotechar
              ? (c += l)
              : s
              ? e.charAt(o + 1) === i.quotechar
                ? ((c += i.quotechar), (o += 1))
                : (s = !1)
              : (u = s = !0)
            : ((c = a(c)),
              f.push(c),
              l === i.lineterminator && (d.push(f), (f = [])),
              (c = ""),
              (u = !1));
      return (
        (c = a(c)),
        f.push(c),
        d.push(f),
        i.skipinitialrows && (d = d.slice(i.skipinitialrows)),
        d
      );
    }),
    (p.normalizeLineTerminator = function (e, r) {
      return (r = r || {}).lineterminator
        ? e
        : e.replace(/(\r\n|\n|\r)/gm, "\n");
    }),
    (p.objectToArray = function (e) {
      for (var r = [], t = [], n = [], i = 0; i < e.fields.length; i++) {
        var o = e.fields[i].id;
        n.push(o);
        var a = e.fields[i].label ? e.fields[i].label : o;
        t.push(a);
      }
      r.push(t);
      for (i = 0; i < e.records.length; i++) {
        for (var l = [], s = e.records[i], u = 0; u < n.length; u++)
          l.push(s[n[u]]);
        r.push(l);
      }
      return r;
    }),
    (p.serialize = function (e, r) {
      var t = null;
      t = e instanceof Array ? e : p.objectToArray(e);
      var n,
        i,
        o,
        a = p.normalizeDialectOptions(r),
        l = "",
        s = "",
        u = "",
        c = "";
      for (
        o = function (e) {
          return (
            null === e
              ? (e = "")
              : "string" == typeof e && f.test(e)
              ? (a.doublequote && (e = e.replace(/"/g, '""')),
                (e = a.quotechar + e + a.quotechar))
              : "number" == typeof e && (e = e.toString(10)),
            e
          );
        },
          n = 0;
        n < t.length;
        n += 1
      )
        for (l = t[n], i = 0; i < l.length; i += 1)
          (s = o(l[i])),
            i === l.length - 1
              ? ((c += (u += s) + a.lineterminator), (u = ""))
              : (u += s + a.delimiter),
            (s = "");
      return c;
    });
  var h = /^\d+$/,
    m = /^\d*\.\d+$|^\d+\.\d*$/,
    f = /^\s|\s$|,|"|\n/,
    v = String.prototype.trim
      ? function (e) {
          return e.trim();
        }
      : function (e) {
          return e.replace(/^\s*/, "").replace(/\s*$/, "");
        };
})(CSV);
var recline = recline || {};
(recline.Backend = recline.Backend || {}),
  (recline.Backend.CSV = CSV),
  "undefined" != typeof module && module.exports && (module.exports = CSV);

//distance-based inconsistency reduction algorithm
let DisBasedReduct = (x, y, z) => {
  x = parseFloat(x);
  y = parseFloat(y);
  z = parseFloat(z);
  let isSmaller = x * y < z ? 1 : 0;
  let a = x * y;
  let b1 = z + 2 * x * y;
  let b2 = -1 * b1;
  let c = x * y - z;
  let solution = 0;

  let dis = b1 ** 2 - 4 * a * c;
  let sqr_dis = Math.sqrt(dis);
  if (isSmaller) {
    let s1 = (-1 * b1 + sqr_dis) / (2 * a);
    let s2 = (-1 * b1 - sqr_dis) / (2 * a);
    if (s1 > 0) {
      solution = (Math.round(s1 * 100) / 100).toFixed(2);
    } else {
      solution = (Math.round(s2 * 100) / 100).toFixed(2);
    }
    return [x + x * solution, y + y * solution, z - z * solution];
  } else {
    let s1 = (-1 * b2 + sqr_dis) / (2 * a);
    let s2 = (-1 * b2 - sqr_dis) / (2 * a);
    if (s1 > s2) {
      solution = (Math.round(s2 * 100) / 100).toFixed(2);
    } else {
      solution = (Math.round(s1 * 100) / 100).toFixed(2);
    }
    return [x - x * solution, y - y * solution, z + z * solution];
  }
};

const PCCalculator = () => {
  let PCCalculatorContent = document.createElement("PCCalculator");
  PCCalculatorContent.classList.add("Calculator");

  PCCalculatorContent.innerHTML = `

  <div class="row">
  <div class="col-sm-1">
  <div class="form-group">
  <strong>Matrix Size:</strong>
  <label for="Size"></label>
  <input type="number" name="Size" value=4 class="form-control Size" style="margin-top: 15px; width: 100px">
</div>

<button class="btn btn-default lid-toggle m-0">Create Matrix</button>
  </div>
  <div class="col-sm-10 Matrix-Box">

    <h3 style="margin:0;">Matrix Part</h3>
    <p>After you enter the Column and Row number Please Click On Create Matrix Button</p>
    <p style="color: red;">Zero and negative values for PC matrix elements are not allowed!</p>

  </div>

</div>


   `;

  const button = PCCalculatorContent.querySelector(".lid-toggle");
  const Row = PCCalculatorContent.querySelector(".Size");
  // const Column = Row;
  const MatrixDiv = PCCalculatorContent.querySelector(".Matrix-Box");

  // handle "create matrix" button
  button.addEventListener("click", () => {
    MatrixDiv.innerHTML = "";
    // add data validation:
    if (
      Row.value < 3 ||
      !Number.isInteger(Number(Row.value)) ||
      Row.value > 8
    ) {
      // console.log(Row.value);
      alert("⚠ - Please enter an integer value x that is between 3 and 8");
      window.location.reload();
    } else {
      let RowNum = Row.value;
      let ColumnNum = RowNum;
      MatrixDiv.append(CreateMat(RowNum, ColumnNum));
      // insert treemap module here:
      let nor_geo_means = [1.0];
      let nor = (1.0 / ColumnNum).toFixed(2);
      for (let i = 0; i < ColumnNum; i++) {
        nor_geo_means.push(nor);
      }
      const alpha = Array.from(Array(26)).map((e, i) => i + 65);
      const alphabet = alpha.map((x) => String.fromCharCode(x));
      let labels = ["Root"];
      for (let i = 0; i < ColumnNum; i++) {
        labels.push(alphabet[i]);
      }

      let parents = [""];
      for (let i = 0; i < ColumnNum; i++) {
        parents.push("Root");
      }

      let sum = 0;
      for (let i = 1; i < ColumnNum + 1; i++) {
        sum += parseFloat(nor_geo_means[i]);
      }
      nor_geo_means[0] = sum;
      // console.log(
      //   `labels is ${labels}\n parents is ${parents}\n values is ${nor_geo_means}\n`
      // );
      var data = [
        {
          type: "treemap",
          labels: labels,
          parents: parents,
          values: nor_geo_means,
          textinfo:
            "label+value+percent root+percent parent+percent entry+current path",
          // textinfo: "label+percent parent",
          domain: { x: [1, 2] },
          branchvalues: "total",
        },
      ];
      Plotly.newPlot("treemap", data);
    }
  });

  return PCCalculatorContent;
};

// create matrix
const CreateMat = (RowNum, ColumnNum) => {
  let divMatrix = document.createElement("div");
  divMatrix.classList.add("Matrix");
  let size = 5;
  // if(RowNum < 5){
  //   size = 3;
  // }
  // else if(RowNum < 6) {
  //   size = 4;
  // }
  // else {
  //   size = 6;
  // }
  let MatContent = `
  <div class="row">
  `;
  MatContent += `<div class="col-xs-${size} text-center">`;
  MatContent += `<p style="margin-bottom:0;">PC (pairwise comparisons) Matrix</p> `;
  for (let i = 0; i < ColumnNum; i++) {
    MatContent += `<div class="col-xs-12">`;
    for (let j = 0; j < RowNum; j++) {
      if (i < j) {
        MatContent += `<input type="number" name="mt${i}${j}" class="Mat" id="mt${i}${j}" value="1">`;
      } else if (i == j) {
        MatContent += `<input type="number" value="1" name="mt${i}${j}" class="Mat" id="mt${i}${j}"  disabled>`;
      } else {
        MatContent += `<input type="number" name="mt${i}${j}" class="Mat" id="mt${i}${j}" value="1" disabled>`;
      }
    }
    MatContent += `<br/></div>`;
  }

  // add in new buttons for calculating geometric mean and kii triad
  // <button class="btn btn-default nor-mt-process">Process Normalized Geometric Mean</button>

  // <button class="btn btn-default mt-process">Process Geometric Mean</button>
  MatContent += `
  <!-- <button class="btn btn-default Kii-process" style="margin-top: 10px;">(Re)Evaluate Kii</button> <strong><span class="Kii_result"></span></strong> -->
  <button class="btn btn-default Kii-process" style="margin-top: 10px;"><abbr title="Iteratively compute inconsistency (Kii)">Compute Kii</abbr></button> <strong><span class="Kii_result"></span></strong>
  <div>
  <span id="next-Kii-div"></span>
  <span id="dis-based-reduce"></span>
  <span id="save-csv-div"></span>
  <span id="save-screenshot-div"></span>
  </div>
  </div>
  <div class="col-xs-1 text-center" id="geometric"></div>
  <div class="col-xs-1 text-center" id="nor-geometric"></div>
  <div class="col-xs-1 text-center" id="parentSelect"></div>
  `;
  divMatrix.innerHTML = MatContent;

  // const button = divMatrix.querySelector(".mt-process");
  // const button_nor = divMatrix.querySelector(".nor-mt-process");
  const geometric = divMatrix.querySelector("#geometric");
  const nor_geometric = divMatrix.querySelector("#nor-geometric");
  const parentSelectionHTML = divMatrix.querySelector("#parentSelect");

  // initialize geometrix mean column
  let MatContentMul = ``;
  MatContentMul += `<div class="col-12">
  <abbr title="Geometric Mean">GM</abbr>`;
  for (let i = 0; i < ColumnNum; i++) {
    MatContentMul += `<input type="number" value="1" name="gm${i}" class="Mat geo_col" id="gm${i}"  disabled>
    <br/></div>`;
  }
  geometric.innerHTML = MatContentMul;

  // initialize normalized geometrix mean column
  let nor_MatContentMul = ``;
  nor_MatContentMul += `<div class="col-12">
  <abbr title="Normalized Geometric Mean">N_GM</abbr>`;
  //adding parent selection
  let parentSelect = ``;
  parentSelect += `<div class="col-12">
  <abbr title="Choose parent node (default: Root)">Parent</abbr>`;

  let geo_means = [];
  let nor_geo_means = [1.0];
  let nor = (1.0 / ColumnNum).toFixed(2);
  for (let i = 0; i < ColumnNum; i++) {
    nor_geo_means.push(nor);
  }
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  let labels = ["Root"];
  for (let i = 0; i < ColumnNum; i++) {
    labels.push(alphabet[i]);
  }

  let parents = [""];
  for (let i = 0; i < ColumnNum; i++) {
    parents.push("Root");
  }

  let sum = 0;
  // acquire data from the geometric mean column and store them in geo_means
  for (let i = 0; i < ColumnNum; i++) {
    geo_means[i] = divMatrix.querySelector(`#gm${i}`).value;
    sum += parseInt(geo_means[i]);
  }
  // console.log(sum);
  //display data on the webpage
  for (let i = 0; i < ColumnNum; i++) {
    let nor = (geo_means[i] / sum).toFixed(2);
    nor_MatContentMul += `<input type="number" value="${nor}" name="nor_gm${i}" class="Mat" id="nor_gm${i}"  disabled>
    <br/></div>`;
  }
  for (let i = 0; i < ColumnNum; i++) {
    // console.log(labels);
    let parentSelectX = `<select style="margin:10px 0;" id="parent${i}" class="Parent">`;
    for (let j = 0; j < labels.length; j++) {
      if (i + 1 != j) {
        parentSelectX += `<option value="${labels[j]}">${labels[j]}</option>`;
      }
    }
    parentSelectX += `</select>
    <br/></div>`;
    parentSelect += parentSelectX;
  }
  nor_geometric.innerHTML = nor_MatContentMul;
  parentSelectionHTML.innerHTML = parentSelect;
  // for (let i = 0; i < ColumnNum; i++) {
  //   document
  //     .getElementById(`parent${i}`)
  //     .addEventListener("change", onParentChange(`${i}`));
  // }

  // calculating the 1/(new value) when changes detected
  let onParentChange = (index) => {
    // console.log(index.target.id);
    parents = [""];
    for (let i = 0; i < ColumnNum; i++) {
      let x = document.getElementById(`parent${i}`).value;
      parents.push(x);
    }
    console.log(parents);
    onActivityChange();
  };

  function onActivityChange() {
    // item.addEventListener("change", (event) => {
    // let id = event.target.id.replace("mt", "");
    // console.log(id);
    // let rowNum = id[0];
    // get the diaognal position of the changing position
    // id = id.split("").reverse().join("");
    // console.log(`reversed ID = ${id}`);

    for (let i = 0; i < ColumnNum; i++) {
      for (let j = 0; j < ColumnNum; j++) {
        if (i > j) {
          let otherTxt = divMatrix.querySelector(`#mt${i}${j}`);
          let oriTxt = divMatrix.querySelector(`#mt${j}${i}`);
          otherTxt.value = (Math.round((1 / oriTxt.value) * 100) / 100).toFixed(
            2
          );
        }
      }
    }

    // let otherTxt = divMatrix.querySelector(`#mt${id}`);
    // otherTxt.value = (
    //   Math.round((1 / event.target.value) * 100) / 100
    // ).toFixed(2);
    let MatContentMul = ``;
    geometric.replaceChildren();
    MatContentMul += `<div class="col-12">
      <abbr title="Geometric Mean">GM</abbr>`;
    let geo_means = [];
    for (let i = 0; i < ColumnNum; i++) {
      let mul = 1;
      for (let j = 0; j < RowNum; j++) {
        let otherTxt = divMatrix.querySelector(`#mt${i}${j}`);
        mul = mul * otherTxt.value;
      }
      geo_means[i] = (
        Math.round(Math.pow(mul, 1 / RowNum) * 100) / 100
      ).toFixed(2);
      MatContentMul += `<div class="col-12">
      <input type="number" value="${geo_means[i]}" name="gm${i}" class="Mat geo_col" id="gm${i}"  disabled>
      <br/></div>`;
    }
    let new_sum = 0;
    for (let i = 0; i < ColumnNum; i++) {
      new_sum += parseFloat(geo_means[i]);
    }
    let nor_MatContentMul = ``;
    nor_geometric.replaceChildren();
    nor_MatContentMul += `<div class="col-12">
      <abbr title="Normalized Geometric Mean">N_GM</abbr>`;
    nor_geo_means = [1.0];
    let sum = 0;
    for (let i = 0; i < ColumnNum; i++) {
      let nor = (Math.round((geo_means[i] / new_sum) * 100) / 100).toFixed(2);
      // console.log(`${nor}\n`)
      sum += nor;
      nor_geo_means.push(nor);
      nor_MatContentMul += `<input type="number" value="${nor}" name="nor_gm${i}" class="Mat" id="nor_gm${i}"  disabled>
    <br/></div>`;
    }
    for (let i = 1; i < ColumnNum + 1; i++) {
      sum += parseFloat(nor_geo_means[i]);
    }
    nor_geo_means[0] = sum;
    // console.log(
    //   `labels is ${labels}\n parents is ${parents}\n values is ${nor_geo_means}\n`
    // );
    nor_geometric.innerHTML = nor_MatContentMul;
    geometric.innerHTML = MatContentMul;
    var data = [
      {
        type: "treemap",
        labels: labels,
        parents: parents,
        values: nor_geo_means,
        textinfo:
          "label+value+percent root+percent parent+percent entry+current path",
        // textinfo: "label+percent parent",
        domain: { x: [1, 2] },
        branchvalues: "total",
      },
    ];
    Plotly.newPlot("treemap", data);
    // document.getElementById("treemap").innerHTML = reason;
    // });
  }
  const ChangeInput = divMatrix.querySelectorAll(".Mat");
  ChangeInput.forEach((item) =>
    item.addEventListener("change", onActivityChange)
  );
  const parentChange = divMatrix.querySelectorAll(".Parent");
  parentChange.forEach((item) =>
    item.addEventListener("change", onParentChange)
  );
  // when "geometrix mean" button is clicked
  // button.addEventListener("click", () => {
  //   let MatContentMul = ``;
  //   geometric.replaceChildren();
  //   MatContentMul += `<div class="col-12">
  //   <p>Geometric Mean</p>`;
  //   for (let i = 0; i < ColumnNum; i++) {
  //     let mul = 1;
  //     for (let j = 0; j < RowNum; j++) {
  //       let otherTxt = divMatrix.querySelector(`#mt${i}${j}`);
  //       mul = mul * otherTxt.value;
  //     }
  //     MatContentMul += `<div class="col-12">
  //     <input type="number" value="${Math.pow(
  //       mul,
  //       1 / RowNum
  //     )}" name="gm${i}" class="Mat" id="gm${i}"  disabled>
  //     <br/><br/></div>`;
  //   }

  //   geometric.innerHTML = MatContentMul;
  // });

  const buttonKii = divMatrix.querySelector(".Kii-process");

  buttonKii.addEventListener("click", () => {
    let nextKiiCounter = 1;
    var dict = [];
    for (let i = 0; i < ColumnNum; i++) {
      for (let j = 0; j < ColumnNum; j++) {
        for (let k = 0; k < ColumnNum; k++) {
          if (i < j && j < k) {
            let first = divMatrix.querySelector(`#mt${i}${k}`).value;
            let second = divMatrix.querySelector(`#mt${i}${j}`).value;
            let third = divMatrix.querySelector(`#mt${j}${k}`).value;
            let A = Math.abs(1 - first / (second * third));
            let B = Math.abs(1 - (second * third) / first);
            dict.push({
              key: `${i},${j},${k}`,
              value: Math.min(A, B),
            });
          }
        }
      }
    }
    // console.log(dict);
    let finditem = dict[0];
    dict.forEach((item) => {
      if (item.value > finditem.value) {
        finditem = item;
      }
    });
    // console.log(finditem);
    let indexes = finditem.key.split(",");
    let firstTxt = divMatrix.querySelector(`#mt${indexes[0]}${indexes[1]}`);
    let secondTxt = divMatrix.querySelector(`#mt${indexes[1]}${indexes[2]}`);
    let thirdTxt = divMatrix.querySelector(`#mt${indexes[0]}${indexes[2]}`);
    let allTxt = divMatrix.querySelector(`#mt01`);
    let resultShow = divMatrix.querySelector(".Kii_result");
    let saveCSVButton = divMatrix.querySelector("#save-csv-div");
    let saveScreenshotButton = divMatrix.querySelector("#save-screenshot-div");
    let nextKiiButton = divMatrix.querySelector("#next-Kii-div");
    let disBasedReduceButton = divMatrix.querySelector("#dis-based-reduce");
    resultShow.innerHTML = `Maximum of ${finditem.value.toFixed(2)} where ${
      Number(indexes[0]) + 1
    }, ${Number(indexes[1]) + 1}, ${Number(indexes[2]) + 1} is a triad.`;
    saveCSVButton.innerHTML = `<button id="save-csv" class="btn btn-default" style="margin-top: 10px;">Save to CSV File</button>`;
    saveScreenshotButton.innerHTML = `<button id="save-screenshot" class="btn btn-default" style="margin-top: 10px;">Print</button>`;
    nextKiiButton.innerHTML = `<button id="next-Kii" class="btn btn-default" style="margin-top: 10px;">Next Most Inconsistent Triad</button>`;
    disBasedReduceButton.innerHTML = `<button id="disBasedReduceButton" class="btn btn-default" style="margin-top: 10px;"><abbr title="Distance Based Inconsistency Reduction">DBIR</button>`;
    //allTxt.style.backgroundColor = "#ffff00";
    for (let i = 0; i < RowNum; i++) {
      for (let j = 0; j < RowNum; j++) {
        divMatrix.querySelector(`#mt${i}${j}`).style.backgroundColor =
          "#ffffff";
      }
    }
    if (finditem.value.toFixed(2) <= 0.33) {
      firstTxt.style.backgroundColor = "#90ee90";
      secondTxt.style.backgroundColor = "#90ee90";
      thirdTxt.style.backgroundColor = "#90ee90";
    } else {
      firstTxt.style.backgroundColor = "#ffcbcb";
      secondTxt.style.backgroundColor = "#ffcbcb";
      thirdTxt.style.backgroundColor = "#ffcbcb";
    }
    let nextKii = divMatrix.querySelector("#next-Kii");
    let saveCSV = divMatrix.querySelector("#save-csv");
    let saveScreenShot = divMatrix.querySelector("#save-screenshot");
    if (nextKiiCounter >= Object.keys(dict).length) {
      // console.log("hello");
      document.getElementById("next-Kii").disabled = true;
      document.getElementById("next-Kii").textContent =
        "This is the last traid!";
    }
    if (finditem.value < 0.33) {
      document.getElementById("disBasedReduceButton").disabled = true;
      document.getElementById("disBasedReduceButton").textContent =
        "kii < 0.33!";
    }
    let findNext = () => {
      if (nextKiiCounter + 1 >= Object.keys(dict).length) {
        // console.log("hello");
        document.getElementById("next-Kii").disabled = true;
        document.getElementById("next-Kii").textContent =
          "This is the last traid!";
      }
      // console.log("nextKii is clicked.");
      finditem.value = -1;
      finditem = dict[0];
      dict.forEach((item) => {
        if (item.value > finditem.value) {
          finditem = item;
        }
      });
      nextKiiCounter += 1;
      indexes = finditem.key.split(",");
      firstTxt = divMatrix.querySelector(`#mt${indexes[0]}${indexes[1]}`);
      secondTxt = divMatrix.querySelector(`#mt${indexes[1]}${indexes[2]}`);
      thirdTxt = divMatrix.querySelector(`#mt${indexes[0]}${indexes[2]}`);
      allTxt = divMatrix.querySelector(`#mt01`);
      resultShow = divMatrix.querySelector(".Kii_result");
      resultShow.innerHTML = `Maximum of ${finditem.value.toFixed(2)} where ${
        Number(indexes[0]) + 1
      }, ${Number(indexes[1]) + 1}, ${Number(indexes[2]) + 1} is a triad.`;
      // console.log(dict);

      for (let i = 0; i < RowNum; i++) {
        for (let j = 0; j < RowNum; j++) {
          divMatrix.querySelector(`#mt${i}${j}`).style.backgroundColor =
            "#ffffff";
        }
      }
      if (finditem.value.toFixed(2) <= 0.33) {
        firstTxt.style.backgroundColor = "#90ee90";
        secondTxt.style.backgroundColor = "#90ee90";
        thirdTxt.style.backgroundColor = "#90ee90";
        document.getElementById("disBasedReduceButton").disabled = true;
        document.getElementById("disBasedReduceButton").textContent =
          "kii < 0.33!";
      } else {
        firstTxt.style.backgroundColor = "#ffcbcb";
        secondTxt.style.backgroundColor = "#ffcbcb";
        thirdTxt.style.backgroundColor = "#ffcbcb";
      }
      // console.log(nextKiiCounter);
    };
    nextKii.addEventListener("click", findNext);
    // console.log(`size of the dict is ${Object.keys(dict).length}`);
    // console.log(`The input values are:\n`);

    //transfer the matrix from web form to
    disBasedReduceButton.addEventListener("click", () => {
      let x = matrixArray[indexes[0]][indexes[1]];
      let y = matrixArray[indexes[1]][indexes[2]];
      let z = matrixArray[indexes[0]][indexes[2]];

      let triadReduced = DisBasedReduct(x, y, z);
      divMatrix.querySelector(`#mt${indexes[0]}${indexes[1]}`).value =
        triadReduced[0].toFixed(2);
      divMatrix.querySelector(`#mt${indexes[1]}${indexes[2]}`).value =
        triadReduced[1].toFixed(2);
      divMatrix.querySelector(`#mt${indexes[0]}${indexes[2]}`).value =
        triadReduced[2].toFixed(2);
      document.getElementById("disBasedReduceButton").disabled = true;
      document.getElementById("disBasedReduceButton").textContent =
        "Reevaluation required!";
      onActivityChange();
      console.log(triadReduced);
    });
    let matrixArray = [];
    for (let i = 0; i < ColumnNum; i++) {
      let matrixRow = [];
      for (let j = 0; j < ColumnNum; j++) {
        matrixRow.push(divMatrix.querySelector(`#mt${i}${j}`).value);
      }
      matrixArray.push(matrixRow);
    }

    let save_geo_means = [];
    let save_nor_geo_means = nor_geo_means.slice(1, ColumnNum + 1);
    for (let i = 0; i < ColumnNum; i++) {
      save_geo_means.push(divMatrix.querySelector(`#gm${i}`).value);
    }
    let CSVArray = matrixArray;
    let header = alphabet.slice(0, ColumnNum);
    header.push("Geometric Mean");
    header.push("Normalized Geometric Mean");
    header.unshift(" ");
    CSVArray.unshift(header);
    for (let i = 1; i < CSVArray.length; i++) {
      CSVArray[i].unshift(`${header[i]}`);
      CSVArray[i].push(save_geo_means[i - 1]);
      CSVArray[i].push(save_nor_geo_means[i - 1]);
    }
    CSVArray.push([" "]);
    CSVArray.push([]);
    CSVArray[CSVArray.length - 1].push(resultShow.innerHTML);
    saveCSV.addEventListener("click", () => {
      var blob = new Blob([CSV.serialize(CSVArray)], { type: "text/csv" });
      var url = window.URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "PC_Calc_Result.csv";
      anchor.click();
      window.URL.revokeObjectURL(url);
      anchor.remove();
    });

    saveScreenShot.addEventListener("click", () => {
      html2canvas(document.body).then((canvas) => {
        let a = document.createElement("a");
        a.download = "PCM.png";
        a.href = canvas.toDataURL("image/png");
        let link = canvas.toDataURL("image/png");
        // a.click(); // MAY NOT ALWAYS WORK!
        printJS(link, "image");
      });
    });
    // if (finditem.value > 0.33) {
    //   let x = matrixArray[indexes[0]][indexes[1]];
    //   let y = matrixArray[indexes[1]][indexes[2]];
    //   let z = matrixArray[indexes[0]][indexes[2]];

    //   let triadReduced = DisBasedReduct(x, y, z);
    //   console.log(triadReduced);
    // }
    // console.log(finditem);
    // console.log(indexes);
    // console.log(`a[i][j]: ${matrixArray[indexes[0]][indexes[1]]}`);
    // console.log(`a[j][k]: ${matrixArray[indexes[1]][indexes[2]]}`);
    // console.log(`a[i][k]: ${matrixArray[indexes[0]][indexes[2]]}`);
  });

  return divMatrix;
};
const main = document.querySelector(".maincontent");
main.innerHTML = "";
main.append(PCCalculator());
