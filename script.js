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

const backpackList = () => {
  let backpackArticle = document.createElement("article");
  backpackArticle.classList.add("backpack");

  backpackArticle.innerHTML = `

  <div class="row">
  <div class="col-sm-1">
  <div class="form-group">
  <strong>Matrix Size:</strong>
  <label for="Size"></label>
  <input type="number" name="Size" class="form-control Size" style="margin-top: 15px; width: 100px">
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

  const button = backpackArticle.querySelector(".lid-toggle");
  const Row = backpackArticle.querySelector(".Size");
  // const Column = Row;
  const MatrixDiv = backpackArticle.querySelector(".Matrix-Box");

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
          textinfo: "label+percent parent",
          domain: { x: [1, 2] },
          branchvalues: "total",
        },
      ];
      Plotly.newPlot("treemap", data);
    }
  });

  return backpackArticle;
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
  <button class="btn btn-default Kii-process" style="margin-top: 10px;">(Re)Evaluate Kii</button> <strong><span class="Kii_result"></span></strong>
  <div id="next-Kii-div"></div>
  <div id="dis-based-reduce"></div>
  </div>
  <div class="col-xs-1 text-center" id="geometric"></div>
  <div class="col-xs-1 text-center" id="nor-geometric"></div>
  `;
  divMatrix.innerHTML = MatContent;

  // const button = divMatrix.querySelector(".mt-process");
  // const button_nor = divMatrix.querySelector(".nor-mt-process");
  const geometric = divMatrix.querySelector("#geometric");
  const nor_geometric = divMatrix.querySelector("#nor-geometric");

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
  nor_geometric.innerHTML = nor_MatContentMul;

  // calculating the 1/(new value) when changes detected

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
        textinfo: "label+percent parent",
        domain: { x: [1, 2] },
        branchvalues: "total",
      },
    ];
    Plotly.newPlot("treemap", data);
    // });
  }
  const ChangeInput = divMatrix.querySelectorAll(".Mat");
  ChangeInput.forEach((item) =>
    item.addEventListener("change", onActivityChange)
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
    let nextKiiButton = divMatrix.querySelector("#next-Kii-div");
    let disBasedReduceButton = divMatrix.querySelector("#dis-based-reduce");
    resultShow.innerHTML = `Maximum of ${finditem.value.toFixed(2)} where ${
      Number(indexes[0]) + 1
    }, ${Number(indexes[1]) + 1}, ${Number(indexes[2]) + 1} is a triad`;
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
      }, ${Number(indexes[1]) + 1}, ${Number(indexes[2]) + 1} is a triad`;
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
main.append(backpackList());
