//Write and developed by Majid Piramoon
const backpackList = () => {
  let backpackArticle = document.createElement("article");
  backpackArticle.classList.add("backpack");

  backpackArticle.innerHTML = `

  <div class="row">
  <div class="col-sm-2">
  <div class="form-group">
  <strong>Matrix Size:</strong>
  <label for="Size"></label>
  <input type="number" name="Size" class="form-control Size" >
</div>

<button class="btn btn-default lid-toggle">Create Matrix</button>
  </div>
  <div class="col-sm-10 Matrix-Box">

    <h3>Matrix Part</h3>
    <p>After you enter the Column and Row number Please Click On Create Matrix Button</p>

  </div>

</div>


   `;

  const button = backpackArticle.querySelector(".lid-toggle");
  const Row = backpackArticle.querySelector(".Size");
  const Column = Row;
  const MatrixDiv = backpackArticle.querySelector(".Matrix-Box");

  // handle "create matrix" button
  button.addEventListener("click", () => {
    MatrixDiv.innerHTML = "";
    let RowNum = Row.value;
    let ColumnNum = RowNum;
    MatrixDiv.append(CreateMat(RowNum, ColumnNum));
  });

  return backpackArticle;
};

// create matrix
const CreateMat = (RowNum, ColumnNum) => {
  let divMatrix = document.createElement("div");
  divMatrix.classList.add("Matrix");
  let MatContent = `
  <div class="row">
  <div class="col-xs-9">
  <p>Pairwise Comparison Matrix</p> 
  `;
  for (let i = 0; i < ColumnNum; i++) {
    MatContent += `<div class="col-12">`;
    for (let j = 0; j < RowNum; j++) {
      if (i < j) {
        MatContent += `<input type="number" name="mt${i}${j}" class="Mat" id="mt${i}${j}" value="1">`;
      } else if (i == j) {
        MatContent += `<input type="number" value="1" name="mt${i}${j}" class="Mat" id="mt${i}${j}"  disabled>`;
      } else {
        MatContent += `<input type="number" name="mt${i}${j}" class="Mat" id="mt${i}${j}" value="1" disabled>`;
      }
    }
    MatContent += `<br/><br/></div>`;
  }

  // add in new buttons for calculating geometric mean and kii triad
  MatContent += `
  <button class="btn btn-default mt-process">Process geometric mean</button>
  <button class="btn btn-default Kii-process">Process Kii</button> <strong><span class="Kii_result"></span></strong>
  </div>
  <div class="col-xs-3" id="geometric"></div>`;
  divMatrix.innerHTML = MatContent;

  const button = divMatrix.querySelector(".mt-process");
  const geometric = divMatrix.querySelector("#geometric");

  let MatContentMul = ``;
  MatContentMul += `<div class="col-12">
  <p>Geometric Mean</p>`;
  for (let i = 0; i < ColumnNum; i++) {
    MatContentMul += `<input type="number" value="1" name="gm${i}" class="Mat" id="gm${i}"  disabled>
    <br/><br/></div>`;
  }
  geometric.innerHTML = MatContentMul;

  // calculating the 1/(new value) when changes detected
  const ChangeInput = divMatrix.querySelectorAll(".Mat");
  ChangeInput.forEach((item) => {
    item.addEventListener("change", (event) => {
      let MatContentMul = ``;
      geometric.replaceChildren();
      let id = event.target.id.replace("mt", "");
      console.log(id[0]);
      let rowNum = id[0];
      id = id.split("").reverse().join("");
      let otherTxt = divMatrix.querySelector(`#mt${id}`);
      otherTxt.value = 1 / event.target.value;
      MatContentMul += `<div class="col-12">
    <p>Geometric Mean</p>`;
      for (let i = 0; i < ColumnNum; i++) {
        MatContentMul += `<input type="number" value="1" name="gm${i}" class="Mat" id="gm${i}"  disabled>
      <br/><br/></div>`;
      }
      geometric.innerHTML = MatContentMul;
      //handle click
    });
  });

  // when "geometrix mean" button is clicked
  button.addEventListener("click", () => {
    let MatContentMul = ``;
    geometric.replaceChildren();
    MatContentMul += `<div class="col-12">
    <p>Geometric Mean</p>`;
    for (let i = 0; i < ColumnNum; i++) {
      let mul = 1;
      for (let j = 0; j < RowNum; j++) {
        let otherTxt = divMatrix.querySelector(`#mt${i}${j}`);
        mul = mul * otherTxt.value;
      }
      MatContentMul += `<div class="col-12">
      <input type="number" value="${Math.pow(
        mul,
        1 / RowNum
      )}" name="gm${i}" class="Mat" id="gm${i}"  disabled>
      <br/><br/></div>`;
    }

    geometric.innerHTML = MatContentMul;
  });

  const buttonKii = divMatrix.querySelector(".Kii-process");

  buttonKii.addEventListener("click", () => {
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

    let finditem = dict[0];
    dict.forEach((item) => {
      if (item.value > finditem.value) {
        finditem = item;
      }
    });
    let indexes = finditem.key.split(",");
    let firstTxt = divMatrix.querySelector(`#mt${indexes[0]}${indexes[1]}`);
    let secondTxt = divMatrix.querySelector(`#mt${indexes[1]}${indexes[2]}`);
    let thirdTxt = divMatrix.querySelector(`#mt${indexes[0]}${indexes[2]}`);
    let resultShow = divMatrix.querySelector(".Kii_result");
    resultShow.innerHTML = `maximum of ${finditem.value} where ${finditem.key} is a triad`;
    firstTxt.style.backgroundColor = "#ffcbcb";
    secondTxt.style.backgroundColor = "#ffcbcb";
    thirdTxt.style.backgroundColor = "#ffcbcb";
  });

  return divMatrix;
};

const main = document.querySelector(".maincontent");
main.innerHTML = "";
main.append(backpackList());
