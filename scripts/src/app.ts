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
  pointGrades: { [key: string]: Subject };
  pointGradesTable: HTMLCollection;

  constructor() {
    this.regularGrades = {};
    this.pointGrades = {};
    this.regularGradesTable = document.getElementsByClassName("decorated stretch")[1]!.children[1]!.children;
    this.pointGradesTable = document.getElementsByClassName("decorated stretch")[2]!.children[1]!.children;
    this.getRegularGrades();
    this.getPointGrades();
    this.displayAverage();
  }

  getRegularGrades() {
    for (let i = 0; i < this.regularGradesTable!.length - 2; i += 2) {
      const subject =
        this.regularGradesTable![i]!.children[1]!.innerHTML.search("<") != -1
          ? this.regularGradesTable![i]!.children[1]!.innerHTML.split("<")[0]!.trim()
          : this.regularGradesTable![i]!.children[1]!.innerHTML!;
      const formattedSubject = this.formatSubjectName(this.regularGradesTable![i]!.children[1]!.innerHTML);
      if (this.regularGradesTable![i]!.children[2]!.innerHTML !== "Brak ocen") {
        const grades = this.regularGradesTable![i + 1]!.children[0]!.children[0]!.children[1]!.children;
        let semester = -1;
        let gradeArray: [Grade[], Grade[]] = [[], []];
        for (let j = 0; j < grades.length; j++) {
          if (grades[j]!.innerHTML.includes("Okres")) {
            semester++;
          } else {
            if (
              grades[j]?.children[6]?.innerHTML !== "" &&
              grades[j]?.children[0]?.innerHTML! !== "np" &&
              grades[j]?.children[0]?.innerHTML! !== "+" &&
              grades[j]?.children[0]?.innerHTML! !== "-"
            ) {
              const grade =
                grades[j]?.children[0]?.innerHTML!.length! > 1
                  ? parseFloat(grades[j]?.children[0]?.innerHTML[0]!) + 0.5
                  : parseFloat(grades[j]?.children[0]?.innerHTML[0]!);
              const weight = parseFloat(grades[j]?.children[6]?.innerHTML!);
              semester === 0
                ? gradeArray[0]!.push({ value: grade, weight: weight })
                : gradeArray[1]!.push({ value: grade, weight: weight });
            }
          }
        }
        this.regularGrades[formattedSubject] = { name: subject, grades: gradeArray };
      }
    }
  }

  getPointGrades() {
    for (let i = 0; i < this.pointGradesTable!.length - 2; i += 2) {
      const subject =
        this.pointGradesTable![i]!.children[1]!.innerHTML.search("<") != -1
          ? this.pointGradesTable![i]!.children[1]!.innerHTML.split("<")[0]!.trim()
          : this.pointGradesTable![i]!.children[1]!.innerHTML!;
      const formattedSubject = this.formatSubjectName(this.pointGradesTable![i]!.children[1]!.innerHTML);
      if (this.pointGradesTable![i]!.children[2]!.innerHTML !== "Brak ocen") {
        const grades = this.pointGradesTable![i + 1]!.children[1]!.children[0]!.children[1]!.children;
        let semester = -1;
        let gradeArray: [Grade[], Grade[]] = [[], []];
        for (let j = 0; j < grades.length; j++) {
          if (grades[j]!.innerHTML.includes("Okres")) {
            semester++;
          } else {
            if (grades[j]?.children[0]?.innerHTML.search("/") !== -1 && grades[j]?.children[0]?.innerHTML !== "0/0") {
              const grade = parseFloat(grades[j]?.children[0]?.innerHTML!.split("/")[0]!);
              const weight = parseFloat(grades[j]?.children[0]?.innerHTML!.split("/")[1]!);
              semester === 0
                ? gradeArray[0]!.push({ value: grade, weight: weight })
                : gradeArray[1]!.push({ value: grade, weight: weight });
            }
          }
        }
        this.pointGrades[formattedSubject] = { name: subject, grades: gradeArray };
      }
    }
  }

  calculateAverage(array: [Grade[], Grade[]], method: string) {
    let avg1sum = 0;
    let avg1weight = 0;
    let avg2sum = 0;
    let avg2weight = 0;
    if (method === "regular") {
      for (let i = 0; i < array[0].length; i++) {
        avg1sum += array[0][i]!.value * array[0][i]!.weight;
        avg1weight += array[0][i]!.weight;
      }
      for (let i = 0; i < array[1].length; i++) {
        avg2sum += array[1][i]!.value * array[1][i]!.weight;
        avg2weight += array[1][i]!.weight;
      }
      return [avg1sum / avg1weight, avg2sum / avg2weight, (avg1sum + avg2sum) / (avg1weight + avg2weight)];
    } else {
      for (let i = 0; i < array[0].length; i++) {
        avg1sum += array[0][i]!.value;
        avg1weight += array[0][i]!.weight;
      }
      for (let i = 0; i < array[1].length; i++) {
        avg2sum += array[1][i]!.value;
        avg2weight += array[1][i]!.weight;
      }
      return [
        (avg1sum / avg1weight) * 100,
        (avg2sum / avg2weight) * 100,
        ((avg1sum + avg2sum) / (avg1weight + avg2weight)) * 100,
      ];
    }
  }

  displayAverage() {
    for (let i = 0; i < this.regularGradesTable!.length! - 2; i += 2) {
      const tdArray = this.regularGradesTable[i]!.children!;
      const tdArraySubject = this.formatSubjectName(tdArray[1]!.innerHTML);
      for (let j = 0; j < Object.keys(this.regularGrades).length; j++) {
        if (tdArraySubject === Object.keys(this.regularGrades)[j]) {
          const averages = this.calculateAverage(this.regularGrades[tdArraySubject]!.grades, "regular");
          tdArray[3]!.innerHTML = String(averages[0]!.toFixed(2));
          tdArray[7]!.innerHTML = String(averages[1]!.toFixed(2));
          tdArray[10]!.innerHTML = String(averages[2]!.toFixed(2));
        }
      }
      for (let j = 0; j < Object.keys(this.pointGrades).length; j++) {
        if (tdArraySubject === Object.keys(this.pointGrades)[j]) {
          const averages = this.calculateAverage(this.pointGrades[tdArraySubject]!.grades, "point");
          tdArray[3]!.innerHTML = String(averages[0]!.toFixed(2));
          tdArray[7]!.innerHTML = String(averages[1]!.toFixed(2));
          tdArray[10]!.innerHTML = String(averages[2]!.toFixed(2));
        }
      }
    }
  }

  formatSubjectName(name: string) {
    if (name.search("<") !== -1) {
      return name.split("<")[0]!.trim().replaceAll(" ", "_").replaceAll(".", "").toLowerCase();
    } else {
      return name.trim().replaceAll(" ", "_").replaceAll(".", "").toLowerCase();
    }
  }
}

let average = new Grades();
