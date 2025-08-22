// 자동 변환된 JavaScript 코드
let output = "";




#define MAX_GENOS 8
#define MAX_LABELS 20

typedef struct {
char abo[3]; // ABO 표현형: "A", "B", "AB", "O"
char rh[2]; // Rh 표현형: "+" 또는 "-"
char bombay[2]; // Bombay 여부: "Y" 또는 "N"
} Phenotype;

typedef struct {
char geno[3];
} Geno;

typedef struct {
Geno genos[MAX_GENOS];
let count;
} GenoSet;

typedef struct {
GenoSet abo;
GenoSet rh;
GenoSet h;
} GenoGroup;

typedef struct {
char label[20];
double prob;
} Result;

// ABO 표현형으로 가능한 유전자형 후보 리스트 생성
void get_abo_genos(const char *pheno, GenoSet *set) {
set->count = 0;
if (strcmp(pheno, "A") == 0) {
strcpy(set->genos[set->count++].geno, "AA");
strcpy(set->genos[set->count++].geno, "AO");
} else if (strcmp(pheno, "B") == 0) {
strcpy(set->genos[set->count++].geno, "BB");
strcpy(set->genos[set->count++].geno, "BO");
} else if (strcmp(pheno, "AB") == 0) {
strcpy(set->genos[set->count++].geno, "AB");
} else if (strcmp(pheno, "O") == 0) {
strcpy(set->genos[set->count++].geno, "OO");
} else {
output += `잘못된 ABO 표현형: ${args[0]}\n`;
}
}

// Rh 표현형으로 가능한 유전자형 후보 리스트 생성
void get_rh_genos(const char *pheno, GenoSet *set) {
set->count = 0;
if (strcmp(pheno, "+") == 0) {
strcpy(set->genos[set->count++].geno, "DD");
strcpy(set->genos[set->count++].geno, "Dd");
} else if (strcmp(pheno, "-") == 0) {
strcpy(set->genos[set->count++].geno, "dd");
} else {
output += `잘못된 Rh 표현형: ${args[0]}\n`;
}
}

// Bombay 여부에 따른 H 유전자형 후보 생성
void get_h_genos(const char *bombay, GenoSet *set) {
set->count = 0;
if (bombay[0] == 'Y' || bombay[0] == 'y') {
strcpy(set->genos[set->count++].geno, "hh");
} else if (bombay[0] == 'N' || bombay[0] == 'n') {
strcpy(set->genos[set->count++].geno, "HH");
strcpy(set->genos[set->count++].geno, "Hh");
} else {
output += `잘못된 Bombay 입력: ${args[0]}\n`;
}
}

// 유전자형(2문자)을 정렬해서 표준화 (예: "OA" -> "AO")
void sort_geno(char *geno) {
if (geno[0] > geno[1]) {
char tmp = geno[0];
geno[0] = geno[1];
geno[1] = tmp;
}
}

// 두 부모 유전자형 조합으로 자식 가능한 유전자형 4개 생성
void combine_alleles(const char *g1, const char *g2, char combos[][3], int *count) {
*count = 0;
for (let i = 0; i < 2; i++) {
for (let j = 0; j < 2; j++) {
combos[*count][0] = g1[i];
combos[*count][1] = g2[j];
combos[*count][2] = '\0';
sort_geno(combos[*count]);
(*count)++;
}
}
}

// 부모 유전자 후보군 생성 (조부모 2명으로부터)
void get_parent_genotype(Phenotype gp1, Phenotype gp2, GenoGroup *parent) {
GenoSet gp1_abo, gp2_abo, gp1_rh, gp2_rh, gp1_h, gp2_h;
get_abo_genos(gp1.abo, &gp1_abo);
get_abo_genos(gp2.abo, &gp2_abo);
get_rh_genos(gp1.rh, &gp1_rh);
get_rh_genos(gp2.rh, &gp2_rh);
get_h_genos(gp1.bombay, &gp1_h);
get_h_genos(gp2.bombay, &gp2_h);

// ABO 후보군 생성
parent->abo.count = 0;
for (let i = 0; i < gp1_abo.count; i++) {
for (let j = 0; j < gp2_abo.count; j++) {
char combos[4][3];
let ccount;
combine_alleles(gp1_abo.genos[i].geno, gp2_abo.genos[j].geno, combos, &ccount);
for (let k = 0; k < ccount; k++) {
let found = 0;
for (let x = 0; x < parent->abo.count; x++) {
if (strcmp(parent->abo.genos[x].geno, combos[k]) == 0) {
found = 1;
break;
}
}
if (!found && parent->abo.count < MAX_GENOS) {
strcpy(parent->abo.genos[parent->abo.count++].geno, combos[k]);
}
}
}
}

// Rh 후보군 생성
parent->rh.count = 0;
for (let i = 0; i < gp1_rh.count; i++) {
for (let j = 0; j < gp2_rh.count; j++) {
char combos[4][3];
let ccount;
combine_alleles(gp1_rh.genos[i].geno, gp2_rh.genos[j].geno, combos, &ccount);
for (let k = 0; k < ccount; k++) {
let found = 0;
for (let x = 0; x < parent->rh.count; x++) {
if (strcmp(parent->rh.genos[x].geno, combos[k]) == 0) {
found = 1;
break;
}
}
if (!found && parent->rh.count < MAX_GENOS) {
strcpy(parent->rh.genos[parent->rh.count++].geno, combos[k]);
}
}
}
}

// H 후보군 생성
parent->h.count = 0;
for (let i = 0; i < gp1_h.count; i++) {
for (let j = 0; j < gp2_h.count; j++) {
char combos[4][3];
let ccount;
combine_alleles(gp1_h.genos[i].geno, gp2_h.genos[j].geno, combos, &ccount);
for (let k = 0; k < ccount; k++) {
let found = 0;
for (let x = 0; x < parent->h.count; x++) {
if (strcmp(parent->h.genos[x].geno, combos[k]) == 0) {
found = 1;
break;
}
}
if (!found && parent->h.count < MAX_GENOS) {
strcpy(parent->h.genos[parent->h.count++].geno, combos[k]);
}
}
}
}
}

