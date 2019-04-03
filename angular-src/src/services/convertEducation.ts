export function convertToString(education) {
    
    if (education == 7) {
        education = "Bachelors"
    }
    else if (education == 4) {
        education = 'Middle'
    }
    else if (education == 5) {
        education = 'Matric'
    }
    else if (education == 6) {
        education = 'Intermediate'
    }
    else if (education == 8) {
        education = 'Masters'
    }
    else {
        education = "Primary"
    }
    return education;
}

export function convertToNumber(education) {
    
    if (education == "Bachelors" || education == "DAE") {
        education = 7
    }
    else if (education == "Middle") {
        education = 4
    }
    else if (education == "Matric" || education == "O-Levels") {
        education = 5
    }
    else if (education == "Intermediate" || education == "A-Levels") {
        education = 6
    }
    else if (education == "Masters") {
        education = 8
    }
    else {
        education = 3
    }
    return education;
}
