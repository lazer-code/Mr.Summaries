import { Summary } from "@/types/summary";

export const mockSummaries: Summary[] = [
  {
    id: "1",
    courseNumber: "MATH 201",
    courseName: "Calculus II",
    title: "Integration Techniques and Applications",
    author: "Sarah Johnson",
    uploadDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    preview: "This summary covers various integration techniques including integration by parts, trigonometric substitution, and partial fractions...",
    content: `# Integration Techniques and Applications

## Introduction
This summary covers various integration techniques essential for Calculus II.

## Integration by Parts
The integration by parts formula is:

$$\\int u \\, dv = uv - \\int v \\, du$$

### Example
Let's integrate $\\int x e^x \\, dx$:

- Let $u = x$, so $du = dx$
- Let $dv = e^x dx$, so $v = e^x$

Therefore:
$$\\int x e^x \\, dx = xe^x - \\int e^x \\, dx = xe^x - e^x + C$$

## Trigonometric Substitution

| Expression | Substitution | Identity Used |
|------------|--------------|---------------|
| $\\sqrt{a^2 - x^2}$ | $x = a\\sin\\theta$ | $\\sin^2\\theta + \\cos^2\\theta = 1$ |
| $\\sqrt{a^2 + x^2}$ | $x = a\\tan\\theta$ | $\\tan^2\\theta + 1 = \\sec^2\\theta$ |
| $\\sqrt{x^2 - a^2}$ | $x = a\\sec\\theta$ | $\\sec^2\\theta - 1 = \\tan^2\\theta$ |

## Partial Fractions
For rational functions, we can decompose them into simpler fractions:

$$\\frac{P(x)}{Q(x)} = \\frac{A}{x-a} + \\frac{B}{x-b} + ...$$

### Practice Problem
Find $\\int \\frac{x+1}{x^2-1} dx$

## Applications
- Area under curves
- Volume of revolution
- Arc length
- Surface area`
  },
  {
    id: "2",
    courseNumber: "PHYS 102",
    courseName: "Physics: Electricity and Magnetism",
    title: "Maxwell's Equations Summary",
    author: "Michael Chen",
    uploadDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    preview: "A comprehensive summary of Maxwell's equations, their integral and differential forms, and their physical interpretations...",
    content: `# Maxwell's Equations

## Overview
Maxwell's equations are a set of four fundamental equations that describe how electric and magnetic fields interact.

## The Four Equations

### 1. Gauss's Law
**Integral form:**
$$\\oint_S \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{enc}}{\\epsilon_0}$$

**Differential form:**
$$\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}$$

*Physical meaning:* Electric charges produce electric fields.

### 2. Gauss's Law for Magnetism
**Integral form:**
$$\\oint_S \\mathbf{B} \\cdot d\\mathbf{A} = 0$$

**Differential form:**
$$\\nabla \\cdot \\mathbf{B} = 0$$

*Physical meaning:* There are no magnetic monopoles.

### 3. Faraday's Law
**Integral form:**
$$\\oint_C \\mathbf{E} \\cdot d\\mathbf{l} = -\\frac{d\\Phi_B}{dt}$$

**Differential form:**
$$\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$$

*Physical meaning:* A changing magnetic field creates an electric field.

### 4. Ampère-Maxwell Law
**Integral form:**
$$\\oint_C \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I_{enc} + \\mu_0 \\epsilon_0 \\frac{d\\Phi_E}{dt}$$

**Differential form:**
$$\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}$$

*Physical meaning:* Electric currents and changing electric fields create magnetic fields.

## Key Constants

| Symbol | Name | Value |
|--------|------|-------|
| $\\epsilon_0$ | Permittivity of free space | $8.854 \\times 10^{-12}$ F/m |
| $\\mu_0$ | Permeability of free space | $4\\pi \\times 10^{-7}$ H/m |
| $c$ | Speed of light | $\\frac{1}{\\sqrt{\\mu_0 \\epsilon_0}}$ |

## Applications
- Electromagnetic waves
- Radio transmission
- Light propagation
- Circuit theory`
  },
  {
    id: "3",
    courseNumber: "CS 224",
    courseName: "Data Structures and Algorithms",
    title: "Sorting Algorithms Comparison",
    author: "Emily Rodriguez",
    uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    preview: "Comprehensive comparison of common sorting algorithms including bubble sort, merge sort, quick sort, and heap sort...",
    content: `# Sorting Algorithms

## Overview
This summary compares various sorting algorithms based on time complexity, space complexity, and stability.

## Algorithm Comparison

| Algorithm | Best Case | Average Case | Worst Case | Space | Stable |
|-----------|-----------|--------------|------------|-------|--------|
| Bubble Sort | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes |
| Selection Sort | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | No |
| Insertion Sort | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes |
| Merge Sort | $O(n \\log n)$ | $O(n \\log n)$ | $O(n \\log n)$ | $O(n)$ | Yes |
| Quick Sort | $O(n \\log n)$ | $O(n \\log n)$ | $O(n^2)$ | $O(\\log n)$ | No |
| Heap Sort | $O(n \\log n)$ | $O(n \\log n)$ | $O(n \\log n)$ | $O(1)$ | No |

## Merge Sort

### Algorithm
Merge sort uses the divide-and-conquer strategy:

1. **Divide:** Split the array into two halves
2. **Conquer:** Recursively sort each half
3. **Combine:** Merge the sorted halves

### Pseudocode
\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
\`\`\`

### Time Complexity Analysis
The recurrence relation for merge sort is:

$$T(n) = 2T(\\frac{n}{2}) + O(n)$$

Using the Master Theorem, we get $T(n) = O(n \\log n)$.

## Quick Sort

### Key Idea
- Choose a pivot element
- Partition array so elements smaller than pivot are on left, larger on right
- Recursively sort both partitions

### Average vs Worst Case
- **Average:** $O(n \\log n)$ with random pivot selection
- **Worst:** $O(n^2)$ when pivot is always smallest/largest element

## Choosing an Algorithm

**Use Merge Sort when:**
- Guaranteed $O(n \\log n)$ performance is needed
- Stability is required
- Working with linked lists

**Use Quick Sort when:**
- Average case performance is priority
- In-place sorting is needed
- Working with arrays

**Use Insertion Sort when:**
- Array is small ($n < 50$)
- Array is nearly sorted
- As part of hybrid algorithms`
  },
  {
    id: "4",
    courseNumber: "CHEM 301",
    courseName: "Organic Chemistry",
    title: "Reaction Mechanisms and Arrow Pushing",
    author: "David Park",
    uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    preview: "Understanding electron movement in organic reactions through curved arrow notation and mechanism types...",
    content: `# Reaction Mechanisms

## Introduction
Organic reaction mechanisms show the step-by-step process of how reactants transform into products.

## Arrow Pushing Basics

### Curved Arrow Notation
- **Full arrow (→):** Shows movement of an electron pair
- **Half arrow (⇀):** Shows movement of a single electron

### Rules
1. Arrows always start from electron-rich regions
2. Arrows point to electron-poor regions
3. Count electrons to verify formal charges

## Common Reaction Types

### 1. $S_N2$ Mechanism
Substitution, Nucleophilic, Bimolecular

**Characteristics:**
- One-step mechanism
- Backside attack
- Inversion of configuration
- Rate = $k[RX][Nu^-]$

**Energy diagram:** Single transition state, no intermediate

### 2. $S_N1$ Mechanism
Substitution, Nucleophilic, Unimolecular

**Characteristics:**
- Two-step mechanism
- Carbocation intermediate
- Racemization (usually)
- Rate = $k[RX]$

**Steps:**
1. Leaving group departs → carbocation forms
2. Nucleophile attacks carbocation

### 3. $E2$ Mechanism
Elimination, Bimolecular

**Requirements:**
- Anti-periplanar geometry
- Strong base
- Rate = $k[RX][Base]$

### 4. $E1$ Mechanism
Elimination, Unimolecular

**Characteristics:**
- Two-step process
- Carbocation intermediate
- Follows Zaitsev's rule
- Rate = $k[RX]$

## Reaction Conditions Table

| Mechanism | Substrate | Nucleophile/Base | Solvent | Temperature |
|-----------|-----------|------------------|---------|-------------|
| $S_N2$ | 1° > 2° | Strong Nu, weak base | Polar aprotic | Room temp |
| $S_N1$ | 3° > 2° | Weak Nu | Polar protic | Room temp |
| $E2$ | 2° or 3° | Strong base | Any | Elevated |
| $E1$ | 3° > 2° | Weak base | Polar protic | Elevated |

## Carbocation Stability
The stability order is:

$$3° > 2° > 1° > CH_3^+$$

**Reasons for stability:**
- Hyperconjugation
- Inductive effects
- Resonance (when applicable)

## Practice Tips
1. Always draw all electrons
2. Check formal charges at each step
3. Consider stereochemistry
4. Identify the rate-determining step
5. Predict products based on mechanism type`
  },
  {
    id: "5",
    courseNumber: "ECON 101",
    courseName: "Microeconomics",
    title: "Supply and Demand Analysis",
    author: "Jessica Lee",
    uploadDate: new Date(Date.now() - 1 * 7 * 24 * 60 * 60 * 1000), // 1 week ago
    preview: "Fundamental concepts of supply and demand, market equilibrium, elasticity, and consumer/producer surplus...",
    content: `# Supply and Demand

## Market Equilibrium

### Demand
The law of demand states that as price increases, quantity demanded decreases (ceteris paribus).

**Demand function:**
$$Q_d = a - bP$$

where:
- $Q_d$ = quantity demanded
- $P$ = price
- $a$ = maximum quantity demanded when $P = 0$
- $b$ = slope parameter

### Supply
The law of supply states that as price increases, quantity supplied increases.

**Supply function:**
$$Q_s = c + dP$$

where:
- $Q_s$ = quantity supplied
- $c$ = quantity supplied when $P = 0$ (often negative)
- $d$ = slope parameter

### Equilibrium
Market equilibrium occurs when $Q_d = Q_s$:

$$a - bP^* = c + dP^*$$

Solving for equilibrium price $P^*$:

$$P^* = \\frac{a - c}{b + d}$$

And equilibrium quantity $Q^*$:

$$Q^* = a - bP^* = c + dP^*$$

## Price Elasticity of Demand

### Formula
$$E_d = \\frac{\\% \\Delta Q_d}{\\% \\Delta P} = \\frac{\\Delta Q_d}{\\Delta P} \\cdot \\frac{P}{Q_d}$$

### Interpretation

| $|E_d|$ | Type | Description |
|---------|------|-------------|
| $> 1$ | Elastic | Demand is price sensitive |
| $= 1$ | Unit elastic | Proportional change |
| $< 1$ | Inelastic | Demand is price insensitive |
| $= 0$ | Perfectly inelastic | Demand doesn't change with price |
| $= \\infty$ | Perfectly elastic | Any price increase → zero demand |

## Consumer and Producer Surplus

### Consumer Surplus (CS)
The difference between what consumers are willing to pay and what they actually pay:

$$CS = \\int_0^{Q^*} P_d(Q) \\, dQ - P^* Q^*$$

For linear demand:
$$CS = \\frac{1}{2}(P_{max} - P^*) \\cdot Q^*$$

### Producer Surplus (PS)
The difference between what producers receive and their minimum acceptable price:

$$PS = P^* Q^* - \\int_0^{Q^*} P_s(Q) \\, dQ$$

For linear supply:
$$PS = \\frac{1}{2}(P^* - P_{min}) \\cdot Q^*$$

### Total Surplus
$$TS = CS + PS$$

This represents the total welfare in the market.

## Shifts in Supply and Demand

### Demand Shifters
- Income (normal vs inferior goods)
- Prices of related goods (substitutes and complements)
- Tastes and preferences
- Expectations
- Number of buyers

### Supply Shifters
- Input prices
- Technology
- Expectations
- Number of sellers
- Government policies (taxes, subsidies)

## Market Interventions

### Price Ceiling
A maximum legal price (e.g., rent control)

**Effects when $P_{ceiling} < P^*$:**
- Shortage: $Q_d > Q_s$
- Deadweight loss
- Black markets may emerge

### Price Floor
A minimum legal price (e.g., minimum wage)

**Effects when $P_{floor} > P^*$:**
- Surplus: $Q_s > Q_d$
- Deadweight loss
- Potential unemployment (in labor markets)

## Applications
- Predicting market responses to shocks
- Analyzing tax incidence
- Understanding government interventions
- Evaluating economic efficiency`
  },
  {
    id: "6",
    courseNumber: "BIO 205",
    courseName: "Cell Biology",
    title: "Cell Cycle and Mitosis",
    author: "Amanda Thompson",
    uploadDate: new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000), // 2 weeks ago
    preview: "Detailed overview of the cell cycle phases, checkpoint mechanisms, and mitosis process...",
    content: `# Cell Cycle and Mitosis

## Cell Cycle Overview

The cell cycle consists of two main phases:
1. **Interphase** (90% of cycle)
2. **M Phase** (Mitotic phase)

## Interphase

### G1 Phase (Gap 1)
- Cell growth
- Organelle production
- Protein synthesis
- G1/S checkpoint: "Is the cell ready to replicate DNA?"

### S Phase (Synthesis)
- DNA replication
- Histone synthesis
- Centrosome duplication

### G2 Phase (Gap 2)
- Continued growth
- Protein synthesis for mitosis
- G2/M checkpoint: "Is all DNA replicated and undamaged?"

### G0 Phase
- Quiescent state
- Cells that have exited the cycle
- Can re-enter under proper signals

## Mitosis Phases

### Prophase
1. Chromatin condenses into chromosomes
2. Centrosomes move to opposite poles
3. Nuclear envelope begins to break down
4. Mitotic spindle forms

### Prometaphase
1. Nuclear envelope completely fragments
2. Kinetochores form at centromeres
3. Spindle microtubules attach to kinetochores
4. Chromosomes begin moving

### Metaphase
1. Chromosomes align at metaphase plate
2. Each chromosome attached to both poles
3. **M checkpoint (Spindle checkpoint):** "Are all chromosomes attached?"

### Anaphase
1. Sister chromatids separate
2. Chromatids move to opposite poles
3. Cell elongates
4. Spindle microtubules shorten

### Telophase
1. Nuclear envelopes reform
2. Chromosomes decondense
3. Spindle apparatus disassembles
4. Cleavage furrow begins to form

### Cytokinesis
- Division of cytoplasm
- **Animal cells:** Contractile ring of actin
- **Plant cells:** Cell plate formation

## Checkpoint Control

### Key Checkpoints

| Checkpoint | Location | Key Questions |
|------------|----------|---------------|
| G1/S | End of G1 | Environment favorable? Growth signals present? DNA damaged? |
| G2/M | End of G2 | All DNA replicated? DNA damaged? |
| Spindle | Metaphase | All chromosomes attached to spindle? |

### Regulatory Proteins

**Cyclins:**
- Protein levels fluctuate during cycle
- Types: Cyclin D, E, A, B

**Cyclin-Dependent Kinases (CDKs):**
- Enzyme activity depends on cyclin binding
- Phosphorylate target proteins

**Active complex:**
$$\\text{Cyclin} + \\text{CDK} \\rightarrow \\text{Active MPF}$$

## Cancer and Cell Cycle

### Proto-oncogenes
- Normal genes promoting cell division
- When mutated → oncogenes
- Examples: Ras, Myc

### Tumor Suppressors
- Proteins that inhibit cell division
- Must lose both copies for cancer
- Examples: p53, Rb

### p53: "Guardian of the Genome"
Functions:
1. DNA damage detection
2. Cell cycle arrest
3. DNA repair activation
4. Apoptosis induction (if damage severe)

**Effect of p53 mutation:**
- Found in >50% of cancers
- Cells with damaged DNA continue dividing
- Accumulation of mutations

## Key Equations

### Cell doubling time
$$T_d = \\frac{\\ln(2)}{k}$$

where $k$ is the growth rate constant.

### Fraction of cells in each phase
$$\\text{Fraction} = \\frac{\\text{Time in phase}}{\\text{Total cycle time}}$$

## Summary Points
- Cell cycle is tightly regulated
- Checkpoints ensure fidelity
- Cyclins and CDKs drive progression
- Loss of control → cancer
- Different cell types have different cycle times`
  }
];

// Helper function to get summaries (can be extended for filtering/searching)
export function getSummaries(searchTerm?: string): Summary[] {
  if (!searchTerm) {
    return mockSummaries;
  }

  const term = searchTerm.toLowerCase();
  return mockSummaries.filter(
    (summary) =>
      summary.courseNumber.toLowerCase().includes(term) ||
      summary.courseName.toLowerCase().includes(term) ||
      summary.title.toLowerCase().includes(term) ||
      summary.author.toLowerCase().includes(term)
  );
}

export function getSummaryById(id: string): Summary | undefined {
  return mockSummaries.find((summary) => summary.id === id);
}