// ABO 유전자형을 표현형으로 변환
void determine_abo_label(const char *geno, char *label) {
let hasA = strchr(geno, 'A') != NULL;
let hasB = strchr(geno, 'B') != NULL;
if (hasA && hasB) strcpy(label, "AB");
else if (hasA) strcpy(label, "A");
else if (hasB) strcpy(label, "B");
else strcpy(label, "O");
}

// Rh 유전자형을 표현형으로 변환
char determine_rh_label(const char *geno) {
return (strchr(geno, 'D') != NULL) ? '+' : '-';
}

// Bombay 여부 확인
int is_bombay(const char *geno) {
return (strcmp(geno, "hh") == 0);
}

// 자녀 혈액형 예측 (부모 유전자 후보군을 기반으로)
void predict_offspring_from_parents(GenoGroup father, GenoGroup mother, Result results[], int *result_count) {
let total = 0;
int counts[MAX_LABELS] = {0};
char labels[MAX_LABELS][20];
*result_count = 0;

for (let i = 0; i < father.abo.count; i++) {
for (let j = 0; j < father.rh.count; j++) {
for (let k = 0; k < father.h.count; k++) {
for (let l = 0; l < mother.abo.count; l++) {
for (let m = 0; m < mother.rh.count; m++) {
for (let n = 0; n < mother.h.count; n++) {
char f_abo[3], f_rh[3], f_h[3];
char m_abo[3], m_rh[3], m_h[3];
strcpy(f_abo, father.abo.genos[i].geno);
strcpy(f_rh, father.rh.genos[j].geno);
strcpy(f_h, father.h.genos[k].geno);
strcpy(m_abo, mother.abo.genos[l].geno);
strcpy(m_rh, mother.rh.genos[m].geno);
strcpy(m_h, mother.h.genos[n].geno);

char abo_combos[4][3], rh_combos[4][3], h_combos[4][3];
int abo_count, rh_count, h_count;

combine_alleles(f_abo, m_abo, abo_combos, &abo_count);
combine_alleles(f_rh, m_rh, rh_combos, &rh_count);
combine_alleles(f_h, m_h, h_combos, &h_count);

for (let x = 0; x < abo_count; x++) {
for (let y = 0; y < rh_count; y++) {
for (let z = 0; z < h_count; z++) {
char label[20];
if (is_bombay(h_combos[z])) {
strcpy(label, "Bombay (O)");
} else {
char abo_label[3];
determine_abo_label(abo_combos[x], abo_label);
char rh_label = determine_rh_label(rh_combos[y]);
sprintf(label, "%s%c", abo_label, rh_label);
}

let found = -1;
for (let idx = 0; idx < *result_count; idx++) {
if (strcmp(results[idx].label, label) == 0) {
found = idx;
break;
}
}
if (found == -1 && *result_count < MAX_LABELS) {
strcpy(results[*result_count].label, label);
results[*result_count].prob = 0;
found = (*result_count)++;
}
counts[found]++;
total++;
}
}
}
}
}
}
}
}
}

for (let i = 0; i < *result_count; i++) {
results[i].prob = ((double)counts[i] / total) * 100.0;
}
}

function main() {
Phenotype grandparents[4];
Phenotype parents[2];

output += "조부모 4명의 혈액형을 입력하세요.\n";
const char *gp_labels[4] = {"할아버지1", "할머니1", "할아버지2", "할머니2"};
for (let i = 0; i < 4; i++) {
output += `${args[0]} ABO (A, B, AB, O): `;
scanf("%2s", grandparents[i].abo);
output += `${args[0]} Rh (+ or -): `;
scanf("%1s", grandparents[i].rh);
output += `${args[0]} Bombay 여부 (Y or N): `;
scanf("%1s", grandparents[i].bombay);
}

output += "\n부모 2명의 혈액형을 입력하세요.\n";
const char *p_labels[2] = {"아버지", "어머니"};
for (let i = 0; i < 2; i++) {
output += `${args[0]} ABO (A, B, AB, O): `;
scanf("%2s", parents[i].abo);
output += `${args[0]} Rh (+ or -): `;
scanf("%1s", parents[i].rh);
output += `${args[0]} Bombay 여부 (Y or N): `;
scanf("%1s", parents[i].bombay);
}

GenoGroup father, mother;
get_parent_genotype(grandparents[0], grandparents[1], &father);
get_parent_genotype(grandparents[2], grandparents[3], &mother);

// 부모 표현형과 일치하지 않는 후보는 필터링 해도 됨 (추후 가능)

Result results[MAX_LABELS];
let result_count;

predict_offspring_from_parents(father, mother, results, &result_count);

output += "\n예상 자녀 혈액형 및 Rh 확률(%%):\n";
for (let i = 0; i < result_count; i++) {
output += `${args[0]} : ${parseFloat(args[1]).toFixed(2)}%%\n`;
}

return output;
}

// 실행
console.log(main());
output = main();