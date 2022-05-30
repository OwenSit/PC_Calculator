//Write and developed by Majid Piramoon
const backpackList = () => {
  let backpackArticle = document.createElement("article");
  backpackArticle.classList.add("backpack");

  backpackArticle.innerHTML = `

  <div class="row">
  <div class="col-sm-2">
  <div class="form-group">
  <strong>Matrix Size:</strong>
  <label for="Row">Row</label>
  <input type="number" name="Row" class="form-control Row" >
</div>
<div class="form-group">
  <label for="Column">Column</label>
  <input type="number" name="Column" class="form-control Column">
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
  const Row = backpackArticle.querySelector(".Row");
  const Column = backpackArticle.querySelector(".Column");
  const MatrixDiv = backpackArticle.querySelector(".Matrix-Box");

  button.addEventListener("click", () => {
    MatrixDiv.innerHTML = "";
    let RowNum = Row.value;
    let ColumnNum = Column.value;
    MatrixDiv.append(CreateMat(RowNum, ColumnNum));
  });

  return backpackArticle;
};

const CreateMat = (RowNum, ColumnNum) => {
  let divMatrix = document.createElement("div");
  divMatrix.classList.add("Matrix");
  let MatContent = `
  <div class="row">
  <div class="col-xs-9">
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
  MatContent += `
  <button class="btn btn-default mt-process">Process geometric mean</button>
  <button class="btn btn-default Kii-process">Process Kii</button> <strong><span class="Kii_result"></span></strong>
  </div>
  <div class="col-xs-3" id="geometric"></div>`;
  divMatrix.innerHTML = MatContent;

  const ChangeInput = divMatrix.querySelectorAll(".Mat");
  ChangeInput.forEach((item) => {
    item.addEventListener("change", (event) => {
      let id = event.target.id.replace("mt", "");
      id = id.split("").reverse().join("");
      let otherTxt = divMatrix.querySelector(`#mt${id}`);
      otherTxt.value = 1 / event.target.value;

      //handle click
    });
  });

  const button = divMatrix.querySelector(".mt-process");
  const geometric = divMatrix.querySelector("#geometric");

  button.addEventListener("click", () => {
    let MatContentMul = ``;
    geometric.replaceChildren();
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
              value: Math.min(A, B)
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
