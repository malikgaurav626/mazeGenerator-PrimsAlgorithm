const jsPDF = window.jspdf.jsPDF;
function saveElementAsPdf() {
  const elementToSave = document.getElementById("table-id");

  html2canvas(elementToSave).then((canvas) => {
    const imageData = canvas.toDataURL("image/png");

    // Get the dimensions of the element
    const elementWidth = elementToSave.offsetWidth;
    const elementHeight = elementToSave.offsetHeight;

    // Create a new jsPDF instance with custom page size
    const pdf = new jsPDF({
      format: [elementWidth + 50, elementHeight + 100], // Add some extra padding
    });

    // Calculate the horizontal and vertical centering positions
    const positionX = (pdf.internal.pageSize.getWidth() - elementWidth) / 2;
    const positionY = (pdf.internal.pageSize.getHeight() - elementHeight) / 2;

    // Add the image to the PDF at the center position
    pdf.addImage(
      imageData,
      "PNG",
      positionX,
      positionY,
      elementWidth,
      elementHeight
    );

    pdf.save("Maze.pdf");
  });
}

function createMatrix() {
  // Get the dimensions from the input fields
  var rows = parseInt(document.getElementById("rows").value);
  var cols = parseInt(document.getElementById("cols").value);

  let container = document.getElementById("matrix-container");
  container.innerHTML = "";
  container.style.cssText = `text-align: center; border-collapse:collapse;`;
  let newElement = document.createElement("table");
  newElement.id = "table-id";
  newElement.style.cssText = "border 1px solid black";
  container.appendChild(newElement);
  for (let i = 0; i < rows; i++) {
    addRow(i);
    for (let j = 0; j < cols; j++) {
      addCol(i, j, rows, cols);
    }
  }
  let maze = new Maze(rows, cols);
  maze.generate();
  maze.display();
}
function addRow(i) {
  let container = document.getElementById("table-id");
  let newElement = document.createElement("tr");
  newElement.classList.add("table-row");
  newElement.id = `t-row-${i}`;
  container.appendChild(newElement);
}
function addCol(i, j, rows, cols) {
  let windowWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  let maxPadding = Math.floor(windowWidth / (cols + 1));

  let padding = Math.min(maxPadding, 10);
  let container = document.getElementById("t-row-" + i);
  let newElement = document.createElement("td");
  newElement.classList.add("table-data");
  newElement.id = `t-data-${i}-${j}`;
  newElement.style.cssText = `border: 1px solid #424874; padding: ${padding}px; position: relative;`;
  container.appendChild(newElement);
}
class matrix_element {
  constructor() {
    this.top = true;
    this.bottom = true;
    this.left = true;
    this.right = true;
    this.visited = false;
    this.frontier = false;
  }
}
class cords {
  constructor() {
    this.row = 0;
    this.col = 0;
  }
  give_cords() {
    let cordinates = [];
    cordinates.push(this.row);
    conrdinates.push(this.col);
    return cordinates;
  }
}
class Maze {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.matrix = [];
    for (let i = 0; i < rows; i++) {
      this.matrix[i] = [];
    }
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.matrix[i][j] = new matrix_element();
      }
    }
  }
  adjacent_cells(random_cell) {
    let cellList = [];
    let row = random_cell.row;
    let col = random_cell.col;
    if (row > 0) {
      let temp = new cords();
      temp.col = col;
      temp.row = row - 1;
      cellList.push(temp);
    }
    if (row < this.rows - 1) {
      let temp = new cords();
      temp.col = col;
      temp.row = row + 1;
      cellList.push(temp);
    }
    if (col < this.cols - 1) {
      let temp = new cords();
      temp.col = col + 1;
      temp.row = row;
      cellList.push(temp);
    }
    if (col > 0) {
      let temp = new cords();
      temp.col = col - 1;
      temp.row = row;
      cellList.push(temp);
    }

    return cellList;
  }
  addToFrontier(cellList) {
    for (let ele of cellList) {
      if (this.matrix[ele.row][ele.col].visited === false) {
        this.matrix[ele.row][ele.col].frontier = true;
      }
    }
  }
  getFrontierSet() {
    let frontierSet = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.matrix[i][j].frontier == true) {
          let temp = new cords();
          temp.row = i;
          temp.col = j;
          frontierSet.push(temp);
        }
      }
    }
    return frontierSet;
  }
  getAdjacentCellVisited(cell) {
    let cellList = [];
    let row = cell.row;
    let col = cell.col;
    if (row > 0) {
      let temp = new cords();
      temp.col = col;
      temp.row = row - 1;
      cellList.push(temp);
    }
    if (row < this.rows - 1) {
      let temp = new cords();
      temp.col = col;
      temp.row = row + 1;
      cellList.push(temp);
    }
    if (col < this.cols - 1) {
      let temp = new cords();
      temp.col = col + 1;
      temp.row = row;
      cellList.push(temp);
    }
    if (col > 0) {
      let temp = new cords();
      temp.col = col - 1;
      temp.row = row;
      cellList.push(temp);
    }

    let adjacentcells = [];
    for (let i = 0; i < cellList.length; i++) {
      if (this.matrix[cellList[i].row][cellList[i].col].visited) {
        adjacentcells.push(cellList[i]);
      }
    }
    return adjacentcells;
  }
  breakWall(currentCell, randomAdjacentCellVisited) {
    let rowDiff = currentCell.row - randomAdjacentCellVisited.row;
    let colDiff = currentCell.col - randomAdjacentCellVisited.col;

    if (rowDiff === 1) {
      this.matrix[currentCell.row][currentCell.col].top = false;
      this.matrix[randomAdjacentCellVisited.row][
        randomAdjacentCellVisited.col
      ].bottom = false;
    } else if (rowDiff === -1) {
      this.matrix[currentCell.row][currentCell.col].bottom = false;
      this.matrix[randomAdjacentCellVisited.row][
        randomAdjacentCellVisited.col
      ].top = false;
    } else if (colDiff === 1) {
      this.matrix[currentCell.row][currentCell.col].left = false;
      this.matrix[randomAdjacentCellVisited.row][
        randomAdjacentCellVisited.col
      ].right = false;
    } else if (colDiff === -1) {
      this.matrix[currentCell.row][currentCell.col].right = false;
      this.matrix[randomAdjacentCellVisited.row][
        randomAdjacentCellVisited.col
      ].left = false;
    }
  }

  generate() {
    let random_cell = new cords();
    random_cell.row = Math.floor(Math.random() * this.rows);
    random_cell.col = Math.floor(Math.random() * this.cols);

    this.matrix[random_cell.row][random_cell.col].visited = true;
    let adjacent_cells = this.adjacent_cells(random_cell);

    this.addToFrontier(adjacent_cells);

    while (this.getFrontierSet().length > 0) {
      let frontierSet = this.getFrontierSet();
      let frontierCellIndex = Math.floor(Math.random() * frontierSet.length);

      let randomFrontierCell = frontierSet[frontierCellIndex];
      random_cell = randomFrontierCell;
      this.matrix[randomFrontierCell.row][
        randomFrontierCell.col
      ].frontier = false;
      this.matrix[randomFrontierCell.row][
        randomFrontierCell.col
      ].visited = true;

      let adjacentCellVisitedList = this.getAdjacentCellVisited(random_cell);
      let randomAdjacentCellVisitedIndex = Math.floor(
        Math.random() * adjacentCellVisitedList.length
      );
      let randomAdjacentCellVisited =
        adjacentCellVisitedList[randomAdjacentCellVisitedIndex];

      this.breakWall(random_cell, randomAdjacentCellVisited);

      adjacent_cells = this.adjacent_cells(random_cell);
      this.addToFrontier(adjacent_cells);
    }
  }
  display() {
    let original = document.getElementById("matrix-container");
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!this.matrix[i][j].top) {
          document.getElementById(`t-data-${i}-${j}`).style.borderTop = "none";
        }
        if (!this.matrix[i][j].bottom) {
          document.getElementById(`t-data-${i}-${j}`).style.borderBottom =
            "none";
        }
        if (!this.matrix[i][j].left) {
          document.getElementById(`t-data-${i}-${j}`).style.borderLeft = "none";
        }
        if (!this.matrix[i][j].right) {
          document.getElementById(`t-data-${i}-${j}`).style.borderRight =
            "none";
        }
      }
    }
  }
}
