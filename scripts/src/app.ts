class Average {
  data: [];
  constructor() {
    this.data = [];
    this.getData();
  }

  ping() {
    console.log("pong");
  }
  getData() {
    const row = document.getElementById("przedmioty_86613");
    console.log(row?.children[0]?.children[0]?.children[1]?.children.length);
    const tbody = row?.children[0]?.children[0]?.children[1]?.children;
    for (let i = 0; i < tbody!.length; i++) {
      if (
        tbody![i]?.classList.contains("detail-grades") &&
        tbody![i]?.children[2]?.innerHTML !== "przewidywana roczna" &&
        tbody![i]?.children[2]?.innerHTML !== "roczna" &&
        tbody![i]?.children[2]?.innerHTML !== "przewidywana śródroczna" &&
        tbody![i]?.children[2]?.innerHTML !== "śródroczna" &&
        tbody![i]?.children[2]?.innerHTML !== "nieprzygotowanie"
      ) {
        console.log(tbody![i]); // TODO: do next
      }
    }
  }
}

let average;
!average ? (average = new Average()) : null;
