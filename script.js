function combineAlleles(a1, a2) {
  let combos = [];
  for (let i = 0; i < a1.length; i++) {
    for (let j = 0; j < a2.length; j++) {
      let combo = [a1[i], a2[j]].sort().join('');
      if (!combos.includes(combo)) combos.push(combo);
    }
  }
  return combos;
}

function getABOGenos(abo) {
  switch(abo.toUpperCase()) {
    case "A": return ["AA","AO"];
    case "B": return ["BB","BO"];
    case "AB": return ["AB"];
    case "O": return ["OO"];
    default: return [];
  }
}

function getRhGeno(rh) {
  return (rh === "+") ? ["DD","Dd"] : ["dd"];
}

function getHGeno(h) {
  return (h.toUpperCase() === "Y") ? ["hh"] : ["HH","Hh"];
}

function determineABO(geno) {
  if (geno.includes("A") && geno.includes("B")) return "AB";
  if (geno.includes("A")) return "A";
  if (geno.includes("B")) return "B";
  return "O";
}

function determineRh(geno) {
  return geno.includes("D") ? "+" : "-";
}

function isBombay(geno) {
  return geno === "hh";
}

function predictOffspring() {
  const fatherABO = getABOGenos(document.getElementById("fatherABO").value);
  const fatherRh = getRhGeno(document.getElementById("fatherRh").value);
  const fatherH = getHGeno(document.getElementById("fatherH").value);

  const motherABO = getABOGenos(document.getElementById("motherABO").value);
  const motherRh = getRhGeno(document.getElementById("motherRh").value);
  const motherH = getHGeno(document.getElementById("motherH").value);

  let results = {};

  fatherABO.forEach(fABO => {
    fatherRh.forEach(fRh => {
      fatherH.forEach(fH => {
        motherABO.forEach(mABO => {
          motherRh.forEach(mRh => {
            motherH.forEach(mH => {
              let aboCombos = combineAlleles(fABO, mABO);
              let rhCombos = combineAlleles(fRh, mRh);
              let hCombos = combineAlleles(fH, mH);

              aboCombos.forEach(abo => {
                rhCombos.forEach(rh => {
                  hCombos.forEach(h => {
                    let label = isBombay(h) ? "Bombay (O)" : determineABO(abo) + determineRh(rh);
                    results[label] = (results[label] || 0) + 1;
                  });
                });
              });

            });
          });
        });
      });
    });
  });

  let outputText = "";
  let total = Object.values(results).reduce((a,b)=>a+b,0);
  for (const key in results) {
    let percent = ((results[key]/total)*100).toFixed(2);
    outputText += `${key}: ${percent}%\n`;
  }

  document.getElementById("output").textContent = outputText;
}
