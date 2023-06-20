interface Grade {
  value: number;
  weight: number;
}

interface Subject {
  name: string;
  grades: [Grade[], Grade[]];
}

class Grades {
  regularGrades: { [key: string]: Subject };
  regularGradesTable: HTMLCollection;
  pointGrades: any;
  pointGradesTable: HTMLCollection;

  constructor() {
    this.regularGrades = {};
    this.pointGrades = {};
    this.regularGradesTable = document.getElementsByClassName("decorated stretch")[1]!.children[1]!.children;
    this.pointGradesTable = document.getElementsByClassName("decorated stretch")[2]!.children[1]!.children;
    this.getRegularGrades();
  }

  ping() {
    console.log(document.getElementsByClassName("decorated stretch")[1]?.children[1]?.children);
  }

  getRegularGrades() {
    console.log(this.regularGradesTable);
    for (let i = 0; i < this.regularGradesTable!.length - 2; i += 2) {
      const subject = this.regularGradesTable![i]!.children[1]!.innerHTML;
      const formattedSubject = this.formatSubjectName(this.regularGradesTable![i]!.children[1]!.innerHTML);
      console.log(subject);
      if (this.regularGradesTable![i]!.children[2]!.innerHTML !== "Brak ocen") {
        const grades = this.regularGradesTable![i + 1]!.children[0]!.children[0]!.children[1]!.children;
        console.log(grades);
        let semester = -1;
        let gradeArray: [Grade[], Grade[]] = [[], []];
        for (let j = 0; j < grades.length; j++) {
          if (grades[j]!.innerHTML.includes("Okres")) {
            semester++;
          } else {
            console.log(grades[j]?.children[0], semester);
            console.log(grades[j]?.children[6]?.innerHTML !== "");
            if (grades[j]?.children[6]?.innerHTML !== "") {
              const grade =
                grades[j]?.children[0]?.innerHTML!.length! > 1
                  ? parseFloat(grades[j]?.children[0]?.innerHTML[0]!) + 0.5
                  : parseFloat(grades[j]?.children[0]?.innerHTML[0]!);
              console.log(grade);
              const weight = parseFloat(grades[j]?.children[6]?.innerHTML!);
              semester === 0
                ? gradeArray[0]!.push({ value: grade, weight: weight })
                : gradeArray[1]!.push({ value: grade, weight: weight });
            }
          }
        }
        this.regularGrades[formattedSubject] = { name: subject, grades: gradeArray };
      } else {
        console.log("brak ocen lub ocena punktowa");
      }
    }
    console.log(this.regularGrades["język_angielski"]);
  }

  getPointGrades() {}

  formatSubjectName(name: string) {
    let formattedName = "";
    if (name.search("<") !== -1) {
      formattedName = name.split("<")[0]!.trim().replaceAll(" ", "_").replaceAll(".", "").toLowerCase();
    } else {
      formattedName = name.trim().replaceAll(" ", "_").replaceAll(".", "").toLowerCase();
    }
    return formattedName;
  }
}

let average;
!average ? (average = new Grades()) : null;
