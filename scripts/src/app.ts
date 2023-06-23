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

  ping() {
    console.log("pong");
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
    console.log(this.regularGrades);
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
    console.log(this.pointGrades);
  }

  calculateAverage(array: [Grade[], Grade[]], method: string) {
    if (method === "regular") {
      let avg1sum = 0;
      let avg1weight = 0;
      for (let i = 0; i < array[0].length; i++) {
        avg1sum += array[0][i]!.value * array[0][i]!.weight;
      }
      for (let i = 0; i < array[0].length; i++) {
        avg1weight += array[0][i]!.weight;
      }
      let avg1 = avg1sum / avg1weight;
      console.log(avg1);

      let avg2sum = 0;
      let avg2weight = 0;
      for (let i = 0; i < array[1].length; i++) {
        avg2sum += array[1][i]!.value * array[1][i]!.weight;
      }
      for (let i = 0; i < array[1].length; i++) {
        avg2weight += array[1][i]!.weight;
      }
      let avg2 = avg2sum / avg2weight;
      console.log(avg2);
      return [avg1, avg2, (avg1sum + avg2sum) / (avg1weight + avg2weight)];
    } else {
      let avg1sum = 0;
      let avg1weight = 0;
      for (let i = 0; i < array[0].length; i++) {
        avg1sum += array[0][i]!.value;
      }
      for (let i = 0; i < array[0].length; i++) {
        avg1weight += array[0][i]!.weight;
      }
      let avg1 = avg1sum / avg1weight;
      console.log(avg1);

      let avg2sum = 0;
      let avg2weight = 0;
      for (let i = 0; i < array[1].length; i++) {
        avg2sum += array[1][i]!.value;
      }
      for (let i = 0; i < array[1].length; i++) {
        avg2weight += array[1][i]!.weight;
      }
      let avg2 = avg2sum / avg2weight;
      console.log(avg2);
      return [avg1 * 100, avg2 * 100, ((avg1sum + avg2sum) / (avg1weight + avg2weight)) * 100];
    }
  }

  displayAverage() {
    if (Object.keys(this.regularGrades).length > 0 && Object.keys(this.pointGrades).length > 0) {
      for (let i = 0; i < this.regularGradesTable!.length! - 2; i += 2) {
        const tdArray = this.regularGradesTable[i]!.children!;
        const tdArraySubject = this.formatSubjectName(tdArray[1]!.innerHTML);
        for (let j = 0; j < Object.keys(this.regularGrades).length; j++) {
          if (tdArraySubject === Object.keys(this.regularGrades)[j]) {
            console.log(Object.keys(this.regularGrades)[j]);
            const averages = this.calculateAverage(this.regularGrades[tdArraySubject]!.grades, "regular");
            tdArray[3]!.innerHTML = String(averages[0]!.toFixed(2));
            tdArray[7]!.innerHTML = String(averages[1]!.toFixed(2));
            tdArray[10]!.innerHTML = String(averages[2]!.toFixed(2));
          }
        }
      }
    }
    for (let i = 0; i < this.regularGradesTable!.length! - 2; i += 2) {
      const tdArray = this.regularGradesTable[i]!.children!;
      const tdArraySubject = this.formatSubjectName(tdArray[1]!.innerHTML);
      for (let j = 0; j < Object.keys(this.pointGrades).length; j++) {
        if (tdArraySubject === Object.keys(this.pointGrades)[j]) {
          if (i === 0) {
            console.log(tdArraySubject);
          }
          console.log(this.pointGrades[tdArraySubject]!.grades);
          const averages = this.calculateAverage(this.pointGrades[tdArraySubject]!.grades, "point");
          console.log(averages);
          tdArray[3]!.innerHTML = String(averages[0]!.toFixed(2));
          tdArray[7]!.innerHTML = String(averages[1]!.toFixed(2));
          tdArray[10]!.innerHTML = String(averages[2]!.toFixed(2));
        }
      }
    }
  }

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
